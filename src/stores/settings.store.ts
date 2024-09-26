// src/stores/settings.store.ts

import { defineStore } from 'pinia';
import { db } from '@/db';
import type { Settings } from '@/models/settings.model';

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    id: 1,
    // Removed API keys from the state
    theme: 'light', // Default theme setting
    // ... add other settings as needed
  }),
  actions: {
    async loadSettings() {
      const settings = await db.settings.get(1);
      if (settings) {
        this.$patch(settings);
      } else {
        // If no settings are stored, initialize with default settings
        await db.settings.add(this.$state);
      }
    },
    async saveSettings() {
      await db.settings.put(this.$state);
    },
  },
});
