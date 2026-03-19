import { requireRole } from '../../../utils/auth'
import { logSystem } from '../../../utils/logger'
import { listQaMonitorChecks } from '../../../utils/development-board-db'
import { discoverQaChecks } from '../../../utils/qa-discovery'

type CheckType = 'page' | 'api'
type Severity = 'ok' | 'warn' | 'error'
type CheckAudience = 'public' | 'admin' | 'analyst' | 'user'
const SOURCE_FILE_TARGET_PATTERN = /(\.(ts|js|vue)$)|(\/(index|\[[^/]+\])\.(get|post|put|patch|delete)\.(ts|js)$)/i

interface QaCheck {
  id: string
  name: string
  type: CheckType
  target: string
  requiresAuth: boolean
}

const SLOW_THRESHOLD_MS = 1500
const QA_LOG_PATH = '/internal/qa-monitor'

const inferCheckAudience = (check: QaCheck): CheckAudience => {
  if (!check.requiresAuth) return 'public'

  if (check.target.startsWith('/dashboard/analyst') || check.target.startsWith('/api/dashboard/analyst')) {
    return 'analyst'
  }

  if (check.target.startsWith('/dashboard/user') || check.target.startsWith('/api/dashboard/user')) {
    return 'user'
  }

  if (check.target.startsWith('/api/analysts/subscribers')) {
    return 'analyst'
  }

  return 'admin'
}

const DEFAULT_CHECKS: QaCheck[] = [
  { id: 'page-home', name: 'Landing Page', type: 'page', target: '/', requiresAuth: false },
  { id: 'page-login', name: 'Login Page', type: 'page', target: '/login', requiresAuth: false },
  { id: 'page-public-feed', name: 'Public Feed', type: 'page', target: '/public-feed', requiresAuth: false },
  { id: 'page-api-docs', name: 'API Docs Page', type: 'page', target: '/api-docs', requiresAuth: false },
  { id: 'page-admin-overview', name: 'Admin Overview', type: 'page', target: '/dashboard/admin', requiresAuth: true },
  { id: 'page-admin-users', name: 'Admin Users', type: 'page', target: '/dashboard/admin/users', requiresAuth: true },
  { id: 'page-admin-analysts', name: 'Admin Analysts', type: 'page', target: '/dashboard/admin/analysts', requiresAuth: true },
  { id: 'page-admin-logs', name: 'Admin Logs', type: 'page', target: '/dashboard/admin/logs', requiresAuth: true },
  { id: 'page-admin-development', name: 'Development Board', type: 'page', target: '/dashboard/admin/development', requiresAuth: true },
  { id: 'api-auth-me', name: 'Auth Me API', type: 'api', target: '/api/auth/me', requiresAuth: true },
  { id: 'api-dashboard-admin', name: 'Admin Dashboard API', type: 'api', target: '/api/dashboard/admin', requiresAuth: true },
  { id: 'api-admin-users', name: 'Admin Users API', type: 'api', target: '/api/admin/users?page=1&limit=5', requiresAuth: true },
  { id: 'api-admin-analysts', name: 'Admin Analysts API', type: 'api', target: '/api/admin/analysts', requiresAuth: true },
  { id: 'api-admin-logs', name: 'Admin Logs API', type: 'api', target: '/api/admin/logs?type=system&page=1&limit=5', requiresAuth: true },
  { id: 'api-settings', name: 'Settings API', type: 'api', target: '/api/settings', requiresAuth: true },
  { id: 'api-signals', name: 'Signals API', type: 'api', target: '/api/signals?page=1&limit=5', requiresAuth: false },
  { id: 'api-journals', name: 'Journals API', type: 'api', target: '/api/journals?page=1&limit=5', requiresAuth: false },
]

const buildSummary = (results: Array<{ severity: Severity; type: CheckType }>) => {
  const errorCount = results.filter((result) => result.severity === 'error').length
  const warningCount = results.filter((result) => result.severity === 'warn').length
  const failedPages = results.filter((result) => result.type === 'page' && result.severity === 'error').length
  const failedApis = results.filter((result) => result.type === 'api' && result.severity === 'error').length
  const recommendations: string[] = []

  if (failedPages > 0) {
    recommendations.push('Periksa route page yang gagal karena ada indikasi middleware, SSR, atau fetch data bermasalah.')
  }
  if (failedApis > 0) {
    recommendations.push('Periksa endpoint API yang gagal karena ini paling sering menjadi akar masalah halaman kosong atau error render.')
  }
  if (warningCount > 0) {
    recommendations.push('Beberapa endpoint lambat. Audit query database dan proses agregasi pada dashboard.')
  }
  if (!recommendations.length) {
    recommendations.push('Tidak ada temuan kritis dari scan ini. Lanjutkan audit manual untuk halaman yang masih terasa dummy atau belum lengkap.')
  }

  const headline = errorCount > 0
    ? `Ditemukan ${errorCount} error dan ${warningCount} warning yang perlu perhatian.`
    : warningCount > 0
      ? `Tidak ada error, tetapi ada ${warningCount} warning performa atau stabilitas.`
      : 'Semua check lulus tanpa error atau warning.'

  return {
    totalChecks: results.length,
    passed: results.filter((result) => result.severity === 'ok').length,
    warnings: warningCount,
    errors: errorCount,
    headline,
    recommendations,
  }
}

