// أنواع البيانات الأساسية لتطبيق "دبّرها"

export type ExpenseCategory =
  | 'ضروري'
  | 'مهم'
  | 'قابل_للتقليل'
  | 'كمالي';

export const CATEGORY_META: Record<ExpenseCategory, { label: string; emoji: string; color: string }> = {
  ضروري: { label: 'ضروري', emoji: '🔴', color: '#b8543a' },
  مهم: { label: 'مهم وقابل للتحسين', emoji: '🟠', color: '#c1913f' },
  قابل_للتقليل: { label: 'قابل للتقليل', emoji: '🟡', color: '#d1a75c' },
  كمالي: { label: 'كمالي', emoji: '🟢', color: '#3d6f60' },
};

export type PaymentMethod = 'نقدًا' | 'بطاقة' | 'تحويل' | 'أخرى';

export interface Expense {
  id: string;
  amount: number; // دج
  categoryTag: string; // e.g. "كهرباء", "مطاعم"
  classification: ExpenseCategory;
  description?: string;
  date: string; // ISO date
  paymentMethod: PaymentMethod;
  isEssential: boolean;
  notes?: string;
  isFixed?: boolean; // مصروف ثابت شهري
}

export interface AnnualExpense {
  id: string;
  name: string;
  yearlyAmount: number;
  monthDue?: number; // 1-12, optional
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
  monthlyContribution?: number;
}

export type HousingStatus = 'ملك' | 'إيجار' | 'سكن_عائلي' | 'أخرى';

export interface HouseholdProfile {
  monthlyIncome: number;
  householdType: 'شخص_واحد' | 'زوجان' | 'أسرة';
  numChildren: number;
  numMembers: number;
  housingStatus: HousingStatus;
  rentAmount?: number;
  hasCar: boolean;
  carFuel?: number;
  carMaintenance?: number;
  carInsurance?: number;
  carAnnualExpenses?: number;
  onboardingComplete: boolean;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  expectedAmount: number;
  month?: number;
}

export interface AppData {
  profile: HouseholdProfile;
  expenses: Expense[];
  annualExpenses: AnnualExpense[];
  seasonalEvents: SeasonalEvent[];
  goals: Goal[];
  emergencyFund: { target: number; saved: number };
  isDemoMode: boolean;
  theme: 'light' | 'dark';
  facebookUrl: string;
}
