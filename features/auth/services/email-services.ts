import { createServerSideClient } from '@/utils/supabase/server';
import { extractSubdomainFromHost } from '@/features/auth/utils';
import { prisma } from '@/utils/prisma';
import { getCurrentUser } from '../actions';
import { headers } from 'next/headers';
import type { 
  ResendEmailParams, 
  ResendEmailResponse, 
  EmailChangeStatusResponse
} from '../types';

export class EmailService {
  private static async getBaseUrl(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const subdomain = extractSubdomainFromHost(host);
    
    return subdomain 
      ? `https://${subdomain}.lanzate.app` 
      : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  static async resendConfirmation(params: ResendEmailParams): Promise<ResendEmailResponse> {
    try {
      const supabase = await createServerSideClient(); // ✅ Agregado await
      const baseUrl = await this.getBaseUrl();

      switch (params.type) {
        case 'signup':
          return await this.handleSignupResend(supabase, params.email!, baseUrl);
        
        case 'recovery':
          return await this.handleRecoveryResend(supabase, params.email!, baseUrl);
        
        case 'email_change':
          return await this.handleEmailChangeResend(supabase, baseUrl, params.step);
        
        default:
          throw new Error(`Unsupported resend type: ${params.type}`);
      }
    } catch (error) {
      console.error(`❌ Error in resendConfirmation (${params.type}):`, error);
      throw error;
    }
  }

  private static async handleSignupResend(
    supabase: any, 
    email: string, 
    baseUrl: string
  ): Promise<ResendEmailResponse> {

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Email de confirmación de registro reenviado',
      data: {
        type: 'signup',
        email: email,
        reason: 'Signup confirmation resent'
      }
    };
  }

  private static async handleRecoveryResend(
    supabase: any, 
    email: string, 
    baseUrl: string
  ): Promise<ResendEmailResponse> {

    const redirectTo = `${baseUrl}/auth/confirm?next=/update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo
    });

    if (error) {
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        const rateLimitError = new Error('Too many requests. Please wait 5 minutes before trying again.');
        (rateLimitError as any).status = 429;
        throw rateLimitError;
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Recovery email sent successfully',
      data: {
        type: 'recovery',
        email: email,
        redirectTo: redirectTo
      }
    };
  }

  private static async handleEmailChangeResend(
    supabase: any, 
    baseUrl: string, 
    step?: 'old_email' | 'new_email'
  ): Promise<ResendEmailResponse> {
    const { payload: user, error: userError } = await getCurrentUser();
    if (userError || !user) {
      const authError = new Error('Usuario no autenticado');
      (authError as any).status = 401;
      throw authError;
    }

    const localUser = await this.findLocalUser(user);
    if (!localUser) {
      const notFoundError = new Error('Usuario no encontrado en la base de datos local');
      (notFoundError as any).status = 404;
      throw notFoundError;
    }

    const activeEmailChange = await this.getActiveEmailChange(localUser.id);
    
    if (!activeEmailChange) {
      return await this.handleSignupConfirmationCheck(supabase, user, baseUrl);
    }

    const resendInfo = this.determineResendTarget(activeEmailChange, step);
    
    const { error } = await supabase.auth.resend({
      type: 'email_change',
      email: resendInfo.emailToResend,
      options: {
        emailRedirectTo: `${baseUrl}/auth/confirm?next=/account`
      }
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        const rateLimitError = new Error('Demasiadas solicitudes. Espera 5 minutos antes de intentar nuevamente.');
        (rateLimitError as any).status = 429;
        throw rateLimitError;
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Email de confirmación reenviado exitosamente',
      data: {
        type: 'email_change',
        email: resendInfo.emailToResend,
        resendType: resendInfo.resendType,
        reason: resendInfo.message,
        requestId: activeEmailChange.id
      }
    };
  }

  static async getEmailChangeStatus(userId: string | number): Promise<EmailChangeStatusResponse> {
    try {
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
      const activeEmailChange = await prisma.email_change_requests.findFirst({
        where: {
          user_id: userIdNum,
          completed: false,
          expires_at: {
            gt: new Date()
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      if (!activeEmailChange) {
        return {
          hasEmailChange: false,
          oldEmailConfirmed: false,
          newEmailConfirmed: false,
          newEmail: null,
          currentEmail: '',
          loading: false,
          processCompleted: false
        };
      }

      const processCompleted = activeEmailChange.old_email_confirmed && 
                              activeEmailChange.new_email_confirmed;

      return {
        hasEmailChange: true,
        oldEmailConfirmed: activeEmailChange.old_email_confirmed,
        newEmailConfirmed: activeEmailChange.new_email_confirmed,
        newEmail: activeEmailChange.new_email,
        currentEmail: activeEmailChange.old_email,
        loading: false,
        processCompleted,
        requestId: activeEmailChange.id,
        expiresAt: activeEmailChange.expires_at,
        oldEmailConfirmedAt: activeEmailChange.old_email_confirmed_at,
        newEmailConfirmedAt: activeEmailChange.new_email_confirmed_at
      };
    } catch (error) {
      throw error;
    }
  }

  private static async findLocalUser(user: any) {
    let localUser = await prisma.user.findUnique({
      where: { supabase_user_id: user.id }
    });

    if (!localUser) {
      localUser = await prisma.user.findUnique({
        where: { email: user.email! }
      });
    }

    return localUser;
  }

  private static async getActiveEmailChange(userId: string | number) {
    const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
    return await prisma.email_change_requests.findFirst({
      where: {
        user_id: userIdNum,
        completed: false,
        expires_at: {
          gt: new Date()
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  private static async handleSignupConfirmationCheck(supabase: any, user: any, baseUrl: string) {
    if (!user.email_confirmed_at) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message: 'Email de confirmación de registro reenviado',
        data: {
          type: 'signup',
          email: user.email,
          reason: 'Account not confirmed'
        }
      };
    }

    const noConfirmationError = new Error('No hay confirmaciones pendientes');
    (noConfirmationError as any).status = 400;
    throw noConfirmationError;
  }

  private static determineResendTarget(activeEmailChange: any, step?: 'old_email' | 'new_email') {
    if (step === 'old_email') {
      return {
        emailToResend: activeEmailChange.old_email,
        resendType: 'old_email' as const,
        message: `Confirma tu email actual ${activeEmailChange.old_email} para continuar con el cambio`
      };
    }
    
    if (step === 'new_email') {
      return {
        emailToResend: activeEmailChange.new_email,
        resendType: 'new_email' as const,
        message: `Confirma tu nuevo email ${activeEmailChange.new_email} para completar el cambio`
      };
    }

    if (!activeEmailChange.old_email_confirmed) {
      return {
        emailToResend: activeEmailChange.old_email,
        resendType: 'old_email' as const,
        message: `Confirma tu email actual ${activeEmailChange.old_email} para continuar con el cambio`
      };
    } else if (activeEmailChange.old_email_confirmed && !activeEmailChange.new_email_confirmed) {
      return {
        emailToResend: activeEmailChange.new_email,
        resendType: 'new_email' as const,
        message: `Confirma tu nuevo email ${activeEmailChange.new_email} para completar el cambio`
      };
    } else {
      throw new Error('El cambio de email ya está completado');
    }
  }
}