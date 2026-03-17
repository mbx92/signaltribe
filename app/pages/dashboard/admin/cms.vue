<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Landing Page CMS</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Build your landing page dynamically using blocks.</p>
      </div>
      <div class="flex items-center gap-2">
         <button class="btn btn-primary btn-sm gap-2" @click="saveBlocks" :disabled="isLoading">
          <IconDeviceFloppy class="w-4 h-4" />
          <span v-if="isLoading">Saving...</span>
          <span v-else>Publish to Landing</span>
        </button>
      </div>
    </div>

    <!-- Alert Banner -->
    <div v-if="alertMessage" :class="`alert border py-3 shrink-0 ${alertType === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`">
      <IconCircleCheck v-if="alertType === 'success'" class="w-5 h-5 shrink-0"/>
      <IconAlertTriangle v-else class="w-5 h-5 shrink-0"/>
      <div>
        <p class="font-semibold text-sm">{{ alertMessage }}</p>
      </div>
      <button class="btn btn-ghost btn-xs ml-auto shrink-0" @click="alertMessage = ''">✕</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <!-- Left: Block List Sidebar -->
      <div class="lg:col-span-1 space-y-4">
        <div class="card bg-base-100 border border-base-300">
          <div class="flex items-center justify-between px-5 py-4 border-b border-base-200">
            <div>
              <p class="font-semibold text-sm">Page Blocks</p>
              <p class="text-xs text-base-content/50 mt-0.5">Drag to reorder sections</p>
            </div>
            <span class="badge badge-ghost badge-sm">{{ blocks.length }}</span>
          </div>

          <!-- Section rows (Draggable simulation) -->
          <ul class="divide-y divide-base-200 min-h-[100px]">
            <li v-if="blocks.length === 0" class="p-5 text-center text-sm text-base-content/40 italic">
              No blocks added yet. Click below to add your first section.
            </li>
            
            <li v-for="(block, index) in blocks" :key="block.id"
                @click="selectBlock(index)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4',
                  selectedBlockIndex === index 
                    ? 'bg-primary/5 border-primary' 
                    : 'hover:bg-base-200/40 border-transparent'
                ]">
              
              <!-- Move Up/Down Controls -->
              <div class="flex flex-col gap-1 shrink-0">
                <button @click.stop="moveBlock(index, -1)" :disabled="index === 0" class="hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed">
                  <IconChevronUp class="w-3.5 h-3.5"/>
                </button>
                <button @click.stop="moveBlock(index, 1)" :disabled="index === blocks.length - 1" class="hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed">
                  <IconChevronDown class="w-3.5 h-3.5"/>
                </button>
              </div>

              <div class="grow min-w-0">
                <p class="text-sm font-semibold leading-tight">{{ block.type }} Section</p>
                <p class="text-xs text-base-content/50 mt-0.5 truncate">{{ getBlockPreview(block) }}</p>
              </div>
              
              <button @click.stop="removeBlock(index)" class="btn btn-ghost btn-xs btn-square text-error shrink-0">
                <IconTrash class="w-4 h-4" />
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Add Block Button -->
        <div class="dropdown dropdown-top w-full">
           <label tabindex="0" class="btn btn-block btn-outline border-dashed">
            <IconPlus class="w-5 h-5"/> Add New Block
           </label>
           <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-full mb-2 border border-base-200 z-50">
             <li class="menu-title px-4 py-2 text-xs">Choose Block Type</li>
             <li><a @click="addBlock('Hero')">Hero Banner</a></li>
             <li><a @click="addBlock('Stats')">Social Proof Stats</a></li>
             <li><a @click="addBlock('HowItWorks')">How It Works Steps</a></li>
             <li><a @click="addBlock('Analysts')">Top Analysts Carousel</a></li>
             <li><a @click="addBlock('Features')">Platform Features</a></li>
             <li><a @click="addBlock('Testimonials')">User Testimonials</a></li>
             <li><a @click="addBlock('Pricing')">Pricing Plans</a></li>
             <li><a @click="addBlock('FAQ')">FAQ</a></li>
             <li><a @click="addBlock('Newsletter')">Newsletter CTA</a></li>
             <li><a @click="addBlock('CTA')">Final Call to Action</a></li>
           </ul>
        </div>
      </div>

      <!-- Right: Block Editor Pane -->
      <div class="lg:col-span-2 lg:sticky lg:top-20">
        
        <!-- Empty State -->
        <div v-if="selectedBlockIndex === null" class="card bg-base-100 border border-base-300 border-dashed h-64 flex flex-col items-center justify-center text-center p-6">
          <div class="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
            <IconBox class="w-6 h-6"/>
          </div>
          <h3 class="font-bold">No Block Selected</h3>
          <p class="text-sm text-base-content/50 mt-1">Select a block from the sidebar to edit its properties, or add a new one.</p>
        </div>

        <!-- Editor State -->
        <div v-else class="card bg-base-100 border border-base-300">
          <div class="flex items-center justify-between px-5 py-4 border-b border-base-200">
            <div class="flex items-center gap-2">
              <IconEdit class="w-5 h-5 text-primary"/>
              <p class="font-semibold text-sm">Editing {{ selectedBlock?.type }} Section</p>
            </div>
            <span class="badge badge-primary badge-outline badge-sm">ID: {{ selectedBlock?.id.split('-')[1] }}</span>
          </div>

          <div class="p-5 space-y-5">
            
            <!-- Hero Form -->
            <template v-if="selectedBlock?.type === 'Hero'">
               <div>
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Top Badge Text</label>
                  <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.badge" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Main Headline</label>
                  <textarea class="textarea textarea-bordered textarea-sm w-full" rows="2" v-model="selectedBlock.data.title"></textarea>
                  <p class="text-[10px] text-base-content/50 mt-1">Use &lt;br/&gt; for line breaks, and &lt;span class="text-primary"&gt;text&lt;/span&gt; for color.</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Subheadline Paragraph</label>
                  <textarea class="textarea textarea-bordered textarea-sm w-full" rows="3" v-model="selectedBlock.data.subtitle"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Primary Button Label</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaPrimaryText" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Primary Button Link</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaPrimaryLink" />
                  </div>
                </div>
                 <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Secondary Button Label</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaSecondaryText" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Secondary Button Link</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaSecondaryLink" />
                  </div>
                </div>
            </template>

            <!-- Stats Form -->
            <template v-if="selectedBlock?.type === 'Stats'">
              <div v-for="(stat, idx) in selectedBlock.data.items" :key="idx" class="flex gap-4 items-end bg-base-200/50 p-3 rounded border border-base-200/50">
                 <div class="w-1/3">
                   <label class="block text-xs font-medium text-base-content/70 mb-1">Large Value #{{idx+1}}</label>
                   <input type="text" class="input input-sm input-bordered w-full font-bold" v-model="stat.value" />
                 </div>
                 <div class="w-2/3">
                   <label class="block text-xs font-medium text-base-content/70 mb-1">Bottom Label</label>
                   <input type="text" class="input input-sm input-bordered w-full" v-model="stat.label" />
                 </div>
              </div>
            </template>

            <!-- Text/Header based Sections Form -->
            <template v-if="['HowItWorks', 'Analysts', 'Features', 'Testimonials', 'CTA', 'Pricing', 'FAQ', 'Newsletter'].includes(selectedBlock?.type)">
                <div>
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Section Pre-Title (Small)</label>
                  <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.preTitle" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Section Main Title</label>
                  <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.title" />
                </div>
                <div v-if="!['Analysts'].includes(selectedBlock?.type)">
                  <label class="block text-xs font-medium text-base-content/70 mb-1">Section Description / Subtitle</label>
                  <textarea class="textarea textarea-bordered textarea-sm w-full" rows="2" v-model="selectedBlock.data.subtitle"></textarea>
                </div>
                
                <div v-if="selectedBlock?.type === 'CTA'" class="grid grid-cols-2 gap-3 mt-4 border-t border-base-200 pt-4">
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Primary Button Label</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaText" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-base-content/70 mb-1">Primary Button Link</label>
                    <input type="text" class="input input-sm input-bordered w-full" v-model="selectedBlock.data.ctaLink" />
                  </div>
                </div>

                <div v-if="selectedBlock?.type === 'Analysts'" class="mt-6 border-t border-base-200 pt-4">
                   <div class="flex items-center justify-between mb-4">
                     <p class="font-semibold text-sm">Analyst Cards</p>
                     <button @click="addAnalystCard" class="btn btn-xs btn-outline">Add Card</button>
                   </div>
                   <div class="space-y-4">
                      <div v-for="(card, idx) in selectedBlock.data.analysts" :key="idx" class="border border-base-200 p-4 rounded-lg bg-base-200/20 relative">
                         <button @click="selectedBlock.data.analysts.splice(idx, 1)" class="btn btn-xs btn-square btn-ghost text-error absolute top-2 right-2"><IconTrash class="w-3 h-3"/></button>
                         <p class="text-xs font-bold mb-3">Card #{{ idx + 1 }}</p>
                         
                         <div class="mb-3">
                           <label class="block text-xs text-base-content/70 mb-1">Link Platform Analyst</label>
                           <select class="select select-bordered select-xs w-full" :value="card.userId || ''" @change="e => linkAnalystCard(card, e.target.value)">
                             <option value="">-- Manual Entry (No Link) --</option>
                             <option v-for="pa in platformAnalysts" :key="pa.id" :value="pa.id">{{ pa.name || pa.email }}</option>
                           </select>
                         </div>

                         <div class="grid grid-cols-2 gap-3 mb-2">
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Name</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.name" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Avatar URL</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.avatar" placeholder="https://..." />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Subtitle</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.subtitle" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Win Rate Badge</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.winRate" />
                           </div>
                         </div>
                         <div class="mb-2">
                            <label class="block text-xs text-base-content/70 mb-1">Tags (Comma Separated)</label>
                            <input type="text" class="input input-xs input-bordered w-full" v-model="card.tags" />
                         </div>
                         <div class="mb-2">
                            <label class="block text-xs text-base-content/70 mb-1">Description</label>
                            <textarea class="textarea textarea-bordered textarea-xs w-full" rows="2" v-model="card.description"></textarea>
                         </div>
                         <div class="grid grid-cols-3 gap-2 mb-2">
                            <div><input type="text" class="input input-xs input-bordered w-full" v-model="card.stat1Value" placeholder="Val 1"/><input type="text" class="input input-xs input-bordered w-full mt-1" v-model="card.stat1Label" placeholder="Lbl 1"/></div>
                            <div><input type="text" class="input input-xs input-bordered w-full" v-model="card.stat2Value" placeholder="Val 2"/><input type="text" class="input input-xs input-bordered w-full mt-1" v-model="card.stat2Label" placeholder="Lbl 2"/></div>
                            <div><input type="text" class="input input-xs input-bordered w-full" v-model="card.stat3Value" placeholder="Val 3"/><input type="text" class="input input-xs input-bordered w-full mt-1" v-model="card.stat3Label" placeholder="Lbl 3"/></div>
                         </div>
                         <div class="grid grid-cols-2 gap-3">
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Price (e.g. $49)</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.price" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Suffix (e.g. /month)</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="card.priceSuffix" />
                           </div>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- FAQ Editor -->
                <div v-if="selectedBlock?.type === 'FAQ'" class="mt-6 border-t border-base-200 pt-4">
                   <div class="flex items-center justify-between mb-4">
                     <p class="font-semibold text-sm">Questions & Answers</p>
                     <button @click="selectedBlock.data.faqs.push({question: 'New Question', answer: 'Answer'})" class="btn btn-xs btn-outline">Add FAQ</button>
                   </div>
                   <div class="space-y-4">
                      <div v-for="(faq, idx) in selectedBlock.data.faqs" :key="idx" class="border border-base-200 p-4 rounded-lg bg-base-200/20 relative">
                         <button @click="selectedBlock.data.faqs.splice(idx, 1)" class="btn btn-xs btn-square btn-ghost text-error absolute top-2 right-2"><IconTrash class="w-3 h-3"/></button>
                         <p class="text-xs font-bold mb-3">Item #{{ idx + 1 }}</p>
                         <div class="space-y-2">
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Question</label>
                             <input type="text" class="input input-xs input-bordered w-full font-semibold" v-model="faq.question" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Answer</label>
                             <textarea class="textarea textarea-bordered textarea-xs w-full" rows="2" v-model="faq.answer"></textarea>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- Pricing Editor -->
                <div v-if="selectedBlock?.type === 'Pricing'" class="mt-6 border-t border-base-200 pt-4">
                   <div class="flex items-center justify-between mb-4">
                     <p class="font-semibold text-sm">Pricing Plans</p>
                     <button @click="selectedBlock.data.plans.push({name: 'Pro', price: '$29', period: '/month', description: 'Best for professionals', features: 'Feature 1, Feature 2', cta: 'Subscribe', isPopular: false})" class="btn btn-xs btn-outline">Add Plan</button>
                   </div>
                   <div class="space-y-4">
                      <div v-for="(plan, idx) in selectedBlock.data.plans" :key="idx" class="border border-base-200 p-4 rounded-lg bg-base-200/20 relative" :class="{'ring-2 ring-primary': plan.isPopular}">
                         <button @click="selectedBlock.data.plans.splice(idx, 1)" class="btn btn-xs btn-square btn-ghost text-error absolute top-2 right-2"><IconTrash class="w-3 h-3"/></button>
                         <div class="flex items-center gap-3 mb-3">
                            <p class="text-xs font-bold">Plan #{{ idx + 1 }}</p>
                            <label class="label cursor-pointer py-0 gap-2">
                              <input type="checkbox" class="toggle toggle-xs toggle-primary" v-model="plan.isPopular" />
                              <span class="label-text text-xs">Popular Badge</span>
                            </label>
                         </div>
                         <div class="grid grid-cols-3 gap-3 mb-2">
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Plan Name</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="plan.name" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Price</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="plan.price" />
                           </div>
                           <div>
                             <label class="block text-xs text-base-content/70 mb-1">Period (e.g. / mo)</label>
                             <input type="text" class="input input-xs input-bordered w-full" v-model="plan.period" />
                           </div>
                         </div>
                         <div class="mb-2">
                            <label class="block text-xs text-base-content/70 mb-1">Description</label>
                            <input type="text" class="input input-xs input-bordered w-full" v-model="plan.description" />
                         </div>
                         <div class="mb-2">
                            <label class="block text-xs text-base-content/70 mb-1">Features (Comma Separated)</label>
                            <textarea class="textarea textarea-bordered textarea-xs w-full" rows="2" v-model="plan.features"></textarea>
                         </div>
                         <div>
                            <label class="block text-xs text-base-content/70 mb-1">Button Text</label>
                            <input type="text" class="input input-xs input-bordered w-full" v-model="plan.cta" />
                         </div>
                      </div>
                   </div>
                </div>

                <div v-if="!['Analysts', 'FAQ', 'Pricing', 'CTA'].includes(selectedBlock?.type)" class="alert alert-info py-2 text-xs mt-4">
                  <IconInfoCircle class="w-4 h-4"/> The internal cards, lists, and dynamic content for this section are managed by the platform data or are pre-designed templates.
                </div>
            </template>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  IconDeviceFloppy, 
  IconBox,
  IconCircleCheck, 
  IconAlertTriangle,
  IconPlus,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconEdit,
  IconInfoCircle
} from '@tabler/icons-vue'
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard' })

