import { spawn } from 'node:child_process'
import { requireRole } from '../../../utils/auth'

const PRISMA_STUDIO_PORT = 5555
const PRISMA_STUDIO_HOST = '127.0.0.1'
const PRISMA_STUDIO_URL = `http://${PRISMA_STUDIO_HOST}:${PRISMA_STUDIO_PORT}`
const PRISMA_SCHEMA_PATH = 'prisma/schema.prisma'
const PRISMA_STUDIO_COMMAND = `npx prisma studio --port ${PRISMA_STUDIO_PORT} --hostname ${PRISMA_STUDIO_HOST} --browser none --schema ${PRISMA_SCHEMA_PATH}`

type PrismaStudioState = {
  pid: number
  url: string
}

declare global {
  var __signaltribePrismaStudio: PrismaStudioState | undefined
}

const wait = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs))

const isStudioReachable = async () => {
  try {
    const response = await fetch(PRISMA_STUDIO_URL, {
      signal: AbortSignal.timeout(1500),
    })
    return response.ok
  } catch {
    return false
  }
}

const ensureStudioStarted = async () => {
  if (await isStudioReachable()) {
    return { url: PRISMA_STUDIO_URL, alreadyRunning: true }
  }

  const shellCommand = process.platform === 'win32'
    ? `${process.env.ComSpec || 'cmd.exe'} /d /s /c "${PRISMA_STUDIO_COMMAND}"`
    : PRISMA_STUDIO_COMMAND

  const child = spawn(shellCommand, [], {
    cwd: process.cwd(),
    stdio: 'ignore',
    detached: false,
    shell: true,
  })

  child.unref()
  globalThis.__signaltribePrismaStudio = {
    pid: child.pid ?? 0,
    url: PRISMA_STUDIO_URL,
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await isStudioReachable()) {
      return { url: PRISMA_STUDIO_URL, alreadyRunning: false }
    }
    await wait(500)
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Prisma Studio gagal start di port 5555.',
  })
}

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  if (!import.meta.dev) {
    throw createError({ statusCode: 403, statusMessage: 'Prisma Studio hanya tersedia di mode development.' })
  }

  const result = await ensureStudioStarted()

  return {
    success: true,
    ...result,
  }
})