<script lang="ts" setup>
  import type { CTAButton, NavigationItem, UIConfig } from '@/controller/landingController'
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from '@/composables/useTheme'

  interface Props {
    config?: UIConfig | null
  }

  const props = defineProps<Props>()
  const router = useRouter()

  // Mobile drawer state
  const drawer = ref(false)
  const isScrolled = ref(false)

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

  // Scroll handler for floating effect
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
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
    <!-- Floating Navbar Card Design -->
    <v-card
      :class="[
        'floating-navbar mx-auto',
        { 'scrolled': isScrolled }
      ]"
      :elevation="isScrolled ? 12 : 8"
      rounded="pill"
      variant="elevated"
    >
      <v-toolbar
        :height="60"
        color="transparent"
        flat
        class="px-2"
      >
        <!-- Logo Section with Animated Badge -->
        <template #prepend>
          <div class="d-flex align-center">
            <v-badge
              :content="'V3'"
              color="success"
              dot
              offset-x="8"
              offset-y="8"
              class="me-2"
            >
              <v-avatar
                :color="navbarConfig.color"
                size="42"
                class="logo-avatar"
              >
                <v-icon
                  :icon="navbarConfig.icon"
                  size="22"
                  color="white"
                />
              </v-avatar>
            </v-badge>

            <div class="d-flex flex-column ms-2 d-none d-sm-flex">
              <span class="text-subtitle-1 font-weight-bold text-primary">
                {{ navbarConfig.title }}
              </span>
              <span class="text-caption text-medium-emphasis">
                Academic Excellence
              </span>
            </div>
          </div>
        </template>

        <v-spacer />

        <!-- Desktop Navigation with Hover Effects -->
        <template #append>
          <div class="d-none d-lg-flex align-center">
            <!-- Navigation Buttons with Pills -->
            <div class="d-flex align-center me-4">
              <v-btn
                v-for="(item, index) in navbarConfig.navigationItems"
                :key="item.label"
                :class="[
                  'nav-pill mx-1',
                  `nav-delay-${index + 1}`
                ]"
                variant="text"
                rounded="pill"
                size="large"
                @click="handleNavigation(item)"
              >
                <v-icon
                  start
                  size="small"
                  :icon="`mdi-${index === 0 ? 'star' : 'information'}`"
                />
                {{ item.label }}
              </v-btn>
            </div>

            <!-- Theme Toggle with Advanced Design -->
            <v-menu location="bottom">
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  :loading="isLoadingTheme"
                  variant="outlined"
                  rounded="pill"
                  size="large"
                  class="me-3 theme-toggle"
                  :prepend-icon="themeIcon"
                >
                  <span class="d-none d-xl-inline">Theme</span>
                </v-btn>
              </template>

              <v-card width="200" class="mt-2">
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-white-balance-sunny"
                    title="Light Mode"
                    :active="currentTheme === 'light'"
                    @click="currentTheme === 'dark' && toggleTheme()"
                  />
                  <v-list-item
                    prepend-icon="mdi-weather-night"
                    title="Dark Mode"
                    :active="currentTheme === 'dark'"
                    @click="currentTheme === 'light' && toggleTheme()"
                  />
                </v-list>
              </v-card>
            </v-menu>

            <!-- Enhanced CTA Button -->
            <v-btn
              v-if="navbarConfig.ctaButton"
              :color="navbarConfig.ctaButton.color"
              variant="elevated"
              size="large"
              rounded="pill"
              class="cta-button px-6"
              prepend-icon="mdi-rocket-launch-outline"
              @click="handleCTAAction(navbarConfig.ctaButton)"
            >
              {{ navbarConfig.ctaButton.label }}
              <v-icon
                end
                icon="mdi-arrow-right"
                class="ms-1"
              />
            </v-btn>
          </div>

          <!-- Mobile Menu Button -->
          <v-btn
            class="d-lg-none"
            icon="mdi-menu"
            variant="text"
            size="large"
            @click="drawer = !drawer"
          />
        </template>
      </v-toolbar>
    </v-card>

    <!-- Mobile Side Drawer with Modern Design -->
    <v-navigation-drawer
      v-model="drawer"
      location="end"
      temporary
      width="320"
      class="d-lg-none mobile-drawer"
    >
      <!-- Enhanced Drawer Header -->
      <v-card
        class="ma-4 pa-4"
        variant="tonal"
        rounded="xl"
      >
        <div class="d-flex align-center">
          <v-avatar
            :color="navbarConfig.color"
            size="56"
            class="me-4"
          >
            <v-icon
              :icon="navbarConfig.icon"
              size="32"
              color="white"
            />
          </v-avatar>

          <div>
            <h3 class="text-h6 font-weight-bold text-primary">
              {{ navbarConfig.title }}
            </h3>
            <p class="text-caption text-medium-emphasis mb-0">
              Modern Academic Platform
            </p>
          </div>
        </div>
      </v-card>

      <!-- Navigation with Enhanced Styling -->
      <v-list class="px-4">
        <v-list-item
          v-for="(item, index) in navbarConfig.navigationItems"
          :key="item.label"
          :title="item.label"
          :prepend-icon="`mdi-${index === 0 ? 'star-outline' : 'information-outline'}`"
          rounded="xl"
          class="mb-2 nav-item"
          variant="text"
          @click="handleNavigation(item)"
        >
          <template #append>
            <v-icon
              icon="mdi-chevron-right"
              size="small"
              class="text-medium-emphasis"
            />
          </template>
        </v-list-item>
      </v-list>

      <!-- Mobile Actions Footer -->
      <template #append>
        <v-card
          class="ma-4 pa-4"
          variant="outlined"
          rounded="xl"
        >
          <!-- Theme Selection -->
          <v-btn-toggle
            v-model="currentTheme"
            mandatory
            variant="outlined"
            divided
            rounded="pill"
            class="mb-4 w-100"
          >
            <v-btn
              value="light"
              prepend-icon="mdi-white-balance-sunny"
              @click="currentTheme === 'dark' && toggleTheme()"
            >
              Light
            </v-btn>
            <v-btn
              value="dark"
              prepend-icon="mdi-weather-night"
              @click="currentTheme === 'light' && toggleTheme()"
            >
              Dark
            </v-btn>
          </v-btn-toggle>

          <!-- Mobile CTA -->
          <v-btn
            v-if="navbarConfig.ctaButton"
            block
            :color="navbarConfig.ctaButton.color"
            variant="elevated"
            size="large"
            rounded="pill"
            prepend-icon="mdi-rocket-launch-outline"
            @click="handleCTAAction(navbarConfig.ctaButton)"
          >
            {{ navbarConfig.ctaButton.label }}
          </v-btn>
        </v-card>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