// Array of blocks
const blocks = ref([])
const selectedBlockIndex = ref(null)

const selectedBlock = computed(() => {
  if (selectedBlockIndex.value === null) return null
  return blocks.value[selectedBlockIndex.value]
})

const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('success')

// Helper for UI Sidebar Previews
const getBlockPreview = (b) => {
  if (b.type === 'Hero') return b.data.title?.replace(/<[^>]*>?/gm, '') || 'Hero Section'
  if (b.type === 'Stats') return `3 Stat columns`
  return b.data.title || `${b.type} Section`
}

// Block Management
const selectBlock = (index) => {
  selectedBlockIndex.value = index
}

const moveBlock = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= blocks.value.length) return
  
  // Swap
  const temp = blocks.value[index]
  blocks.value[index] = blocks.value[newIndex]
  blocks.value[newIndex] = temp
  
  // Maintain selection visually
  if (selectedBlockIndex.value === index) {
    selectedBlockIndex.value = newIndex
  } else if (selectedBlockIndex.value === newIndex) {
    selectedBlockIndex.value = index
  }
}

const removeBlock = (index) => {
  blocks.value.splice(index, 1)
  if (selectedBlockIndex.value === index) {
    selectedBlockIndex.value = null
  } else if (selectedBlockIndex.value > index) {
    selectedBlockIndex.value--
  }
}

