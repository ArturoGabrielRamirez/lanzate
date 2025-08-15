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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // ✅ OBTENER ESTADO ORIGINAL
    const deletionStatus = await UserDeletionSystem.getDeletionStatus(userData.id);

    // ✅ AGREGAR FECHA REDONDEADA PARA EL DISPLAY
    const enhancedStatus = {
      ...deletionStatus,
      // Agregar la fecha redondeada para mostrar al usuario
      displayScheduledAt: deletionStatus.deletionScheduledAt 
        ? DeletionHelpers.getDisplayScheduledDate(new Date(deletionStatus.deletionScheduledAt))
        : null,
      // Recalcular timeRemaining con la fecha redondeada si es necesario
      timeRemaining: deletionStatus.deletionScheduledAt
        ? DeletionHelpers.getTimeRemaining(new Date(deletionStatus.deletionScheduledAt))
        : null
    };

    return NextResponse.json(enhancedStatus);

  } catch (error) {
    console.error('Error obteniendo estado de eliminación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}