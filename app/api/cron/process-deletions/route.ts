import { UserDeletionSystem } from '@/features/account/utils/user-deletion-system'

export default async function handler(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
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
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('❌ Error en procesamiento diario:', error)
    
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
