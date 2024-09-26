<!-- src/components/AppSettings.vue -->

<template>
  <div class="settings-modal p-6 bg-white rounded-md shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Settings</h2>

    <!-- Other settings fields -->
    <!-- Example: Theme selection -->
    <div class="mb-4">
      <label for="theme" class="block text-sm font-medium text-gray-700 mb-1">Theme</label>
      <select
        id="theme"
        v-model="localSettings.theme"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <!-- Save Settings Button -->
    <div class="flex justify-end">
      <button
        @click="saveSettings"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings.store';
import { ref, watch } from 'vue';

const settingsStore = useSettingsStore();

// Create a local copy of the settings to allow canceling changes
const localSettings = ref({ ...settingsStore.$state });

// Watch for changes in the store and update local settings accordingly
watch(
  () => settingsStore.$state,
  (newSettings) => {
    localSettings.value = { ...newSettings };
  },
  { deep: true }
);

function saveSettings() {
  settingsStore.$patch(localSettings.value);
  settingsStore.saveSettings();
}
</script>

<style scoped>
.settings-modal {
  max-width: 500px;
  margin: 2rem auto;
}
</style>
