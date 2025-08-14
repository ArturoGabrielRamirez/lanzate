import UserDeletionSystem from "@/features/account/utils/user-deletion-system"

export async function systemHealthCheck(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const status = await UserDeletionSystem.getSystemStatus()
    const stats = await UserDeletionSystem.getDeletionStats()
    
    const healthReport = {
      timestamp: new Date().toISOString(),
      system_status: status,
      deletion_stats: stats,
      alerts: []
    }

/*     if (status.orphanedConnections > 0) {
      healthReport.alerts.push(`${status.orphanedConnections} conexiones huérfanas detectadas`)
    }
    
    if (stats.pendingDeletions > 100) {
      healthReport.alerts.push(`${stats.pendingDeletions} eliminaciones pendientes (revisar)`)
    }
    
    if (stats.expiredLegalRetention > 0) {
      healthReport.alerts.push(`${stats.expiredLegalRetention} registros con retención legal expirada`)
    }
     */
  /*   console.log('📊 Reporte de salud del sistema:', healthReport) */
    
    return new Response(JSON.stringify(healthReport), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('❌ Error en reporte de salud:', error)
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}