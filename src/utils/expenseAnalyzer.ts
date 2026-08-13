// expenseAnalyzer.ts - تحليل المصاريف واقتراح خطط توفير

import type { Expense } from '../types';

export interface SavingSuggestion {
  tag: string;
  currentAmount: number;
  suggestedCut: number;
  reason: string;
}

/** يجمع المصاريف حسب الوسم (categoryTag) للشهر الحالي */
export function groupByTag(expenses: Expense[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of expenses) {
    map[e.categoryTag] = (map[e.categoryTag] || 0) + e.amount;
  }
  return map;
}

/** أكثر التصنيفات إنفاقًا بين المصاريف غير الضرورية */
export function topDiscretionaryTags(expenses: Expense[], limit = 5) {
  const nonEssential = expenses.filter((e) => !e.isEssential);
  const grouped = groupByTag(nonEssential);
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, amount]) => ({ tag, amount }));
}

/**
 * يبني خطة توفير تصل إلى الهدف المطلوب بالاعتماد على المصاريف القابلة للتقليل والكمالية،
 * بدءًا بالأكبر قيمة والأقل ضرورة.
 */
export function buildSavingsPlan(expenses: Expense[], targetAmount: number): SavingSuggestion[] {
  const candidates = expenses
    .filter((e) => e.classification === 'كمالي' || e.classification === 'قابل_للتقليل')
    .sort((a, b) => b.amount - a.amount);

  const grouped: Record<string, { total: number; classification: string }> = {};
  for (const e of candidates) {
    if (!grouped[e.categoryTag]) grouped[e.categoryTag] = { total: 0, classification: e.classification };
    grouped[e.categoryTag].total += e.amount;
  }

  const sortedGroups = Object.entries(grouped).sort((a, b) => b[1].total - a[1].total);

  const plan: SavingSuggestion[] = [];
  let remaining = targetAmount;

  for (const [tag, info] of sortedGroups) {
    if (remaining <= 0) break;
    const isDiscretionary = info.classification === 'كمالي';
    // نقترح خفض 100% من الكماليات، و 30% فقط من "القابل للتقليل" حتى لا يشعر المستخدم بالحرمان
    const maxCut = isDiscretionary ? info.total : info.total * 0.3;
    const cut = Math.min(maxCut, remaining);
    if (cut <= 0) continue;
    plan.push({
      tag,
      currentAmount: info.total,
      suggestedCut: Math.round(cut),
      reason: isDiscretionary
        ? `يمكن تقليص "${tag}" لأنها مصروف كمالي`
        : `يمكن تقليص جزء من "${tag}" دون التأثير الكبير على نمط حياتك`,
    });
    remaining -= cut;
  }

  return plan;
}

/** رسالة تحليلية عن أكثر مصروف يحتاج انتباه هذا الشهر */
export function mostConcerningCategory(expenses: Expense[]): string | null {
  const top = topDiscretionaryTags(expenses, 1);
  return top.length > 0 ? top[0].tag : null;
}

/** مقارنة الإنفاق بين شهرين (بالمعرفات الشهرية بصيغة YYYY-MM) */
export function compareMonths(
  expenses: Expense[],
  currentMonthKey: string,
  previousMonthKey: string
): { current: number; previous: number; diffPercent: number } {
  const sumFor = (key: string) =>
    expenses.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);

  const current = sumFor(currentMonthKey);
  const previous = sumFor(previousMonthKey);
  const diffPercent = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

  return { current, previous, diffPercent };
}
