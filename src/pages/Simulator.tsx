import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { computeBudget, simulateScenario } from '../utils/budgetEngine';
import { formatDZD, daysRemainingInMonth } from '../utils/format';
import PageHeader from '../components/PageHeader';
import { AlertTriangle } from 'lucide-react';

const SCENARIOS = [
  { id: 'income_up', label: 'زاد الراتب 10,000 دج', incomeChange: 10000 },
  { id: 'income_down', label: 'انخفض الراتب 10,000 دج', incomeChange: -10000 },
  { id: 'cancel_sub', label: 'ألغيت اشتراكًا بـ 2,000 دج', expenseChange: -2000 },
  { id: 'electricity_up', label: 'زادت فاتورة الكهرباء 1,500 دج', expenseChange: 1500 },
  { id: 'stop_restaurants', label: 'توقفت عن المطاعم (وفّرت 8,000 دج)', expenseChange: -8000 },
  { id: 'phone_purchase', label: 'اشتريت هاتفًا بـ 40,000 دج', expenseChange: 40000 },
  { id: 'unexpected', label: 'دفعت مصروفًا مفاجئًا 5,000 دج', expenseChange: 5000 },
];

export default function Simulator() {
  const { data } = useAppData();
  const [selected, setSelected] = useState<string | null>(null);

  const monthKey = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(
    () => data.expenses.filter((e) => e.date.startsWith(monthKey)),
    [data.expenses, monthKey]
  );

  const base = useMemo(
    () => computeBudget(data.profile, monthlyExpenses, data.annualExpenses),
    [data.profile, monthlyExpenses, data.annualExpenses]
  );

  const scenario = SCENARIOS.find((s) => s.id === selected);
  const result = scenario
    ? simulateScenario(base, { incomeChange: scenario.incomeChange, expenseChange: scenario.expenseChange })
    : null;

  const daysLeft = daysRemainingInMonth();
  const inCrisis = base.remaining < base.income * 0.05 && daysLeft <= 10;

  return (
    <div className="pb-28">
      <PageHeader title="ماذا لو؟" subtitle="جرّب تأثير قرار مالي قبل اتخاذه" back />

      <div className="px-5 space-y-4">
        {inCrisis && (
          <div className="card p-4 border-clay-500/40 bg-clay-500/5 flex items-start gap-3">
            <AlertTriangle className="text-clay-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-clay-700 dark:text-clay-400 text-sm mb-1">🚨 خطة نهاية الشهر</p>
              <p className="text-sm">
                باقي {daysLeft} أيام والمتبقي {formatDZD(Math.max(0, base.remaining))}. الحد اليومي الآمن
                المقترح: <span className="num font-medium">{formatDZD(base.dailyBudgetRemaining)}</span>.
                حاول تأجيل أي مصروف غير ضروري وتجنّب الشراء العشوائي حتى نهاية الشهر.
              </p>
            </div>
          </div>
        )}

        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">اختر سيناريو</p>
          <div className="space-y-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full text-right rounded-xl px-4 py-3 text-sm font-medium border transition-colors ${
                  selected === s.id
                    ? 'bg-ink-600 text-white border-ink-600'
                    : 'bg-white dark:bg-ink-950 border-ink-200 dark:border-ink-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="card p-5">
            <p className="text-sm font-medium text-ink-500 mb-3">التأثير على ميزانيتك</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-ink-400 mb-1">قبل</p>
                <p className="font-bold num">{formatDZD(base.remaining)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-1">بعد</p>
                <p className={`font-bold num ${result.remaining < 0 ? 'text-clay-600' : 'text-ink-700 dark:text-sand-100'}`}>
                  {formatDZD(result.remaining)}
                </p>
              </div>
            </div>
            <p className="text-sm text-ink-400 mt-4">
              {result.remaining < 0
                ? 'هذا القرار سيجعل ميزانيتك في العجز هذا الشهر. يُفضّل التأجيل أو تعويضه من مكان آخر.'
                : 'ميزانيتك ستبقى في وضع آمن مع هذا القرار.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
