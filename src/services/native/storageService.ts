import { Preferences } from '@capacitor/preferences';

export const setStoredItem = async (key: string, value: string): Promise<void> => {
  try {
    await Preferences.set({ key, value });
  } catch {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to write to storage:', e);
    }
  }
};

export const getStoredItem = async (key: string): Promise<string | null> => {
  try {
    const { value } = await Preferences.get({ key });
    if (value !== null) return value;
  } catch {
    // fallback below
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const removeStoredItem = async (key: string): Promise<void> => {
  try {
    await Preferences.remove({ key });
  } catch {
    // fallback
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // ignored
  }
};

export const clearAllStorage = async (): Promise<void> => {
  try {
    await Preferences.clear();
  } catch {
    // fallback
  }
  try {
    localStorage.clear();
  } catch {
    // ignored
  }
};
