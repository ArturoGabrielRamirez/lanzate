// app/api/cron/process-deletions/route.ts
import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Verificar autorización
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }

  try {
    // 🧪 Para testing, también puedes usar el método unificado:
    // const result = await UserDeletionSystem.runScheduledMaintenance()
    
    const deletionResults = await UserDeletionSystem.processScheduledDeletions()
    const orphanedCleaned = await UserDeletionSystem.cleanupOrphanedConnections()
    const legalExpiryResults = await UserDeletionSystem.processLegalRetentionExpiry()
    
    const result = {
      timestamp: new Date().toISOString(),
      scheduled_deletions: deletionResults,
      orphaned_connections_cleaned: orphanedCleaned,
      legal_retention_expired: legalExpiryResults,
      success: true
    }

    return NextResponse.json(result, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error en procesamiento diario:', error)
    
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

// 🧪 Para testing manual, también puedes agregar POST
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
    const { force = false, action = 'all' } = body

    let result

    if (action === 'deletions' || action === 'all') {
      result = await UserDeletionSystem.processScheduledDeletions()
    } else if (action === 'retention') {
      result = await UserDeletionSystem.processLegalRetentionExpiry()
    } else if (action === 'orphaned') {
      result = await UserDeletionSystem.cleanupOrphanedConnections()
    } else if (action === 'maintenance') {
      result = await UserDeletionSystem.runScheduledMaintenance()
    } else {
      return NextResponse.json(
        { error: 'Invalid action', success: false },
        { status: 400 }
      )
    }

    return NextResponse.json({
      action,
      result,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('❌ Error en procesamiento manual:', error)
    
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