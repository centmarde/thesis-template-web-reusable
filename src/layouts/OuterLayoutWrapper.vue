<template>
  <v-app>
    <!-- Dynamic Navbar Selection -->
    <OuterNavbar
      v-if="data?.ui?.navbarComponent === '1'"
      :config="data?.ui"
    />
    <OuterNavbar2
      v-else-if="data?.ui?.navbarComponent === '2'"
      :config="data?.ui"
    />
    <OuterNavbar3
      v-else-if="data?.ui?.navbarComponent === '3'"
      :config="data?.ui"
    />
    <OuterNavbar4
      v-else-if="data?.ui?.navbarComponent === '4'"
      :config="data?.ui"
    />

    <v-main>
      <slot name="content"></slot>
    </v-main>

    <!-- Outer Footer -->
    <OuterFooter :config="data?.ui" />
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import OuterFooter from '@/components/common/OuterFooter.vue'
  import OuterNavbar from '@/components/common/outerNavbars/OuterNavbar.vue'
  import OuterNavbar2 from '@/components/common/outerNavbars/OuterNavbar2.vue'
  import OuterNavbar3 from '@/components/common/outerNavbars/OuterNavbar3.vue'
  import OuterNavbar4 from '@/components/common/outerNavbars/OuterNavbar4.vue'
  import { useLandingController } from '@/controller/landingController'

  const { data, fetchLandingData } = useLandingController()

  onMounted(async () => {
    await fetchLandingData()
  })
</script>

<style scoped>
  /* Layout-specific styles can be added here */
</style>
