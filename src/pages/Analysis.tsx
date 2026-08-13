import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { computeBudget } from '../utils/budgetEngine';
import { computeFinancialScore, scoreLabel } from '../utils/financialScore';
import { compareMonths, mostConcerningCategory, topDiscretionaryTags } from '../utils/expenseAnalyzer';
import { formatDZD, ARABIC_MONTHS, currentMonthKey } from '../utils/format';
import { CATEGORY_META } from '../types';
import PageHeader from '../components/PageHeader';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function Analysis() {
  const { data } = useAppData();
  const now = new Date();
  const monthKey = currentMonthKey(now);
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = currentMonthKey(prevDate);

  const monthlyExpenses = useMemo(
    () => data.expenses.filter((e) => e.date.startsWith(monthKey)),
    [data.expenses, monthKey]
  );

  const budget = useMemo(
    () => computeBudget(data.profile, monthlyExpenses, data.annualExpenses),
    [data.profile, monthlyExpenses, data.annualExpenses]
  );

  const score = useMemo(
    () => computeFinancialScore(budget, data.emergencyFund, data.goals),
    [budget, data.emergencyFund, data.goals]
  );

  const pieData = (['ضروري', 'مهم', 'قابل_للتقليل', 'كمالي'] as const)
    .map((c) => ({
      name: CATEGORY_META[c].label,
      value:
        c === 'ضروري'
          ? budget.essential
          : c === 'مهم'
          ? budget.important
          : c === 'قابل_للتقليل'
          ? budget.reducible
          : budget.discretionary,
      color: CATEGORY_META[c].color,
    }))
    .filter((d) => d.value > 0);

  const comparison = compareMonths(data.expenses, monthKey, prevMonthKey);
  const concern = mostConcerningCategory(monthlyExpenses);
  const topTags = topDiscretionaryTags(monthlyExpenses, 5);

  const barData = topTags.map((t) => ({ name: t.tag, قيمة: t.amount }));

  const monthLabel = ARABIC_MONTHS[now.getMonth()];

  return (
    <div className="pb-28">
      <PageHeader title="التحليل" subtitle={`تقرير شهر ${monthLabel}`} />

      <div className="px-5 space-y-4">
        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">توزيع المصاريف</p>
          {pieData.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">لا توجد بيانات كافية بعد.</p>
          ) : (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatDZD(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d, i) => (
              <span key={i} className="text-xs flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {barData.length > 0 && (
          <div className="card p-5">
            <p className="text-sm font-medium text-ink-500 mb-3">أكثر مصاريف غير ضرورية</p>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatDZD(Number(v))} />
                  <Bar dataKey="قيمة" fill="#c1913f" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">مقارنة بالشهر السابق</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ink-400">هذا الشهر</p>
              <p className="font-bold num">{formatDZD(comparison.current)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">الشهر السابق</p>
              <p className="font-bold num">{formatDZD(comparison.previous)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">التغيّر</p>
              <p className={`font-bold num ${comparison.diffPercent > 0 ? 'text-clay-600' : 'text-ink-600'}`}>
                {comparison.diffPercent > 0 ? '+' : ''}
                {comparison.diffPercent}٪
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">تقرير شهر {monthLabel}</p>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span>الدخل</span><span className="num font-medium">{formatDZD(budget.income)}</span></li>
            <li className="flex justify-between"><span>المصروف</span><span className="num font-medium">{formatDZD(budget.totalSpent)}</span></li>
            <li className="flex justify-between"><span>الادخار المقترح</span><span className="num font-medium">{formatDZD(budget.suggestedSavings)}</span></li>
            <li className="flex justify-between"><span>المتبقي</span><span className="num font-medium">{formatDZD(budget.remaining)}</span></li>
          </ul>
          <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 space-y-2 text-sm">
            {concern && (
              <p>
                <span className="text-ink-400">أكثر مصروف يحتاج انتباه: </span>
                <span className="font-medium">{concern}</span>
              </p>
            )}
            <p>
              <span className="text-ink-400">اقتراح الشهر القادم: </span>
              <span className="font-medium">
                {budget.suggestedDiscretionary > 0
                  ? `يمكنك توفير حوالي ${formatDZD(Math.round(budget.suggestedDiscretionary * 0.2))} إضافية.`
                  : 'حاول ضبط المصاريف غير الضرورية هذا الشهر.'}
              </span>
            </p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink-500">مؤشر الصحة المالية</p>
            <span className="font-bold num">{score.total}/100</span>
          </div>
          <p className="text-xs text-ink-400 mb-3">{scoreLabel(score.total)} — مؤشر توجيهي وليس تصنيفًا رسميًا</p>
          <div className="space-y-2.5">
            {score.components.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{c.label}</span>
                  <span className="num text-ink-400">{c.score}/{c.weight}</span>
                </div>
                <div className="h-1.5 rounded-full bg-sand-100 dark:bg-ink-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ink-600"
                    style={{ width: `${(c.score / c.weight) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
