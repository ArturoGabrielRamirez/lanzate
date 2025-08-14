import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, confirmPassword } = body;

    if (!reason || reason.length < 10) {
      return NextResponse.json(
        { error: 'El motivo debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (!confirmPassword) {
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

    const currentStatus = await UserDeletionSystem.getDeletionStatus(userData.id);
    if (currentStatus.isDeletionRequested && !currentStatus.isAnonymized) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud de eliminación activa' },
        { status: 400 }
      );
    }
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const result = await UserDeletionSystem.requestDeletion({
      userId: userData.id,
      reason,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Solicitud de eliminación procesada correctamente',
      data: result,
    });

  } catch (error) {
    console.error('Error procesando solicitud de eliminación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}