import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          name: 'analyst'
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
    return users
  } catch (error) {
    console.error('Error fetching analysts:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch platform analysts'
    })
  }
})
