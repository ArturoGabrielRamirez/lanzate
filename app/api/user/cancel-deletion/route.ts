import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';
import DeletionHelpers from '@/features/account/utils/deletion-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason } = body;

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

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('supabase_user_id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const currentStatus = await UserDeletionSystem.getDeletionStatus(userData.id);

    if (!currentStatus.isDeletionRequested) {
      return NextResponse.json({
        error: 'No hay ninguna solicitud de eliminación pendiente'
      }, { status: 409 });
    }

    if (currentStatus.isAnonymized) {
      return NextResponse.json({
        error: 'La cuenta ya ha sido procesada y no puede cancelarse'
      }, { status: 409 });
    }

    const requestedAt = new Date(currentStatus.deletionRequestedAt!);
    const actionLimit = DeletionHelpers.roundScheduledDateToNextHour(requestedAt);
    const now = new Date();

    if (now > actionLimit) {
      return NextResponse.json({
        error: 'El período para cancelar la eliminación ha expirado',
        expiredAt: actionLimit,
        currentTime: now,
        minutesPastDeadline: Math.ceil((now.getTime() - actionLimit.getTime()) / (1000 * 60))
      }, { status: 409 });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await UserDeletionSystem.cancelDeletion({
      userId: userData.id,
      reason: reason || 'Cancelación solicitada por el usuario',
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Eliminación cancelada correctamente',
      cancellationInfo: {
        cancelledAt: result.cancelledAt,
        reason: reason || 'Cancelación solicitada por el usuario',

        originalRequestAt: requestedAt,
        actionLimitWas: actionLimit,
        cancelledWithMinutesToSpare: Math.floor((actionLimit.getTime() - now.getTime()) / (1000 * 60)),

        processingMethod: result.processingMethod,
        automaticProcessing: result.automaticProcessing,
      }
    });

  } catch (error) {
    console.error('Error cancelando eliminación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}