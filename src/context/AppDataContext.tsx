import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppData, Expense, Goal, AnnualExpense, HouseholdProfile, SeasonalEvent } from '../types';
import { loadAppData, saveAppData, clearAppData, generateId, emptyAppData } from '../utils/storage';
import { buildDemoData } from '../data/demoData';

interface AppDataContextValue {
  data: AppData;
  updateProfile: (profile: Partial<HouseholdProfile>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addAnnualExpense: (item: Omit<AnnualExpense, 'id'>) => void;
  deleteAnnualExpense: (id: string) => void;
  addSeasonalEvent: (item: Omit<SeasonalEvent, 'id'>) => void;
  deleteSeasonalEvent: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setEmergencyFund: (target: number, saved: number) => void;
  loadDemo: () => void;
  exitDemo: () => void;
  resetAllData: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  replaceAllData: (data: AppData) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.theme === 'dark');
  }, [data.theme]);

  const updateProfile = useCallback((profile: Partial<HouseholdProfile>) => {
    setData((d) => ({ ...d, profile: { ...d.profile, ...profile } }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setData((d) => ({ ...d, expenses: [{ ...expense, id: generateId() }, ...d.expenses] }));
  }, []);

  const updateExpense = useCallback((id: string, patch: Partial<Expense>) => {
    setData((d) => ({
      ...d,
      expenses: d.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
  }, []);

  const addAnnualExpense = useCallback((item: Omit<AnnualExpense, 'id'>) => {
    setData((d) => ({ ...d, annualExpenses: [...d.annualExpenses, { ...item, id: generateId() }] }));
  }, []);

  const deleteAnnualExpense = useCallback((id: string) => {
    setData((d) => ({ ...d, annualExpenses: d.annualExpenses.filter((a) => a.id !== id) }));
  }, []);

  const addSeasonalEvent = useCallback((item: Omit<SeasonalEvent, 'id'>) => {
    setData((d) => ({ ...d, seasonalEvents: [...d.seasonalEvents, { ...item, id: generateId() }] }));
  }, []);

  const deleteSeasonalEvent = useCallback((id: string) => {
    setData((d) => ({ ...d, seasonalEvents: d.seasonalEvents.filter((s) => s.id !== id) }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setData((d) => ({
      ...d,
      goals: [...d.goals, { ...goal, id: generateId(), createdAt: new Date().toISOString() }],
    }));
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setData((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }, []);

  const setEmergencyFund = useCallback((target: number, saved: number) => {
    setData((d) => ({ ...d, emergencyFund: { target, saved } }));
  }, []);

  const loadDemo = useCallback(() => {
    setData(buildDemoData());
  }, []);

  const exitDemo = useCallback(() => {
    setData({ ...structuredClone(emptyAppData), theme: data.theme });
  }, [data.theme]);

  const resetAllData = useCallback(() => {
    clearAppData();
    setData(structuredClone(emptyAppData));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setData((d) => ({ ...d, theme }));
  }, []);

  const replaceAllData = useCallback((newData: AppData) => {
    setData(newData);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        data,
        updateProfile,
        addExpense,
        updateExpense,
        deleteExpense,
        addAnnualExpense,
        deleteAnnualExpense,
        addSeasonalEvent,
        deleteSeasonalEvent,
        addGoal,
        updateGoal,
        deleteGoal,
        setEmergencyFund,
        loadDemo,
        exitDemo,
        resetAllData,
        setTheme,
        replaceAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
