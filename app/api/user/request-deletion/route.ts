import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';
import DeletionHelpers from '@/features/account/utils/deletion-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, confirmPassword } = body;

    if (!reason?.trim() || reason.length < 10) {
      return NextResponse.json(
        { error: 'El motivo debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (!confirmPassword?.trim()) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => { },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: confirmPassword,
    });

    if (signInError) {
      console.log('❌ Error de verificación de contraseña:', signInError.message);
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const existingStatus = await UserDeletionSystem.getDeletionStatus(userData.id);

    if (existingStatus.isDeletionRequested) {
      if (existingStatus.deletionRequestedAt) {
        const requestedAt = new Date(existingStatus.deletionRequestedAt);
        const actionLimit = DeletionHelpers.roundScheduledDateToNextHour(requestedAt);
        const now = new Date();

        if (now <= actionLimit) {
          return NextResponse.json({
            error: 'Ya tienes una solicitud de eliminación pendiente. Puedes cancelarla o esperar a que se procese.',
            existingRequest: {
              requestedAt: existingStatus.deletionRequestedAt,
              canCancelUntil: actionLimit,
              isWithinActionWindow: true
            }
          }, { status: 409 });
        }
      }
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const result = await UserDeletionSystem.requestDeletion({
      userId: userData.id,
      reason: reason.trim(),
      ipAddress,
      userAgent,
    });

    const actionLimit = DeletionHelpers.roundScheduledDateToNextHour(result.deletionRequestedAt);

    return NextResponse.json({
      success: true,
      message: 'Solicitud de eliminación procesada correctamente',
      deletionInfo: {
        requestedAt: result.deletionRequestedAt,
        scheduledAt: result.deletionScheduledAt,
        displayScheduledAt: DeletionHelpers.getDisplayScheduledDate(result.deletionScheduledAt),

        canDeleteUntil: actionLimit,
        canCancelUntil: actionLimit,
        actionWindowMinutes: Math.ceil((actionLimit.getTime() - result.deletionRequestedAt.getTime()) / (1000 * 60)),

        processingMethod: result.processingMethod,
        testingMode: result.testingMode,
      }
    });

  } catch (error) {
    console.error('Error procesando solicitud de eliminación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}