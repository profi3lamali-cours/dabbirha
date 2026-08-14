// storage.ts - حفظ واسترجاع البيانات من LocalStorage (بدون أي إرسال للخادم)

import type { AppData } from '../types';

const STORAGE_KEY = 'dabbirha_app_data_v1';

export const emptyAppData: AppData = {
  profile: {
    monthlyIncome: 0,
    householdType: 'أسرة',
    numChildren: 0,
    numMembers: 1,
    housingStatus: 'ملك',
    hasCar: false,
    onboardingComplete: false,
  },
  expenses: [],
  annualExpenses: [],
  seasonalEvents: [],
  goals: [],
  emergencyFund: { target: 0, saved: 0 },
  isDemoMode: false,
  theme: 'light',
  facebookUrl: '',
};

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(emptyAppData);
    const parsed = JSON.parse(raw);
    // دمج مع القيم الافتراضية لتجنّب كسر التطبيق عند إضافة حقول جديدة مستقبلًا
    return { ...structuredClone(emptyAppData), ...parsed };
  } catch {
    return structuredClone(emptyAppData);
  }
}

export function saveAppData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function exportAppDataAsJSON(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importAppDataFromJSON(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json);
    return { ...structuredClone(emptyAppData), ...parsed };
  } catch {
    return null;
  }
}

export function clearAppData() {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
