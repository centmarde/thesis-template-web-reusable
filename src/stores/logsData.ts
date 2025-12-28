import { computed, ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";


// Log types following the database schema
export type LogType = {
  id: number;
  created_at: string;
  title: string;
  version: string;
  description: string;
  type: string;
}

type LogsState = {
  logs: LogType[];
  loading: boolean;
  error: string;
}

export const useLogsDataStore = defineStore("logsData", () => {
  // States
  const logs: Ref<LogType[]> = ref([]);
  const loading = ref(false);
  const error: Ref<string> = ref("");


  // Computed properties
  const logsCount = computed(() => logs.value.length);
  const hasLogs = computed(() => logs.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== "");

  // Helper function to handle errors
  const handleError = (err: any, defaultMessage: string) => {
    const errorMessage = err?.message || defaultMessage;
    error.value = errorMessage;
  };

  // Clear error state
  const clearError = () => {
    error.value = "";
  };

  // Fetch all logs
  const fetchLogs = async () => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

        logs.value = data || [];
      } catch (err) {
        handleError(err, "Failed to fetch logs");
    } finally {
      loading.value = false;
    }
  };

  // Fetch logs by type
  const fetchLogsByType = async (logType: string) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("logs")
        .select("*")
        .eq("type", logType)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      logs.value = data || [];
    } catch (err) {
      handleError(err, `Failed to fetch logs of type "${logType}"`);
    } finally {
      loading.value = false;
    }
  };

  // Fetch logs by date range
  const fetchLogsByDateRange = async (startDate: string, endDate: string) => {
    loading.value = true;
    clearError();

    try {
      const { data, error: fetchError } = await supabase
        .from("logs")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      logs.value = data || [];

    } catch (err) {
      handleError(err, "Failed to fetch logs for the specified date range");
    } finally {
      loading.value = false;
    }
  };

  // Get logs by version
  const getLogsByVersion = computed(() => {
    return (version: string) => logs.value.filter(log => log.version === version);
  });

  // Get logs by type (computed filter)
  const getLogsByType = computed(() => {
    return (logType: string) => logs.value.filter(log => log.type === logType);
  });

  // Get recent logs (last N logs)
  const getRecentLogs = computed(() => {
    return (limit: number = 10) => logs.value.slice(0, limit);
  });

  // Search logs by title or description
  const searchLogs = computed(() => {
    return (searchTerm: string) => {
      if (!searchTerm.trim()) return logs.value;

      const term = searchTerm.toLowerCase();
      return logs.value.filter(log =>
        log.title.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term)
      );
    };
  });

  // Clear logs state
  const clearLogs = () => {
    logs.value = [];
    clearError();
  };

  // Reset store to initial state
  const resetStore = () => {
    logs.value = [];
    loading.value = false;
    error.value = "";
  };

  return {
    // State
    logs,
    loading,
    error,

    // Computed
    logsCount,
    hasLogs,
    isLoading,
    hasError,
    getLogsByVersion,
    getLogsByType,
    getRecentLogs,
    searchLogs,

    // Actions
    fetchLogs,
    fetchLogsByType,
    fetchLogsByDateRange,
    clearError,
    clearLogs,
    resetStore,
  };
});
