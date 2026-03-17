<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Platform Settings</h1>
        <p class="text-sm text-base-content/50 mt-0.5">Configure your application, integrations, and services.</p>
      </div>
      <button class="btn btn-primary btn-sm gap-2" @click="saveSettings" :disabled="isLoading">
        <IconDeviceFloppy class="w-4 h-4"/>
        <span v-if="isLoading">Saving...</span>
        <span v-else>Save Settings</span>
      </button>
    </div>

    <!-- Alert Banner (Success/Error Messages) -->
    <div v-if="alertMessage" :class="`alert border py-3 shrink-0 ${alertType === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`">
      <IconCircleCheck v-if="alertType === 'success'" class="w-5 h-5 shrink-0"/>
      <IconAlertTriangle v-else class="w-5 h-5 shrink-0"/>
      <div>
        <p class="font-semibold text-sm">{{ alertMessage }}</p>
      </div>
      <button class="btn btn-ghost btn-xs ml-auto shrink-0" @click="alertMessage = ''">✕</button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      <!-- Left Column: Settings Cards -->
      <div class="xl:col-span-3 space-y-6">
        
        <!-- General Configuration -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
              <IconSettings class="w-5 h-5 text-primary"/> General Configuration
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control w-full">
                <label class="label"><span class="label-text font-medium">Application Name</span></label>
                <input type="text" v-model="settings.appName" placeholder="e.g. SignalTribe" class="input input-bordered w-full" />
              </div>
              <div class="form-control w-full">
                <label class="label"><span class="label-text font-medium">Platform Timezone</span></label>
                <select class="select select-bordered w-full" v-model="settings.timezone">
                  <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Gateway Integration -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold text-lg flex items-center gap-2">
                <IconCreditCard class="w-5 h-5 text-primary"/> Payment Gateway
              </h2>
              <select class="select select-bordered select-sm" v-model="settings.activePaymentGateway">
                <option value="">None</option>
                <option value="midtrans">Midtrans</option>
                <option value="xendit">Xendit</option>
              </select>
            </div>
            
            <!-- Midtrans Form -->
            <div v-if="settings.activePaymentGateway === 'midtrans'" class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" class="toggle toggle-primary" v-model="settings.midtransIsProduction" />
                  <span class="label-text font-medium">Production Environment</span>
                </label>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Merchant ID</span></label>
                  <input type="text" v-model="settings.midtransMerchantId" placeholder="M..." class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Client Key</span></label>
                  <input type="text" v-model="settings.midtransClientKey" placeholder="SB-Mid-client-..." class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Server Key</span></label>
                  <input type="password" v-model="settings.midtransServerKey" placeholder="SB-Mid-server-..." class="input input-bordered w-full" />
                </div>
              </div>
            </div>

            <!-- Xendit Form -->
            <div v-if="settings.activePaymentGateway === 'xendit'" class="space-y-4">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Public API Key</span></label>
                  <input type="text" v-model="settings.xenditPublicKey" placeholder="xnd_public_..." class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Secret API Key</span></label>
                  <input type="password" v-model="settings.xenditSecretKey" placeholder="xnd_production_..." class="input input-bordered w-full" />
                </div>
              </div>
            </div>
            <div v-if="!settings.activePaymentGateway" class="text-sm text-base-content/50 italic">
              Please select a payment gateway provider to configure.
            </div>
          </div>
        </div>

        <!-- Market Data APIs Integration -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
              <IconChartCandle class="w-5 h-5 text-primary"/> Market Data APIs
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Crypto -->
              <div class="space-y-4 p-4 border border-base-200 rounded-box bg-base-200/30">
                <h3 class="font-semibold text-sm uppercase tracking-wider text-base-content/60">Crypto Provider</h3>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Active Provider</span></label>
                  <select class="select select-bordered w-full" v-model="settings.activeCryptoProvider">
                    <option value="">None</option>
                    <option value="binance">Binance WebSocket</option>
                    <option value="coingecko">CoinGecko REST/WS</option>
                  </select>
                </div>

                <div v-if="settings.activeCryptoProvider === 'binance'" class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">API Key (Optional for public)</span></label>
                  <input type="password" v-model="settings.binanceApiKey" placeholder="API Key" class="input input-bordered w-full" />
                </div>

                <div v-if="settings.activeCryptoProvider === 'coingecko'" class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">CoinGecko API Key (Demo/Pro)</span></label>
                  <input type="password" v-model="settings.coingeckoApiKey" placeholder="CG-..." class="input input-bordered w-full" />
                </div>
              </div>

              <!-- Forex / Stocks -->
              <div class="space-y-4 p-4 border border-base-200 rounded-box bg-base-200/30">
                <h3 class="font-semibold text-sm uppercase tracking-wider text-base-content/60">Forex & Stocks Provider</h3>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Active Provider</span></label>
                  <select class="select select-bordered w-full" v-model="settings.activeForexProvider">
                    <option value="">None</option>
                    <option value="alphavantage">Alpha Vantage</option>
                    <option value="polygon">Polygon.io</option>
                    <option value="twelvedata">Twelve Data</option>
                  </select>
                </div>

                <div v-if="settings.activeForexProvider === 'alphavantage'" class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Alpha Vantage API Key</span></label>
                  <input type="password" v-model="settings.alphaVantageApiKey" placeholder="Key..." class="input input-bordered w-full" />
                </div>

                <div v-if="settings.activeForexProvider === 'polygon'" class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Polygon.io API Key</span></label>
                  <input type="password" v-model="settings.polygonApiKey" placeholder="Key..." class="input input-bordered w-full" />
                </div>

                <div v-if="settings.activeForexProvider === 'twelvedata'" class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Twelve Data API Key</span></label>
                  <input type="password" v-model="settings.twelveDataApiKey" placeholder="Key..." class="input input-bordered w-full" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- WhatsApp API Integration -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body p-5">
             <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold text-lg flex items-center gap-2">
                <IconMessageCircle class="w-5 h-5 text-primary"/> WhatsApp API
              </h2>
              <select class="select select-bordered select-sm" v-model="settings.activeWhatsappProvider">
                <option value="">None</option>
                <option value="meta">Meta Cloud API</option>
                <option value="fonnte">Fonnte</option>
              </select>
            </div>

            <!-- Meta API Form -->
            <div v-if="settings.activeWhatsappProvider === 'meta'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">Phone Number ID</span></label>
                  <input type="text" v-model="settings.waMetaPhoneNumberId" placeholder="e.g. 10123456789" class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full">
                  <label class="label"><span class="label-text font-medium">WhatsApp Business Account ID</span></label>
                  <input type="text" v-model="settings.waMetaAccountId" placeholder="e.g. 10987654321" class="input input-bordered w-full" />
                </div>
                <div class="form-control w-full md:col-span-2">
                  <label class="label"><span class="label-text font-medium">System User Access Token</span></label>
                  <input type="password" v-model="settings.waMetaAccessToken" placeholder="EA... Token" class="input input-bordered w-full" />
                </div>
              </div>
            </div>

            <!-- Fonnte Form -->
            <div v-if="settings.activeWhatsappProvider === 'fonnte'" class="space-y-4">
              <div class="form-control w-full">
                <label class="label"><span class="label-text font-medium">Fonnte API Token</span></label>
                <input type="password" v-model="settings.waFonnteToken" placeholder="Your Fonnte Device Token" class="input input-bordered w-full" />
              </div>
            </div>

             <div v-if="!settings.activeWhatsappProvider" class="text-sm text-base-content/50 italic">
              Please select a WhatsApp API provider to configure.
            </div>

          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <div class="card bg-base-100 border border-base-300">
           <div class="card-body p-5">
             <h2 class="font-bold text-base mb-2">Notice</h2>
             <p class="text-sm text-base-content/70">
               Changes to Application Name and Timezone may require a page reload to fully take effect.
               Please ensure API Keys are kept secret and never shared.
             </p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  IconDeviceFloppy, 
  IconCircleCheck, 
  IconAlertTriangle,
  IconSettings,
  IconCreditCard,
  IconChartCandle,
  IconMessageCircle
} from '@tabler/icons-vue'
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'dashboard' })

