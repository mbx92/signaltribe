import { requireRole } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { getDefaultLandingPageBlocks, LANDING_PAGE_BLOCKS_KEY, normalizeLandingPageBlocks } from '../../../utils/cms'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const setting = await prisma.setting.findUnique({
    where: { key: LANDING_PAGE_BLOCKS_KEY },
    select: { value: true, updatedAt: true },
  })

  const blocks = setting?.value
    ? normalizeLandingPageBlocks(setting.value) ?? getDefaultLandingPageBlocks()
    : getDefaultLandingPageBlocks()

  return {
    blocks,
    updatedAt: setting?.updatedAt ?? null,
  }
})