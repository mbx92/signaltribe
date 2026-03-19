import { buildTestHeadline, formatTestDuration, formatTestScopeLabel, testStatusBadgeClass } from '../../app/utils/test-manager'

describe('frontend test manager utils', () => {
  it('formats scope labels consistently', () => {
    expect(formatTestScopeLabel('frontend')).toBe('Frontend')
    expect(formatTestScopeLabel('backend')).toBe('Backend')
    expect(formatTestScopeLabel('all')).toBe('All Tests')
  })

  it('formats duration safely', () => {
    expect(formatTestDuration(0)).toBe('< 1ms')
    expect(formatTestDuration(425)).toBe('425ms')
    expect(formatTestDuration(1500)).toBe('1.5s')
  })

  it('builds success and failure headlines', () => {
    expect(buildTestHeadline({ scope: 'frontend', status: 'passed', totalTests: 6, passed: 6, failed: 0, skipped: 0, durationMs: 1200 })).toBe('Frontend: semua 6 test lulus.')
    expect(buildTestHeadline({ scope: 'backend', status: 'failed', totalTests: 6, passed: 4, failed: 2, skipped: 0, durationMs: 1200 })).toBe('Backend: 2 test gagal dari 6 test.')
  })

  it('maps badge class from test status', () => {
    expect(testStatusBadgeClass('passed')).toBe('badge-success')
    expect(testStatusBadgeClass('failed')).toBe('badge-error')
    expect(testStatusBadgeClass('empty')).toBe('badge-ghost')
  })
})