import { existsSync, mkdirSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'

export type DevelopmentBoardSection = 'start_here' | 'checklist' | 'active' | 'backlog' | 'bug'
export type DevelopmentBoardStatus = 'not-started' | 'in-progress' | 'done' | 'blocked' | 'needs-work' | 'open' | 'fixed'
export type DevelopmentBoardPriority = 'high' | 'medium' | 'low' | null

export interface DevelopmentBoardItem {
  id: string
  section: DevelopmentBoardSection
  title: string
  description: string
  module: string | null
  tracer: string | null
  priority: DevelopmentBoardPriority
  status: DevelopmentBoardStatus
  helperText: string | null
  sortOrder: number
  updatedAt: string
}

export interface DevelopmentBoardItemInput {
  section: DevelopmentBoardSection
  title: string
  description: string
  module?: string | null
  tracer?: string | null
  priority: DevelopmentBoardPriority
  status: DevelopmentBoardStatus
  helperText?: string | null
}

export interface DevelopmentBoardMeta {
  phase: string | null
  phaseNote: string | null
  updatedAt: string | null
}

export type QaCheckType = 'page' | 'api'

export interface QaMonitorCheck {
  id: string
  name: string
  type: QaCheckType
  target: string
  requiresAuth: boolean
  createdAt: string
}

export interface QaMonitorCheckInput {
  name: string
  type: QaCheckType
  target: string
  requiresAuth: boolean
}

const DB_PATH = resolve(process.cwd(), '.data', 'development-board.sqlite')

const DEFAULT_ITEMS: Array<Omit<DevelopmentBoardItem, 'updatedAt'>> = [
  {
    id: 'start-analyst-profile',
    section: 'start_here',
    title: 'Selesaikan analyst onboarding / profile management',
    description: 'Tambahkan halaman dan API untuk edit profil analyst, specialty, pricing, dan status pengajuan analis.',
    module: 'Analyst Management',
    tracer: 'Audit profile schema dan endpoint update analyst.',
    priority: 'high',
    status: 'not-started',
    helperText: 'Ini bottleneck utama supaya flow analyst menjadi nyata, bukan sekadar role di database.',
    sortOrder: 1,
  },
  {
    id: 'start-cms-persistence',
    section: 'start_here',
    title: 'Sambungkan CMS ke backend',
    description: 'Buat penyimpanan blok CMS di backend lalu render datanya ke landing page publik.',
    module: 'CMS',
    tracer: 'Tentukan struktur blok dan endpoint simpan/ambil.',
    priority: 'high',
    status: 'not-started',
    helperText: 'Landing page sudah punya arah, tapi belum punya persistence yang utuh.',
    sortOrder: 2,
  },
  {
    id: 'start-pro-feed',
    section: 'start_here',
    title: 'Rapikan pro feed dan subscription value',
    description: 'Pastikan pro feed hanya menampilkan signal yang relevan dari analyst yang diikuti dan tampilannya jelas.',
    module: 'Subscriber Experience',
    tracer: 'Audit query feed premium dan aturan akses subscription.',
    priority: 'medium',
    status: 'not-started',
    helperText: 'User harus langsung melihat manfaat setelah subscribe.',
    sortOrder: 3,
  },
  {
    id: 'check-auth-dashboard',
    section: 'checklist',
    title: 'Auth dan role-based dashboard',
    description: 'Sudah berjalan untuk admin, analyst, dan user.',
    module: 'Auth',
    tracer: 'Role dashboard utama sudah stabil.',
    priority: null,
    status: 'done',
    helperText: null,
    sortOrder: 1,
  },
  {
    id: 'check-publish-signal',
    section: 'checklist',
    title: 'Analyst publish signal',
    description: 'CRUD signal sudah ada, perlu dipastikan UX dan validasi konsisten.',
    module: 'Signals',
    tracer: 'Validasi form dan editor signal masih perlu dipoles.',
    priority: null,
    status: 'done',
    helperText: null,
    sortOrder: 2,
  },
  {
    id: 'check-user-subscribe',
    section: 'checklist',
    title: 'User subscribe ke analyst',
    description: 'Flow dasar ada, tetapi monetisasi dan value after-subscribe masih perlu diperkuat.',
    module: 'Subscriptions',
    tracer: 'Perkuat monetisasi dan after-subscribe experience.',
    priority: null,
    status: 'in-progress',
    helperText: null,
    sortOrder: 3,
  },
  {
    id: 'check-admin-approve',
    section: 'checklist',
    title: 'Admin approve analyst',
    description: 'Halaman dan API approval sudah tersedia.',
    module: 'Admin Approval',
    tracer: 'Approval flow dasar sudah siap dipakai.',
    priority: null,
    status: 'done',
    helperText: null,
    sortOrder: 4,
  },
  {
    id: 'check-cms-landing',
    section: 'checklist',
    title: 'CMS landing page',
    description: 'UI admin sudah ada, tetapi persistence backend belum utuh.',
    module: 'CMS',
    tracer: 'Pastikan publish admin langsung mengubah landing page publik.',
    priority: null,
    status: 'needs-work',
    helperText: null,
    sortOrder: 5,
  },
  {
    id: 'check-payment',
    section: 'checklist',
    title: 'Payment gateway real',
    description: 'Masih perlu integrasi Midtrans atau Xendit secara nyata.',
    module: 'Payments',
    tracer: 'Belum ada gateway produksi yang aktif.',
    priority: null,
    status: 'not-started',
    helperText: null,
    sortOrder: 6,
  },
  {
    id: 'task-analyst-profile',
    section: 'active',
    title: 'Analyst Profile Management',
    description: 'Lengkapi profil analis agar specialty, pricing, bio, dan readiness untuk approval bisa dikelola.',
    module: 'Analyst Management',
    tracer: 'Next step: Audit schema + page analyst yang sudah ada, lalu tambah API update profile.',
    priority: 'high',
    status: 'not-started',
    helperText: 'Next step: Audit schema + page analyst yang sudah ada, lalu tambah API update profile.',
    sortOrder: 1,
  },
  {
    id: 'task-cms-persistence',
    section: 'active',
    title: 'CMS Persistence',
    description: 'Hubungkan CMS admin ke penyimpanan backend agar landing page benar-benar dikelola dari panel admin.',
    module: 'CMS',
    tracer: 'Next step: Tentukan struktur data blok dan endpoint simpan/ambil.',
    priority: 'high',
    status: 'not-started',
    helperText: 'Next step: Tentukan struktur data blok dan endpoint simpan/ambil.',
    sortOrder: 2,
  },
  {
    id: 'task-pro-feed',
    section: 'active',
    title: 'Pro Feed Cleanup',
    description: 'Pastikan feed premium memberi nilai nyata untuk user yang sudah subscribe.',
    module: 'Subscriber Experience',
    tracer: 'Next step: Audit query source data dan batasi feed berdasarkan subscription aktif.',
    priority: 'medium',
    status: 'not-started',
    helperText: 'Next step: Audit query source data dan batasi feed berdasarkan subscription aktif.',
    sortOrder: 3,
  },
  {
    id: 'backlog-payment',
    section: 'backlog',
    title: 'Payment Gateway Integration',
    description: 'Midtrans/Xendit integration agar subscription tidak lagi dianggap paid secara dummy.',
    module: 'Payments',
    tracer: 'Tentukan provider dan alur webhook.',
    priority: 'high',
    status: 'not-started',
    helperText: null,
    sortOrder: 1,
  },
  {
    id: 'backlog-user-profile',
    section: 'backlog',
    title: 'User Profile Editing',
    description: 'Tambah edit profil user untuk nama, bio, avatar, dan preferensi dasar.',
    module: 'User Profile',
    tracer: 'Perlu page edit profile dan API update user.',
    priority: 'medium',
    status: 'not-started',
    helperText: null,
    sortOrder: 2,
  },
  {
    id: 'backlog-email',
    section: 'backlog',
    title: 'Email Notification',
    description: 'Tambahkan channel email untuk event penting seperti approval, subscription, dan signal penting.',
    module: 'Notifications',
    tracer: 'Pilih provider email dan daftar event prioritas.',
    priority: 'medium',
    status: 'not-started',
    helperText: null,
    sortOrder: 3,
  },
  {
    id: 'backlog-legal',
    section: 'backlog',
    title: 'Legal Documents Flow',
    description: 'Isi dan kelola Terms, Privacy Policy, disclaimer, dan dokumen legal platform.',
    module: 'Legal',
    tracer: 'Perlu konten legal dan halaman publik/legal admin.',
    priority: 'low',
    status: 'not-started',
    helperText: null,
    sortOrder: 4,
  },
  {
    id: 'bug-dummy-pages',
    section: 'bug',
    title: 'Masih ada halaman dengan data dummy atau semi-static',
    description: 'Beberapa area dashboard masih lebih kuat di UI daripada integrasi data real.',
    module: 'Dashboard',
    tracer: 'Audit setiap dashboard page dan tandai mana yang masih dummy.',
    priority: 'medium',
    status: 'open',
    helperText: 'Arah perbaikan: Audit setiap dashboard page dan tandai mana yang masih dummy.',
    sortOrder: 1,
  },
  {
    id: 'bug-role-naming',
    section: 'bug',
    title: 'Istilah role belum konsisten',
    description: 'Di UI dipakai user, di domain bisnis lebih cocok trader/subscriber.',
    module: 'UX Copy',
    tracer: 'Putuskan istilah role final dan rapikan UI.',
    priority: 'low',
    status: 'open',
    helperText: 'Arah perbaikan: Tentukan istilah final dan rapikan di UI serta dokumentasi.',
    sortOrder: 2,
  },
  {
    id: 'bug-payment-prod',
    section: 'bug',
    title: 'Payment flow belum valid untuk produksi',
    description: 'Subscription sudah ada tetapi belum didukung payment gateway sungguhan.',
    module: 'Payments',
    tracer: 'Jangan anggap monetisasi siap sebelum payment provider selesai diintegrasikan.',
    priority: 'high',
    status: 'open',
    helperText: 'Arah perbaikan: Jangan anggap monetisasi siap sebelum payment provider selesai diintegrasikan.',
    sortOrder: 3,
  },
]

let database: Database.Database | null = null

const ensureDatabase = () => {
  if (database) return database

  const dir = dirname(DB_PATH)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS development_board_items (
      id TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      module TEXT,
      tracer TEXT,
      priority TEXT,
      status TEXT NOT NULL,
      helper_text TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS qa_monitor_checks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      target TEXT NOT NULL,
      requires_auth INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS development_board_meta (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT NOT NULL
    )
  `)

  const itemColumns = db.prepare(`PRAGMA table_info(development_board_items)`).all() as Array<{ name: string }>
  const hasModuleColumn = itemColumns.some((column) => column.name === 'module')
  const hasTracerColumn = itemColumns.some((column) => column.name === 'tracer')

  if (!hasModuleColumn) {
    db.exec('ALTER TABLE development_board_items ADD COLUMN module TEXT')
  }

  if (!hasTracerColumn) {
    db.exec('ALTER TABLE development_board_items ADD COLUMN tracer TEXT')
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM development_board_items').get() as { count: number }
  if (count.count === 0) {
    const now = new Date().toISOString()
    const insert = db.prepare(`
      INSERT INTO development_board_items (
        id, section, title, description, module, tracer, priority, status, helper_text, sort_order, updated_at
      ) VALUES (
        @id, @section, @title, @description, @module, @tracer, @priority, @status, @helperText, @sortOrder, @updatedAt
      )
    `)

    const transaction = db.transaction((items: Array<Omit<DevelopmentBoardItem, 'updatedAt'>>) => {
      for (const item of items) {
        insert.run({ ...item, updatedAt: now })
      }
    })

    transaction(DEFAULT_ITEMS)
  }

  database = db
  return db
}

export const listDevelopmentBoardItems = (): DevelopmentBoardItem[] => {
  const db = ensureDatabase()
  return db.prepare(`
    SELECT
      id,
      section,
      title,
      description,
      module,
      tracer,
      priority,
      status,
      helper_text as helperText,
      sort_order as sortOrder,
      updated_at as updatedAt
    FROM development_board_items
    ORDER BY section, sort_order, updated_at DESC
  `).all() as DevelopmentBoardItem[]
}

export const updateDevelopmentBoardItemStatus = (id: string, status: DevelopmentBoardStatus): DevelopmentBoardItem | null => {
  const db = ensureDatabase()
  const now = new Date().toISOString()

  const result = db.prepare(`
    UPDATE development_board_items
    SET status = ?, updated_at = ?
    WHERE id = ?
  `).run(status, now, id)

  if (result.changes === 0) return null

  return db.prepare(`
    SELECT
      id,
      section,
      title,
      description,
      module,
      tracer,
      priority,
      status,
      helper_text as helperText,
      sort_order as sortOrder,
      updated_at as updatedAt
    FROM development_board_items
    WHERE id = ?
  `).get(id) as DevelopmentBoardItem
}

export const createDevelopmentBoardItem = (input: DevelopmentBoardItemInput): DevelopmentBoardItem => {
  const db = ensureDatabase()
  const now = new Date().toISOString()
  const id = randomUUID()
  const maxSortOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) as maxSortOrder FROM development_board_items WHERE section = ?').get(input.section) as { maxSortOrder: number }

  db.prepare(`
    INSERT INTO development_board_items (
      id, section, title, description, module, tracer, priority, status, helper_text, sort_order, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    input.section,
    input.title,
    input.description,
    input.module ?? null,
    input.tracer ?? null,
    input.priority,
    input.status,
    input.helperText ?? null,
    maxSortOrder.maxSortOrder + 1,
    now,
  )

  return db.prepare(`
    SELECT
      id,
      section,
      title,
      description,
      module,
      tracer,
      priority,
      status,
      helper_text as helperText,
      sort_order as sortOrder,
      updated_at as updatedAt
    FROM development_board_items
    WHERE id = ?
  `).get(id) as DevelopmentBoardItem
}

export const updateDevelopmentBoardItem = (id: string, input: DevelopmentBoardItemInput): DevelopmentBoardItem | null => {
  const db = ensureDatabase()
  const now = new Date().toISOString()

  const result = db.prepare(`
    UPDATE development_board_items
    SET section = ?, title = ?, description = ?, module = ?, tracer = ?, priority = ?, status = ?, helper_text = ?, updated_at = ?
    WHERE id = ?
  `).run(
    input.section,
    input.title,
    input.description,
    input.module ?? null,
    input.tracer ?? null,
    input.priority,
    input.status,
    input.helperText ?? null,
    now,
    id,
  )

  if (result.changes === 0) return null

  return db.prepare(`
    SELECT
      id,
      section,
      title,
      description,
      module,
      tracer,
      priority,
      status,
      helper_text as helperText,
      sort_order as sortOrder,
      updated_at as updatedAt
    FROM development_board_items
    WHERE id = ?
  `).get(id) as DevelopmentBoardItem
}

export const deleteDevelopmentBoardItem = (id: string): boolean => {
  const db = ensureDatabase()
  const result = db.prepare('DELETE FROM development_board_items WHERE id = ?').run(id)
  return result.changes > 0
}

export const getDevelopmentBoardDbPath = () => DB_PATH

export const getDevelopmentBoardMeta = (): DevelopmentBoardMeta => {
  const db = ensureDatabase()
  const rows = db.prepare(`
    SELECT key, value, updated_at as updatedAt
    FROM development_board_meta
    WHERE key IN ('phase', 'phaseNote')
  `).all() as Array<{ key: string; value: string | null; updatedAt: string }>

  const phaseRow = rows.find((row) => row.key === 'phase')
  const phaseNoteRow = rows.find((row) => row.key === 'phaseNote')

  return {
    phase: phaseRow?.value ?? null,
    phaseNote: phaseNoteRow?.value ?? null,
    updatedAt: phaseRow?.updatedAt ?? phaseNoteRow?.updatedAt ?? null,
  }
}

export const setDevelopmentBoardMeta = (input: { phase?: string | null; phaseNote?: string | null }): DevelopmentBoardMeta => {
  const db = ensureDatabase()
  const now = new Date().toISOString()
  const upsert = db.prepare(`
    INSERT INTO development_board_meta (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `)

  if (typeof input.phase !== 'undefined') {
    upsert.run('phase', input.phase?.trim() || null, now)
  }

  if (typeof input.phaseNote !== 'undefined') {
    upsert.run('phaseNote', input.phaseNote?.trim() || null, now)
  }

  return getDevelopmentBoardMeta()
}

export const listQaMonitorChecks = (): QaMonitorCheck[] => {
  const db = ensureDatabase()
  return db.prepare(`
    SELECT
      id,
      name,
      type,
      target,
      requires_auth as requiresAuth,
      created_at as createdAt
    FROM qa_monitor_checks
    ORDER BY created_at DESC
  `).all().map((item: any) => ({
    ...item,
    requiresAuth: Boolean(item.requiresAuth),
  })) as QaMonitorCheck[]
}

export const createQaMonitorCheck = (input: QaMonitorCheckInput): QaMonitorCheck => {
  const db = ensureDatabase()
  const now = new Date().toISOString()
  const id = randomUUID()

  db.prepare(`
    INSERT INTO qa_monitor_checks (
      id, name, type, target, requires_auth, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, input.name, input.type, input.target, input.requiresAuth ? 1 : 0, now)

  const item = db.prepare(`
    SELECT
      id,
      name,
      type,
      target,
      requires_auth as requiresAuth,
      created_at as createdAt
    FROM qa_monitor_checks
    WHERE id = ?
  `).get(id) as any

  return {
    ...item,
    requiresAuth: Boolean(item.requiresAuth),
  } as QaMonitorCheck
}

export const deleteQaMonitorCheck = (id: string): boolean => {
  const db = ensureDatabase()
  const result = db.prepare('DELETE FROM qa_monitor_checks WHERE id = ?').run(id)
  return result.changes > 0
}