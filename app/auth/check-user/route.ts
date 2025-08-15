// /api/auth/check-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

    // Verificar si el usuario existe en la base de datos
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      // El usuario fue eliminado de la base de datos
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Usuario existe y está activo
    return NextResponse.json({
      exists: true,
      user: {
        id: userData.id,
        email: userData.email,
        createdAt: userData.created_at
      }
    });

  } catch (error) {
    console.error('Error verificando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}