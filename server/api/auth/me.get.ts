import { prisma } from '../../utils/prisma'
import { getSessionUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = getSessionUserId(event)
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true, analystProfile: true },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role.name,
    analystStatus: user.analystProfile?.status ?? null,
  }
})
