
<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUser'
import { useToast } from 'vue-toastification'
import InnerLayoutWrapper from '@/layouts/InnerLayoutWrapper.vue'
import HomeLogs from '@/pages/hometab/HomeLogs.vue'

const authStore = useAuthUserStore()
const toast = useToast()

// Reactive references from the auth store
const { userName, loading } = storeToRefs(authStore)

const handleLogout = async () => {
  try {
    const result = await authStore.signOut()

    if (result.error) {
      toast.error('Logout failed: ' + result.error.message)
    } else {
      toast.success('You have been logged out successfully')
    }
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('An unexpected error occurred during logout')
  }
}
</script>

<template>
  <InnerLayoutWrapper>
    <template #content>
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" md="12" lg="12">
            <HomeLogs />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </InnerLayoutWrapper>
</template>

