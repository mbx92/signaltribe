import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

type CheckType = 'page' | 'api'

export interface DiscoveredQaCheck {
  id: string
  name: string
  type: CheckType
  target: string
  requiresAuth: boolean
  source: 'auto'
}

export interface SkippedQaRoute {
  type: CheckType
  sourcePath: string
  reason: string
}

const PAGE_ROOT = join(process.cwd(), 'app', 'pages')
const API_ROOT = join(process.cwd(), 'server', 'api')
const PUBLIC_PAGE_ROUTES = new Set(['/', '/login', '/public-feed', '/api-docs'])

const walkFiles = (dir: string): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }

  return files
}

const normalizeRoutePath = (value: string) => {
  if (!value || value === 'index') return '/'
  return `/${value}`
    .replace(/\\/g, '/')
    .replace(/\/index$/, '')
    .replace(/\/+/g, '/')
}

const pageFileToRoute = (filePath: string) => {
  const relativePath = relative(PAGE_ROOT, filePath).split(sep).join('/')
  const withoutExt = relativePath.replace(/\.vue$/, '')

  if (withoutExt.includes('[')) {
    return null
  }

  return normalizeRoutePath(withoutExt).replace(/\/index$/, '') || '/'
}

const apiFileToRoute = (filePath: string) => {
  const relativePath = relative(API_ROOT, filePath).split(sep).join('/')
  if (!/\.get\.(ts|js)$/.test(relativePath)) {
    return { route: null, skipped: true, reason: 'Only GET endpoints are auto-scanned' }
  }

  const withoutExt = relativePath.replace(/\.get\.(ts|js)$/, '')
  if (withoutExt.includes('[')) {
    return { route: null, skipped: true, reason: 'Dynamic API route requires sample params' }
  }

  const route = `/api/${withoutExt}`
    .replace(/\\/g, '/')
    .replace(/\/index$/, '')
  return { route: route === '/api' ? '/api' : route, skipped: false, reason: '' }
}

const guessApiRequiresAuth = (route: string) => {
  if (route === '/api/signals' || route === '/api/journals' || route === '/api/analysts') return false
  if (route.startsWith('/api/auth/') && route !== '/api/auth/me') return false
  return true
}

export const discoverQaChecks = () => {
  const discovered: DiscoveredQaCheck[] = []
  const skipped: SkippedQaRoute[] = []

  for (const file of walkFiles(PAGE_ROOT)) {
    if (!file.endsWith('.vue')) continue
    const route = pageFileToRoute(file)
    if (!route) {
      skipped.push({
        type: 'page',
        sourcePath: relative(process.cwd(), file).split(sep).join('/'),
        reason: 'Dynamic page route requires sample params',
      })
      continue
    }

    discovered.push({
      id: `auto-page:${route}`,
      name: `Auto Page ${route}`,
      type: 'page',
      target: route,
      requiresAuth: !PUBLIC_PAGE_ROUTES.has(route),
      source: 'auto',
    })
  }

  for (const file of walkFiles(API_ROOT)) {
    if (!/\.(ts|js)$/.test(file)) continue
    const info = apiFileToRoute(file)
    if (!info.route) {
      if (info.skipped) {
        skipped.push({
          type: 'api',
          sourcePath: relative(process.cwd(), file).split(sep).join('/'),
          reason: info.reason,
        })
      }
      continue
    }

    discovered.push({
      id: `auto-api:${info.route}`,
      name: `Auto API ${info.route}`,
      type: 'api',
      target: info.route,
      requiresAuth: guessApiRequiresAuth(info.route),
      source: 'auto',
    })
  }

  return { discovered, skipped }
}