import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin AsyncStorage wrapper — every call is try/caught so a storage failure
 * degrades to "acts like first run" / "acts like nothing saved" instead of
 * crashing the app (SPEC.md Section 28).
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Non-fatal: the moment just won't be remembered next launch.
  }
}