const addBlock = (type) => {
  const newBlock = {
    id: `block-${Date.now()}`,
    type: type,
    data: {}
  }

  // Pre-seed default schemas
  switch(type) {
    case 'Hero':
      newBlock.data = {
        badge: 'New Feature Announcement',
        title: 'Your Powerful Headline Here',
        subtitle: 'Add a compelling description.',
        ctaPrimaryText: 'Get Started', ctaPrimaryLink: '/login',
        ctaSecondaryText: 'Learn More', ctaSecondaryLink: '/#how-it-works'
      }
      break
    case 'Stats':
      newBlock.data = {
        items: [
          { value: '10K', label: 'Users' },
          { value: '99%', label: 'Uptime' },
          { value: '24/7', label: 'Support' }
        ]
      }
      break
    case 'HowItWorks':
      newBlock.data = { preTitle: 'Simple Process', title: 'Start trading smarter in 3 steps', subtitle: 'No complicated setup. Subscribe, receive signals, and trade.' }
      break
    case 'Analysts':
      newBlock.data = { 
        preTitle: 'Our Analysts', 
        title: 'Top Performing Analysts',
        analysts: [
          {
            name: 'Alex Crypto', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', subtitle: 'Crypto · Day Trader · 5 yrs', winRate: '72% Win',
            tags: 'BTC/USDT, ETH/USDT, Scalping', description: 'High-frequency scalping with clear entry, TP and SL. 3-5 quality setups daily with strict risk rules.',
            stat1Value: '85', stat1Label: 'Signals/mo', stat2Value: '1:2.4', stat2Label: 'Avg R:R', stat3Value: '1.2K', stat3Label: 'Subs',
            price: '$49', priceSuffix: '/month'
          },
          {
             name: 'Sarah FX', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', subtitle: 'Forex · Swing Trader · 8 yrs', winRate: '65% Win',
             tags: 'EUR/USD, GBP/USD, Swing', description: 'Pure price action on major pairs. Institutional-level zones and multi-day swing opportunities metrics.',
             stat1Value: '22', stat1Label: 'Signals/mo', stat2Value: '1:3.1', stat2Label: 'Avg R:R', stat3Value: '850', stat3Label: 'Subs',
             price: '$35', priceSuffix: '/month'
          }
        ] 
      }
      break
    case 'Features':
      newBlock.data = { preTitle: 'Why SignalTribe', title: 'Built for serious traders', subtitle: '' }
      break
    case 'Testimonials':
      newBlock.data = { preTitle: 'Testimonials', title: 'What traders say about us', subtitle: '' }
      break
    case 'Pricing':
      newBlock.data = { 
        preTitle: 'Pricing', 
        title: 'Simple, transparent pricing', 
        subtitle: 'Choose a plan that works best for you.',
        plans: [
          { name: 'Basic', price: '$19', period: '/month', description: 'Perfect for beginners.', features: 'Real-time alerts, Community access, Basic stats', cta: 'Get Started', isPopular: false },
          { name: 'Pro', price: '$49', period: '/month', description: 'For serious traders.', features: 'Everything in Basic, Live Journals, Priority support, Portfolio tracker', cta: 'Start Free Trial', isPopular: true }
        ]
      }
      break
    case 'FAQ':
      newBlock.data = { 
        preTitle: 'FAQ', 
        title: 'Frequently asked questions', 
        subtitle: 'Everything you need to know about the product.',
        faqs: [
          { question: 'Do I get access to all analysts?', answer: 'No, subscriptions are per analyst to ensure they are fairly compensated.' },
          { question: 'Can I cancel anytime?', answer: 'Yes, your subscription rolls over monthly and you can turn off auto-renew at any time in your dashboard.' }
        ]
      }
      break
    case 'Newsletter':
      newBlock.data = { preTitle: 'Newsletter', title: 'Get weekly market insights', subtitle: 'We share our best setups and market reviews every Sunday.' }
      break
    case 'CTA':
      newBlock.data = { preTitle: '', title: 'Ready to trade with an edge?', subtitle: 'Join thousands of traders.', ctaText: 'Get Started', ctaLink: '/login' }
      break
  }

  blocks.value.push(newBlock)
  selectedBlockIndex.value = blocks.value.length - 1
  
  // close dropdown hack
  document.activeElement?.blur()
}

