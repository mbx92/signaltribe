import { requireRole } from '../../../utils/auth'
import { listTestCatalog, type TestManagerScope } from '../../../utils/test-manager'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const query = getQuery(event)
  const scope = (query.scope as TestManagerScope | undefined) || 'all'
  const catalog = listTestCatalog()

  return {
    items: scope === 'all' ? catalog : catalog.filter((item) => item.scope === scope),
  }
})