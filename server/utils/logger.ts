import type { H3Event } from 'h3'
import { prisma } from './prisma'

export type LogAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'SIGNAL_CREATE'
  | 'SIGNAL_UPDATE'
  | 'SIGNAL_DELETE'
  | 'JOURNAL_CREATE'
  | 'JOURNAL_UPDATE'
  | 'JOURNAL_DELETE'
  | 'SUBSCRIPTION_CREATE'
  | 'SUBSCRIPTION_CANCEL'
  | 'ANALYST_APPROVE'
  | 'ANALYST_REJECT'
  | 'SETTINGS_UPDATE'

interface ActivityOptions {
  userId?: string
  userEmail?: string
  action: LogAction
  entity?: string
  entityId?: string
  meta?: Record<string, unknown>
  ip?: string
}

interface SystemLogOptions {
  level?: 'error' | 'warn' | 'info'
  message: string
  stack?: string
  path?: string
  userId?: string
  meta?: Record<string, unknown>
}

export const logActivity = async (options: ActivityOptions): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: options.userId,
        userEmail: options.userEmail,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId,
        meta: options.meta ? JSON.stringify(options.meta) : null,
        ip: options.ip,
      },
    })
  } catch {
    // Silent — logging must never break app flow
  }
}

export const logSystem = async (options: SystemLogOptions): Promise<void> => {
  try {
    await prisma.systemLog.create({
      data: {
        level: options.level ?? 'error',
        message: options.message,
        stack: options.stack,
        path: options.path,
        userId: options.userId,
        meta: options.meta ? JSON.stringify(options.meta) : null,
      },
    })
  } catch {
    // Silent
  }
}

export const getClientIp = (event: H3Event): string => {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return getHeader(event, 'x-real-ip') ?? 'unknown'
}
