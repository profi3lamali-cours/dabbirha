// محرك الميزانية - budgetEngine.ts
// هذا الملف يحتوي على المنطق الأساسي لتحليل الدخل والمصاريف وبناء خطة الميزانية.
// عدّل النسب والقواعد هنا لتطوير الخوارزمية مستقبلًا.

import type { AnnualExpense, Expense, HouseholdProfile } from '../types';
import { daysRemainingInMonth, daysInCurrentMonth } from './format';

export interface BudgetBreakdown {
  income: number;
  essential: number;
  important: number;
  reducible: number;
  discretionary: number;
  fixedTotal: number;
  annualMonthlyShare: number;
  totalSpent: number;
  remaining: number;
  suggestedSavings: number;
  suggestedEmergencyFund: number;
  suggestedDiscretionary: number;
  dailyBudgetRemaining: number;
  weeklyBudgetRemaining: number;
}

/** حصة شهرية من مجموع المصاريف السنوية */
export function monthlyShareOfAnnualExpenses(annual: AnnualExpense[]): number {
  const total = annual.reduce((sum, a) => sum + (a.yearlyAmount || 0), 0);
  return total / 12;
}

/** المصاريف الثابتة المشتقة من ملف الأسرة (سكن + سيارة) */
export function fixedHouseholdCosts(profile: HouseholdProfile): number {
  let total = 0;
  if (profile.housingStatus === 'إيجار') total += profile.rentAmount || 0;
  if (profile.hasCar) {
    total += (profile.carFuel || 0) + (profile.carMaintenance || 0) + (profile.carInsurance || 0);
  }
  return total;
}

/** تصنيف مجموع المصاريف الشهرية حسب النوع */
export function classifyMonthlyExpenses(expenses: Expense[]) {
  const buckets = { ضروري: 0, مهم: 0, قابل_للتقليل: 0, كمالي: 0 };
  for (const e of expenses) {
    buckets[e.classification] += e.amount;
  }
  return buckets;
}

/**
 * الوظيفة الرئيسية: تحسب توزيع الميزانية الكاملة بناءً على الدخل والمصاريف الحالية.
 * القاعدة: لا نسب ثابتة عمياء - نطرح الالتزامات الحقيقية أولًا ثم نوزّع المتبقي بذكاء.
 */
export function computeBudget(
  profile: HouseholdProfile,
  expenses: Expense[],
  annualExpenses: AnnualExpense[]
): BudgetBreakdown {
  const income = profile.monthlyIncome || 0;
  const buckets = classifyMonthlyExpenses(expenses);
  const fixedTotal = fixedHouseholdCosts(profile);
  const annualMonthlyShare = monthlyShareOfAnnualExpenses(annualExpenses);

  const totalSpent = buckets.ضروري + buckets.مهم + buckets.قابل_للتقليل + buckets.كمالي;
  const remaining = income - totalSpent - annualMonthlyShare;

  // بعد تغطية الضروريات والمهمّات والحصة السنوية، وزّع المتبقي:
  // أولوية: صندوق الطوارئ 10% ثم الادخار 15% ثم الباقي حر (كمالي/ترفيه)
  const afterEssentials = Math.max(
    0,
    income - buckets.ضروري - buckets.مهم - annualMonthlyShare
  );

  const suggestedEmergencyFund = Math.max(0, Math.round(afterEssentials * 0.1));
  const suggestedSavings = Math.max(0, Math.round(afterEssentials * 0.15));
  const suggestedDiscretionary = Math.max(
    0,
    Math.round(afterEssentials - suggestedEmergencyFund - suggestedSavings)
  );

  const daysLeft = daysRemainingInMonth();
  const daysTotal = daysInCurrentMonth();
  // نحسب الميزانية اليومية بناءً على المتبقي الفعلي بعد خصم المصاريف الضرورية القادمة المتوقعة
  // تقدير تقريبي: نفترض أن باقي المصاريف الضرورية لهذا الشهر ستتوزع بالتناسب مع الأيام المتبقية
  const projectedRemainingEssential = (buckets.ضروري / daysTotal) * daysLeft * 0.15; // هامش احتياط بسيط
  const safeRemaining = Math.max(0, remaining - projectedRemainingEssential);

  const dailyBudgetRemaining = daysLeft > 0 ? Math.round(safeRemaining / daysLeft) : 0;
  const weeklyBudgetRemaining = Math.round(dailyBudgetRemaining * 7);

  return {
    income,
    essential: buckets.ضروري,
    important: buckets.مهم,
    reducible: buckets.قابل_للتقليل,
    discretionary: buckets.كمالي,
    fixedTotal,
    annualMonthlyShare,
    totalSpent,
    remaining,
    suggestedSavings,
    suggestedEmergencyFund,
    suggestedDiscretionary,
    dailyBudgetRemaining,
    weeklyBudgetRemaining,
  };
}

/** تأثير حذف مصروف كمالي واحد على الميزانية */
export function impactOfRemovingExpense(amount: number, breakdown: BudgetBreakdown): BudgetBreakdown {
  return {
    ...breakdown,
    discretionary: Math.max(0, breakdown.discretionary - amount),
    totalSpent: breakdown.totalSpent - amount,
    remaining: breakdown.remaining + amount,
  };
}

/** تأثير شراء جديد (مصروف مستقبلي لمرة واحدة) على المتبقي والأهداف */
export function impactOfNewPurchase(
  price: number,
  breakdown: BudgetBreakdown,
  monthlySavingsTarget: number
): { verdict: 'ok' | 'caution' | 'risky'; monthsToRecover: number; newRemaining: number } {
  const newRemaining = breakdown.remaining - price;
  let verdict: 'ok' | 'caution' | 'risky' = 'ok';

  if (price <= breakdown.remaining * 0.5) verdict = 'ok';
  else if (price <= breakdown.remaining) verdict = 'caution';
  else verdict = 'risky';

  const monthsToRecover =
    monthlySavingsTarget > 0 ? Math.ceil(Math.abs(Math.min(0, newRemaining)) / monthlySavingsTarget) : 0;

  return { verdict, monthsToRecover, newRemaining };
}

/** محاكي "ماذا لو؟" - يطبّق تغييرًا افتراضيًا على الدخل أو مصروف معيّن */
export function simulateScenario(
  breakdown: BudgetBreakdown,
  change: { incomeChange?: number; expenseChange?: number }
): BudgetBreakdown {
  const newIncome = breakdown.income + (change.incomeChange || 0);
  const deltaExpense = change.expenseChange || 0;
  return {
    ...breakdown,
    income: newIncome,
    totalSpent: breakdown.totalSpent + deltaExpense,
    remaining: breakdown.remaining + (change.incomeChange || 0) - deltaExpense,
  };
}
