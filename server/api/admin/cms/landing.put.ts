import { createError, readBody } from 'h3'
import { requireRole } from '../../../utils/auth'
import { logActivity, logSystem, getClientIp } from '../../../utils/logger'
import { prisma } from '../../../utils/prisma'
import { LANDING_PAGE_BLOCKS_KEY, normalizeLandingPageBlocks } from '../../../utils/cms'

export default defineEventHandler(async (event) => {
  const admin = await requireRole(event, 'admin')
  const body = await readBody<{ blocks?: unknown } | unknown>(event)
  const candidateBlocks = Array.isArray(body) ? body : body?.blocks

  if (!Array.isArray(candidateBlocks)) {
    throw createError({ statusCode: 400, statusMessage: 'Blocks array is required' })
  }

  const blocks = normalizeLandingPageBlocks(candidateBlocks)
  if (blocks === null) {
    throw createError({ statusCode: 400, statusMessage: 'Blocks payload is invalid' })
  }

  await prisma.setting.upsert({
    where: { key: LANDING_PAGE_BLOCKS_KEY },
    update: { value: JSON.stringify(blocks) },
    create: { key: LANDING_PAGE_BLOCKS_KEY, value: JSON.stringify(blocks) },
  })

  await logActivity({
    userId: admin.id,
    userEmail: admin.email,
    action: 'SETTINGS_UPDATE',
    entity: 'LandingPageCMS',
    entityId: LANDING_PAGE_BLOCKS_KEY,
    ip: getClientIp(event),
    meta: { blockCount: blocks.length },
  })

  await logSystem({
    level: 'info',
    message: 'Landing page CMS updated',
    path: '/api/admin/cms/landing',
    userId: admin.id,
    meta: { blockCount: blocks.length },
  })

  return {
    success: true,
    blocks,
    message: 'Landing page CMS updated successfully',
  }
})