const getBoolean = (val) => val === 'true' || val === true

const settings = ref({
  appName: '',
  timezone: 'Asia/Jakarta',

  activePaymentGateway: '',
  midtransIsProduction: false,
  midtransMerchantId: '',
  midtransClientKey: '',
  midtransServerKey: '',
  xenditPublicKey: '',
  xenditSecretKey: '',

  activeCryptoProvider: '',
  binanceApiKey: '',
  coingeckoApiKey: '',

  activeForexProvider: '',
  alphaVantageApiKey: '',
  polygonApiKey: '',
  twelveDataApiKey: '',

  activeWhatsappProvider: '',
  waMetaPhoneNumberId: '',
  waMetaAccountId: '',
  waMetaAccessToken: '',
  waFonnteToken: ''
})

const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('success')

const fetchSettings = async () => {
  try {
    const res = await $fetch('/api/settings')
    if (res) {
      // Loop object keys and assign if it exists in our ref
      Object.keys(settings.value).forEach(key => {
        if (res[key] !== undefined) {
          if (typeof settings.value[key] === 'boolean') {
             settings.value[key] = getBoolean(res[key])
          } else {
             settings.value[key] = res[key]
          }
        }
      })
    }
  } catch (err) {
    showAlert('Failed to load settings', 'error')
  }
}

const saveSettings = async () => {
  isLoading.value = true
  alertMessage.value = ''
  try {
    const res = await $fetch('/api/settings', {
      method: 'PUT',
      body: settings.value
    })
    
    // Attempt to reload the window entirely so the layout picks up the new appName if it was fetching it
    showAlert('Settings saved successfully', 'success')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (err) {
    showAlert(err.data?.message || 'Failed to save settings', 'error')
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
})
</script>
