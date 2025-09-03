<template>
  <v-app>
    <!-- Outer Navbar -->
    <OuterNavbar :config="data?.ui" />


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
  import OuterNavbar from '@/components/common/OuterNavbar.vue'
  import { useLandingController } from '@/controller/landingController'

  const { data, fetchLandingData } = useLandingController()

  onMounted(async () => {
    await fetchLandingData()
  })
</script>

<style scoped>
  /* Layout-specific styles can be added here */
</style>
