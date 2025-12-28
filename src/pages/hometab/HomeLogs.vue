<script setup lang="ts">
import { onMounted, computed, ref, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLogsDataStore } from '@/stores/logsData'
import type { LogType } from '@/stores/logsData'

// Initialize logs store
const logsStore = useLogsDataStore()
const { logs, loading, error, logsCount, hasLogs, isLoading, hasError } = storeToRefs(logsStore)

// Lazy loading state
const displayedLogs = ref<LogType[]>([])
const loadCount = ref(5) // Initial load count
const hasMoreLogs = computed(() => displayedLogs.value.length < logs.value.length)
const logsContainer = ref<HTMLElement | null>(null)

// Load more logs function
const loadMoreLogs = () => {
  const currentLength = displayedLogs.value.length
  const nextBatch = logs.value.slice(currentLength, currentLength + loadCount.value)
  displayedLogs.value.push(...nextBatch)
}

// Initialize displayed logs when logs change
const initializeLogs = () => {
  displayedLogs.value = logs.value.slice(0, loadCount.value)
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get relative time
const getRelativeTime = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

// Get type color based on log type
const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'feature': 'success',
    'fix': 'error',
    'update': 'info'
  }
  return colors[type.toLowerCase()] || 'primary'
}

// Get type icon based on log type
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'feature': 'mdi-star-plus',
    'fix': 'mdi-wrench',
    'update': 'mdi-update'
  }
  return icons[type.toLowerCase()] || 'mdi-circle'
}

// Refresh logs data
const refreshLogs = async () => {
  await logsStore.fetchLogs()
  initializeLogs() // Reset to initial display
}

// Setup intersection observer for lazy loading
const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMoreLogs.value && !isLoading.value) {
          loadMoreLogs()
        }
      })
    },
    {
      rootMargin: '100px' // Load more when 100px before reaching the bottom
    }
  )

  const sentinel = document.querySelector('#load-more-sentinel')
  if (sentinel) {
    observer.observe(sentinel)
  }
}

// Fetch logs on component mount
onMounted(async () => {
  await logsStore.fetchLogs()
  initializeLogs()

  // Setup lazy loading after next tick
  nextTick(() => {
    setupIntersectionObserver()
  })
})

// Watch logs changes to update displayed logs
watch(logs, () => {
  initializeLogs()
}, { deep: true })
</script>

<template>

    <!-- Header Section -->
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon icon="mdi-text-box-outline" class="me-2" color="primary"></v-icon>
        <span>Logs Dashboard</span>
      </div>

      <div class="d-flex align-center ga-2">
        <v-chip
          :color="hasLogs ? 'primary' : 'secondary'"
          variant="tonal"
          size="small"
        >
          {{ logsCount }} logs
        </v-chip>

        <v-btn
          icon="mdi-refresh"
          variant="text"
          size="small"
          :loading="isLoading"
          @click="refreshLogs"
        ></v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Content Section -->
    <v-card-text class="pa-0">
      <!-- Error State -->
      <v-alert
        v-if="hasError"
        type="error"
        variant="tonal"
        class="ma-4 mb-0"
        closable
        @click:close="logsStore.clearError"
      >
        {{ error }}
      </v-alert>

      <!-- Loading State -->
      <div v-if="isLoading && !hasLogs" class="text-center pa-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="40"
        ></v-progress-circular>
        <div class="text-body-2 mt-4 text-medium-emphasis">Loading logs...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && !hasLogs && !hasError" class="text-center pa-8">
        <v-icon
          icon="mdi-text-box-outline"
          size="64"
          color="grey-lighten-1"
          class="mb-4"
        ></v-icon>
        <div class="text-h6 text-medium-emphasis mb-2">No logs available</div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          There are no logs to display at the moment.
        </div>
        <v-btn
          color="primary"
          variant="outlined"
          @click="refreshLogs"
        >
          <v-icon icon="mdi-refresh" start></v-icon>
          Refresh
        </v-btn>
      </div>

      <!-- Posts Layout (Facebook Style) -->
      <div v-else class="pa-4">
        <div class="mx-auto" style="max-width: 800px;">
          <div
            v-for="log in displayedLogs"
            :key="log.id"
            class="mb-4"
          >
            <!-- Facebook-style Post Card -->
            <v-card
              elevation="2"
              rounded="lg"
              class="w-100"
            >
              <!-- Post Header -->
              <v-card-title class="d-flex align-center justify-space-between pa-4 pb-3">
                <div class="d-flex align-center">
                  <v-avatar
                    size="40"
                    :color="getTypeColor(log.type)"
                    class="me-3"
                  >
                    <v-icon
                      :icon="getTypeIcon(log.type)"
                      color="white"
                      size="20"
                    ></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-medium">
                      {{ log.title }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ getRelativeTime(log.created_at) }} • v{{ log.version }}
                    </div>
                  </div>
                </div>

                <v-chip
                  :color="getTypeColor(log.type)"
                  size="small"
                  variant="tonal"
                >
                  {{ log.type }}
                </v-chip>
              </v-card-title>

              <!-- Post Content -->
              <v-card-text class="pa-4 pt-0">
                <div class="text-body-1 mb-3">
                  {{ log.description }}
                </div>
              </v-card-text>

              <!-- Post Footer -->
              <v-card-actions class="pa-4 pt-0">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center">


                  </div>

                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-calendar-clock"
                      size="16"
                      class="me-1 text-medium-emphasis"
                    ></v-icon>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatDate(log.created_at) }}
                    </span>
                  </div>
                </div>
              </v-card-actions>
            </v-card>
          </div>

          <!-- Load More Sentinel for Intersection Observer -->
          <div
            id="load-more-sentinel"
            v-if="hasMoreLogs"
            class="text-center py-4"
          >
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              color="primary"
              size="32"
            ></v-progress-circular>
            <div v-else class="text-body-2 text-medium-emphasis">
              Scroll to load more...
            </div>
          </div>

          <!-- End of Posts Message -->
          <div
            v-if="!hasMoreLogs && displayedLogs.length > 0"
            class="text-center py-4"
          >
            <v-icon
              icon="mdi-check-circle-outline"
              color="success"
              size="32"
              class="mb-2"
            ></v-icon>
            <div class="text-body-2 text-medium-emphasis">
              You've seen all {{ logsCount }} logs
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

</template>
