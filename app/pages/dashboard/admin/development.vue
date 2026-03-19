<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Development Workspace</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Pisahkan QA monitor dan development board, lalu simpan progress kerja ke SQLite file di dalam project.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="badge badge-soft badge-primary">{{ boardSummary.openTasks }} open tasks</span>
        <span class="badge badge-soft badge-error">{{ boardSummary.openBugs }} open bugs</span>
      </div>
    </div>

    <div class="tabs tabs-bordered">
      <button type="button" class="tab" :class="activeTab === 'qa' && 'tab-active font-semibold'" @click="activeTab = 'qa'">
        <IconShieldSearch class="w-4 h-4 mr-1.5" /> QA Monitor
      </button>
      <button type="button" class="tab" :class="activeTab === 'board' && 'tab-active font-semibold'" @click="activeTab = 'board'">
        <IconChecklist class="w-4 h-4 mr-1.5" /> Development Board
      </button>
      <button type="button" class="tab" :class="activeTab === 'database' && 'tab-active font-semibold'" @click="activeTab = 'database'">
        <IconDatabase class="w-4 h-4 mr-1.5" /> Database
      </button>
      <button type="button" class="tab" :class="activeTab === 'tests' && 'tab-active font-semibold'" @click="activeTab = 'tests'">
        <IconPlayerPlay class="w-4 h-4 mr-1.5" /> Test Manager
      </button>
    </div>

    <template v-if="activeTab === 'qa'">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-5 space-y-5">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h2 class="font-bold text-lg flex items-center gap-2">
                <IconShieldSearch class="w-5 h-5 text-primary" /> QA Monitor
              </h2>
              <p class="text-sm text-base-content/50 mt-1">Scan manual untuk route dan API penting. Hasil warning dan error otomatis masuk ke system log QA monitor.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="btn btn-sm btn-ghost" @click="loadQaHistory" :disabled="qaPending">
                <IconRefresh class="w-4 h-4" /> Refresh Logs
              </button>
              <button type="button" class="btn btn-primary btn-sm" @click="runQaScan" :disabled="qaPending">
                <IconScan class="w-4 h-4" />
                <span v-if="qaPending">Running Scan...</span>
                <span v-else>Run QA Scan</span>
              </button>
            </div>
          </div>

          <div v-if="qaError" class="alert border border-error/30 bg-error/10 py-3 text-error">
            <IconAlertTriangle class="w-5 h-5 shrink-0" />
            <p class="text-sm font-medium">{{ qaError }}</p>
          </div>

          <div class="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Last Scan</p>
              <p class="text-sm font-semibold">{{ qaResult ? formatDateTime(qaResult.summary.checkedAt) : 'Belum ada' }}</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Total Checks</p>
              <p class="text-2xl font-extrabold">{{ qaResult?.summary.totalChecks ?? 0 }}</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Passed</p>
              <p class="text-2xl font-extrabold text-success">{{ qaResult?.summary.passed ?? 0 }}</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Warnings</p>
              <p class="text-2xl font-extrabold text-warning">{{ qaResult?.summary.warnings ?? 0 }}</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Errors</p>
              <p class="text-2xl font-extrabold text-error">{{ qaResult?.summary.errors ?? 0 }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 border border-base-300 p-4 bg-base-200/20">
              <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-1">Ringkasan Prioritas</p>
              <p class="text-sm font-medium">{{ qaResult?.summary.headline || 'Jalankan QA scan untuk mendapatkan ringkasan kondisi route dan API penting.' }}</p>

              <details class="mt-3 group">
                <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wide text-base-content/50 list-none flex items-center justify-between gap-3">
                  <span>Rekomendasi Tindak Lanjut</span>
                  <span class="text-[11px] text-base-content/40 group-open:hidden">Buka</span>
                  <span class="text-[11px] text-base-content/40 hidden group-open:inline">Tutup</span>
                </summary>
                <div class="space-y-2 text-sm mt-3">
                  <p v-for="item in qaResult?.summary.recommendations || defaultRecommendations" :key="item">{{ item }}</p>
                </div>
              </details>
            </div>

            <details class="border border-base-300 p-4 bg-base-200/20 group">
              <summary class="cursor-pointer text-xs text-base-content/40 uppercase tracking-wide font-semibold list-none flex items-center justify-between gap-3">
                <span>Apa Yang Dicek</span>
                <span class="text-[11px] text-base-content/40 group-open:hidden">Buka</span>
                <span class="text-[11px] text-base-content/40 hidden group-open:inline">Tutup</span>
              </summary>
              <div class="space-y-2 text-sm text-base-content/75 mt-3">
                <p>Public routes penting seperti landing, login, dan public feed.</p>
                <p>Admin routes penting seperti overview, users, analysts, logs, dan development board.</p>
                <p>API utama seperti auth, dashboard admin, users, analysts, logs, settings, signals, dan journals.</p>
                <p>Page baru dan API GET baru sekarang juga bisa terdeteksi otomatis dari struktur file project.</p>
              </div>
            </details>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Auto Discovered</p>
              <p class="text-2xl font-extrabold">{{ qaDiscovery.autoDiscovered }}</p>
              <p class="text-xs text-base-content/50 mt-1">Static page dan GET API yang terdeteksi otomatis</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Custom Checks</p>
              <p class="text-2xl font-extrabold">{{ qaDiscovery.customChecks }}</p>
              <p class="text-xs text-base-content/50 mt-1">Check yang Anda tambahkan manual dari UI</p>
            </div>
            <div class="card bg-base-200/40 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Skipped Dynamic</p>
              <p class="text-2xl font-extrabold text-warning">{{ qaDiscovery.skippedDynamic.length }}</p>
              <p class="text-xs text-base-content/50 mt-1">Route dinamis yang butuh sample param manual</p>
            </div>
          </div>

          <details v-if="qaDiscovery.skippedDynamic.length" class="border border-base-300 p-4 bg-base-200/20 group">
            <summary class="cursor-pointer list-none flex items-start justify-between gap-3">
              <div>
                <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold">Route Yang Tidak Bisa Discann Otomatis</p>
                <p class="text-sm text-base-content/60 mt-1">Ini adalah route dinamis atau route yang butuh parameter/contoh session khusus, jadi scanner tidak bisa menebak request valid secara otomatis.</p>
              </div>
              <span class="badge badge-sm badge-soft badge-warning mt-0.5">{{ qaDiscovery.skippedDynamic.length }}</span>
            </summary>
            <div class="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
              <div v-for="item in qaDiscovery.skippedDynamic" :key="`${item.type}:${item.sourcePath}`" class="text-sm border border-base-300 bg-base-100 p-3">
                <p class="font-medium">{{ item.sourcePath }}</p>
                <p class="text-xs text-base-content/50 mt-1">{{ item.reason }}</p>
              </div>
            </div>
          </details>

          <div class="card bg-base-200/20 border border-base-300">
            <div class="card-body p-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 pt-4">
                <div>
                  <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold">Hasil QA</p>
                  <p class="text-xs text-base-content/50 mt-1">Tabel ini dibuat scrollable agar daftar page dan API tetap ringkas walau check makin banyak.</p>
                </div>
                <div class="tabs tabs-bordered">
                <button type="button" class="tab" :class="qaResultTab === 'pages' && 'tab-active font-semibold'" @click="qaResultTab = 'pages'">
                  Pages
                  <span class="badge badge-sm badge-soft ml-2">{{ pageResults.length }}</span>
                </button>
                <button type="button" class="tab" :class="qaResultTab === 'apis' && 'tab-active font-semibold'" @click="qaResultTab = 'apis'">
                  APIs
                  <span class="badge badge-sm badge-soft ml-2">{{ apiResults.length }}</span>
                </button>
                </div>
              </div>
              <div class="max-h-112 overflow-auto">
                <table class="table table-sm w-full">
                  <thead>
                    <tr class="bg-base-200/60 text-xs uppercase">
                      <th>Check</th>
                      <th>Type</th>
                      <th>Target</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="qaPending">
                      <td colspan="6" class="text-center py-8 text-base-content/40">
                        <span class="loading loading-spinner loading-sm"></span>
                      </td>
                    </tr>
                    <tr v-else-if="!qaResult?.results.length">
                      <td colspan="6" class="text-center py-10 text-base-content/40">
                        <IconScan class="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p class="text-sm">Belum ada hasil scan. Jalankan QA scan untuk memulai.</p>
                      </td>
                    </tr>
                    <tr v-else-if="!visibleQaResults.length">
                      <td colspan="6" class="text-center py-10 text-base-content/40">
                        <p class="text-sm">Belum ada hasil untuk tab {{ qaResultTab === 'pages' ? 'Pages' : 'APIs' }}.</p>
                      </td>
                    </tr>
                    <tr v-for="result in visibleQaResults" :key="result.id">
                      <td class="text-sm font-medium">{{ result.name }}</td>
                      <td>
                        <span class="badge badge-sm badge-soft">{{ result.type }}</span>
                      </td>
                      <td class="font-mono text-xs text-base-content/60 max-w-65 truncate">{{ result.target }}</td>
                      <td class="font-mono text-xs">{{ result.status ?? 'ERR' }}</td>
                      <td class="text-xs">{{ result.durationMs }}ms</td>
                      <td>
                        <div class="space-y-1">
                          <span class="badge badge-sm badge-soft" :class="resultBadgeClass(result.severity)">{{ result.severity }}</span>
                          <p class="text-xs text-base-content/60 max-w-[320px]">{{ result.note }}</p>
                          <button
                            type="button"
                            v-if="result.severity !== 'ok'"
                            class="btn btn-xs btn-outline mt-1"
                            :disabled="creatingBugForCheckId === result.id"
                            @click="createBugFromQaResult(result)"
                          >
                            <IconBug class="w-3 h-3" />
                            <span v-if="creatingBugForCheckId === result.id">Saving...</span>
                            <span v-else>Jadikan Bug</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <details class="card bg-base-200/20 border border-base-300 group" :open="Boolean(qaCheckError)">
              <summary class="cursor-pointer list-none flex items-center justify-between gap-3 px-5 pt-5">
                <div>
                  <h3 class="font-bold text-base flex items-center gap-2">
                    <IconPlus class="w-5 h-5 text-primary" /> Tambah Custom QA Check
                  </h3>
                  <p class="text-xs text-base-content/50">Kalau ada fitur baru, Anda bisa tambahkan route atau API baru ke QA monitor dari sini.</p>
                </div>
                <span class="text-[11px] text-base-content/40">{{ qaCheckError ? 'Perlu dicek' : 'Buka' }}</span>
              </summary>

              <div class="card-body p-5 pt-4">
                <div class="space-y-4">
                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Nama Check</legend>
                    <input v-model="qaCheckForm.name" type="text" class="input input-bordered w-full" placeholder="Misalnya: Analyst Profile Page" />
                  </fieldset>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <fieldset class="fieldset">
                      <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Jenis</legend>
                      <select v-model="qaCheckForm.type" class="select select-bordered w-full">
                        <option value="page">page</option>
                        <option value="api">api</option>
                      </select>
                    </fieldset>

                    <fieldset class="fieldset">
                      <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Butuh Auth</legend>
                      <label class="label cursor-pointer justify-start gap-3">
                        <input v-model="qaCheckForm.requiresAuth" type="checkbox" class="toggle toggle-primary" />
                        <span class="label-text">Gunakan cookie session admin</span>
                      </label>
                    </fieldset>
                  </div>

                  <fieldset class="fieldset">
                    <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Target</legend>
                    <input v-model="qaCheckForm.target" type="text" class="input input-bordered w-full" placeholder="Contoh: /dashboard/analyst/profile atau /api/analyst/profile" />
                  </fieldset>

                  <button type="button" class="btn btn-sm btn-primary" :disabled="qaCheckPending" @click="createQaCheck">
                    <IconPlus class="w-4 h-4" />
                    <span v-if="qaCheckPending">Saving...</span>
                    <span v-else>Add QA Check</span>
                  </button>

                  <div v-if="qaCheckError" class="alert border border-error/30 bg-error/10 py-3 text-error">
                    <IconAlertTriangle class="w-5 h-5 shrink-0" />
                    <p class="text-sm font-medium">{{ qaCheckError }}</p>
                  </div>
                </div>
              </div>
            </details>

            <details class="card bg-base-200/20 border border-base-300 group">
              <summary class="cursor-pointer list-none flex items-center justify-between gap-3 px-5 pt-5">
                  <div>
                    <h3 class="font-bold text-base flex items-center gap-2">
                      <IconChecklist class="w-5 h-5 text-primary" /> Custom QA Checks
                    </h3>
                    <p class="text-xs text-base-content/50">Daftar check tambahan yang akan ikut discan setiap kali QA scan dijalankan.</p>
                  </div>
                  <span class="badge badge-sm badge-soft">{{ qaCustomChecks.length }}</span>
                </summary>

              <div class="card-body p-5 pt-4">
                <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <div v-if="!qaCustomChecks.length" class="text-sm text-base-content/50">
                    Belum ada custom check. Tambahkan saat ada page atau API baru.
                  </div>
                  <div v-for="item in qaCustomChecks" :key="item.id" class="border border-base-300 p-4 bg-base-100">
                    <div class="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p class="text-sm font-medium">{{ item.name }}</p>
                        <p class="text-xs text-base-content/50 mt-1">{{ item.target }}</p>
                      </div>
                      <button type="button" class="btn btn-ghost btn-xs text-error" :disabled="deletingQaCheckId === item.id || deleteModalPending" @click="openDeleteQaCheckModal(item)">
                        <IconTrash class="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-base-content/60">
                      <span class="badge badge-sm badge-soft">{{ item.type }}</span>
                      <span class="badge badge-sm badge-soft">{{ item.requiresAuth ? 'auth' : 'public' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <details class="border border-base-300 p-4 bg-base-200/20 group">
            <summary class="cursor-pointer list-none flex items-center justify-between gap-3">
              <div>
                <h3 class="font-bold text-base flex items-center gap-2">
                  <IconHistory class="w-5 h-5 text-primary" /> Recent QA Findings
                </h3>
                <p class="text-xs text-base-content/50 mt-1">Diambil dari system log dengan path QA monitor.</p>
              </div>
              <span class="badge badge-sm badge-soft">{{ qaHistory.length }}</span>
            </summary>

            <div class="space-y-3 mt-4 max-h-80 overflow-y-auto pr-1">
              <div v-if="!qaHistory.length" class="border border-base-300 p-4 bg-base-200/20 text-sm text-base-content/50">
                Belum ada history QA. Jalankan scan pertama untuk mulai mencatat temuan.
              </div>
              <div v-for="item in qaHistory" :key="item.id" class="border border-base-300 p-4 bg-base-100">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="badge badge-sm badge-soft" :class="historyBadgeClass(item.level)">{{ item.level }}</span>
                    <p class="text-sm font-medium">{{ item.message }}</p>
                  </div>
                  <p class="text-xs text-base-content/50">{{ formatDateTime(item.createdAt) }}</p>
                </div>
                <p v-if="historyMetaSummary(item.meta)" class="text-xs text-base-content/60">{{ historyMetaSummary(item.meta) }}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </template>

    <template v-else-if="activeTab === 'board'">
      <div class="space-y-6">
        <div class="alert border border-primary/20 bg-primary/5 py-3">
          <IconDatabase class="w-5 h-5 text-primary shrink-0" />
          <div>
            <p class="font-semibold text-sm">Development Board disimpan di SQLite lokal.</p>
            <p class="text-xs text-base-content/70">File database: {{ boardDbPath || 'memuat...' }}. Jika ingin data ikut pindah device, file ini perlu ikut disalin atau ikut tersinkron bersama project.</p>
          </div>
        </div>

        <div v-if="boardError" class="alert border border-error/30 bg-error/10 py-3 text-error">
          <IconAlertTriangle class="w-5 h-5 shrink-0" />
          <p class="text-sm font-medium">{{ boardError }}</p>
        </div>

        <div v-if="boardInfo" class="alert border border-success/30 bg-success/10 py-3 text-success">
          <IconCircleCheck class="w-5 h-5 shrink-0" />
          <p class="text-sm font-medium">{{ boardInfo }}</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="font-bold text-lg">Board Actions</h2>
            <p class="text-sm text-base-content/50">Tambah, edit, atau hapus task dan bug dari board ini.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="btn btn-sm btn-ghost" @click="openPhaseModal">
              <IconPencil class="w-4 h-4" /> Edit Phase
            </button>
            <button type="button" class="btn btn-sm btn-outline" @click="openCreateModal('checklist')">
              <IconChecklist class="w-4 h-4" /> Add Checklist
            </button>
            <button type="button" class="btn btn-sm btn-primary" @click="openCreateModal('active')">
              <IconPlus class="w-4 h-4" /> Add Task
            </button>
            <button type="button" class="btn btn-sm btn-outline" @click="openCreateModal('bug')">
              <IconBug class="w-4 h-4" /> Add Bug
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="card p-4" :class="boardPhaseCardClass">
            <p class="text-xs text-base-content/50 mb-1">Current Phase</p>
            <p class="text-lg font-bold">{{ boardMeta.phase }}</p>
            <p class="text-xs text-base-content/50 mt-1">{{ boardMeta.phaseNote }}</p>
          </div>
          <div class="card p-4" :class="boardFocusCardClass">
            <p class="text-xs text-base-content/50 mb-1">Focus This Week</p>
            <p class="text-lg font-bold">{{ boardMeta.focusThisWeek }}</p>
            <p class="text-xs text-base-content/50 mt-1">{{ boardMeta.focusNote }}</p>
          </div>
          <div class="card p-4" :class="openTasksCardClass">
            <p class="text-xs text-base-content/50 mb-1">Open Tasks</p>
            <p class="text-2xl font-extrabold text-primary">{{ boardSummary.openTasks }}</p>
            <p class="text-xs text-base-content/50 mt-1">Task dengan status belum selesai</p>
          </div>
          <div class="card p-4" :class="openBugsCardClass">
            <p class="text-xs text-base-content/50 mb-1">Open Bugs</p>
            <p class="text-2xl font-extrabold text-error">{{ boardSummary.openBugs }}</p>
            <p class="text-xs text-base-content/50 mt-1">Bug yang masih open atau in progress</p>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div class="xl:col-span-2 space-y-6">
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 class="font-bold text-lg flex items-center gap-2">
                      <IconPlayerPlay class="w-5 h-5 text-primary" /> Mulai Dari Sini
                    </h2>
                    <p class="text-sm text-base-content/50">Checklist prioritas awal yang bisa langsung Anda eksekusi.</p>
                  </div>
                  <button type="button" class="btn btn-sm btn-ghost" @click="loadBoard" :disabled="boardPending">
                    <IconRefresh class="w-4 h-4" /> Refresh Board
                  </button>
                </div>

                <div class="space-y-3">
                  <div v-for="item in startHereItems" :key="item.id" class="border border-base-300 p-4 bg-base-200/30">
                    <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-2">
                      <div>
                        <p class="font-semibold text-sm">{{ item.title }}</p>
                        <div class="flex items-center gap-2 mt-1 flex-wrap">
                          <span class="badge badge-sm badge-soft badge-info">{{ item.module || 'General' }}</span>
                        </div>
                        <p v-if="item.helperText" class="text-xs text-base-content/50 mt-1">{{ item.helperText }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <span v-if="item.priority" class="badge badge-sm badge-soft" :class="priorityBadgeClass(item.priority)">{{ item.priority }}</span>
                        <select class="select select-sm select-bordered w-36" :value="item.status" :disabled="boardPendingItemId === item.id" @change="updateBoardItemStatus(item.id, ($event.target as HTMLSelectElement).value)">
                          <option v-for="option in taskStatusOptions" :key="option" :value="option">{{ option }}</option>
                        </select>
                      </div>
                    </div>
                    <p class="text-sm text-base-content/80">{{ item.description }}</p>
                    <p v-if="item.tracer" class="text-xs text-base-content/60 mt-2">Tracer: {{ item.tracer }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <h2 class="font-bold text-lg flex items-center gap-2">
                    <IconChecklist class="w-5 h-5 text-primary" /> Core Flow Checklist
                  </h2>
                  <button type="button" class="btn btn-sm btn-ghost" @click="openCreateModal('checklist')">
                    <IconPlus class="w-4 h-4" /> Add Checklist
                  </button>
                </div>
                <div class="overflow-x-auto">
                  <table class="table table-sm w-full">
                    <thead>
                      <tr class="bg-base-200/60 text-xs uppercase">
                        <th>Flow</th>
                        <th>Status</th>
                        <th>Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in checklistItems" :key="item.id">
                        <td class="font-medium text-sm">
                          <p>{{ item.title }}</p>
                          <span class="badge badge-sm badge-soft badge-info mt-1">{{ item.module || 'General' }}</span>
                        </td>
                        <td>
                          <select class="select select-sm select-bordered w-40" :value="item.status" :disabled="boardPendingItemId === item.id" @change="updateBoardItemStatus(item.id, ($event.target as HTMLSelectElement).value)">
                            <option v-for="option in checklistStatusOptions" :key="option" :value="option">{{ option }}</option>
                          </select>
                        </td>
                        <td class="text-xs text-base-content/60">
                          <p>{{ item.description }}</p>
                          <p v-if="item.tracer" class="mt-1">Tracer: {{ item.tracer }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5">
                  <div class="flex items-center justify-between gap-3 mb-4">
                    <h2 class="font-bold text-lg flex items-center gap-2">
                      <IconClockHour4 class="w-5 h-5 text-primary" /> Task Aktif
                    </h2>
                    <button type="button" class="btn btn-sm btn-ghost" @click="openCreateModal('active')">
                      <IconPlus class="w-4 h-4" /> Add Task
                    </button>
                  </div>
                  <div class="space-y-3">
                    <div v-for="item in activeItems" :key="item.id" class="border border-base-300 p-4 bg-base-200/20">
                      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-2">
                        <div>
                          <p class="font-semibold text-sm">{{ item.title }}</p>
                          <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="badge badge-sm badge-soft badge-info">{{ item.module || 'General' }}</span>
                          </div>
                        </div>
                          <div class="flex items-center gap-2 flex-wrap justify-end">
                          <span v-if="item.priority" class="badge badge-sm badge-soft" :class="priorityBadgeClass(item.priority)">{{ item.priority }}</span>
                            <button type="button" class="btn btn-ghost btn-xs" @click="openEditModal(item)">
                              <IconPencil class="w-3.5 h-3.5" /> Edit
                            </button>
                            <button type="button" class="btn btn-ghost btn-xs text-error" @click="openDeleteBoardItemModal(item)">
                              <IconTrash class="w-3.5 h-3.5" /> Delete
                            </button>
                          <select class="select select-sm select-bordered w-36" :value="item.status" :disabled="boardPendingItemId === item.id" @change="updateBoardItemStatus(item.id, ($event.target as HTMLSelectElement).value)">
                            <option v-for="option in taskStatusOptions" :key="option" :value="option">{{ option }}</option>
                          </select>
                        </div>
                      </div>
                      <p class="text-xs text-base-content/60 mb-2">{{ item.description }}</p>
                      <p v-if="item.tracer" class="text-xs text-base-content/60 mb-2">Tracer: {{ item.tracer }}</p>
                      <p v-if="item.helperText" class="text-xs font-medium text-base-content/70">{{ item.helperText }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5">
                  <div class="flex items-center justify-between gap-3 mb-4">
                    <h2 class="font-bold text-lg flex items-center gap-2">
                      <IconStack2 class="w-5 h-5 text-primary" /> Backlog Penting
                    </h2>
                    <button type="button" class="btn btn-sm btn-ghost" @click="openCreateModal('backlog')">
                      <IconPlus class="w-4 h-4" /> Add Backlog
                    </button>
                  </div>
                  <div class="space-y-3">
                    <div v-for="item in backlogItems" :key="item.id" class="border border-base-300 p-4 bg-base-200/20">
                      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-2">
                        <div>
                          <p class="font-semibold text-sm">{{ item.title }}</p>
                          <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="badge badge-sm badge-soft badge-info">{{ item.module || 'General' }}</span>
                          </div>
                        </div>
                          <div class="flex items-center gap-2 flex-wrap justify-end">
                          <span v-if="item.priority" class="badge badge-sm badge-soft" :class="priorityBadgeClass(item.priority)">{{ item.priority }}</span>
                            <button type="button" class="btn btn-ghost btn-xs" @click="openEditModal(item)">
                              <IconPencil class="w-3.5 h-3.5" /> Edit
                            </button>
                            <button type="button" class="btn btn-ghost btn-xs text-error" @click="openDeleteBoardItemModal(item)">
                              <IconTrash class="w-3.5 h-3.5" /> Delete
                            </button>
                          <select class="select select-sm select-bordered w-36" :value="item.status" :disabled="boardPendingItemId === item.id" @change="updateBoardItemStatus(item.id, ($event.target as HTMLSelectElement).value)">
                            <option v-for="option in taskStatusOptions" :key="option" :value="option">{{ option }}</option>
                          </select>
                        </div>
                      </div>
                      <p class="text-xs text-base-content/60">{{ item.description }}</p>
                      <p v-if="item.tracer" class="text-xs text-base-content/60 mt-2">Tracer: {{ item.tracer }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <h2 class="font-bold text-lg flex items-center gap-2">
                    <IconBug class="w-5 h-5 text-error" /> Open Bugs
                  </h2>
                  <button type="button" class="btn btn-sm btn-ghost" @click="openCreateModal('bug')">
                    <IconPlus class="w-4 h-4" /> Add Bug
                  </button>
                </div>
                <div class="space-y-3">
                  <div v-for="item in bugItems" :key="item.id" class="border p-4" :class="highlightedBoardItemId === item.id ? 'border-warning bg-warning/10' : 'border-error/20 bg-error/5'">
                    <div class="flex flex-col gap-3 mb-2">
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="font-semibold text-sm">{{ item.title }}</p>
                          <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="badge badge-sm badge-soft badge-info">{{ item.module || 'General' }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap justify-end">
                          <span v-if="item.priority" class="badge badge-sm badge-soft" :class="priorityBadgeClass(item.priority)">{{ item.priority }}</span>
                          <button type="button" class="btn btn-ghost btn-xs" @click="openEditModal(item)">
                            <IconPencil class="w-3.5 h-3.5" /> Edit
                          </button>
                          <button type="button" class="btn btn-ghost btn-xs text-error" @click="openDeleteBoardItemModal(item)">
                            <IconTrash class="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                      <select class="select select-sm select-bordered w-full" :value="item.status" :disabled="boardPendingItemId === item.id" @change="updateBoardItemStatus(item.id, ($event.target as HTMLSelectElement).value)">
                        <option v-for="option in bugStatusOptions" :key="option" :value="option">{{ option }}</option>
                      </select>
                    </div>
                    <p class="text-xs text-base-content/70 mb-2">{{ item.description }}</p>
                    <p v-if="item.tracer" class="text-xs text-base-content/60 mb-2">Tracer: {{ item.tracer }}</p>
                    <p v-if="item.helperText" class="text-xs text-base-content/50">{{ item.helperText }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <h2 class="font-bold text-lg flex items-center gap-2">
                    <IconCircleCheck class="w-5 h-5 text-success" /> Recently Completed
                  </h2>
                  <button type="button" class="btn btn-sm btn-ghost" @click="showCompletedModal = true" :disabled="!allCompletedItems.length">
                    View All
                  </button>
                </div>
                <div class="space-y-2 text-sm">
                  <div v-if="!completedItems.length" class="text-base-content/50">Belum ada item yang selesai.</div>
                  <div v-for="item in completedItems" :key="item.id" class="flex items-start gap-2">
                    <IconCircleCheck class="w-4 h-4 mt-0.5 shrink-0 text-success" />
                    <div>
                      <p>{{ item.title }}</p>
                      <div class="flex items-center gap-2 mt-1 flex-wrap">
                        <span class="badge badge-sm badge-soft badge-info">{{ item.module || 'General' }}</span>
                        <span class="badge badge-sm badge-soft">{{ item.section }}</span>
                      </div>
                      <p v-if="item.tracer" class="text-xs text-base-content/60 mt-1">Tracer: {{ item.tracer }}</p>
                      <p class="text-xs text-base-content/50">{{ formatDateTime(item.updatedAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
                  <IconNotes class="w-5 h-5 text-primary" /> Cara Pakai Board
                </h2>
                <div class="space-y-3 text-sm text-base-content/75">
                  <p>Ubah status checklist dan task langsung dari dropdown.</p>
                  <p>Gunakan status <strong>done</strong> untuk item selesai dan <strong>fixed</strong> untuk bug yang beres.</p>
                  <p>Data board disimpan di SQLite file lokal di dalam project.</p>
                  <p>Saat pindah device, file SQLite perlu ikut dipindahkan atau ikut tersinkron di repo/folder kerja Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="activeTab === 'database'">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="font-bold text-lg flex items-center gap-2">
              <IconDatabase class="w-5 h-5 text-primary" /> Database Overview
            </h2>
            <p class="text-sm text-base-content/50 mt-0.5">Status koneksi, migration history, board storage, dan dev tools.</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="databaseOverview" class="text-xs text-base-content/50">Terakhir dicek: {{ formatDateTime(databaseOverview.checkedAt) }}</span>
            <button type="button" class="btn btn-sm btn-ghost" @click="loadDatabaseOverview" :disabled="databaseOverviewPending">
              <IconRefresh class="w-4 h-4" />
              <span v-if="databaseOverviewPending">Checking...</span>
              <span v-else>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="databaseOverviewError" class="alert border border-error/30 bg-error/10 py-3 text-error">
          <IconAlertTriangle class="w-5 h-5 shrink-0" />
          <p class="text-sm font-medium">{{ databaseOverviewError }}</p>
        </div>

        <!-- Loading skeleton -->
        <div v-else-if="databaseOverviewPending && !databaseOverview" class="card bg-base-100 border border-base-300 p-8 text-center text-base-content/50">
          <span class="loading loading-spinner loading-sm mx-auto mb-2"></span>
          <p class="text-sm">Memuat database overview...</p>
        </div>

        <template v-if="databaseOverview">
          <!-- Summary row -->
          <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="card p-4" :class="databaseOverview.app.connectionStatus === 'connected' ? 'bg-success/5 border border-success/20' : 'bg-error/5 border border-error/20'">
              <p class="text-xs text-base-content/50 mb-1">App Database</p>
              <div class="flex items-center gap-2">
                <span class="badge badge-sm badge-soft" :class="databaseConnectionBadgeClass">{{ databaseOverview.app.connectionStatus === 'connected' ? 'Connected' : 'Error' }}</span>
              </div>
              <p class="text-xs text-base-content/60 mt-1">{{ databaseOverview.app.engine }}</p>
            </div>
            <div class="card p-4" :class="databaseOverview.app.migrationStatus === 'in-sync' ? 'bg-success/5 border border-success/20' : databaseOverview.app.migrationStatus === 'drift' ? 'bg-error/5 border border-error/20' : 'bg-warning/5 border border-warning/20'">
              <p class="text-xs text-base-content/50 mb-1">Migrations</p>
              <div class="flex items-center gap-2">
                <span class="badge badge-sm badge-soft" :class="migrationStatusBadgeClass">{{ migrationStatusLabel }}</span>
              </div>
              <p class="text-xs text-base-content/60 mt-1">{{ databaseOverview.app.appliedMigrationCount }}/{{ databaseOverview.app.localMigrationCount }} applied</p>
            </div>
            <div class="card bg-base-100 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">App Tables</p>
              <p class="text-2xl font-extrabold">{{ Object.keys(databaseOverview.app.tables).length }}</p>
              <p class="text-xs text-base-content/60 mt-1">Prisma models tracked</p>
            </div>
            <div class="card bg-base-100 border border-base-300 p-4">
              <p class="text-xs text-base-content/50 mb-1">Board SQLite</p>
              <p class="text-2xl font-extrabold">{{ databaseOverview.board.fileSizeLabel }}</p>
              <p class="text-xs text-base-content/60 mt-1">{{ databaseOverview.board.itemCount }} items · {{ databaseOverview.board.qaCheckCount }} QA checks</p>
            </div>
          </div>

          <!-- Main grid -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Left 2/3 -->
            <div class="xl:col-span-2 space-y-6">

              <!-- App Database card -->
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5 space-y-4">
                  <h3 class="font-bold text-base flex items-center gap-2">
                    <IconServer class="w-5 h-5 text-primary" /> App Database
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div class="border border-base-300 bg-base-200/20 p-3">
                      <p class="text-xs text-base-content/50 mb-1">Engine</p>
                      <p class="font-semibold">{{ databaseOverview.app.engine }}</p>
                    </div>
                    <div class="border border-base-300 bg-base-200/20 p-3 md:col-span-2">
                      <p class="text-xs text-base-content/50 mb-1">Target</p>
                      <p class="font-mono text-xs break-all">{{ databaseOverview.app.target }}</p>
                    </div>
                  </div>
                  <div class="border border-base-300 p-3 text-sm" :class="databaseOverview.app.connectionStatus === 'connected' ? 'bg-success/5' : 'bg-error/5'">
                    <p class="text-xs text-base-content/50 mb-1">Status</p>
                    <p class="text-sm">{{ databaseOverview.app.connectionNote }}</p>
                  </div>
                  <div v-if="Object.keys(databaseOverview.app.tables).length">
                    <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Statistik Tabel</p>
                    <div class="overflow-x-auto">
                      <table class="table table-sm w-full">
                        <thead>
                          <tr class="bg-base-200/60 text-xs uppercase">
                            <th>Model</th>
                            <th class="text-right">Records</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(count, table) in databaseOverview.app.tables" :key="table">
                            <td class="text-sm font-mono">{{ table }}</td>
                            <td class="text-right font-mono text-sm font-semibold">{{ count.toLocaleString('id-ID') }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Migration History card -->
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5 space-y-4">
                  <h3 class="font-bold text-base flex items-center gap-2">
                    <IconHistory class="w-5 h-5 text-primary" /> Migration History
                  </h3>
                  <div v-if="!databaseOverview.migrations.length" class="text-sm text-base-content/50">
                    Belum ada migration yang terdeteksi.
                  </div>
                  <div v-else class="overflow-x-auto max-h-96 overflow-y-auto">
                    <table class="table table-sm w-full">
                      <thead class="sticky top-0 z-10">
                        <tr class="bg-base-200/60 text-xs uppercase">
                          <th>#</th>
                          <th>Nama Migration</th>
                          <th>Status</th>
                          <th>Diterapkan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(migration, index) in databaseOverview.migrations" :key="migration.name">
                          <td class="text-xs text-base-content/50 font-mono">{{ index + 1 }}</td>
                          <td class="font-mono text-xs">
                            <p class="font-semibold">{{ migrationLabel(migration.name) }}</p>
                            <p class="text-base-content/50 text-xs">{{ migration.name }}</p>
                          </td>
                          <td>
                            <span class="badge badge-sm badge-soft" :class="migration.status === 'applied' ? 'badge-success' : migration.status === 'pending' ? 'badge-warning' : 'badge-error'">
                              {{ migration.status }}
                            </span>
                          </td>
                          <td class="text-xs text-base-content/60">{{ migration.appliedAt ? formatDateTime(migration.appliedAt) : '—' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right 1/3 -->
            <div class="space-y-6">

              <!-- Board Storage card -->
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5 space-y-4">
                  <h3 class="font-bold text-base flex items-center gap-2">
                    <IconDatabase class="w-5 h-5 text-primary" /> Board Storage
                  </h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between text-xs border-b border-base-300 pb-2">
                      <span class="text-base-content/50">Engine</span>
                      <span class="font-semibold">{{ databaseOverview.board.engine }}</span>
                    </div>
                    <div class="flex justify-between text-xs border-b border-base-300 pb-2">
                      <span class="text-base-content/50">File</span>
                      <span class="font-mono font-semibold">{{ databaseOverview.board.fileName }}</span>
                    </div>
                    <div class="flex justify-between text-xs border-b border-base-300 pb-2">
                      <span class="text-base-content/50">Size</span>
                      <span class="font-bold">{{ databaseOverview.board.fileSizeLabel }}</span>
                    </div>
                  </div>
                  <p class="text-xs text-base-content/50 break-all font-mono">{{ databaseOverview.board.filePath }}</p>

                  <div>
                    <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Breakdown by Section</p>
                    <div class="space-y-1.5">
                      <div v-for="sec in databaseOverview.board.itemsBySection" :key="sec.section" class="flex items-center justify-between text-sm">
                        <span class="text-base-content/70">{{ sec.label }}</span>
                        <span class="font-semibold">{{ sec.count }}</span>
                      </div>
                      <div class="flex items-center justify-between text-sm border-t border-base-300 pt-1.5 mt-1.5">
                        <span class="font-semibold">Total</span>
                        <span class="font-bold">{{ databaseOverview.board.itemCount }}</span>
                      </div>
                    </div>
                  </div>

                  <a href="/api/admin/database/board-export" download class="btn btn-outline btn-sm gap-2 w-full">
                    <IconDownload class="w-4 h-4" /> Export Board Backup
                  </a>
                </div>
              </div>

              <!-- Dev Tools card -->
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body p-5 space-y-4">
                  <h3 class="font-bold text-base flex items-center gap-2">
                    <IconTerminal2 class="w-5 h-5 text-warning" /> Dev Tools
                  </h3>
                  <div class="alert border border-warning/30 bg-warning/10 py-3">
                    <IconAlertTriangle class="w-5 h-5 shrink-0 text-warning" />
                    <p class="text-xs">Tool ini hanya tersedia di mode development. Seed akan menjalankan script <code class="font-mono">prisma/seed.ts</code> ke database aktif.</p>
                  </div>

                  <div>
                    <p class="text-sm font-semibold mb-1">Prisma Studio</p>
                    <p class="text-xs text-base-content/60 mb-3">Buka web UI Prisma Studio untuk inspeksi data database utama dari browser.</p>
                    <button type="button" class="btn btn-sm btn-outline gap-2 w-full" :disabled="prismaStudioPending" @click="openPrismaStudio">
                      <IconDatabase class="w-4 h-4" />
                      <span v-if="prismaStudioPending">Opening Prisma Studio...</span>
                      <span v-else>Open Prisma Studio</span>
                    </button>
                    <p v-if="prismaStudioUrl" class="text-xs text-base-content/50 mt-2 break-all">
                      Studio URL: {{ prismaStudioUrl }}
                    </p>
                  </div>

                  <div>
                    <p class="text-sm font-semibold mb-1">Seed Database</p>
                    <p class="text-xs text-base-content/60 mb-3">Jalankan <code class="font-mono text-xs">prisma/seed.ts</code> untuk mengisi ulang data awal.</p>
                    <div v-if="!dbSeedConfirm">
                      <button type="button" class="btn btn-sm btn-warning btn-outline gap-2 w-full" @click="dbSeedConfirm = true">
                        <IconRefresh class="w-4 h-4" /> Run Seed
                      </button>
                    </div>
                    <div v-else class="space-y-2">
                      <p class="text-xs font-semibold text-warning">Konfirmasi: seed akan dijalankan ke database aktif.</p>
                      <div class="flex gap-2">
                        <button type="button" class="btn btn-sm btn-ghost flex-1" @click="dbSeedConfirm = false">Batal</button>
                        <button type="button" class="btn btn-sm btn-warning flex-1 gap-2" :disabled="dbSeedPending" @click="runDbSeed">
                          <span v-if="dbSeedPending" class="loading loading-spinner loading-xs"></span>
                          <span v-else>Konfirmasi & Run</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="dbSeedError" class="alert border border-error/30 bg-error/10 py-3 text-error">
                    <IconAlertTriangle class="w-5 h-5 shrink-0" />
                    <p class="text-xs font-medium">{{ dbSeedError }}</p>
                  </div>
                  <div v-if="prismaStudioError" class="alert border border-error/30 bg-error/10 py-3 text-error">
                    <IconAlertTriangle class="w-5 h-5 shrink-0" />
                    <p class="text-xs font-medium">{{ prismaStudioError }}</p>
                  </div>
                  <div v-if="dbSeedOutput" class="space-y-1">
                    <p class="text-xs text-base-content/50 font-semibold">Output</p>
                    <pre class="bg-base-300 text-base-content p-3 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">{{ dbSeedOutput }}</pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </template>
      </div>
    </template>

    <template v-else-if="activeTab === 'tests'">
      <div class="space-y-6">
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5 space-y-5">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h2 class="font-bold text-lg flex items-center gap-2">
                  <IconPlayerPlay class="w-5 h-5 text-primary" /> Test Manager
                </h2>
                <p class="text-sm text-base-content/50 mt-1">Jalankan frontend test, backend logic test, atau seluruh suite Vitest langsung dari panel admin.</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="btn btn-sm btn-ghost" @click="loadTestHistory" :disabled="testPending">
                  <IconRefresh class="w-4 h-4" /> Refresh History
                </button>
                <button type="button" class="btn btn-primary btn-sm gap-2" @click="runTests" :disabled="testPending">
                  <IconPlayerPlay class="w-4 h-4" />
                  <span v-if="testPending">Running...</span>
                  <span v-else>Run {{ formatTestScopeLabel(testScope) }}</span>
                </button>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn btn-sm" :class="testScope === 'frontend' ? 'btn-primary' : 'btn-ghost'" @click="testScope = 'frontend'">
                Frontend
              </button>
              <button type="button" class="btn btn-sm" :class="testScope === 'backend' ? 'btn-primary' : 'btn-ghost'" @click="testScope = 'backend'">
                Backend Logic
              </button>
              <button type="button" class="btn btn-sm" :class="testScope === 'all' ? 'btn-primary' : 'btn-ghost'" @click="testScope = 'all'">
                All Tests
              </button>
            </div>

            <div class="border border-base-300 bg-base-200/20 p-4">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-xs text-base-content/50 uppercase tracking-wide font-semibold">Run Progress</p>
                <span class="text-xs font-medium" :class="testPending ? 'text-primary' : 'text-base-content/50'">{{ testProgressLabel }}</span>
              </div>
              <progress class="progress progress-primary w-full" :value="testPending ? Math.max(testProgress, 6) : testProgress" max="100"></progress>
              <div class="flex items-center justify-between gap-3 mt-2 text-xs text-base-content/50">
                <span>{{ formatTestScopeLabel(testScope) }}</span>
                <span>{{ testPending ? `${Math.round(testProgress)}%` : 'Ready' }}</span>
              </div>
            </div>

            <div class="alert border border-warning/30 bg-warning/10 py-3">
              <IconAlertTriangle class="w-5 h-5 shrink-0 text-warning" />
              <p class="text-sm">Eksekusi test berjalan di server development, bukan di browser. UI ini hanya menjadi control panel dan viewer hasil run.</p>
            </div>

            <div v-if="testError" class="alert border border-error/30 bg-error/10 py-3 text-error">
              <IconAlertTriangle class="w-5 h-5 shrink-0" />
              <p class="text-sm font-medium">{{ testError }}</p>
            </div>

            <div v-if="testCatalogError" class="alert border border-error/30 bg-error/10 py-3 text-error">
              <IconAlertTriangle class="w-5 h-5 shrink-0" />
              <p class="text-sm font-medium">{{ testCatalogError }}</p>
            </div>

            <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <div class="card bg-base-200/40 border border-base-300 p-4">
                <p class="text-xs text-base-content/50 mb-1">Scope</p>
                <p class="text-sm font-semibold">{{ testRun ? formatTestScopeLabel(testRun.summary.scope) : formatTestScopeLabel(testScope) }}</p>
              </div>
              <div class="card bg-base-200/40 border border-base-300 p-4">
                <p class="text-xs text-base-content/50 mb-1">Status</p>
                <div class="flex items-center gap-2">
                  <span class="badge badge-sm badge-soft" :class="testStatusBadgeClass(testRun?.summary.status || 'empty')">
                    {{ testRun?.summary.status || 'empty' }}
                  </span>
                </div>
              </div>
              <div class="card bg-base-200/40 border border-base-300 p-4">
                <p class="text-xs text-base-content/50 mb-1">Total Tests</p>
                <p class="text-2xl font-extrabold">{{ testRun?.summary.totalTests ?? 0 }}</p>
              </div>
              <div class="card bg-base-200/40 border border-base-300 p-4">
                <p class="text-xs text-base-content/50 mb-1">Duration</p>
                <p class="text-sm font-semibold">{{ formatTestDuration(testRun?.summary.durationMs ?? 0) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div class="xl:col-span-2 space-y-4">
                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body p-5 space-y-4">
                    <div class="flex items-center justify-between gap-3">
                      <h3 class="font-bold text-base flex items-center gap-2">
                        <IconStack2 class="w-5 h-5 text-primary" /> What Gets Tested
                      </h3>
                      <div class="flex items-center gap-2">
                        <span class="badge badge-ghost">{{ visibleTestCatalog.length }} files</span>
                        <span class="badge badge-ghost">{{ visibleTestCatalogCaseCount }} cases</span>
                      </div>
                    </div>

                    <div v-if="testCatalogPending" class="text-sm text-base-content/50">
                      Memuat katalog test...
                    </div>
                    <div v-else-if="!visibleTestCatalog.length" class="text-sm text-base-content/50">
                      Belum ada file test untuk scope ini.
                    </div>
                    <div v-else class="space-y-3">
                      <div v-for="item in visibleTestCatalog" :key="item.filePath" class="border border-base-300 bg-base-200/20 p-4">
                        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p class="font-mono text-xs font-semibold">{{ item.filePath }}</p>
                            <div class="flex flex-wrap items-center gap-2 mt-2">
                              <span class="badge badge-sm badge-soft" :class="item.scope === 'frontend' ? 'badge-info' : 'badge-warning'">{{ item.scope }}</span>
                              <span class="badge badge-sm badge-ghost">{{ item.totalCases }} cases</span>
                            </div>
                          </div>
                          <button type="button" class="btn btn-xs btn-ghost" @click="testScope = item.scope">
                            Focus {{ formatTestScopeLabel(item.scope) }}
                          </button>
                        </div>

                        <div v-if="item.suiteNames.length" class="mt-3">
                          <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Suites</p>
                          <div class="flex flex-wrap gap-2">
                            <span v-for="suiteName in item.suiteNames" :key="suiteName" class="badge badge-sm badge-soft badge-primary">{{ suiteName }}</span>
                          </div>
                        </div>

                        <div class="mt-3">
                          <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Cases</p>
                          <div class="space-y-1.5">
                            <div v-for="testCase in item.cases" :key="`${item.filePath}:${testCase.kind}:${testCase.name}`" class="flex items-center gap-2 text-sm">
                              <span class="badge badge-xs badge-ghost uppercase">{{ testCase.kind }}</span>
                              <span>{{ testCase.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body p-5 space-y-4">
                    <div class="flex items-center justify-between gap-3">
                      <h3 class="font-bold text-base flex items-center gap-2">
                        <IconChecklist class="w-5 h-5 text-primary" /> Latest Run
                      </h3>
                      <span v-if="testRun" class="text-xs text-base-content/50">{{ formatDateTime(testRun.summary.finishedAt) }}</span>
                    </div>

                    <div v-if="testRun" class="space-y-4">
                      <div class="border border-base-300 bg-base-200/20 p-4">
                        <p class="text-sm font-medium">{{ testRun.summary.headline || buildTestHeadline(testRun.summary) }}</p>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs text-base-content/60">
                          <p><span class="font-semibold text-base-content">Passed:</span> {{ testRun.summary.passed }}</p>
                          <p><span class="font-semibold text-base-content">Failed:</span> {{ testRun.summary.failed }}</p>
                          <p><span class="font-semibold text-base-content">Skipped:</span> {{ testRun.summary.skipped }}</p>
                          <p><span class="font-semibold text-base-content">Suites:</span> {{ testRun.summary.suiteCount }}</p>
                        </div>
                      </div>

                      <div>
                        <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Suite Results</p>
                        <div v-if="!testRun.suites.length" class="text-sm text-base-content/50">Belum ada suite yang tercatat.</div>
                        <div v-else class="overflow-x-auto">
                          <table class="table table-sm w-full">
                            <thead>
                              <tr class="bg-base-200/60 text-xs uppercase">
                                <th>Suite</th>
                                <th>Status</th>
                                <th class="text-right">Passed</th>
                                <th class="text-right">Failed</th>
                                <th class="text-right">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="suite in testRun.suites" :key="suite.name">
                                <td class="font-mono text-xs">{{ suite.name }}</td>
                                <td>
                                  <span class="badge badge-sm badge-soft" :class="testStatusBadgeClass(suite.status)">{{ suite.status }}</span>
                                </td>
                                <td class="text-right font-mono">{{ suite.passed }}</td>
                                <td class="text-right font-mono">{{ suite.failed }}</td>
                                <td class="text-right text-xs">{{ formatTestDuration(suite.durationMs) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <p class="text-xs text-base-content/40 uppercase tracking-wide font-semibold mb-2">Failures</p>
                        <div v-if="!testRun.failures.length" class="border border-success/20 bg-success/5 p-4 text-sm text-success">
                          Tidak ada failure pada run terakhir.
                        </div>
                        <div v-else class="space-y-3">
                          <div v-for="failure in testRun.failures" :key="`${failure.suiteName}:${failure.testName}`" class="border border-error/20 bg-error/5 p-4">
                            <p class="text-sm font-semibold">{{ failure.testName }}</p>
                            <p class="text-xs text-base-content/60 mt-1 font-mono">{{ failure.suiteName }}</p>
                            <pre class="mt-3 text-xs whitespace-pre-wrap font-mono text-error">{{ failure.message }}</pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-sm text-base-content/50">
                      Belum ada run pada sesi ini. Pilih scope lalu jalankan test dari panel ini.
                    </div>
                  </div>
                </div>

                <div v-if="testRun?.output" class="card bg-base-100 border border-base-300">
                  <div class="card-body p-5">
                    <h3 class="font-bold text-base flex items-center gap-2 mb-3">
                      <IconNotes class="w-5 h-5 text-primary" /> Runner Output
                    </h3>
                    <pre class="bg-base-300 text-base-content p-3 text-xs font-mono overflow-x-auto max-h-72 overflow-y-auto whitespace-pre-wrap">{{ testRun.output }}</pre>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body p-5 space-y-4">
                    <div class="flex items-center justify-between gap-3">
                      <h3 class="font-bold text-base flex items-center gap-2">
                        <IconHistory class="w-5 h-5 text-primary" /> Run History
                      </h3>
                      <span class="badge badge-ghost">{{ testHistory.length }}</span>
                    </div>

                    <div v-if="!testHistory.length" class="text-sm text-base-content/50">
                      Belum ada history run. Setelah test dijalankan, ringkasannya akan muncul di sini.
                    </div>

                    <div v-else class="space-y-3">
                      <div v-for="entry in testHistory" :key="entry.id" class="border border-base-300 bg-base-200/20 p-4">
                        <div class="flex items-center justify-between gap-3">
                          <span class="badge badge-sm badge-soft" :class="entry.meta ? testStatusBadgeClass(entry.meta.status) : 'badge-ghost'">
                            {{ entry.meta?.status || entry.level }}
                          </span>
                          <span class="text-xs text-base-content/50">{{ formatDateTime(entry.createdAt) }}</span>
                        </div>
                        <p class="text-sm font-medium mt-2">{{ entry.meta?.headline || entry.message }}</p>
                        <div v-if="entry.meta" class="grid grid-cols-2 gap-2 mt-3 text-xs text-base-content/60">
                          <p><span class="font-semibold text-base-content">Scope:</span> {{ formatTestScopeLabel(entry.meta.scope) }}</p>
                          <p><span class="font-semibold text-base-content">Duration:</span> {{ formatTestDuration(entry.meta.durationMs) }}</p>
                          <p><span class="font-semibold text-base-content">Passed:</span> {{ entry.meta.passed }}</p>
                          <p><span class="font-semibold text-base-content">Failed:</span> {{ entry.meta.failed }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body p-5 space-y-3">
                    <h3 class="font-bold text-base flex items-center gap-2">
                      <IconStack2 class="w-5 h-5 text-primary" /> Scope Notes
                    </h3>
                    <p class="text-sm text-base-content/70">`Frontend` untuk helper UI, composable, dan logic presentasi.</p>
                    <p class="text-sm text-base-content/70">`Backend Logic` untuk util server, auth rule, formatter, dan parser.</p>
                    <p class="text-sm text-base-content/70">`All Tests` untuk jalankan seluruh suite Vitest dalam satu kali run.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <dialog :open="showBoardModal" class="modal">
      <div class="modal-box max-w-2xl">
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeBoardModal">
          <IconX class="w-4 h-4" />
        </button>

        <h3 class="font-bold text-base mb-4">{{ boardModalMode === 'create' ? 'Tambah Item Board' : 'Edit Item Board' }}</h3>

        <div class="space-y-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Jenis Item</legend>
            <select v-model="boardForm.section" class="select select-bordered w-full">
              <option value="checklist">Core Flow Checklist</option>
              <option value="active">Task Aktif</option>
              <option value="backlog">Backlog</option>
              <option value="bug">Bug</option>
            </select>
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Title</legend>
            <input v-model="boardForm.title" type="text" class="input input-bordered w-full" placeholder="Masukkan judul task atau bug" />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Description</legend>
            <textarea v-model="boardForm.description" class="textarea textarea-bordered w-full min-h-28" placeholder="Jelaskan pekerjaan atau bug ini"></textarea>
          </fieldset>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Module</legend>
              <input v-model="boardForm.module" type="text" class="input input-bordered w-full" placeholder="Misalnya: CMS, Payments, Auth" />
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Task Tracer</legend>
              <input v-model="boardForm.tracer" type="text" class="input input-bordered w-full" placeholder="Misalnya: next step, blocker, atau trace progress" />
            </fieldset>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Priority</legend>
              <select v-model="boardForm.priority" class="select select-bordered w-full">
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </fieldset>

            <fieldset class="fieldset">
              <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Status</legend>
              <select v-model="boardForm.status" class="select select-bordered w-full">
                <option v-for="option in boardFormStatusOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </fieldset>
          </div>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Catatan Tambahan</legend>
            <textarea v-model="boardForm.helperText" class="textarea textarea-bordered w-full min-h-24" placeholder="Opsional: next step, alasan, atau arah perbaikan"></textarea>
          </fieldset>

          <div v-if="boardModalError" class="alert border border-error/30 bg-error/10 py-3 text-error">
            <IconAlertTriangle class="w-5 h-5 shrink-0" />
            <p class="text-sm font-medium">{{ boardModalError }}</p>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost btn-sm" @click="closeBoardModal">Cancel</button>
          <button type="button" class="btn btn-primary btn-sm" :disabled="boardModalPending" @click="submitBoardForm">
            <IconDeviceFloppy class="w-4 h-4" />
            <span v-if="boardModalPending">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeBoardModal"><button>close</button></form>
    </dialog>

    <dialog :open="showDeleteModal" class="modal">
      <div class="modal-box max-w-lg">
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closeDeleteModal">
          <IconX class="w-4 h-4" />
        </button>

        <h3 class="font-bold text-base mb-2">Konfirmasi Hapus</h3>
        <p class="text-sm text-base-content/70 mb-4">
          {{ deleteModalTarget?.kind === 'qa-check' ? 'Custom QA check ini akan dihapus dari scanner.' : 'Item board ini akan dihapus permanen dari SQLite board.' }}
        </p>

        <div class="border border-base-300 bg-base-200/20 p-4 text-sm">
          <p class="text-xs uppercase tracking-wide text-base-content/50 mb-1">Item</p>
          <p class="font-medium">{{ deleteModalTarget?.title }}</p>
        </div>

        <div v-if="deleteModalError" class="alert border border-error/30 bg-error/10 py-3 text-error mt-4">
          <IconAlertTriangle class="w-5 h-5 shrink-0" />
          <p class="text-sm font-medium">{{ deleteModalError }}</p>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost btn-sm" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="btn btn-error btn-sm" :disabled="deleteModalPending" @click="confirmDeleteModal">
            <IconTrash class="w-4 h-4" />
            <span v-if="deleteModalPending">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeDeleteModal"><button>close</button></form>
    </dialog>

    <dialog :open="showPhaseModal" class="modal">
      <div class="modal-box max-w-xl">
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="closePhaseModal">
          <IconX class="w-4 h-4" />
        </button>

        <h3 class="font-bold text-base mb-4">Edit Current Phase</h3>

        <div class="space-y-4">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Phase</legend>
            <input v-model="phaseForm.phase" type="text" class="input input-bordered w-full" placeholder="Misalnya: MVP Alignment" />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend text-xs font-semibold uppercase tracking-wide">Phase Note</legend>
            <textarea v-model="phaseForm.phaseNote" class="textarea textarea-bordered w-full min-h-28" placeholder="Catatan singkat tentang fokus fase saat ini"></textarea>
          </fieldset>

          <div v-if="phaseModalError" class="alert border border-error/30 bg-error/10 py-3 text-error">
            <IconAlertTriangle class="w-5 h-5 shrink-0" />
            <p class="text-sm font-medium">{{ phaseModalError }}</p>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost btn-sm" @click="closePhaseModal">Cancel</button>
          <button type="button" class="btn btn-primary btn-sm" :disabled="phaseModalPending" @click="submitPhaseForm">
            <IconDeviceFloppy class="w-4 h-4" />
            <span v-if="phaseModalPending">Saving...</span>
            <span v-else>Save Phase</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closePhaseModal"><button>close</button></form>
    </dialog>

    <dialog :open="showCompletedModal" class="modal">
      <div class="modal-box max-w-4xl">
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" @click="showCompletedModal = false">
          <IconX class="w-4 h-4" />
        </button>

        <h3 class="font-bold text-base mb-4">All Completed Items By Module</h3>

        <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div v-if="!allCompletedItems.length" class="text-sm text-base-content/50">
            Belum ada item selesai.
          </div>

          <div v-for="group in completedItemsByModule" :key="group.module" class="border border-base-300 bg-base-200/20 p-4">
            <div class="flex items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="badge badge-soft badge-info">{{ group.module }}</span>
                <p class="text-sm font-semibold">{{ group.items.length }} item selesai</p>
              </div>
            </div>

            <div class="space-y-3">
              <div v-for="item in group.items" :key="item.id" class="border border-base-300 bg-base-100 p-3">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <p class="font-medium text-sm">{{ item.title }}</p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <span class="badge badge-sm badge-soft">{{ item.section }}</span>
                      <span class="badge badge-sm badge-soft" :class="item.status === 'fixed' ? 'badge-success' : 'badge-info'">{{ item.status }}</span>
                    </div>
                    <p class="text-xs text-base-content/60 mt-2">{{ item.description }}</p>
                    <p v-if="item.tracer" class="text-xs text-base-content/60 mt-1">Tracer: {{ item.tracer }}</p>
                  </div>
                  <p class="text-xs text-base-content/50 whitespace-nowrap">{{ formatDateTime(item.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showCompletedModal = false"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  IconAlertTriangle,
  IconBug,
  IconChecklist,
  IconCircleCheck,
  IconClockHour4,
  IconDatabase,
  IconDeviceFloppy,
  IconDownload,
  IconHistory,
  IconNotes,
  IconPencil,
  IconPlayerPlay,
  IconPlus,
  IconRefresh,
  IconScan,
  IconServer,
  IconShieldSearch,
  IconStack2,
  IconTerminal2,
  IconTrash,
  IconX,
} from '@tabler/icons-vue'
import { buildTestHeadline, formatTestDuration, formatTestScopeLabel, testStatusBadgeClass, type TestManagerScope, type TestManagerStatus } from '~/utils/test-manager'

definePageMeta({ layout: 'dashboard' })

type QaSeverity = 'ok' | 'warn' | 'error'
type QaLogLevel = 'info' | 'warn' | 'error'
type BoardSection = 'start_here' | 'checklist' | 'active' | 'backlog' | 'bug'
type BoardStatus = 'not-started' | 'in-progress' | 'done' | 'blocked' | 'needs-work' | 'open' | 'fixed'
type BoardPriority = 'high' | 'medium' | 'low' | null

interface QaResultItem {
  id: string
  name: string
  type: 'page' | 'api'
  target: string
  requiresAuth: boolean
  status: number | null
  durationMs: number
  severity: QaSeverity
  note: string
  checkedAt: string
}

interface QaSummary {
  checkedAt: string
  totalChecks: number
  passed: number
  warnings: number
  errors: number
  headline: string
  recommendations: string[]
}

interface QaScanResponse {
  summary: QaSummary
  results: QaResultItem[]
  discovery: {
    autoDiscovered: number
    customChecks: number
    skippedDynamic: Array<{
      type: 'page' | 'api'
      sourcePath: string
      reason: string
    }>
  }
}

interface QaHistoryItem {
  id: string
  level: QaLogLevel
  message: string
  meta: string | null
  createdAt: string
}

interface QaCustomCheck {
  id: string
  name: string
  type: 'page' | 'api'
  target: string
  requiresAuth: boolean
  createdAt: string
}

interface DevelopmentBoardItem {
  id: string
  section: BoardSection
  title: string
  description: string
  module: string | null
  tracer: string | null
  priority: BoardPriority
  status: BoardStatus
  helperText: string | null
  sortOrder: number
  updatedAt: string
}

interface DevelopmentBoardMeta {
  phase: string | null
  phaseNote: string | null
  updatedAt: string | null
}

interface DatabaseOverviewResponse {
  checkedAt: string
  board: {
    engine: string
    filePath: string
    fileName: string
    fileExists: boolean
    fileSizeBytes: number
    fileSizeLabel: string
    itemCount: number
    qaCheckCount: number
    itemsBySection: Array<{ section: string; label: string; count: number }>
  }
  app: {
    engine: string
    target: string
    connectionStatus: 'connected' | 'error'
    connectionNote: string
    migrationStatus: 'in-sync' | 'pending' | 'drift' | 'unknown'
    localMigrationCount: number
    appliedMigrationCount: number
    pendingMigrationCount: number
    driftDetected: boolean
    latestLocalMigration: string
    lastAppliedMigration: string
    tables: Record<string, number>
  }
  migrations: Array<{ name: string; status: 'applied' | 'pending' | 'drift'; appliedAt: string | null }>
}

interface TestRunSummary {
  scope: TestManagerScope
  status: TestManagerStatus
  totalTests: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
  suiteCount: number
  startedAt: string
  finishedAt: string
  headline: string
}

interface TestRunSuite {
  name: string
  status: TestManagerStatus
  durationMs: number
  passed: number
  failed: number
  skipped: number
}

interface TestRunFailure {
  suiteName: string
  testName: string
  message: string
}

interface TestRunResponse {
  summary: TestRunSummary
  suites: TestRunSuite[]
  failures: TestRunFailure[]
  output: string
}

interface TestHistoryItem {
  id: string
  level: QaLogLevel
  message: string
  meta: (TestRunSummary & { failureCount?: number }) | null
  createdAt: string
}

interface TestCatalogItem {
  scope: 'frontend' | 'backend'
  filePath: string
  suiteNames: string[]
  cases: Array<{
    name: string
    kind: 'it' | 'test'
  }>
  totalCases: number
}

interface DeleteModalTarget {
  kind: 'board-item' | 'qa-check'
  id: string
  title: string
}

const defaultRecommendations = [
  'Jalankan QA scan untuk melihat route atau API mana yang perlu ditangani lebih dulu.',
]

const taskStatusOptions: BoardStatus[] = ['not-started', 'in-progress', 'done', 'blocked']
const checklistStatusOptions: BoardStatus[] = ['not-started', 'in-progress', 'needs-work', 'done']
const bugStatusOptions: BoardStatus[] = ['open', 'in-progress', 'fixed']

const activeTab = ref<'qa' | 'board' | 'database' | 'tests'>('qa')

const qaPending = ref(false)
const qaError = ref('')
const qaResult = ref<QaScanResponse | null>(null)
const qaHistory = ref<QaHistoryItem[]>([])
const qaCustomChecks = ref<QaCustomCheck[]>([])
const qaCheckPending = ref(false)
const qaCheckError = ref('')
const deletingQaCheckId = ref('')
const creatingBugForCheckId = ref('')
const qaResultTab = ref<'pages' | 'apis'>('pages')
const qaCheckForm = ref({
  name: '',
  type: 'page' as 'page' | 'api',
  target: '',
  requiresAuth: false,
})
const qaDiscovery = computed(() => qaResult.value?.discovery ?? {
  autoDiscovered: 0,
  customChecks: 0,
  skippedDynamic: [],
})

const boardPending = ref(false)
const boardPendingItemId = ref('')
const boardError = ref('')
const boardInfo = ref('')
const boardDbPath = ref('')
const databaseOverviewPending = ref(false)
const databaseOverviewError = ref('')
const databaseOverview = ref<DatabaseOverviewResponse | null>(null)
const dbSeedPending = ref(false)
const dbSeedOutput = ref('')
const dbSeedError = ref('')
const dbSeedConfirm = ref(false)
const prismaStudioPending = ref(false)
const prismaStudioError = ref('')
const prismaStudioUrl = ref('')
const testPending = ref(false)
const testError = ref('')
const testProgress = ref(0)
const testProgressLabel = ref('Idle')
const testScope = ref<TestManagerScope>('all')
const testRun = ref<TestRunResponse | null>(null)
const testHistory = ref<TestHistoryItem[]>([])
const testCatalogPending = ref(false)
const testCatalogError = ref('')
const testCatalog = ref<TestCatalogItem[]>([])
const boardItems = ref<DevelopmentBoardItem[]>([])
const boardMetaOverride = ref<DevelopmentBoardMeta | null>(null)
const highlightedBoardItemId = ref('')
const showDeleteModal = ref(false)
const deleteModalPending = ref(false)
const deleteModalError = ref('')
const deleteModalTarget = ref<DeleteModalTarget | null>(null)
const showBoardModal = ref(false)
const boardModalMode = ref<'create' | 'edit'>('create')
const boardModalPending = ref(false)
const boardModalError = ref('')
const editingBoardItemId = ref('')
const showCompletedModal = ref(false)
const showPhaseModal = ref(false)
const phaseModalPending = ref(false)
const phaseModalError = ref('')
const phaseForm = ref({
  phase: '',
  phaseNote: '',
})
const boardForm = ref({
  section: 'active' as 'checklist' | 'active' | 'backlog' | 'bug',
  title: '',
  description: '',
  module: 'General',
  tracer: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  status: 'not-started' as BoardStatus,
  helperText: '',
})

const startHereItems = computed(() => boardItems.value.filter((item) => item.section === 'start_here' && item.status !== 'done'))
const checklistItems = computed(() => boardItems.value.filter((item) => item.section === 'checklist' && item.status !== 'done'))
const activeItems = computed(() => boardItems.value.filter((item) => item.section === 'active' && item.status !== 'done'))
const backlogItems = computed(() => boardItems.value.filter((item) => item.section === 'backlog' && item.status !== 'done'))
const bugItems = computed(() => boardItems.value.filter((item) => item.section === 'bug' && item.status !== 'fixed'))
const completedItems = computed(() => boardItems.value.filter((item) => item.status === 'done' || item.status === 'fixed').sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 5))
const allCompletedItems = computed(() => boardItems.value.filter((item) => item.status === 'done' || item.status === 'fixed').sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)))
const completedItemsByModule = computed(() => {
  const groups = new Map<string, DevelopmentBoardItem[]>()

  for (const item of allCompletedItems.value) {
    const moduleName = item.module || 'General'
    if (!groups.has(moduleName)) {
      groups.set(moduleName, [])
    }
    groups.get(moduleName)!.push(item)
  }

  return [...groups.entries()]
    .map(([module, items]) => ({ module, items }))
    .sort((left, right) => left.module.localeCompare(right.module))
})
const pageResults = computed(() => (qaResult.value?.results || []).filter((item) => item.type === 'page'))
const apiResults = computed(() => (qaResult.value?.results || []).filter((item) => item.type === 'api'))
const visibleQaResults = computed(() => qaResultTab.value === 'pages' ? pageResults.value : apiResults.value)
const boardFormStatusOptions = computed<BoardStatus[]>(() => {
  if (boardForm.value.section === 'bug') return bugStatusOptions
  if (boardForm.value.section === 'checklist') return checklistStatusOptions
  return taskStatusOptions
})

const openTaskItems = computed(() => boardItems.value.filter((item) => item.section !== 'bug' && item.status !== 'done'))
const actionableTaskItems = computed(() => boardItems.value.filter((item) => ['active', 'backlog', 'start_here'].includes(item.section) && item.status !== 'done'))

const boardSummary = computed(() => ({
  openTasks: openTaskItems.value.length,
  openBugs: boardItems.value.filter((item) => item.section === 'bug' && item.status !== 'fixed').length,
}))

const boardProgress = computed(() => {
  const total = boardItems.value.length
  const completed = boardItems.value.filter((item) => item.status === 'done' || item.status === 'fixed').length
  return total ? completed / total : 0
})

const priorityWeight = (priority: BoardPriority) => {
  if (priority === 'high') return 3
  if (priority === 'medium') return 2
  if (priority === 'low') return 1
  return 0
}

const statusWeight = (status: BoardStatus) => {
  if (status === 'blocked') return 3
  if (status === 'in-progress') return 2
  if (status === 'needs-work') return 2
  if (status === 'not-started' || status === 'open') return 1
  return 0
}

const boardFocusItem = computed(() => {
  const items = actionableTaskItems.value.length ? actionableTaskItems.value : openTaskItems.value
  return [...items].sort((left, right) => {
    const priorityDiff = priorityWeight(right.priority) - priorityWeight(left.priority)
    if (priorityDiff !== 0) return priorityDiff

    const statusDiff = statusWeight(right.status) - statusWeight(left.status)
    if (statusDiff !== 0) return statusDiff

    return right.updatedAt.localeCompare(left.updatedAt)
  })[0] ?? null
})

const boardMeta = computed(() => {
  const openBugs = boardSummary.value.openBugs
  const openTasks = boardSummary.value.openTasks
  const progress = boardProgress.value
  const focusItem = boardFocusItem.value

  let phase = 'Planning Setup'
  let phaseNote = 'Board masih tipis. Mulai isi task inti supaya progres mingguan bisa terbaca.'

  if (openBugs >= 5) {
    phase = 'Stability Push'
    phaseNote = 'Jumlah bug sedang tinggi. Prioritas utama adalah menurunkan noise dan memastikan flow inti stabil.'
  } else if (progress >= 0.85 && openBugs === 0 && openTasks <= 3) {
    phase = 'Release Hardening'
    phaseNote = 'Mayoritas pekerjaan inti sudah beres. Fokus tinggal polishing, QA akhir, dan penutupan task kecil.'
  } else if (progress >= 0.6) {
    phase = 'Feature Consolidation'
    phaseNote = 'Fondasi utama sudah terbentuk. Sekarang waktunya merapikan alur dan menyatukan fitur yang masih tercecer.'
  } else if (progress > 0 || openTasks > 0) {
    phase = 'MVP Alignment'
    phaseNote = 'Fokus sekarang adalah menyatukan alur bisnis inti sebelum monetisasi penuh.'
  }

  const focusThisWeek = focusItem?.title || 'Belum ada task prioritas aktif'
  const focusNote = focusItem
    ? `Prioritas ${focusItem.priority || 'tanpa label'} • status ${focusItem.status}`
    : 'Tambahkan atau prioritaskan task agar fokus mingguan terbentuk otomatis.'

  const computedMeta = {
    phase,
    phaseNote,
    focusThisWeek,
    focusNote,
  }

  if (boardMetaOverride.value?.phase) {
    return {
      ...computedMeta,
      phase: boardMetaOverride.value.phase,
      phaseNote: boardMetaOverride.value.phaseNote || computedMeta.phaseNote,
    }
  }

  return computedMeta
})

const boardPhaseCardClass = computed(() => {
  if (boardMeta.value.phase === 'Stability Push') return 'bg-error/5 border border-error/20'
  if (boardMeta.value.phase === 'Release Hardening') return 'bg-success/5 border border-success/20'
  if (boardMeta.value.phase === 'Feature Consolidation') return 'bg-secondary/10 border border-secondary/20'
  return 'bg-base-100 border border-base-300'
})

const boardFocusCardClass = computed(() => {
  if (!boardFocusItem.value) return 'bg-base-100 border border-base-300'
  if (boardFocusItem.value.priority === 'high') return 'bg-warning/10 border border-warning/30'
  if (boardFocusItem.value.priority === 'medium') return 'bg-secondary/10 border border-secondary/20'
  return 'bg-base-100 border border-base-300'
})

const openTasksCardClass = computed(() => {
  if (boardSummary.value.openTasks >= 10) return 'bg-warning/5 border border-warning/25'
  if (boardSummary.value.openTasks <= 3) return 'bg-success/5 border border-success/20'
  return 'bg-base-100 border border-base-300'
})

const openBugsCardClass = computed(() => {
  if (boardSummary.value.openBugs >= 5) return 'bg-error/10 border border-error/30'
  if (boardSummary.value.openBugs > 0) return 'bg-error/5 border border-error/20'
  return 'bg-success/5 border border-success/20'
})

const databaseConnectionBadgeClass = computed(() => {
  return databaseOverview.value?.app.connectionStatus === 'connected'
    ? 'badge-success'
    : 'badge-error'
})

const migrationStatusBadgeClass = computed(() => {
  if (databaseOverview.value?.app.migrationStatus === 'in-sync') return 'badge-success'
  if (databaseOverview.value?.app.migrationStatus === 'pending') return 'badge-warning'
  if (databaseOverview.value?.app.migrationStatus === 'drift') return 'badge-error'
  return 'badge-ghost'
})

const migrationStatusLabel = computed(() => {
  if (databaseOverview.value?.app.migrationStatus === 'in-sync') return 'In Sync'
  if (databaseOverview.value?.app.migrationStatus === 'pending') return 'Pending Migrations'
  if (databaseOverview.value?.app.migrationStatus === 'drift') return 'Schema Drift Risk'
  return 'Unknown'
})

const migrationLabel = (name: string) => {
  const match = name.match(/^\d{14}_(.+)$/)
  if (match?.[1]) return match[1].replace(/_/g, ' ')
  const dateMatch = name.match(/^(\d{4})(\d{2})(\d{2})/)
  if (dateMatch) return `Migration ${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
  return name
}

const visibleTestCatalog = computed(() => {
  if (testScope.value === 'all') return testCatalog.value
  return testCatalog.value.filter((item) => item.scope === testScope.value)
})

const visibleTestCatalogCaseCount = computed(() => {
  return visibleTestCatalog.value.reduce((total, item) => total + item.totalCases, 0)
})

let testProgressTimer: ReturnType<typeof setInterval> | null = null

const resetTestProgress = () => {
  if (testProgressTimer) {
    clearInterval(testProgressTimer)
    testProgressTimer = null
  }

  testProgress.value = 0
  testProgressLabel.value = 'Idle'
}

const startTestProgress = () => {
  resetTestProgress()
  testProgress.value = 8
  testProgressLabel.value = 'Preparing test runner...'

  testProgressTimer = setInterval(() => {
    if (testProgress.value < 22) {
      testProgress.value += 7
      testProgressLabel.value = 'Loading test scope...'
      return
    }

    if (testProgress.value < 48) {
      testProgress.value += 5
      testProgressLabel.value = 'Executing test suites...'
      return
    }

    if (testProgress.value < 72) {
      testProgress.value += 3
      testProgressLabel.value = 'Collecting assertions...'
      return
    }

    if (testProgress.value < 90) {
      testProgress.value += 2
      testProgressLabel.value = 'Finalizing report...'
    }
  }, 350)
}

const completeTestProgress = (status: TestManagerStatus) => {
  if (testProgressTimer) {
    clearInterval(testProgressTimer)
    testProgressTimer = null
  }

  testProgress.value = 100
  testProgressLabel.value = status === 'failed'
    ? 'Test run completed with failures.'
    : status === 'passed'
      ? 'Test run completed successfully.'
      : 'Test run completed.'
}

const loadQaHistory = async () => {
  const data = await $fetch<{ logs: QaHistoryItem[] }>('/api/admin/qa/history')
  qaHistory.value = data.logs
}

const loadQaChecks = async () => {
  const data = await $fetch<{ items: QaCustomCheck[] }>('/api/admin/qa/checks')
  qaCustomChecks.value = data.items
}

const runQaScan = async () => {
  qaPending.value = true
  qaError.value = ''

  try {
    qaResult.value = await $fetch<QaScanResponse>('/api/admin/qa/scan', {
      method: 'POST',
    })
    await loadQaHistory()
    await loadQaChecks()
  } catch (error: any) {
    qaError.value = error?.data?.statusMessage || error?.message || 'QA scan gagal dijalankan.'
  } finally {
    qaPending.value = false
  }
}

const createQaCheck = async () => {
  qaCheckPending.value = true
  qaCheckError.value = ''

  try {
    await $fetch('/api/admin/qa/checks', {
      method: 'POST',
      body: qaCheckForm.value,
    })
    qaCheckForm.value = {
      name: '',
      type: 'page',
      target: '',
      requiresAuth: false,
    }
    await loadQaChecks()
  } catch (error: any) {
    qaCheckError.value = error?.data?.statusMessage || error?.message || 'Custom QA check gagal ditambahkan.'
  } finally {
    qaCheckPending.value = false
  }
}

const deleteQaCheck = async (id: string) => {
  deletingQaCheckId.value = id
  qaCheckError.value = ''

  try {
    await $fetch(`/api/admin/qa/checks/${id}`, {
      method: 'DELETE',
    })
    await loadQaChecks()
  } catch (error: any) {
    const message = error?.data?.statusMessage || error?.message || 'Custom QA check gagal dihapus.'
    qaCheckError.value = message
    throw new Error(message)
  } finally {
    deletingQaCheckId.value = ''
  }
}

const openDeleteQaCheckModal = (item: QaCustomCheck) => {
  deleteModalTarget.value = {
    kind: 'qa-check',
    id: item.id,
    title: item.name,
  }
  deleteModalError.value = ''
  showDeleteModal.value = true
}

const createBugFromQaResult = async (result: QaResultItem) => {
  creatingBugForCheckId.value = result.id
  qaError.value = ''
  boardError.value = ''
  boardInfo.value = ''

  try {
    const existingBug = boardItems.value.find((item) =>
      item.section === 'bug'
      && item.status !== 'fixed'
      && item.title === `[QA] ${result.name}`
    )

    if (existingBug) {
      highlightedBoardItemId.value = existingBug.id
      activeTab.value = 'board'
      boardInfo.value = `Bug untuk hasil QA ini sudah ada di Development Board: ${existingBug.title}`
      return
    }

    const response = await $fetch<{ item: DevelopmentBoardItem }>('/api/admin/development-board', {
      method: 'POST',
      body: {
        section: 'bug',
        title: `[QA] ${result.name}`,
        description: `Target: ${result.target}\nStatus: ${result.status ?? 'ERR'}\nResult: ${result.note}`,
        module: 'QA Monitor',
        tracer: `Check ${result.type} pada ${result.target}`,
        priority: result.severity === 'error' ? 'high' : 'medium',
        status: 'open',
        helperText: `Dibuat dari QA scan pada ${formatDateTime(result.checkedAt)}. Durasi: ${result.durationMs}ms.`,
      },
    })

    if (!response?.item?.id) {
      throw new Error('Development board create response is missing item data.')
    }

    boardItems.value = [response.item, ...boardItems.value.filter((item) => item.id !== response.item.id)]
    highlightedBoardItemId.value = response.item.id
    boardInfo.value = `Bug baru ditambahkan ke Development Board: ${response.item.title}`
    activeTab.value = 'board'
    await loadBoard()
  } catch (error: any) {
    qaError.value = error?.data?.statusMessage || error?.message || 'Hasil QA gagal dijadikan bug.'
  } finally {
    creatingBugForCheckId.value = ''
  }
}

const loadBoard = async () => {
  boardPending.value = true
  boardError.value = ''

  try {
    const data = await $fetch<{ dbPath: string; items: DevelopmentBoardItem[] }>('/api/admin/development-board')
    boardDbPath.value = data.dbPath
    boardItems.value = data.items
    boardMetaOverride.value = (data as any).meta ?? null
  } catch (error: any) {
    boardError.value = error?.data?.statusMessage || error?.message || 'Development board gagal dimuat.'
  } finally {
    boardPending.value = false
  }
}

const loadDatabaseOverview = async () => {
  databaseOverviewPending.value = true
  databaseOverviewError.value = ''

  try {
    databaseOverview.value = await $fetch<DatabaseOverviewResponse>('/api/admin/database/overview')
  } catch (error: any) {
    databaseOverviewError.value = error?.data?.statusMessage || error?.message || 'Database overview gagal dimuat.'
  } finally {
    databaseOverviewPending.value = false
  }
}

const loadTestHistory = async () => {
  try {
    const data = await $fetch<{ logs: TestHistoryItem[] }>('/api/admin/tests/history')
    testHistory.value = data.logs
  } catch (error: any) {
    testError.value = error?.data?.statusMessage || error?.message || 'History test gagal dimuat.'
  }
}

const loadTestCatalog = async () => {
  testCatalogPending.value = true
  testCatalogError.value = ''

  try {
    const data = await $fetch<{ items: TestCatalogItem[] }>('/api/admin/tests/catalog')
    testCatalog.value = data.items
  } catch (error: any) {
    testCatalogError.value = error?.data?.statusMessage || error?.message || 'Katalog test gagal dimuat.'
  } finally {
    testCatalogPending.value = false
  }
}

const runTests = async () => {
  testPending.value = true
  testError.value = ''
  startTestProgress()

  try {
    testRun.value = await $fetch<TestRunResponse>('/api/admin/tests/run', {
      method: 'POST',
      body: { scope: testScope.value },
    })
    completeTestProgress(testRun.value.summary.status)
    await loadTestHistory()
  } catch (error: any) {
    testError.value = error?.data?.statusMessage || error?.message || 'Test run gagal dijalankan.'
    completeTestProgress('failed')
  } finally {
    testPending.value = false
    setTimeout(() => {
      if (!testPending.value) {
        resetTestProgress()
      }
    }, 1800)
  }
}

const runDbSeed = async () => {
  dbSeedPending.value = true
  dbSeedOutput.value = ''
  dbSeedError.value = ''

  try {
    const result = await $fetch<{ success: boolean; message: string; output: string }>('/api/admin/database/seed', { method: 'POST' })
    dbSeedOutput.value = result.output || result.message
    dbSeedConfirm.value = false
    await loadDatabaseOverview()
  } catch (error: any) {
    dbSeedError.value = error?.data?.statusMessage || error?.message || 'Seed gagal dijalankan.'
  } finally {
    dbSeedPending.value = false
  }
}

const openPrismaStudio = async () => {
  prismaStudioPending.value = true
  prismaStudioError.value = ''

  try {
    const result = await $fetch<{ success: boolean; url: string }>('/api/admin/database/studio', {
      method: 'POST',
    })
    prismaStudioUrl.value = result.url
    if (import.meta.client) {
      window.open(result.url, '_blank', 'noopener,noreferrer')
    }
  } catch (error: any) {
    prismaStudioError.value = error?.data?.statusMessage || error?.message || 'Prisma Studio gagal dibuka.'
  } finally {
    prismaStudioPending.value = false
  }
}

const updateBoardItemStatus = async (id: string, status: string) => {
  boardPendingItemId.value = id
  boardError.value = ''
  boardInfo.value = ''

  try {
    await $fetch(`/api/admin/development-board/${id}`, {
      method: 'PATCH',
      body: { status },
    })
    await loadBoard()
  } catch (error: any) {
    boardError.value = error?.data?.statusMessage || error?.message || 'Status item gagal diperbarui.'
  } finally {
    boardPendingItemId.value = ''
  }
}

const resetBoardForm = () => {
  boardForm.value = {
    section: 'active',
    title: '',
    description: '',
    module: 'General',
    tracer: '',
    priority: 'medium',
    status: 'not-started',
    helperText: '',
  }
}

const openCreateModal = (section: 'checklist' | 'active' | 'backlog' | 'bug') => {
  boardModalMode.value = 'create'
  editingBoardItemId.value = ''
  boardModalError.value = ''
  resetBoardForm()
  boardForm.value.section = section
  boardForm.value.status = section === 'bug' ? 'open' : 'not-started'
  boardForm.value.priority = section === 'checklist' ? 'medium' : 'medium'
  showBoardModal.value = true
}

const openEditModal = (item: DevelopmentBoardItem) => {
  boardModalMode.value = 'edit'
  editingBoardItemId.value = item.id
  boardModalError.value = ''
  boardForm.value = {
    section: item.section === 'bug' ? 'bug' : item.section === 'backlog' ? 'backlog' : item.section === 'checklist' ? 'checklist' : 'active',
    title: item.title,
    description: item.description,
    module: item.module || 'General',
    tracer: item.tracer || '',
    priority: item.priority ?? 'medium',
    status: item.status,
    helperText: item.helperText ?? '',
  }
  showBoardModal.value = true
}

const closeBoardModal = () => {
  showBoardModal.value = false
  boardModalPending.value = false
  boardModalError.value = ''
  editingBoardItemId.value = ''
  resetBoardForm()
}

const openPhaseModal = () => {
  phaseModalError.value = ''
  phaseForm.value = {
    phase: boardMeta.value.phase,
    phaseNote: boardMeta.value.phaseNote,
  }
  showPhaseModal.value = true
}

const closePhaseModal = () => {
  if (phaseModalPending.value) return
  showPhaseModal.value = false
  phaseModalError.value = ''
}

const submitPhaseForm = async () => {
  phaseModalPending.value = true
  phaseModalError.value = ''
  boardInfo.value = ''

  try {
    const response = await $fetch<{ meta: DevelopmentBoardMeta }>('/api/admin/development-board/meta', {
      method: 'PUT',
      body: {
        phase: phaseForm.value.phase,
        phaseNote: phaseForm.value.phaseNote,
      },
    })
    boardMetaOverride.value = response.meta
    boardInfo.value = 'Phase board berhasil diperbarui.'
    closePhaseModal()
  } catch (error: any) {
    phaseModalError.value = error?.data?.statusMessage || error?.message || 'Phase board gagal diperbarui.'
  } finally {
    phaseModalPending.value = false
  }
}

const openDeleteBoardItemModal = (item: DevelopmentBoardItem) => {
  deleteModalTarget.value = {
    kind: 'board-item',
    id: item.id,
    title: item.title,
  }
  deleteModalError.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = (force?: boolean | Event) => {
  const shouldForce = force === true
  if (deleteModalPending.value && !shouldForce) return
  showDeleteModal.value = false
  deleteModalError.value = ''
  deleteModalTarget.value = null
}

const confirmDeleteModal = async () => {
  if (!deleteModalTarget.value) return

  deleteModalPending.value = true
  deleteModalError.value = ''
  boardError.value = ''
  boardInfo.value = ''
  qaCheckError.value = ''

  try {
    if (deleteModalTarget.value.kind === 'qa-check') {
      await deleteQaCheck(deleteModalTarget.value.id)
    } else {
      boardPendingItemId.value = deleteModalTarget.value.id
      await $fetch(`/api/admin/development-board/${deleteModalTarget.value.id}`, {
        method: 'DELETE',
      })
      await loadBoard()
      boardInfo.value = `Item berhasil dihapus: ${deleteModalTarget.value.title}`
      boardPendingItemId.value = ''
    }

  } catch (error: any) {
    deleteModalError.value = error?.data?.statusMessage || error?.message || 'Item gagal dihapus.'
    boardPendingItemId.value = ''
  } finally {
    deleteModalPending.value = false
    if (!deleteModalError.value) {
      closeDeleteModal(true)
    }
  }
}

const submitBoardForm = async () => {
  boardModalPending.value = true
  boardModalError.value = ''
  boardInfo.value = ''

  try {
    const payload = {
      section: boardForm.value.section,
      title: boardForm.value.title,
      description: boardForm.value.description,
      module: boardForm.value.module,
      tracer: boardForm.value.tracer,
      priority: boardForm.value.priority,
      status: boardForm.value.status,
      helperText: boardForm.value.helperText,
    }

    if (boardModalMode.value === 'create') {
      await $fetch('/api/admin/development-board', {
        method: 'POST',
        body: payload,
      })
    } else {
      await $fetch(`/api/admin/development-board/${editingBoardItemId.value}`, {
        method: 'PATCH',
        body: payload,
      })
    }

    await loadBoard()
    closeBoardModal()
  } catch (error: any) {
    boardModalError.value = error?.data?.statusMessage || error?.message || 'Item board gagal disimpan.'
  } finally {
    boardModalPending.value = false
  }
}

const priorityBadgeClass = (priority: BoardPriority) => {
  if (priority === 'high') return 'badge-error'
  if (priority === 'medium') return 'badge-warning'
  return 'badge-ghost'
}

const resultBadgeClass = (severity: QaSeverity) => {
  if (severity === 'error') return 'badge-error'
  if (severity === 'warn') return 'badge-warning'
  return 'badge-success'
}

const historyBadgeClass = (level: QaLogLevel) => {
  if (level === 'error') return 'badge-error'
  if (level === 'warn') return 'badge-warning'
  return 'badge-info'
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const historyMetaSummary = (meta: string | null) => {
  if (!meta) return ''

  try {
    const parsed = JSON.parse(meta) as Record<string, unknown>

    if (typeof parsed.headline === 'string') {
      return parsed.headline
    }

    const target = typeof parsed.target === 'string' ? parsed.target : ''
    const status = typeof parsed.status === 'number' ? `HTTP ${parsed.status}` : ''
    const note = typeof parsed.note === 'string' ? parsed.note : ''
    return [target, status, note].filter(Boolean).join(' • ')
  } catch {
    return meta
  }
}

onMounted(() => {
  loadQaHistory()
  loadQaChecks()
  loadBoard()
  loadDatabaseOverview()
  loadTestHistory()
  loadTestCatalog()
})

onBeforeUnmount(() => {
  resetTestProgress()
})
</script>
