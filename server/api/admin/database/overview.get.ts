import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename } from 'node:path'
import { prisma } from '../../../utils/prisma'
import { requireRole } from '../../../utils/auth'
import { getDevelopmentBoardDbPath, listDevelopmentBoardItems, listQaMonitorChecks } from '../../../utils/development-board-db'

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex += 1 }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const sanitizeDatabaseTarget = (value: string) => {
  if (!value) return 'Belum dikonfigurasi'
  try {
    const url = new URL(value)
    const databaseName = url.pathname.replace(/^\//, '') || 'default'
    return `${url.protocol.replace(':', '')}://${url.hostname}${url.port ? `:${url.port}` : ''}/${databaseName}`
  } catch { return 'Configured' }
}

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const config = useRuntimeConfig(event)
  const boardDbPath = getDevelopmentBoardDbPath()
  const boardDbExists = existsSync(boardDbPath)
  const boardDbSizeBytes = boardDbExists ? statSync(boardDbPath).size : 0
  const boardItems = listDevelopmentBoardItems()
  const qaChecks = listQaMonitorChecks()

  const sectionLabels: Record<string, string> = {
    start_here: 'Start Here', checklist: 'Checklist',
    active: 'Active Tasks', backlog: 'Backlog', bug: 'Bugs',
  }
  const itemsBySection = Object.entries(sectionLabels).map(([section, label]) => ({
    section, label, count: boardItems.filter((i) => i.section === section).length,
  }))

  const migrationsDir = 'prisma/migrations'
  const localMigrationNames = existsSync(migrationsDir)
    ? readdirSync(migrationsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : []

  let connectionStatus: 'connected' | 'error' = 'connected'
  let connectionNote = 'Koneksi Prisma ke database utama berhasil.'
  let lastAppliedMigration = ''
  const latestLocalMigration = localMigrationNames[localMigrationNames.length - 1] || ''
  let appliedMigrationCount = 0
  let pendingMigrationCount = 0
  let driftDetected = false
  let migrationStatus: 'in-sync' | 'pending' | 'drift' | 'unknown' = 'unknown'
  let tables: Record<string, number> = {}
  const fullMigrations: Array<{ name: string; status: 'applied' | 'pending' | 'drift'; appliedAt: string | null }> = []

  try {
    const appliedRows = await prisma.$queryRawUnsafe<Array<{ migration_name: string; finished_at: string | null }>>(
      'SELECT migration_name, finished_at FROM "_prisma_migrations" WHERE rolled_back_at IS NULL ORDER BY started_at ASC NULLS LAST'
    )

    const appliedMap = new Map<string, string | null>(appliedRows.map((r) => [r.migration_name, r.finished_at]))
    const localSet = new Set(localMigrationNames)

    appliedMigrationCount = appliedRows.length
    lastAppliedMigration = [...appliedRows].reverse()[0]?.migration_name || ''
    pendingMigrationCount = localMigrationNames.filter((name) => !appliedMap.has(name)).length
    driftDetected = appliedRows.some((r) => !localSet.has(r.migration_name))

    if (driftDetected) {
      migrationStatus = 'drift'
      connectionNote = 'Ada migration yang tercatat di database tetapi tidak ditemukan di folder lokal.'
    } else if (pendingMigrationCount > 0) {
      migrationStatus = 'pending'
      connectionNote = 'Ada migration lokal yang belum diterapkan ke database.'
    } else {
      migrationStatus = 'in-sync'
    }

    for (const name of localMigrationNames) {
      fullMigrations.push({ name, status: appliedMap.has(name) ? 'applied' : 'pending', appliedAt: appliedMap.get(name) ?? null })
    }
    for (const row of appliedRows) {
      if (!localSet.has(row.migration_name)) {
        fullMigrations.push({ name: row.migration_name, status: 'drift', appliedAt: row.finished_at })
      }
    }
    fullMigrations.sort((a, b) => a.name.localeCompare(b.name))

    const tableResults = await Promise.allSettled([
      prisma.user.count(), prisma.signal.count(), prisma.journalEntry.count(),
      prisma.subscription.count(), prisma.payment.count(), prisma.notification.count(),
      prisma.setting.count(), prisma.activityLog.count(), prisma.systemLog.count(),
    ])
    const tableNames = ['User', 'Signal', 'JournalEntry', 'Subscription', 'Payment', 'Notification', 'Setting', 'ActivityLog', 'SystemLog']
    for (const [index, result] of tableResults.entries()) {
      if (result.status === 'fulfilled') tables[tableNames[index]] = result.value
    }
  } catch (error: any) {
    connectionStatus = 'error'
    migrationStatus = 'unknown'
    connectionNote = error?.message || 'Database utama belum bisa diinspeksi dari endpoint ini.'
  }

  return {
    checkedAt: new Date().toISOString(),
    board: {
      engine: 'SQLite',
      filePath: boardDbPath,
      fileName: basename(boardDbPath),
      fileExists: boardDbExists,
      fileSizeBytes: boardDbSizeBytes,
      fileSizeLabel: formatBytes(boardDbSizeBytes),
      itemCount: boardItems.length,
      qaCheckCount: qaChecks.length,
      itemsBySection,
    },
    app: {
      engine: 'PostgreSQL',
      target: sanitizeDatabaseTarget(config.databaseUrl || ''),
      connectionStatus,
      connectionNote,
      migrationStatus,
      localMigrationCount: localMigrationNames.length,
      appliedMigrationCount,
      pendingMigrationCount,
      driftDetected,
      latestLocalMigration,
      lastAppliedMigration,
      tables,
    },
    migrations: fullMigrations,
  }
})
