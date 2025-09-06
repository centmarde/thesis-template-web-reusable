<script lang="ts" setup>
  import type { CTAButton, NavigationItem, UIConfig } from '@/controller/landingController'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from '@/composables/useTheme'

  interface Props {
    config?: UIConfig | null
  }

  const props = defineProps<Props>()
  const router = useRouter()

  // Mobile drawer state
  const drawer = ref(false)

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
    // Close drawer on mobile after navigation
    drawer.value = false

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
    // Close drawer on mobile after CTA action
    drawer.value = false

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
  <div v-if="config?.showNavbar && navbarConfig">
    <!-- App Bar for Desktop -->
    <v-app-bar
      app
      :elevation="navbarConfig.elevation"
      density="comfortable"
      flat
      scroll-behavior="elevate"
      scroll-threshold="50"
      class="navbar-gradient"
    >
      <!-- Logo and Title Section -->
      <template #prepend>
        <v-avatar
          class="me-3"
          size="40"
          :color="navbarConfig.color === 'transparent' ? 'primary' : 'primary-darken-1'"
        >
          <v-icon
            :icon="navbarConfig.icon"
            size="24"
            color="white"
          />
        </v-avatar>

        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold ">
            {{ navbarConfig.title }}
          </span>
          <span class="text-caption text-medium-emphasis">
            Modern Design
          </span>
        </div>
      </template>

      <v-spacer />

      <!-- Desktop Navigation -->
      <template #append>
        <div class="d-none d-md-flex align-center">
          <!-- Navigation Pills -->
          <v-chip-group
            class="me-4"
            color="primary"
            variant="text"
          >
            <v-chip
              v-for="item in navbarConfig.navigationItems"
              :key="item.label"
              :ripple="true"
              variant="text"
              size="large"
              class="mx-1"
              @click="handleNavigation(item)"
            >
              {{ item.label }}
            </v-chip>
          </v-chip-group>

          <!-- Action Buttons Container -->
            <div class="d-flex align-center">
            <!-- Theme Toggle with Badge -->
            <v-badge
              :content="currentTheme.charAt(0).toUpperCase()"
              color="secondary"
              offset-x="8"
              offset-y="8"
              class="me-4"
            >
              <v-btn
              :loading="isLoadingTheme"
              size="large"
              variant="text"
              rounded="xl"
              :aria-label="themeTooltip"
              @click="toggleTheme"
              >
              <v-icon :icon="themeIcon" />
              <v-tooltip activator="parent" location="bottom">
                {{ themeTooltip }}
              </v-tooltip>
              </v-btn>
            </v-badge>



            <!-- CTA Button with Enhanced Design -->
            <v-btn
              v-if="navbarConfig.ctaButton"
              :color="navbarConfig.ctaButton.color"
              :variant="navbarConfig.ctaButton.variant"
              size="large"
              rounded="xl"
              class="px-6"
              prepend-icon="mdi-rocket-launch"
              @click="handleCTAAction(navbarConfig.ctaButton)"
            >
              {{ navbarConfig.ctaButton.label }}
            </v-btn>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <v-btn
          class="d-md-none"
          icon="mdi-menu"
          variant="text"
          @click="drawer = !drawer"
        />
      </template>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="end"
      temporary
      width="300"
      class="d-md-none"
    >
      <!-- Drawer Header -->
      <v-list-item class="pa-4 border-b">
        <template #prepend>
          <v-avatar
            :color="navbarConfig.color === 'transparent' ? 'light' : 'primary-darken-1'"
            size="48"
          >
            <v-icon
              :icon="navbarConfig.icon"
              size="28"
              color="white"
            />
          </v-avatar>
        </template>

        <v-list-item-title class="text-h6 font-weight-bold text-primary">
          {{ navbarConfig.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          Modern Design
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider />

      <!-- Navigation Items -->
      <v-list nav>
        <v-list-item
          v-for="item in navbarConfig.navigationItems"
          :key="item.label"
          :title="item.label"
          prepend-icon="mdi-chevron-right"
          rounded="xl"
          class="ma-2"
          @click="handleNavigation(item)"
        />
      </v-list>

      <!-- Mobile Actions -->
      <template #append>
        <div class="pa-4 border-t">
          <!-- Theme Toggle -->
          <v-btn
            :loading="isLoadingTheme"
            block
            variant="outlined"
            :prepend-icon="themeIcon"
            class="mb-3"
            @click="toggleTheme"
          >

            {{ themeTooltip }}
          </v-btn>

          <!-- CTA Button -->
          <v-btn
            v-if="navbarConfig.ctaButton"
            block
            :color="navbarConfig.ctaButton.color"
            :variant="navbarConfig.ctaButton.variant"
            size="large"
            prepend-icon="mdi-rocket-launch"
            @click="handleCTAAction(navbarConfig.ctaButton)"
          >
            {{ navbarConfig.ctaButton.label }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
/* Enhance the app bar with subtle animations */
.v-app-bar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient effect using primary theme color */
.navbar-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.8) 50%,
    rgba(var(--v-theme-primary), 0.9) 100%
  ) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
}

/* Add hover effects to navigation chips */
.v-chip:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Smooth drawer animation */
.v-navigation-drawer {
  backdrop-filter: blur(10px);
}
</style>