/* Floating Navbar Styles */
.floating-navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 95%;
  max-width: 1200px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.floating-navbar.scrolled {
  top: 10px;
  width: 90%;
  backdrop-filter: blur(25px);
  background: rgba(var(--v-theme-surface), 0.98) !important;
}

/* Logo Animation */
.logo-avatar {
  transition: all 0.3s ease;
}

.logo-avatar:hover {
  transform: scale(1.1);
}

/* Navigation Pills */
.nav-pill {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-pill:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateY(-2px);
}

.nav-pill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--v-theme-primary), 0.1),
    transparent
  );
  transition: left 0.5s;
}

.nav-pill:hover::before {
  left: 100%;
}

/* Staggered Animation */
.nav-delay-1 { animation-delay: 0.1s; }
.nav-delay-2 { animation-delay: 0.2s; }
.nav-delay-3 { animation-delay: 0.3s; }

/* Theme Toggle Enhancements */
.theme-toggle {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

/* CTA Button Enhancements */
.cta-button {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.8) 100%
  ) !important;
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.4);
}

/* Mobile Drawer Enhancements */
.mobile-drawer {
  backdrop-filter: blur(20px);
}

.nav-item {
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateX(8px);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .floating-navbar {
    width: 98%;
  }
}

@media (max-width: 768px) {
  .floating-navbar {
    top: 10px;
    width: 95%;
  }

  .floating-navbar.scrolled {
    top: 5px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .floating-navbar {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.v-theme--dark .floating-navbar.scrolled {
  background: rgba(var(--v-theme-surface), 0.95) !important;
}
</style>
