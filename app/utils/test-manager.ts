export type TestManagerScope = 'frontend' | 'backend' | 'all'
export type TestManagerStatus = 'passed' | 'failed' | 'empty'

export interface TestManagerSummary {
  scope: TestManagerScope
  status: TestManagerStatus
  totalTests: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
}

export const formatTestScopeLabel = (scope: TestManagerScope) => {
  if (scope === 'frontend') return 'Frontend'
  if (scope === 'backend') return 'Backend'
  return 'All Tests'
}

export const formatTestDuration = (durationMs: number) => {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return '< 1ms'
  if (durationMs < 1000) return `${Math.round(durationMs)}ms`
  return `${(durationMs / 1000).toFixed(durationMs >= 10000 ? 0 : 1)}s`
}

export const testStatusBadgeClass = (status: TestManagerStatus) => {
  if (status === 'passed') return 'badge-success'
  if (status === 'failed') return 'badge-error'
  return 'badge-ghost'
}

export const buildTestHeadline = (summary: TestManagerSummary) => {
  const scopeLabel = formatTestScopeLabel(summary.scope)

  if (summary.totalTests === 0) {
    return `${scopeLabel}: belum ada test yang cocok dengan scope ini.`
  }

  if (summary.failed > 0) {
    return `${scopeLabel}: ${summary.failed} test gagal dari ${summary.totalTests} test.`
  }

  return `${scopeLabel}: semua ${summary.totalTests} test lulus.`
}