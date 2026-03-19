export type LandingBlockType =
  | 'Hero'
  | 'Stats'
  | 'HowItWorks'
  | 'Analysts'
  | 'Features'
  | 'Testimonials'
  | 'Pricing'
  | 'FAQ'
  | 'Newsletter'
  | 'CTA'

export interface LandingBlock {
  id: string
  type: LandingBlockType
  data: Record<string, any>
}

export const LANDING_PAGE_BLOCKS_KEY = 'cmsBlocks'

const VALID_BLOCK_TYPES = new Set<LandingBlockType>([
  'Hero',
  'Stats',
  'HowItWorks',
  'Analysts',
  'Features',
  'Testimonials',
  'Pricing',
  'FAQ',
  'Newsletter',
  'CTA',
])

const DEFAULT_LANDING_PAGE_BLOCKS: LandingBlock[] = [
  {
    id: 'block-1',
    type: 'Hero',
    data: {
      badge: '100% Platform-Verified Signal Statistics',
      title: 'Trade with the<br/><span class="text-primary">Best Analysts</span> in the Market',
      subtitle: 'Subscribe to vetted market analysts, receive real-time trading signals, and study their thinking through detailed journals. Elevate your trading game.',
      ctaPrimaryText: 'Explore Analysts',
      ctaPrimaryLink: '/#analysts',
      ctaSecondaryText: 'How It Works',
      ctaSecondaryLink: '/#how-it-works',
    },
  },
  {
    id: 'block-2',
    type: 'Stats',
    data: {
      items: [
        { value: '12K+', label: 'Active Traders' },
        { value: '42', label: 'Pro Analysts' },
        { value: '68%', label: 'Avg Win Rate' },
      ],
    },
  },
  {
    id: 'block-3',
    type: 'HowItWorks',
    data: {
      preTitle: 'Simple Process',
      title: 'Start trading smarter in 3 steps',
      subtitle: 'No complicated setup. Subscribe, receive signals, and trade.',
    },
  },
  {
    id: 'block-4',
    type: 'Analysts',
    data: {
      preTitle: 'Our Analysts',
      title: 'Top Performing Analysts',
      analysts: [
        {
          name: 'Alex Crypto',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          subtitle: 'Crypto · Day Trader · 5 yrs',
          winRate: '72% Win',
          tags: 'BTC/USDT, ETH/USDT, Scalping',
          description: 'High-frequency scalping with clear entry, TP and SL. 3-5 quality setups daily with strict risk rules.',
          stat1Value: '85',
          stat1Label: 'Signals/mo',
          stat2Value: '1:2.4',
          stat2Label: 'Avg R:R',
          stat3Value: '1.2K',
          stat3Label: 'Subs',
          price: '$49',
          priceSuffix: '/month',
        },
        {
          name: 'Sarah FX',
          avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          subtitle: 'Forex · Swing Trader · 8 yrs',
          winRate: '65% Win',
          tags: 'EUR/USD, GBP/USD, Swing',
          description: 'Pure price action on major pairs. Institutional-level zones and multi-day swing opportunities metrics.',
          stat1Value: '22',
          stat1Label: 'Signals/mo',
          stat2Value: '1:3.1',
          stat2Label: 'Avg R:R',
          stat3Value: '850',
          stat3Label: 'Subs',
          price: '$35',
          priceSuffix: '/month',
        },
      ],
    },
  },
  {
    id: 'block-5',
    type: 'Features',
    data: {
      preTitle: 'Why SignalTribe',
      title: 'Built for serious traders',
      subtitle: '',
    },
  },
  {
    id: 'block-6',
    type: 'Testimonials',
    data: {
      preTitle: 'Testimonials',
      title: 'What traders say about us',
      subtitle: '',
    },
  },
  {
    id: 'block-7',
    type: 'Pricing',
    data: {
      preTitle: 'Pricing',
      title: 'Simple, transparent pricing',
      subtitle: 'Choose a plan that works best for you.',
      plans: [
        {
          name: 'Basic',
          price: '$19',
          period: '/month',
          description: 'Perfect for beginners.',
          features: 'Real-time alerts, Community access, Basic stats',
          cta: 'Get Started',
          isPopular: false,
        },
        {
          name: 'Pro',
          price: '$49',
          period: '/month',
          description: 'For serious traders.',
          features: 'Everything in Basic, Live Journals, Priority support, Portfolio tracker',
          cta: 'Start Free Trial',
          isPopular: true,
        },
      ],
    },
  },
  {
    id: 'block-8',
    type: 'FAQ',
    data: {
      preTitle: 'FAQ',
      title: 'Frequently asked questions',
      subtitle: 'Everything you need to know about the product.',
      faqs: [
        {
          question: 'Do I get access to all analysts?',
          answer: 'No, subscriptions are per analyst to ensure they are fairly compensated.',
        },
        {
          question: 'Can I cancel anytime?',
          answer: 'Yes, your subscription rolls over monthly and you can turn off auto-renew at any time in your dashboard.',
        },
      ],
    },
  },
  {
    id: 'block-9',
    type: 'Newsletter',
    data: {
      preTitle: 'Newsletter',
      title: 'Get weekly market insights',
      subtitle: 'We share our best setups and market reviews every Sunday.',
    },
  },
  {
    id: 'block-10',
    type: 'CTA',
    data: {
      title: 'Ready to trade with an edge?',
      subtitle: 'Join 12,000+ traders already using SignalTribe to follow the best analysts in the market.',
      ctaText: 'Get Started - It\'s Free',
      ctaLink: '/login',
    },
  },
]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const getDefaultLandingPageBlocks = (): LandingBlock[] => clone(DEFAULT_LANDING_PAGE_BLOCKS)

export const normalizeLandingPageBlocks = (input: unknown): LandingBlock[] | null => {
  let parsed = input

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return null
    }
  }

  if (!Array.isArray(parsed)) {
    return null
  }

  return parsed.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const block = item as Record<string, unknown>
    const type = typeof block.type === 'string' && VALID_BLOCK_TYPES.has(block.type as LandingBlockType)
      ? block.type as LandingBlockType
      : null

    if (!type) {
      return []
    }

    const data = block.data && typeof block.data === 'object'
      ? clone(block.data)
      : {}

    const id = typeof block.id === 'string' && block.id.trim()
      ? block.id.trim()
      : `block-${index + 1}`

    return [{ id, type, data } satisfies LandingBlock]
  })
}