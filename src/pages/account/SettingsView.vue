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
      <v-col cols="12" lg="8">
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

          <!-- Notification Settings -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-bell-outline" class="mr-2" color="primary"></v-icon>
              Notification Preferences
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="userSettings.notifications.emailNotifications"
                    label="Email Notifications"
                    color="primary"
                    density="comfortable"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="userSettings.notifications.pushNotifications"
                    label="Push Notifications"
                    color="primary"
                    density="comfortable"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="userSettings.notifications.announcements"
                    label="Announcement Updates"
                    color="primary"
                    density="comfortable"
                  ></v-switch>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="userSettings.notifications.systemUpdates"
                    label="System Updates"
                    color="primary"
                    density="comfortable"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Preferences -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-tune" class="mr-2" color="primary"></v-icon>
              Application Preferences
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="userSettings.preferences.theme"
                    label="Theme"
                    :items="[
                      { title: 'Auto (System)', value: 'auto' },
                      { title: 'Light', value: 'light' },
                      { title: 'Dark', value: 'dark' }
                    ]"
                    prepend-inner-icon="mdi-palette"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="userSettings.preferences.language"
                    label="Language"
                    :items="[
                      { title: 'English', value: 'en' },
                      { title: 'Spanish', value: 'es' },
                      { title: 'French', value: 'fr' }
                    ]"
                    prepend-inner-icon="mdi-translate"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="userSettings.preferences.timezone"
                    label="Timezone"
                    :items="[
                      { title: 'UTC', value: 'UTC' },
                      { title: 'EST (UTC-5)', value: 'America/New_York' },
                      { title: 'PST (UTC-8)', value: 'America/Los_Angeles' },
                      { title: 'CET (UTC+1)', value: 'Europe/Paris' }
                    ]"
                    prepend-inner-icon="mdi-clock-outline"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Action Buttons -->
          <v-card elevation="2">
            <v-card-actions class="pa-4">
              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                prepend-icon="mdi-content-save"
                :loading="saving"
                class="mr-3"
              >
                Save Settings
              </v-btn>

              <v-btn
                color="secondary"
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="resetSettings"
                :disabled="saving"
              >
                Reset to Defaults
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-delete-forever"
                :disabled="saving"
              >
                Delete Account
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>

      <!-- Quick Info Sidebar -->
      <v-col cols="12" lg="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-information-outline" class="mr-2" color="info"></v-icon>
            Quick Info
          </v-card-title>
          <v-card-text>
            <v-list density="compact" class="pa-0">
              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Last Login</v-list-item-title>
                <v-list-item-subtitle>January 13, 2026</v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Account Created</v-list-item-title>
                <v-list-item-subtitle>January 1, 2026</v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Storage Used</v-list-item-title>
                <v-list-item-subtitle>2.3 GB of 10 GB</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
              density="compact"
            >
              <template v-slot:text>
                Your settings are automatically saved and synced across all devices.
              </template>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
		 </template>
	</inner-layout-wrapper>
</template>
