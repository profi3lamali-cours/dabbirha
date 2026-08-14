// financialScore.ts - مؤشر توجيهي للصحة المالية (ليس تصنيفًا رسميًا)

import type { BudgetBreakdown } from './budgetEngine';
import type { Goal } from '../types';
import { clampPercent } from './format';

export interface ScoreBreakdown {
  total: number; // من 100
  components: {
    label: string;
    score: number; // من 0 إلى الوزن
    weight: number;
  }[];
}

export function computeFinancialScore(
  breakdown: BudgetBreakdown,
  emergencyFund: { target: number; saved: number },
  goals: Goal[]
): ScoreBreakdown {
  const components: ScoreBreakdown['components'] = [];

  // 1) السيطرة على المصاريف (30 نقطة) - نسبة المتبقي من الدخل
  const spendControlRatio = breakdown.income > 0 ? breakdown.remaining / breakdown.income : 0;
  const spendControlScore = Math.round(clampPercent(spendControlRatio * 150) * 0.3 * (100 / 100));
  components.push({ label: 'السيطرة على المصاريف', score: Math.min(30, spendControlScore), weight: 30 });

  // 2) الادخار الفعلي (20 نقطة)
  const savingsRatio =
    breakdown.income > 0 ? breakdown.suggestedSavings / (breakdown.income * 0.15 || 1) : 0;
  components.push({
    label: 'الادخار',
    score: Math.min(20, Math.round(clampPercent(savingsRatio * 100) * 0.2)),
    weight: 20,
  });

  // 3) صندوق الطوارئ (20 نقطة)
  const efRatio = emergencyFund.target > 0 ? emergencyFund.saved / emergencyFund.target : 0;
  components.push({
    label: 'صندوق الطوارئ',
    score: Math.min(20, Math.round(clampPercent(efRatio * 100) * 0.2)),
    weight: 20,
  });

  // 4) نسبة المصاريف الكمالية من الدخل (15 نقطة) - الأقل أفضل
  const discretionaryRatio = breakdown.income > 0 ? breakdown.discretionary / breakdown.income : 0;
  const discretionaryScore = Math.max(0, 15 - Math.round(discretionaryRatio * 100 * 0.75));
  components.push({ label: 'التحكم بالكماليات', score: Math.min(15, discretionaryScore), weight: 15 });

  // 5) تقدم الأهداف (15 نقطة)
  const goalsProgress =
    goals.length > 0
      ? goals.reduce((sum, g) => sum + (g.targetAmount > 0 ? g.savedAmount / g.targetAmount : 0), 0) /
        goals.length
      : 0.5; // نقطة وسطية إذا لا توجد أهداف بعد
  components.push({
    label: 'تقدم الأهداف',
    score: Math.min(15, Math.round(clampPercent(goalsProgress * 100) * 0.15)),
    weight: 15,
  });

  const total = clampPercent(components.reduce((sum, c) => sum + c.score, 0));

  return { total, components };
}

export function scoreLabel(total: number): string {
  if (total >= 80) return 'وضع مالي جيد جدًا';
  if (total >= 60) return 'وضع مالي مستقر';
  if (total >= 40) return 'يحتاج بعض التحسين';
  return 'يحتاج انتباهًا عاجلاً';
}
