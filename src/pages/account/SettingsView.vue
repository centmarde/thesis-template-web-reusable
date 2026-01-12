<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import InnerLayoutWrapper from '@/layouts/InnerLayoutWrapper.vue'

const toast = useToast()

// Form state
const userSettings = ref({
  displayName: '',
  email: '',
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    announcements: true,
    systemUpdates: false
  },
  preferences: {
    theme: 'auto',
    language: 'en',
    timezone: 'UTC'
  }
})

// Loading states
const loading = ref(false)
const saving = ref(false)

// Methods
const saveSettings = async () => {
  try {
    saving.value = true
    // TODO: Implement actual save logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

    toast.success('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.error('Failed to save settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const resetSettings = () => {
  // Reset to default values
  userSettings.value = {
    displayName: '',
    email: '',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      announcements: true,
      systemUpdates: false
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: 'UTC'
    }
  }
  toast.info('Settings reset to defaults')
}
</script>

<template>
	<inner-layout-wrapper>
		 <template #content>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <!-- Page Header -->
        <div class="d-flex align-center mb-6">
          <v-icon icon="mdi-cog-outline" class="mr-3" size="large" color="primary"></v-icon>
          <div>
            <h1 class="text-h4 font-weight-bold">Account Settings</h1>
            <p class="text-subtitle-1 text-medium-emphasis ma-0">
              Manage your account preferences and notifications
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="12">
        <v-form @submit.prevent="saveSettings">
          <!-- Profile Information -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-account-circle" class="mr-2" color="primary"></v-icon>
              Profile Information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userSettings.displayName"
                    label="Display Name"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userSettings.email"
                    label="Email Address"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    density="comfortable"
                    type="email"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>




        </v-form>
      </v-col>


    </v-row>
  </v-container>
		 </template>
	</inner-layout-wrapper>
</template>