const addAnalystCard = () => {
  if (!selectedBlock.value) return;
  if (!selectedBlock.value.data.analysts) {
    selectedBlock.value.data.analysts = [];
  }
  selectedBlock.value.data.analysts.push({
    name: 'New Analyst', avatar: '', subtitle: '', winRate: '', 
    tags: '', description: '', stat1Value: '', stat1Label: '', 
    stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '', 
    price: '', priceSuffix: ''
  });
}

// API Interactions
const platformAnalysts = ref([])

const fetchPlatformAnalysts = async () => {
  try {
    const res = await $fetch('/api/users/analysts')
    platformAnalysts.value = res || []
  } catch (err) {
    console.error('Failed to load platform analysts', err)
  }
}

const linkAnalystCard = (card, userId) => {
  // If we unselect, just clear userId.
  if (!userId) {
     card.userId = null
     card.name = 'New Analyst'
     return
  }
  
  card.userId = userId
  const found = platformAnalysts.value.find(p => p.id === userId)
  if (found) {
    card.name = found.name || found.email?.split('@')[0] || 'Unknown User'
    // In the future, if your DB supports these fields, they can be matched directly:
    card.avatar = found.avatar || card.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(card.name)}&background=random`
    card.description = found.description || card.description || `${card.name} is a leading analyst on the platform.`
    
    // As a simple placeholder convenience to the user
    if (!card.winRate) card.winRate = '70% Win'
    if (!card.subtitle) card.subtitle = 'Analyst'
    if (!card.stat1Label) { card.stat1Label = 'Signals'; card.stat1Value = '10' }
    if (!card.stat2Label) { card.stat2Label = 'Avg R:R'; card.stat2Value = '1:2' }
    if (!card.stat3Label) { card.stat3Label = 'Subs'; card.stat3Value = '100+' }
    if (!card.price) { card.price = '$49'; card.priceSuffix = '/month' }
  }
}

const fetchSettings = async () => {
  try {
    const res = await $fetch('/api/settings')
    if (res && res.cmsBlocks) {
      try {
        blocks.value = JSON.parse(res.cmsBlocks)
      } catch (e) {
        blocks.value = []
      }
    } else {
      // Default initial layout state if nothing saved
      blocks.value = []
    }
  } catch (err) {
    showAlert('Failed to load blocks from database', 'error')
  }
}

const saveBlocks = async () => {
  isLoading.value = true
  alertMessage.value = ''
  try {
    // We stringify the array into a single DB field
    const payload = {
      cmsBlocks: JSON.stringify(blocks.value)
    }

    const res = await $fetch('/api/settings', {
      method: 'PUT',
      body: payload
    })
    
    showAlert('Landing page layout published successfully!', 'success')
  } catch (err) {
    showAlert(err.data?.message || 'Failed to publish blocks', 'error')
  } finally {
    isLoading.value = false
  }
}

const showAlert = (msg, type) => {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    alertMessage.value = ''
  }, 5000)
}

onMounted(() => {
  fetchSettings()
  fetchPlatformAnalysts()
})
</script>
