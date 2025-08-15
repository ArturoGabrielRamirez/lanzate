// /api/user/deletion-status/route.ts
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
          setAll: () => {},
        },
      }
    );

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener usuario de la base de datos
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('supabase_user_id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener estado de eliminación
    const deletionStatus = await UserDeletionSystem.getDeletionStatus(userData.id);

    // ✅ NUEVA LÓGICA: Calcular límites basados en hora redondeada
    let canDeleteUntil: Date | null = null;
    let canCancelUntil: Date | null = null;
    let isWithinActionWindow = false;

    if (deletionStatus.deletionScheduledAt) {
      // Calcular hasta cuándo se puede actuar (próxima hora redondeada desde la solicitud)
      const requestedAt = new Date(deletionStatus.deletionRequestedAt!);
      canDeleteUntil = DeletionHelpers.roundScheduledDateToNextHour(requestedAt);
      canCancelUntil = canDeleteUntil; // Mismo límite para ambas acciones

      // Verificar si aún estamos dentro del período de acción
      const now = new Date();
      isWithinActionWindow = now <= canDeleteUntil;
    }

    // ✅ RESPUESTA MEJORADA: Incluir información de ventana de acción
    const response = {
      ...deletionStatus,
      
      // Información de ventana de acción
      canDeleteUntil,
      canCancelUntil,
      isWithinActionWindow,
      
      // Sobrescribir canCancel con la nueva lógica
      canCancel: deletionStatus.isDeletionRequested && 
                 isWithinActionWindow && 
                 !deletionStatus.isAnonymized,
      
      // Información adicional para debugging
      calculationInfo: {
        requestedAt: deletionStatus.deletionRequestedAt,
        scheduledAt: deletionStatus.deletionScheduledAt,
        displayScheduledAt: deletionStatus.deletionScheduledAt ? 
          DeletionHelpers.getDisplayScheduledDate(new Date(deletionStatus.deletionScheduledAt)) : null,
        currentTime: new Date(),
        roundedActionLimit: canDeleteUntil,
        withinWindow: isWithinActionWindow,
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