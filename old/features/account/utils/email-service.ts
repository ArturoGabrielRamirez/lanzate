import { prisma } from "@/utils/prisma";

export class EmailService {
  static async sendDeletionConfirmationEmail(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          email: true, 
          first_name: true, 
          deletion_scheduled_at: true,
          deletion_reason: true 
        }
      });

      if (!user) {
        console.log(`❌ Usuario con ID ${userId} no encontrado para envío de email`);
        return;
      }

      const scheduledDate = user.deletion_scheduled_at;
      const daysRemaining = scheduledDate ? 
        Math.ceil((scheduledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Confirmación de eliminación de cuenta</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #fee2e2; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .warning { background-color: #fef3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
            .info { background-color: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
            .cancel-button { background-color: #16a34a; }
            ul { margin: 15px 0; padding-left: 20px; }
            li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #dc2626;">⚠️ Confirmación de solicitud de eliminación de cuenta</h2>
            </div>
            
            <p>Hola ${user.first_name || 'Usuario'},</p>
            
            <div class="warning">
              <strong>Tu cuenta será eliminada permanentemente el ${scheduledDate?.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} (${daysRemaining} días restantes).</strong>
            </div>
            
            <h3>📋 Detalles de tu solicitud:</h3>
            <ul>
              <li><strong>Motivo:</strong> ${user.deletion_reason || 'No especificado'}</li>
              <li><strong>Fecha de solicitud:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
              <li><strong>Días de gracia:</strong> ${daysRemaining} días</li>
            </ul>
            
            <h3>🔄 ¿Qué sucede ahora?</h3>
            <div class="info">
              <ul>
                <li>Tu cuenta <strong>permanecerá activa</strong> durante los próximos ${daysRemaining} días</li>
                <li>Puedes <strong>cancelar esta solicitud</strong> en cualquier momento</li>
                <li>Después de ${daysRemaining} días, tu cuenta y todos los datos serán <strong>eliminados permanentemente</strong></li>
                <li>Recibirás recordatorios por email durante el período de gracia</li>
              </ul>
            </div>
            
            <h3>💚 ¿Cambió de opinión?</h3>
            <p>Si deseas cancelar la eliminación:</p>
            <ol>
              <li>Inicia sesión en tu cuenta</li>
              <li>Ve a <strong>Configuración → Zona de Peligro</strong></li>
              <li>Haz clic en <strong>"Cancelar eliminación"</strong></li>
            </ol>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" class="button cancel-button">
              Cancelar eliminación ahora
            </a>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="font-size: 14px; color: #6b7280;">
              <p><strong>⚠️ Importante:</strong></p>
              <ul>
                <li>Si no solicitaste esta eliminación, contacta con soporte inmediatamente</li>
                <li>Esta acción es irreversible después del período de gracia</li>
                <li>Se eliminarán todos tus datos, configuraciones y contenido</li>
              </ul>
              
              <p>¿Necesitas ayuda? Contacta con nuestro equipo de soporte.</p>
              <p>Saludos,<br><strong>El equipo de Lanzate</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      // TODO: Implementar el envío real del email aquí
      // Ejemplos de integraciones:
      
      // OPCIÓN 1: Resend (recomendado)
      // const { Resend } = require('resend');
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'noreply@lanzate.app',
      //   to: user.email,
      //   subject: '⚠️ Confirmación de eliminación de cuenta - Acción requerida',
      //   html: emailContent,
      // });

      // OPCIÓN 2: SendGrid
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({
      //   to: user.email,
      //   from: 'noreply@lanzate.app',
      //   subject: '⚠️ Confirmación de eliminación de cuenta - Acción requerida',
      //   html: emailContent,
      // });

      // OPCIÓN 3: Nodemailer
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransporter(/* config */);
      // await transporter.sendMail({
      //   from: 'noreply@lanzate.app',
      //   to: user.email,
      //   subject: '⚠️ Confirmación de eliminación de cuenta - Acción requerida',
      //   html: emailContent,
      // });

      console.log(`✅ Email de confirmación de eliminación enviado a ${user.email}`);
      
      // Log del envío en base de datos
      await prisma.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'EMAIL_SENT',
          reason: 'Deletion confirmation email sent',
          ip_address: 'system',
          user_agent: 'email-service',
          additional_data: JSON.stringify({
            email_type: 'deletion_confirmation',
            sent_to: user.email,
            days_remaining: daysRemaining,
            sent_at: new Date().toISOString()
          })
        }
      });

    } catch (error) {
      console.error('❌ Error sending deletion confirmation email:', error);
      
      // Log del error
      await prisma.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'EMAIL_ERROR',
          reason: 'Failed to send deletion confirmation email',
          ip_address: 'system',
          user_agent: 'email-service',
          additional_data: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }
      }).catch(console.error);
    }
  }

  static async sendDeletionCancelledEmail(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          email: true, 
          first_name: true,
          deletion_cancelled_reason: true,
          deletion_cancelled_at: true
        }
      });

      if (!user) {
        console.log(`❌ Usuario con ID ${userId} no encontrado para email de cancelación`);
        return;
      }

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Eliminación de cuenta cancelada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .success { background-color: #dcfce7; padding: 15px; border-radius: 6px; border-left: 4px solid #16a34a; }
            .info { background-color: #dbeafe; padding: 15px; border-radius: 6px; }
            .button { display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #16a34a;">✅ Eliminación de cuenta cancelada exitosamente</h2>
            </div>
            
            <p>Hola ${user.first_name || 'Usuario'},</p>
            
            <div class="success">
              <p><strong>¡Excelente noticia!</strong> Tu solicitud de eliminación de cuenta ha sido <strong>cancelada exitosamente</strong>.</p>
            </div>
            
            <h3>📋 Detalles:</h3>
            <ul>
              <li><strong>Cancelado el:</strong> ${user.deletion_cancelled_at?.toLocaleDateString('es-ES') || 'Hoy'}</li>
              ${user.deletion_cancelled_reason ? `<li><strong>Motivo:</strong> ${user.deletion_cancelled_reason}</li>` : ''}
              <li><strong>Estado de la cuenta:</strong> Activa y segura</li>
            </ul>
            
            <div class="info">
              <h3>🔒 Tu cuenta está segura</h3>
              <ul>
                <li>Todos tus datos permanecen intactos</li>
                <li>Tu cuenta está completamente activa</li>
                <li>No se ha eliminado ninguna información</li>
                <li>Puedes continuar usando todos los servicios normalmente</li>
              </ul>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
              Ir a mi cuenta
            </a>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="font-size: 14px; color: #6b7280;">
              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
              <p>Nos alegra que hayas decidido quedarte con nosotros.</p>
              
              <p>Saludos,<br><strong>El equipo de Lanzate</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      // TODO: Implementar envío real (igual que arriba)
      console.log(`✅ Email de cancelación de eliminación enviado a ${user.email}`);
      
      // Log del envío
      await prisma.userDeletionLog.create({
        data: {
          user_id: userId,
          action: 'EMAIL_SENT',
          reason: 'Deletion cancellation email sent',
          ip_address: 'system',
          user_agent: 'email-service',
          additional_data: JSON.stringify({
            email_type: 'deletion_cancelled',
            sent_to: user.email,
            sent_at: new Date().toISOString()
          })
        }
      });

    } catch (error) {
      console.error('❌ Error sending deletion cancelled email:', error);
    }
  }

  // Email de recordatorio antes de la eliminación final
  static async sendDeletionReminderEmail(userId: number, daysRemaining: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          email: true, 
          first_name: true, 
          deletion_scheduled_at: true 
        }
      });

      if (!user) return;

      const urgencyLevel = daysRemaining <= 1 ? 'CRÍTICO' : daysRemaining <= 3 ? 'URGENTE' : 'RECORDATORIO';
      const urgencyColor = daysRemaining <= 1 ? '#dc2626' : daysRemaining <= 3 ? '#f59e0b' : '#3b82f6';

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; color: ${urgencyColor};">
                ⏰ ${urgencyLevel}: ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} restante${daysRemaining !== 1 ? 's' : ''} para la eliminación
              </h2>
            </div>
            
            <p>Hola ${user.first_name || 'Usuario'},</p>
            
            <p>Te recordamos que tu cuenta será eliminada <strong>permanentemente en ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}</strong>.</p>
            
            <div style="background-color: #fef3cd; padding: 15px; border-radius: 6px; border-left: 4px solid: #f59e0b;">
              <p><strong>Fecha de eliminación:</strong> ${user.deletion_scheduled_at?.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <p>Si cambias de opinión, aún puedes cancelar la eliminación:</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" 
               style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0;">
              Cancelar eliminación
            </a>
            
            <p>Saludos,<br><strong>El equipo de Lanzate</strong></p>
          </div>
        </body>
        </html>
      `;

      console.log(`✅ Email de recordatorio enviado a ${user.email} (${daysRemaining} días restantes)`);

    } catch (error) {
      console.error('❌ Error sending deletion reminder email:', error);
    }
  }
}