<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Landing Page CMS</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Control the sections and copy used on the public landing page.</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2">
        <IconDeviceFloppy class="w-4 h-4" /> Save Draft
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <!-- Left: Section List -->
      <div class="lg:col-span-2 card bg-base-100 border border-base-300">
        <!-- Card header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-base-200">
          <div>
            <p class="font-semibold text-sm">Page Sections</p>
            <p class="text-xs text-base-content/50 mt-0.5">Toggle visibility and order the sections on your landing page.</p>
          </div>
          <span class="badge badge-ghost badge-sm">5 sections</span>
        </div>

        <!-- Section rows -->
        <ul class="divide-y divide-base-200">
          <li v-for="section in sections" :key="section.key"
              class="flex items-center gap-4 px-5 py-3 hover:bg-base-200/40 transition-colors">
            <IconGripVertical class="w-4 h-4 text-base-content/30 shrink-0 cursor-grab" />
            <div class="grow min-w-0">
              <p class="text-sm font-medium leading-tight">{{ section.name }}</p>
              <p class="text-xs text-base-content/50 mt-0.5">{{ section.desc }}</p>
            </div>
            <label class="flex items-center gap-2 cursor-pointer shrink-0">
              <span class="text-xs text-base-content/50">Visible</span>
              <input type="checkbox" class="toggle toggle-sm toggle-primary" :checked="section.visible" />
            </label>
            <button class="btn btn-xs btn-ghost btn-square shrink-0">
              <IconEdit class="w-4 h-4" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Right: Hero Copy Editor -->
      <div class="lg:sticky lg:top-20 card bg-base-100 border border-base-300">
        <div class="flex items-center justify-between px-5 py-4 border-b border-base-200">
          <div>
            <p class="font-semibold text-sm">Hero Copy</p>
            <p class="text-xs text-base-content/50 mt-0.5">Edit the hero section text.</p>
          </div>
          <span class="badge badge-primary badge-outline badge-sm">Active</span>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-medium text-base-content/70 mb-1">Badge text</label>
            <input type="text" class="input input-sm input-bordered w-full" value="100% Platform-Verified Signal Statistics" />
          </div>
          <div>
            <label class="block text-xs font-medium text-base-content/70 mb-1">Main headline</label>
            <textarea class="textarea textarea-bordered textarea-sm w-full" rows="2">Trade with the Best Analysts in the Market</textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-base-content/70 mb-1">Subheadline</label>
            <textarea class="textarea textarea-bordered textarea-sm w-full" rows="3">Subscribe to vetted market analysts, receive real-time signals, and study their journals to grow as a trader.</textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-base-content/70 mb-1">Primary CTA</label>
              <input type="text" class="input input-sm input-bordered w-full" value="Explore Analysts" />
            </div>
            <div>
              <label class="block text-xs font-medium text-base-content/70 mb-1">Secondary CTA</label>
              <input type="text" class="input input-sm input-bordered w-full" value="How It Works" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button class="btn btn-xs btn-ghost">Reset</button>
            <button class="btn btn-xs btn-primary">Apply to Landing</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { IconDeviceFloppy, IconEdit, IconGripVertical } from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

const sections = [
  { key: 'hero',        name: 'Hero Section',       desc: 'Main headline, subtext, and primary CTA.',      visible: true  },
  { key: 'analysts',    name: 'Top Analysts',        desc: 'Carousel of highlighted analysts and stats.',   visible: true  },
  { key: 'how',         name: 'How It Works',        desc: '3-step explanation of the platform.',           visible: true  },
  { key: 'testimonials',name: 'Testimonials',        desc: 'User reviews and social proof.',                visible: true  },
  { key: 'cta',         name: 'Final CTA Banner',    desc: 'End-of-page call to action.',                   visible: true  },
]
</script>
