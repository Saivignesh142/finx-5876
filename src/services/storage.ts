import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language, ScanHistoryRecord, ThemePreference } from "../types/scam";

const HISTORY_KEY = "@finx/history/v1";
const LANGUAGE_KEY = "@finx/language/v1";
const THEME_KEY = "@finx/theme/v1";

export async function loadHistory(): Promise<ScanHistoryRecord[]> {
  const serialized = await AsyncStorage.getItem(HISTORY_KEY);
  if (!serialized) return [];
  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed) || !parsed.every(isHistoryRecord)) {
    throw new Error("Saved scan history has an invalid format.");
  }
  return parsed;
}

export async function saveHistory(records: ScanHistoryRecord[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function loadLanguage(): Promise<Language> {
  const value = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (value === "en" || value === "te") return value;
  return "en";
}

export async function saveLanguage(language: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
}

export async function loadTheme(): Promise<ThemePreference> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "light";
}

export async function saveTheme(theme: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, theme);
}

function isHistoryRecord(value: unknown): value is ScanHistoryRecord {
  if (!value || typeof value !== "object") return false;
  if (!("id" in value) || typeof value.id !== "string") return false;
  if (!("inputType" in value) || (value.inputType !== "message" && value.inputType !== "url" && value.inputType !== "transcript")) return false;
  if (!("score" in value) || typeof value.score !== "number" || value.score < 0 || value.score > 100) return false;
  if (!("level" in value) || (value.level !== "low" && value.level !== "medium" && value.level !== "high")) return false;
  if (!("explanation" in value) || typeof value.explanation !== "string") return false;
  if (!("method" in value) || (value.method !== "local-rules" && value.method !== "backend-rules")) return false;
  return "scannedAt" in value && typeof value.scannedAt === "string";
}