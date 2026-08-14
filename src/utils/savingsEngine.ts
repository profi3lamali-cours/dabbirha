// savingsEngine.ts - حسابات الأهداف والادخار

import type { Goal } from '../types';

export interface GoalProjection {
  remaining: number;
  progressPercent: number;
  suggestedMonthly: number;
  monthsToComplete: number;
}

/** يحسب تقدّم هدف معيّن، ويقترح مساهمة شهرية للوصول إليه خلال مدة معقولة (افتراضيًا 6 أشهر إن لم يُحدَّد) */
export function projectGoal(goal: Goal, defaultMonths = 6): GoalProjection {
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const progressPercent =
    goal.targetAmount > 0 ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;

  const suggestedMonthly =
    goal.monthlyContribution && goal.monthlyContribution > 0
      ? goal.monthlyContribution
      : Math.ceil(remaining / defaultMonths);

  const monthsToComplete = suggestedMonthly > 0 ? Math.ceil(remaining / suggestedMonthly) : 0;

  return { remaining, progressPercent, suggestedMonthly, monthsToComplete };
}

/** إجمالي الادخار الشهري المطلوب لكل الأهداف النشطة */
export function totalMonthlyGoalContributions(goals: Goal[]): number {
  return goals.reduce((sum, g) => {
    const { suggestedMonthly } = projectGoal(g);
    return sum + suggestedMonthly;
  }, 0);
}