export default defineEventHandler(async (event) => {
  const admin = await requireRole(event, 'admin')
  const requestUrl = getRequestURL(event)
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
  const cookie = getHeader(event, 'cookie') || ''
  const checkedAt = new Date().toISOString()

  const customChecks = listQaMonitorChecks().map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    target: item.target,
    requiresAuth: item.requiresAuth,
  }))
  const autoDiscovery = discoverQaChecks()
  const checks = [...DEFAULT_CHECKS, ...customChecks, ...autoDiscovery.discovered]
  const dedupedChecks = Array.from(new Map(checks.map((check) => [`${check.type}:${check.target}`, check])).values())

  const results = await Promise.all(dedupedChecks.map(async (check) => {
    const startedAt = Date.now()
    const audience = inferCheckAudience(check)

    if (SOURCE_FILE_TARGET_PATTERN.test(check.target)) {
      return {
        id: check.id,
        name: check.name,
        type: check.type,
        target: check.target,
        requiresAuth: check.requiresAuth,
        status: null,
        durationMs: 0,
        severity: 'ok' as Severity,
        note: 'Skipped: target terlihat seperti path file source. Gunakan route runtime seperti /api/settings atau /dashboard/admin/settings.',
        checkedAt,
      }
    }

    if (audience === 'analyst' || audience === 'user') {
      return {
        id: check.id,
        name: check.name,
        type: check.type,
        target: check.target,
        requiresAuth: check.requiresAuth,
        status: null,
        durationMs: 0,
        severity: 'ok' as Severity,
        note: `Skipped: membutuhkan session ${audience} dan tidak bisa divalidasi dari QA admin.`,
        checkedAt,
      }
    }

    try {
      const response = await fetch(new URL(check.target, baseUrl), {
        headers: check.requiresAuth && cookie ? { cookie } : undefined,
        redirect: 'manual',
      })

      const durationMs = Date.now() - startedAt
      let severity: Severity = 'ok'
      let note = `HTTP ${response.status}`

      if (response.status < 200 || response.status >= 300) {
        severity = 'error'
        note = `Request returned HTTP ${response.status}`
      } else if (durationMs > SLOW_THRESHOLD_MS) {
        severity = 'warn'
        note = `Response lambat: ${durationMs}ms`
      }

      if (severity !== 'ok') {
        await logSystem({
          level: severity === 'error' ? 'error' : 'warn',
          message: `QA ${severity === 'error' ? 'issue' : 'warning'}: ${check.name}`,
          path: QA_LOG_PATH,
          userId: admin.id,
          meta: {
            checkId: check.id,
            name: check.name,
            type: check.type,
            target: check.target,
            status: response.status,
            durationMs,
            note,
          },
        })
      }

      return {
        id: check.id,
        name: check.name,
        type: check.type,
        target: check.target,
        requiresAuth: check.requiresAuth,
        status: response.status,
        durationMs,
        severity,
        note,
        checkedAt,
      }
    } catch (error) {
      const durationMs = Date.now() - startedAt
      const message = error instanceof Error ? error.message : 'Unknown error'

      await logSystem({
        level: 'error',
        message: `QA issue: ${check.name}`,
        path: QA_LOG_PATH,
        userId: admin.id,
        meta: {
          checkId: check.id,
          name: check.name,
          type: check.type,
          target: check.target,
          status: null,
          durationMs,
          note: message,
        },
      })

      return {
        id: check.id,
        name: check.name,
        type: check.type,
        target: check.target,
        requiresAuth: check.requiresAuth,
        status: null,
        durationMs,
        severity: 'error' as Severity,
        note: message,
        checkedAt,
      }
    }
  }))

  const summary = {
    checkedAt,
    ...buildSummary(results),
  }

  await logSystem({
    level: summary.errors > 0 ? 'warn' : 'info',
    message: 'QA scan completed',
    path: QA_LOG_PATH,
    userId: admin.id,
    meta: summary,
  })

  return {
    summary,
    results,
    discovery: {
      autoDiscovered: autoDiscovery.discovered.length,
      skippedDynamic: autoDiscovery.skipped,
      customChecks: customChecks.length,
    },
  }
})