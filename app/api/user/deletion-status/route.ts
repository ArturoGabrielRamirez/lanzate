import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';
import DeletionHelpers from '@/features/account/utils/deletion-helpers';

export async function GET(request: NextRequest) {
  try {
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

    const deletionStatus = await UserDeletionSystem.getDeletionStatus(userData.id);

    let canDeleteUntil: Date | null = null;
    let canCancelUntil: Date | null = null;
    let isWithinActionWindow = false;
    let timeRemaining: number | null = null;

    if (deletionStatus.deletionScheduledAt) {
      // ✅ CORREGIDO: Usar la fecha programada, no la de solicitud
      const scheduledAt = new Date(deletionStatus.deletionScheduledAt);
      const displayScheduledAt = DeletionHelpers.getDisplayScheduledDate(scheduledAt);
      
      // Para cancelación: dar 2 minutos desde la solicitud para cancelar
      if (deletionStatus.deletionRequestedAt) {
        const requestedAt = new Date(deletionStatus.deletionRequestedAt);
        const rawCancelUntil = new Date(requestedAt.getTime() + (2 * 60 * 1000)); // +2 minutos
        
        // ✅ CORREGIDO: Redondear también la fecha de cancelación
        canCancelUntil = DeletionHelpers.roundScheduledDateToNextHour(rawCancelUntil);
      }

      // Para eliminación: usar la fecha programada (ya redondeada)
      canDeleteUntil = displayScheduledAt;

      const now = new Date();
      isWithinActionWindow = canCancelUntil ? now <= canCancelUntil : false;
      
      // ✅ Calcular tiempo restante hasta la eliminación (usa redondeo interno)
      if (displayScheduledAt) {
        timeRemaining = DeletionHelpers.getTimeRemaining(scheduledAt);
      }
    }

    const response = {
      ...deletionStatus,
      
      // ✅ Campos calculados
      timeRemaining,
      canDeleteUntil,
      canCancelUntil,
      isWithinActionWindow,
      
      // ✅ Fecha de display usando el helper
      displayScheduledAt: deletionStatus.deletionScheduledAt ? 
        DeletionHelpers.getDisplayScheduledDate(new Date(deletionStatus.deletionScheduledAt)) : null,

      canCancel: deletionStatus.isDeletionRequested &&
        isWithinActionWindow &&
        !deletionStatus.isAnonymized,

      calculationInfo: {
        requestedAt: deletionStatus.deletionRequestedAt,
        scheduledAt: deletionStatus.deletionScheduledAt,
        displayScheduledAt: deletionStatus.deletionScheduledAt ?
          DeletionHelpers.getDisplayScheduledDate(new Date(deletionStatus.deletionScheduledAt)) : null,
        currentTime: new Date().toISOString(),
        canCancelUntil: canCancelUntil?.toISOString(),
        canDeleteUntil: canDeleteUntil?.toISOString(),
        withinWindow: isWithinActionWindow,
        timeRemaining,
        // ✅ Debug adicional
        debugInfo: {
          requestedAtRaw: deletionStatus.deletionRequestedAt,
          cancelWindowMinutes: 2,
          rawCancelUntil: deletionStatus.deletionRequestedAt ? 
            new Date(new Date(deletionStatus.deletionRequestedAt).getTime() + (2 * 60 * 1000)).toISOString() : null,
          roundedCancelUntil: canCancelUntil?.toISOString(),
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error obteniendo estado de eliminación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}