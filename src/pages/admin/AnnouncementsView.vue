<template>
  <InnerLayoutWrapper>
    <template #content>
      <div class="announcements-view">
    <!-- Page Header -->
    <v-container fluid class="pa-0">
      <v-row class="ma-0 mb-4">
        <v-col cols="12" class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Announcements Management</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Create, edit, and manage system announcements
              </p>
            </div>
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              New Announcement
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Stats Cards -->
    <v-container fluid class="pa-0">
      <v-row class="ma-0 mb-6">
        <v-col cols="12" sm="6" md="3" class="pa-2">
          <v-card class="pa-4 text-center" variant="tonal" color="primary">
            <v-icon icon="mdi-bullhorn" size="40" class="mb-2"></v-icon>
            <div class="text-h6 font-weight-bold">{{ announcementsStore.announcementsCount }}</div>
            <div class="text-caption">Total Announcements</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-2">
          <v-card class="pa-4 text-center" variant="tonal" color="success">
            <v-icon icon="mdi-image" size="40" class="mb-2"></v-icon>
            <div class="text-h6 font-weight-bold">{{ announcementsWithImages }}</div>
            <div class="text-caption">With Images</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-2">
          <v-card class="pa-4 text-center" variant="tonal" color="warning">
            <v-icon icon="mdi-text" size="40" class="mb-2"></v-icon>
            <div class="text-h6 font-weight-bold">{{ announcementsWithoutImages }}</div>
            <div class="text-caption">Text Only</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-2">
          <v-card class="pa-4 text-center" variant="tonal" color="info">
            <v-icon icon="mdi-clock-outline" size="40" class="mb-2"></v-icon>
            <div class="text-h6 font-weight-bold">{{ recentAnnouncements }}</div>
            <div class="text-caption">Recent (Last 10)</div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Search -->
    <v-container fluid class="pa-0">
      <v-row class="ma-0 mb-4">
        <v-col cols="12" class="pa-4">
          <v-card class="pa-4">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="searchQuery"
                  label="Search announcements by title or description"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  @click="clearSearch"
                  variant="outlined"
                  color="primary"
                  block
                  density="comfortable"
                >
                  Clear Search
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Announcements Table -->
    <v-container fluid class="pa-0">
      <v-row class="ma-0">
        <v-col cols="12" class="pa-4">
          <v-card>
            <v-data-table
              :headers="headers"
              :items="filteredAnnouncements"
              :loading="announcementsStore.isLoading"
              item-value="id"
              class="elevation-0"
            >
              <template v-slot:item.image_url="{ item }">
                <v-chip
                  :color="item.image_url ? 'success' : 'secondary'"
                  variant="tonal"
                  size="small"
                >
                  {{ item.image_url ? 'Yes' : 'No' }}
                </v-chip>
              </template>

              <template v-slot:item.description="{ item }">
                <div class="text-truncate" style="max-width: 300px;">
                  {{ item.description }}
                </div>
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-tooltip text="Edit">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-pencil"
                        size="small"
                        variant="text"
                        @click="editAnnouncement(item)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip text="Delete">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="deleteAnnouncement(item.id)"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>



    <!-- Error Alert -->
    <v-snackbar
      v-model="announcementsStore.hasError"
      color="error"
      timeout="5000"
      location="top"
    >
      {{ announcementsStore.error }}
      <template v-slot:actions>
        <v-btn @click="announcementsStore.clearError" variant="text" color="white">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Create/Edit Dialog Component -->
    <AnnouncementCreateEditDialog
      v-model="showDialog"
      :is-editing="isEditing"
      :announcement="currentAnnouncement"
      :loading="announcementsStore.isLoading"
      @save="handleSaveAnnouncement"
      @cancel="handleCancelDialog"
    />

    <!-- Delete Confirmation Dialog Component -->
    <AnnouncementDeleteConfirmationDialog
      v-model="showDeleteDialog"
      :loading="announcementsStore.isLoading"
      :announcement-title="announcementToDelete?.title || ''"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
      </div>
    </template>
  </InnerLayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnnouncementsDataStore } from '@/stores/announcementsData'
import { useAuthUserStore } from '@/stores/authUser'
import { useToast } from 'vue-toastification'
import type { AnnouncementType } from '@/stores/announcementsData'
import InnerLayoutWrapper from '@/layouts/InnerLayoutWrapper.vue'
import AnnouncementCreateEditDialog from './dialogs/AnnouncementCreateEditDialog.vue'
import AnnouncementDeleteConfirmationDialog from './dialogs/AnnouncementDeleteConfirmationDialog.vue'

// Stores
const announcementsStore = useAnnouncementsDataStore()
const authStore = useAuthUserStore()
const toast = useToast()

// Reactive state
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const deleteId = ref<number | undefined>(undefined)
const announcementToDelete = ref<AnnouncementType | undefined>(undefined)

const currentAnnouncement = ref<AnnouncementType | undefined>(undefined)

// Table headers
const headers = [
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Has Image', key: 'image_url', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: 100 }
]

// Form validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required'
}

// Computed properties
const filteredAnnouncements = computed(() => {
  return announcementsStore.searchAnnouncements(searchQuery.value)
})

const announcementsWithImages = computed(() => {
  return announcementsStore.getAnnouncementsWithImages.length
})

const announcementsWithoutImages = computed(() => {
  return announcementsStore.getAnnouncementsWithoutImages.length
})

const recentAnnouncements = computed(() => {
  return announcementsStore.getRecentAnnouncements(10).length
})

// Methods
const openCreateDialog = () => {
  isEditing.value = false
  currentAnnouncement.value = undefined
  showDialog.value = true
}

const editAnnouncement = (announcement: AnnouncementType) => {
  isEditing.value = true
  currentAnnouncement.value = announcement
  showDialog.value = true
}

const handleSaveAnnouncement = async (data: { id?: number; title: string; description: string; image_url: string }) => {
  try {
    if (isEditing.value && data.id) {
      // Update existing announcement
      const updateData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url || ''
      }

      const result = await announcementsStore.updateAnnouncement(data.id, updateData)

      if (result) {
        toast.success('Announcement updated successfully!')
        showDialog.value = false
      }
    } else {
      // Create new announcement
      const currentUser = await authStore.getCurrentUser()

      const createData = {
        title: data.title,
        description: data.description,
        image_url: data.image_url || '',
        user_id: currentUser?.user?.id || ''
      }

      const result = await announcementsStore.createAnnouncement(createData)

      if (result) {
        toast.success('Announcement created successfully!')
        showDialog.value = false
      }
    }
  } catch (error) {
    console.error('Error saving announcement:', error)
  }
}

const handleCancelDialog = () => {
  showDialog.value = false
  currentAnnouncement.value = undefined
}

const deleteAnnouncement = (id: number) => {
  // Find the announcement to delete for showing its title
  announcementToDelete.value = announcementsStore.announcements.find(a => a.id === id)
  deleteId.value = id
  showDeleteDialog.value = true
}

const handleConfirmDelete = async () => {
  if (deleteId.value !== undefined) {
    const success = await announcementsStore.deleteAnnouncement(deleteId.value)

    if (success) {
      toast.success('Announcement deleted successfully!')
      deleteId.value = undefined
      announcementToDelete.value = undefined
      showDeleteDialog.value = false
    }
  }
}

const handleCancelDelete = () => {
  deleteId.value = undefined
  announcementToDelete.value = undefined
  showDeleteDialog.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  await announcementsStore.fetchAnnouncements()
})
</script>

<style scoped>
.announcements-view {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.v-card {
  border-radius: 12px !important;
}

.v-chip {
  font-weight: 500;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
