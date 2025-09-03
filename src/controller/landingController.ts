import axios from 'axios'
import { ref, type Ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

export interface Feature {
  title: string
  description: string
  icon: string
}

export interface NavigationItem {
  label: string
  action: 'scroll' | 'navigate' | 'external'
  target: string
}

export interface CTAButton {
  label: string
  variant: 'elevated' | 'outlined' | 'text'
  color: string
  action: 'navigate' | 'external' | 'scroll'
  target: string
}

export interface NavbarConfig {
  title: string
  icon: string
  color: string
  elevation: number
  density: 'default' | 'prominent' | 'comfortable' | 'compact'
  navigationItems: NavigationItem[]
  ctaButton: CTAButton
}

export interface SocialLink {
  platform: string
  icon: string
  url: string
  label: string
}

export interface Technology {
  name: string
  icon: string
  color: string
}

export interface FooterConfig {
  companyName: string
  tagline: string
  icon: string
  color: string
  copyright: string
  socialLinks: SocialLink[]
  technologies: Technology[]
}

export interface UIConfig {
  showNavbar: boolean
  showFooter: boolean
  navbar: NavbarConfig
  footer: FooterConfig
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
}

export interface BackgroundImage {
  src: string
  alt: string
  overlay: {
    enabled: boolean
    color: string
    opacity: number
  }
}

export interface LandingData {
  title: string
  description: string
  subtitle: string
  backgroundImage: BackgroundImage
  features: Feature[]
  version: string
  author: string
  lastUpdated: string
  theme: ThemeConfig
  ui: UIConfig
}

export interface LandingController {
  data: Ref<LandingData | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchLandingData: () => Promise<void>
}

export function useLandingController (): LandingController {
  const data = ref<LandingData | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const { initializeTheme } = useTheme()

  const fetchLandingData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await axios.get<LandingData>('/data/external-page.json', {
        timeout: 5000, // 5 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      })

      data.value = response.data

      // Initialize dynamic theme from external-page.json
      if (data.value?.theme) {
        await initializeTheme()
      }
    } catch (error_) {
      console.error('Failed to fetch landing data:', error_)
      error.value = error_ instanceof Error ? error_.message : 'Unknown error occurred'

      // Fallback data in case of error
      data.value = {
        title: 'Vue 3 + Vuetify 3 Thesis Template',
        description: 'A modern, reusable thesis template built with Vue 3 and Vuetify 3.',
        subtitle: 'Streamline Your Academic Writing',
        backgroundImage: {
          src: '/images/landing-background.jpg',
          alt: 'Abstract academic background',
          overlay: {
            enabled: true,
            color: 'rgba(85, 107, 47, 0.1)',
            opacity: 0.8
          }
        },
        features: [
          {
            title: 'Zero-Config Development',
            description: 'File-based auto-generation with minimal configuration.',
            icon: 'mdi-cog-outline',
          },
        ],
        version: '1.0.0',
        author: 'Thesis Template Team',
        lastUpdated: new Date().toISOString().split('T')[0],
        theme: {
          primaryColor: '#556B2F',
          secondaryColor: '#EFF5D2',
        },
        ui: {
          showNavbar: true,
          showFooter: true,
          navbar: {
            title: 'Thesis Template',
            icon: 'mdi-school',
            color: 'primary',
            elevation: 2,
            density: 'comfortable',
            navigationItems: [
              {
                label: 'Features',
                action: 'scroll',
                target: 'features',
              },
            ],
            ctaButton: {
              label: 'Get Started',
              variant: 'outlined',
              color: 'white',
              action: 'navigate',
              target: '/auth',
            },
          },
          footer: {
            companyName: 'Thesis Template',
            tagline: 'Modern academic writing made simple',
            icon: 'mdi-school',
            color: 'grey-darken-3',
            copyright: 'Thesis Template Team. All rights reserved.',
            socialLinks: [
              {
                platform: 'github',
                icon: 'mdi-github',
                url: 'https://github.com',
                label: 'GitHub',
              },
            ],
            technologies: [
              {
                name: 'Vue 3',
                icon: 'mdi-vuejs',
                color: 'green',
              },
            ],
          },
        },
      }
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    fetchLandingData,
  }
}
