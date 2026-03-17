import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, message: 'Invalid body format' })
    }

    // Prepare data for upsert
    const keys = Object.keys(body)
    
    // We run the updates in a transaction
    const updatePromises = keys.map((key) => {
      const value = String(body[key])
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    })

    await prisma.$transaction(updatePromises)

    return { success: true, message: 'Settings updated successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update settings'
    })
  }
})
