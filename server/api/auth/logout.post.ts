import { clearSessionCookie, getSessionUserId } from '../../utils/auth'
import { logActivity, getClientIp } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const userId = getSessionUserId(event)
  const ip = getClientIp(event)

  clearSessionCookie(event)

  if (userId) {
    await logActivity({ userId, action: 'LOGOUT', ip })
  }

  return { success: true }
})
