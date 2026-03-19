import { exec } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { promisify } from 'node:util'
import { requireRole } from '../../../utils/auth'
import { logSystem } from '../../../utils/logger'
import { buildVitestCommand, getTestResultOutputPath, summarizeVitestReport, TEST_MANAGER_LOG_PATH, type TestManagerScope, type VitestJsonReport } from '../../../utils/test-manager'

const execAsync = promisify(exec)
const VALID_SCOPES = new Set<TestManagerScope>(['frontend', 'backend', 'all'])

export default defineEventHandler(async (event) => {
  const admin = await requireRole(event, 'admin')

  if (!import.meta.dev) {
    throw createError({ statusCode: 403, statusMessage: 'Test Manager hanya tersedia di mode development.' })
  }

  const body = await readBody<{ scope?: TestManagerScope }>(event)
  const scope = body?.scope || 'all'

  if (!VALID_SCOPES.has(scope)) {
    throw createError({ statusCode: 400, statusMessage: 'Scope test tidak valid.' })
  }

  const outputPath = getTestResultOutputPath(scope)
  const command = buildVitestCommand(scope, outputPath)
  const startedAt = new Date().toISOString()
  let stdout = ''
  let stderr = ''

  try {
    const result = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 120000,
      maxBuffer: 4 * 1024 * 1024,
    })
    stdout = result.stdout
    stderr = result.stderr
  } catch (error: any) {
    stdout = error?.stdout || ''
    stderr = error?.stderr || ''
  }

  if (!existsSync(outputPath)) {
    await logSystem({
      level: 'error',
      message: `Test run failed (${scope})`,
      path: TEST_MANAGER_LOG_PATH,
      userId: admin.id,
      meta: { scope, startedAt, stdout, stderr },
    })

    throw createError({
      statusCode: 500,
      statusMessage: 'Vitest tidak menghasilkan file report. Periksa konfigurasi test atau output runner.',
    })
  }

  const report = JSON.parse(readFileSync(outputPath, 'utf8')) as VitestJsonReport
  const finishedAt = new Date().toISOString()
  const result = summarizeVitestReport(report, scope, startedAt, finishedAt)
  const output = [stdout, stderr].filter(Boolean).join('\n').trim()

  await logSystem({
    level: result.summary.failed > 0 ? 'warn' : 'info',
    message: `Test run completed (${scope})`,
    path: TEST_MANAGER_LOG_PATH,
    userId: admin.id,
    meta: {
      ...result.summary,
      suites: result.suites.slice(0, 20),
      failureCount: result.failures.length,
    },
  })

  return {
    ...result,
    output,
  }
})