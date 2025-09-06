<script lang="ts" setup>
  import type { CTAButton, NavigationItem, UIConfig } from '@/controller/landingController'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from '@/composables/useTheme'

  interface Props {
    config?: UIConfig | null
  }

  const props = defineProps<Props>()
  const router = useRouter()

  // Theme management
  const { toggleTheme: handleToggleTheme, getCurrentTheme, isLoadingTheme } = useTheme()

  const navbarConfig = computed(() => props.config?.navbar)

  // Theme toggle computed properties
  const currentTheme = computed(() => getCurrentTheme())
  const themeIcon = computed(() => {
    return currentTheme.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
  })
  const themeTooltip = computed(() => {
    return `Switch to ${currentTheme.value === 'dark' ? 'light' : 'dark'} theme`
  })

  function toggleTheme () {
    handleToggleTheme()
  }

  function handleNavigation (item: NavigationItem) {
    switch (item.action) {
      case 'scroll': {
        scrollToSection(item.target)
        break
      }
      case 'navigate': {
        router.push(item.target)
        break
      }
      case 'external': {
        window.open(item.target, '_blank', 'noopener,noreferrer')
        break
      }
    }
  }

  function handleCTAAction (button: CTAButton) {
    switch (button.action) {
      case 'scroll': {
        scrollToSection(button.target)
        break
      }
      case 'navigate': {
        router.push(button.target)
        break
      }
      case 'external': {
        window.open(button.target, '_blank', 'noopener,noreferrer')
        break
      }
    }
  }

  function scrollToSection (sectionId: string) {
    const element = document.querySelector(`#${sectionId}`)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
</script>

<template>
  <v-toolbar
    v-if="config?.showNavbar && navbarConfig"
    app
    :color="navbarConfig.color"
    :density="navbarConfig.density"
    :elevation="navbarConfig.elevation"
  >
    <template #prepend>
      <v-toolbar-title class="d-flex align-center">
        <v-icon
          class="me-2"
          :icon="navbarConfig.icon"
          size="large"
        />
        <span class="text-h6 font-weight-bold">{{ navbarConfig.title }}</span>
      </v-toolbar-title>
    </template>

    <v-spacer />

    <template #append>
      <v-btn
        v-for="item in navbarConfig.navigationItems"
        :key="item.label"
        color="on-primary"
        variant="text"
        @click="handleNavigation(item)"
      >
        {{ item.label }}
      </v-btn>

      <!-- Theme Toggle Button -->
      <v-btn
        :loading="isLoadingTheme"
        size="small"
        variant="text"
        @click="toggleTheme"
      >
        <v-icon :icon="themeIcon" />
        <v-tooltip activator="parent" location="bottom">
          {{ themeTooltip }}
        </v-tooltip>
      </v-btn>

      <v-btn
        v-if="navbarConfig.ctaButton"
        class="ms-2"
        :color="navbarConfig.ctaButton.color"
        :variant="navbarConfig.ctaButton.variant"
        @click="handleCTAAction(navbarConfig.ctaButton)"
      >
        {{ navbarConfig.ctaButton.label }}
      </v-btn>
    </template>
  </v-toolbar>
</template>


