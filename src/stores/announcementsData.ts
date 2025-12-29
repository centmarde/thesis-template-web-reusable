import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

// Announcement types following the database schema
export type AnnouncementType = {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  image_url: string;
  description: string;
}

type CreateAnnouncementData = {
  title: string;
  description: string;
  image_url?: string;
  user_id?: string;
}

type UpdateAnnouncementData = {
  title?: string;
  description?: string;
  image_url?: string;
}

export const useAnnouncementsDataStore = defineStore("announcementsData", () => {
  // States
  const announcements: Ref<AnnouncementType[]> = ref([]);
  const currentAnnouncement: Ref<AnnouncementType | undefined> = ref(undefined);
  const loading = ref(false);
  const error: Ref<string> = ref("");

  // Computed properties
  const announcementsCount = computed(() => announcements.value.length);
  const hasAnnouncements = computed(() => announcements.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== "");

  // Helper function to handle errors
  const handleError = (err: unknown, defaultMessage: string) => {
    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    error.value = errorMessage;
  };

  // Clear error state
  const clearError = () => {
    error.value = "";
  };

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      announcements.value = data || [];
    } catch (err) {
      handleError(err, "Failed to fetch announcements");
    } finally {
      loading.value = false;
    }
  };

  // Fetch announcement by ID
  const fetchAnnouncementById = async (id: number) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      currentAnnouncement.value = data;
      return data;
    } catch (err) {
      handleError(err, `Failed to fetch announcement with ID ${id}`);
      return undefined;
    } finally {
      loading.value = false;
    }
  };

  // Fetch announcements by user ID
  const fetchAnnouncementsByUserId = async (userId: string) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("announcements")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      announcements.value = data || [];
    } catch (err) {
      handleError(err, `Failed to fetch announcements for user ${userId}`);
    } finally {
      loading.value = false;
    }
  };

  // Create new announcement
  const createAnnouncement = async (announcementData: CreateAnnouncementData) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: createError } = await supabase
        .from("announcements")
        .insert([announcementData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Add to local state
      announcements.value.unshift(data);
      return data;
    } catch (err) {
      handleError(err, "Failed to create announcement");
      return undefined;
    } finally {
      loading.value = false;
    }
  };

  // Update announcement
  const updateAnnouncement = async (id: number, updateData: UpdateAnnouncementData) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: updateError } = await supabase
        .from("announcements")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      const index = announcements.value.findIndex(announcement => announcement.id === id);
      if (index !== -1) {
        announcements.value[index] = data;
      }

      // Update current announcement if it's the same one
      if (currentAnnouncement.value?.id === id) {
        currentAnnouncement.value = data;
      }

      return data;
    } catch (err) {
      handleError(err, `Failed to update announcement with ID ${id}`);
      return undefined;
    } finally {
      loading.value = false;
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (id: number) => {
    loading.value = true;
    clearError();

    try {
      const { error: deleteError } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove from local state
      announcements.value = announcements.value.filter(announcement => announcement.id !== id);

      // Clear current announcement if it's the deleted one
      if (currentAnnouncement.value?.id === id) {
        currentAnnouncement.value = undefined;
      }

      return true;
    } catch (err) {
      handleError(err, `Failed to delete announcement with ID ${id}`);
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Search announcements by title or description
  const searchAnnouncements = computed(() => {
    return (searchTerm: string) => {
      if (!searchTerm.trim()) return announcements.value;

      const term = searchTerm.toLowerCase();
      return announcements.value.filter(announcement =>
        announcement.title.toLowerCase().includes(term) ||
        announcement.description.toLowerCase().includes(term)
      );
    };
  });

  // Get recent announcements (last N announcements)
  const getRecentAnnouncements = computed(() => {
    return (limit: number = 10) => announcements.value.slice(0, limit);
  });

  // Get announcements by specific user
  const getAnnouncementsByUser = computed(() => {
    return (userId: string) => announcements.value.filter(announcement => announcement.user_id === userId);
  });

  // Get announcements with images
  const getAnnouncementsWithImages = computed(() => {
    return announcements.value.filter(announcement => announcement.image_url && announcement.image_url.trim() !== '');
  });

  // Get announcements without images
  const getAnnouncementsWithoutImages = computed(() => {
    return announcements.value.filter(announcement => !announcement.image_url || announcement.image_url.trim() === '');
  });

  // Clear announcements state
  const clearAnnouncements = () => {
    announcements.value = [];
    currentAnnouncement.value = undefined;
    clearError();
  };

  // Clear current announcement
  const clearCurrentAnnouncement = () => {
    currentAnnouncement.value = undefined;
  };

  // Reset store to initial state
  const resetStore = () => {
    announcements.value = [];
    currentAnnouncement.value = undefined;
    loading.value = false;
    error.value = "";
  };

  return {
    // State
    announcements,
    currentAnnouncement,
    loading,
    error,

    // Computed
    announcementsCount,
    hasAnnouncements,
    isLoading,
    hasError,
    searchAnnouncements,
    getRecentAnnouncements,
    getAnnouncementsByUser,
    getAnnouncementsWithImages,
    getAnnouncementsWithoutImages,

    // Actions
    fetchAnnouncements,
    fetchAnnouncementById,
    fetchAnnouncementsByUserId,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    clearError,
    clearAnnouncements,
    clearCurrentAnnouncement,
    resetStore,
  };
});
