// /api/user/request-deletion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system';
import DeletionHelpers from '@/features/account/utils/deletion-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, confirmPassword } = body;

    // Validaciones básicas
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
          setAll: () => {},
        },
      }
    );

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // ✅ USAR EL MÉTODO ORIGINAL: Verificar contraseña con Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: confirmPassword,
    });

    if (signInError) {
      console.log('❌ Error de verificación de contraseña:', signInError.message);
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 400 });
    }

    // Obtener usuario de la tabla personalizada
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // ✅ NUEVA LÓGICA: Verificar si aún está dentro de la ventana de acción
    const existingStatus = await UserDeletionSystem.getDeletionStatus(userData.id);
    
    if (existingStatus.isDeletionRequested) {
      // Verificar si la solicitud previa aún está dentro de la ventana de acción
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
        
        // Si la ventana de acción ya pasó pero aún no se procesó, permitir nueva solicitud
        console.log('Ventana de acción expirada, permitiendo nueva solicitud');
      }
    }

    // Obtener información de la solicitud
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Procesar solicitud de eliminación
    const result = await UserDeletionSystem.requestDeletion({
      userId: userData.id,
      reason: reason.trim(),
      ipAddress,
      userAgent,
    });

    // ✅ CALCULAR LÍMITES DE ACCIÓN basados en hora redondeada
    const actionLimit = DeletionHelpers.roundScheduledDateToNextHour(result.deletionRequestedAt);

    return NextResponse.json({
      success: true,
      message: 'Solicitud de eliminación procesada correctamente',
      deletionInfo: {
        requestedAt: result.deletionRequestedAt,
        scheduledAt: result.deletionScheduledAt,
        displayScheduledAt: DeletionHelpers.getDisplayScheduledDate(result.deletionScheduledAt),
        
        // ✅ NUEVA INFORMACIÓN: Límites de acción
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