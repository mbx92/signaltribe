import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { requireRole } from '../../../utils/auth'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  if (!import.meta.dev) {
    throw createError({ statusCode: 403, statusMessage: 'Seed hanya tersedia di mode development.' })
  }

  try {
    const { stdout, stderr } = await execAsync('npx tsx prisma/seed.ts', {
      cwd: process.cwd(),
      timeout: 60000,
    })
    return {
      success: true,
      message: 'Seed berhasil dijalankan.',
      output: [stdout, stderr].filter(Boolean).join('\n').trim(),
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message?.slice(0, 300) || 'Seed gagal dijalankan.',
    })
  }
})
