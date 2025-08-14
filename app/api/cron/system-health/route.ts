// app/api/cron/health-check/route.ts
import UserDeletionSystem from "@/features/account/utils/user-deletion-system"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }

  try {
    const status = await UserDeletionSystem.getSystemStatus()
    const stats = await UserDeletionSystem.getDeletionStats()
    
    const alerts = []

    // Generar alertas automáticamente
    if (status.orphanedConnections > 0) {
      alerts.push(`${status.orphanedConnections} conexiones huérfanas detectadas`)
    }
    
    if (stats.pendingDeletions > 100) {
      alerts.push(`${stats.pendingDeletions} eliminaciones pendientes (revisar)`)
    }
    
    if (stats.expiredLegalRetention > 0) {
      alerts.push(`${stats.expiredLegalRetention} registros con retención legal expirada`)
    }

    // 🧪 Alertas específicas para testing
    if (stats.testingMode) {
      alerts.push('🧪 SISTEMA EN MODO TESTING - No usar en producción')
    }

    const healthReport = {
      timestamp: new Date().toISOString(),
      system_status: status,
      deletion_stats: stats,
      alerts,
      overall_health: status.systemHealthy && alerts.length === 0 ? 'healthy' : 'needs_attention',
      testing_mode: stats.testingMode || false
    }

    console.log('📊 Reporte de salud del sistema:', healthReport)
    
    return NextResponse.json(healthReport, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error en reporte de salud:', error)
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}

// 🧪 Para testing manual - permite hacer health checks específicos
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { check_type = 'full' } = body

    let result

    switch (check_type) {
      case 'quick':
        result = await UserDeletionSystem.quickHealthCheck()
        break
      case 'stats':
        result = await UserDeletionSystem.getDeletionStats()
        break
      case 'status':
        result = await UserDeletionSystem.getSystemStatus()
        break
      case 'full':
      default:
        const status = await UserDeletionSystem.getSystemStatus()
        const stats = await UserDeletionSystem.getDeletionStats()
        const quickCheck = await UserDeletionSystem.quickHealthCheck()
        
        result = {
          full_status: status,
          stats,
          quick_check: quickCheck,
          comprehensive: true
        }
        break
    }

    return NextResponse.json({
      check_type,
      result,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('❌ Error en health check manual:', error)
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}