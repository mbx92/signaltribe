import { buildVitestCommand, summarizeVitestReport } from '../../server/utils/test-manager'

describe('server test manager utils', () => {
  it('builds scope-specific vitest commands', () => {
    expect(buildVitestCommand('frontend', 'g:/tmp/frontend.json')).toContain('tests/frontend')
    expect(buildVitestCommand('backend', 'g:/tmp/backend.json')).toContain('tests/backend')
    expect(buildVitestCommand('all', 'g:/tmp/all.json')).toContain('vitest run tests ')
  })

  it('summarizes vitest json report output', () => {
    const result = summarizeVitestReport({
      numTotalTests: 3,
      numPassedTests: 2,
      numFailedTests: 1,
      numPendingTests: 0,
      numTodoTests: 0,
      testResults: [
        {
          name: 'tests/backend/test-manager-utils.test.ts',
          startTime: 100,
          endTime: 300,
          assertionResults: [
            { fullName: 'passes one', status: 'passed', duration: 10 },
            { fullName: 'fails one', status: 'failed', failureMessages: ['Expected true to be false'] },
            { fullName: 'passes two', status: 'passed', duration: 12 },
          ],
        },
      ],
    }, 'backend', '2026-03-19T10:00:00.000Z', '2026-03-19T10:00:01.500Z')

    expect(result.summary.status).toBe('failed')
    expect(result.summary.totalTests).toBe(3)
    expect(result.summary.failed).toBe(1)
    expect(result.summary.durationMs).toBe(1500)
    expect(result.suites[0]?.failed).toBe(1)
    expect(result.failures[0]?.message).toContain('Expected true to be false')
  })
})