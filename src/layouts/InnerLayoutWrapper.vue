<template>
  <v-app>
    <!-- Dynamic Navbar Selection -->
    <InnerNavbar
      v-if="data?.ui?.navbarComponent === '1'"
      :config="data?.ui"
    />


    <v-main>
      <slot name="content"></slot>
    </v-main>

    <!-- Dynamic Footer Selection -->
    <InnerFooter
      v-if="data?.ui?.footerComponent === '1'"
      :config="data?.ui"
    />
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'


  import { useLandingController } from '@/controller/landingController'

  const { data, fetchLandingData } = useLandingController()

  onMounted(async () => {
    await fetchLandingData()
  })
</script>

<style scoped>
  /* Layout-specific styles can be added here */
</style>
