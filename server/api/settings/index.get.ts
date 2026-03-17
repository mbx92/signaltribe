import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const settings = await prisma.setting.findMany()
    
    // Convert array of {key, value} to an object {key: value}
    const settingsObject = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value || ''
      return acc
    }, {} as Record<string, string>)

    return settingsObject
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch settings'
    })
  }
})
