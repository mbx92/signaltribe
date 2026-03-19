import { dirname, resolve, relative } from 'node:path'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'

export type TestManagerScope = 'frontend' | 'backend' | 'all'
export type TestManagerStatus = 'passed' | 'failed' | 'empty'

export interface VitestJsonAssertion {
  ancestorTitles?: string[]
  fullName?: string
  title?: string
  status?: string
  duration?: number
  failureMessages?: string[]
}

export interface VitestJsonSuite {
  name: string
  status?: string
  startTime?: number
  endTime?: number
  assertionResults?: VitestJsonAssertion[]
  message?: string
  summary?: string
}

export interface VitestJsonReport {
  success?: boolean
  startTime?: number
  numTotalTests?: number
  numPassedTests?: number
  numFailedTests?: number
  numPendingTests?: number
  numTodoTests?: number
  testResults?: VitestJsonSuite[]
}

export interface TestManagerFailure {
  suiteName: string
  testName: string
  message: string
}

export interface TestManagerSuiteResult {
  name: string
  status: 'passed' | 'failed' | 'empty'
  durationMs: number
  passed: number
  failed: number
  skipped: number
}

export interface TestManagerSummary {
  scope: TestManagerScope
  status: TestManagerStatus
  totalTests: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
  suiteCount: number
  startedAt: string
  finishedAt: string
  headline: string
}

export interface TestCatalogCase {
  name: string
  kind: 'it' | 'test'
}

export interface TestCatalogFile {
  scope: 'frontend' | 'backend'
  filePath: string
  suiteNames: string[]
  cases: TestCatalogCase[]
  totalCases: number
}

export const TEST_MANAGER_LOG_PATH = '/internal/test-manager'

const TEST_ROOT = resolve(process.cwd(), 'tests')

const walkTestFiles = (dirPath: string, bucket: string[] = []) => {
  if (!existsSync(dirPath)) return bucket

  for (const entry of readdirSync(dirPath)) {
    const fullPath = resolve(dirPath, entry)
    const entryStat = statSync(fullPath)

    if (entryStat.isDirectory()) {
      walkTestFiles(fullPath, bucket)
      continue
    }

    if (entry.endsWith('.test.ts')) {
      bucket.push(fullPath)
    }
  }

  return bucket
}

const extractMatches = (source: string, pattern: RegExp) => {
  return [...source.matchAll(pattern)]
    .map((match) => match[3]?.trim())
    .filter((value): value is string => Boolean(value))
}

export const listTestCatalog = (): TestCatalogFile[] => {
  const files = walkTestFiles(TEST_ROOT)

  return files
    .map<TestCatalogFile>((filePath) => {
      const source = readFileSync(filePath, 'utf8')
      const suiteNames = extractMatches(source, /(describe)\((['"`])(.+?)\2/g)
      const itCases = extractMatches(source, /(it)\((['"`])(.+?)\2/g).map((name) => ({ name, kind: 'it' as const }))
      const testCases = extractMatches(source, /(test)\((['"`])(.+?)\2/g).map((name) => ({ name, kind: 'test' as const }))
      const scope = filePath.includes(`${resolve(TEST_ROOT, 'frontend')}`) ? 'frontend' : 'backend'

      return {
        scope,
        filePath: relative(process.cwd(), filePath).replace(/\\/g, '/'),
        suiteNames,
        cases: [...itCases, ...testCases],
        totalCases: itCases.length + testCases.length,
      }
    })
    .sort((left, right) => left.filePath.localeCompare(right.filePath))
}

export const getTestResultOutputPath = (scope: TestManagerScope) => {
  const outputPath = resolve(process.cwd(), '.data', `test-manager-${scope}.json`)
  const dirPath = dirname(outputPath)

  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  return outputPath
}

export const buildVitestCommand = (scope: TestManagerScope, outputFile: string) => {
  const normalizedOutputFile = outputFile.replace(/\\/g, '/')
  const target = scope === 'frontend'
    ? 'tests/frontend'
    : scope === 'backend'
      ? 'tests/backend'
      : 'tests'

  return `npx vitest run ${target} --reporter=json --outputFile="${normalizedOutputFile}" --passWithNoTests`
}

const normalizeSuiteStatus = (suite: VitestJsonSuite): 'passed' | 'failed' | 'empty' => {
  const assertions = suite.assertionResults || []
  if (!assertions.length) return 'empty'
  if (assertions.some((assertion) => assertion.status === 'failed')) return 'failed'
  return 'passed'
}

const buildHeadline = (scope: TestManagerScope, failed: number, totalTests: number) => {
  const scopeLabel = scope === 'frontend' ? 'Frontend' : scope === 'backend' ? 'Backend' : 'Semua test'

  if (totalTests === 0) return `${scopeLabel}: belum ada test yang dijalankan.`
  if (failed > 0) return `${scopeLabel}: ${failed} test gagal dari ${totalTests} test.`
  return `${scopeLabel}: semua ${totalTests} test lulus.`
}

export const summarizeVitestReport = (report: VitestJsonReport, scope: TestManagerScope, startedAt: string, finishedAt: string) => {
  const totalTests = report.numTotalTests ?? 0
  const passed = report.numPassedTests ?? 0
  const failed = report.numFailedTests ?? 0
  const skipped = (report.numPendingTests ?? 0) + (report.numTodoTests ?? 0)
  const suites = (report.testResults || []).map<TestManagerSuiteResult>((suite) => {
    const assertions = suite.assertionResults || []
    return {
      name: suite.name,
      status: normalizeSuiteStatus(suite),
      durationMs: Math.max(0, (suite.endTime || 0) - (suite.startTime || 0)),
      passed: assertions.filter((assertion) => assertion.status === 'passed').length,
      failed: assertions.filter((assertion) => assertion.status === 'failed').length,
      skipped: assertions.filter((assertion) => assertion.status === 'pending' || assertion.status === 'skipped' || assertion.status === 'todo').length,
    }
  })

  const failures = (report.testResults || []).flatMap<TestManagerFailure>((suite) =>
    (suite.assertionResults || [])
      .filter((assertion) => assertion.status === 'failed')
      .map((assertion) => ({
        suiteName: suite.name,
        testName: assertion.fullName || assertion.title || 'Unnamed test',
        message: assertion.failureMessages?.[0] || suite.message || suite.summary || 'Test failed without detailed message.',
      }))
  )

  const durationMs = Math.max(0, new Date(finishedAt).getTime() - new Date(startedAt).getTime())
  const summary: TestManagerSummary = {
    scope,
    status: totalTests === 0 ? 'empty' : failed > 0 ? 'failed' : 'passed',
    totalTests,
    passed,
    failed,
    skipped,
    durationMs,
    suiteCount: suites.length,
    startedAt,
    finishedAt,
    headline: buildHeadline(scope, failed, totalTests),
  }

  return { summary, suites, failures }
}