import { createError, readBody } from 'h3'
import { requireRole } from '../../../utils/auth'
import { createDevelopmentBoardItem, type DevelopmentBoardItemInput, type DevelopmentBoardPriority, type DevelopmentBoardSection, type DevelopmentBoardStatus } from '../../../utils/development-board-db'

const VALID_SECTIONS = new Set<DevelopmentBoardSection>(['checklist', 'active', 'backlog', 'bug'])
const VALID_PRIORITIES = new Set<DevelopmentBoardPriority>(['high', 'medium', 'low', null])
const VALID_STATUSES = new Set<DevelopmentBoardStatus>([
  'not-started',
  'in-progress',
  'done',
  'blocked',
  'needs-work',
  'open',
  'fixed',
])

const validateInput = (input: Partial<DevelopmentBoardItemInput>): DevelopmentBoardItemInput => {
  if (!input.section || !VALID_SECTIONS.has(input.section)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid section is required' })
  }

  if (!input.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  if (!input.description?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Description is required' })
  }

  if (typeof input.priority === 'undefined' || !VALID_PRIORITIES.has(input.priority)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid priority is required' })
  }

  if (!input.status || !VALID_STATUSES.has(input.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid status is required' })
  }

  return {
    section: input.section,
    title: input.title.trim(),
    description: input.description.trim(),
    module: input.module?.trim() || 'General',
    tracer: input.tracer?.trim() || null,
    priority: input.priority,
    status: input.status,
    helperText: input.helperText?.trim() || null,
  }
}

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const body = await readBody<Partial<DevelopmentBoardItemInput>>(event)
  const item = createDevelopmentBoardItem(validateInput(body))

  return { item }
})