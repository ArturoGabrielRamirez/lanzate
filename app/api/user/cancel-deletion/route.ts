import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';


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

    const currentStatus = await UserDeletionSystem.getDeletionStatus(userData.id);
    if (!currentStatus.isDeletionRequested) {
      return NextResponse.json(
        { error: 'No hay ninguna solicitud de eliminación activa' },
        { status: 400 }
      );
    }

    if (!currentStatus.canCancel) {
      return NextResponse.json(
        { error: 'El período de cancelación ha expirado o la cuenta ya fue procesada' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const result = await UserDeletionSystem.cancelDeletion({
      userId: userData.id,
      reason: reason || 'Cancelación sin motivo especificado',
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Eliminación cancelada correctamente',
      data: result,
    });

  } catch (error) {
    console.error('Error cancelando eliminación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}