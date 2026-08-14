// annualExpenses.ts - حساب توزيع المصاريف السنوية على الأشهر

import type { AnnualExpense } from '../types';

/** الحصة الشهرية لمصروف سنوي واحد */
export function monthlyShare(item: AnnualExpense): number {
  return Math.round(item.yearlyAmount / 12);
}

/** إجمالي الحصص الشهرية لكل المصاريف السنوية */
export function totalMonthlyShare(items: AnnualExpense[]): number {
  return items.reduce((sum, i) => sum + monthlyShare(i), 0);
}

/** المصاريف السنوية القريبة الاستحقاق (خلال n يومًا) بناءً على شهر الاستحقاق */
export function upcomingAnnualExpenses(items: AnnualExpense[], withinDays = 30, today = new Date()) {
  return items.filter((item) => {
    if (!item.monthDue) return false;
    const dueDate = new Date(today.getFullYear(), item.monthDue - 1, 1);
    if (dueDate < today) dueDate.setFullYear(dueDate.getFullYear() + 1);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= withinDays;
  });
}
