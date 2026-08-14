import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { buildSavingsPlan } from '../utils/expenseAnalyzer';
import { formatDZD } from '../utils/format';
import PageHeader from '../components/PageHeader';

export default function SavingsPlan() {
  const { data } = useAppData();
  const [target, setTarget] = useState('20000');
  const [plan, setPlan] = useState<ReturnType<typeof buildSavingsPlan> | null>(null);

  const monthKey = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(
    () => data.expenses.filter((e) => e.date.startsWith(monthKey)),
    [data.expenses, monthKey]
  );

  function generate() {
    const t = Number(target);
    if (t > 0) setPlan(buildSavingsPlan(monthlyExpenses, t));
  }

  const totalPlanned = plan?.reduce((s, p) => s + p.suggestedCut, 0) || 0;

  return (
    <div className="pb-28">
      <PageHeader title="ساعدني على التوفير" subtitle="خطة توفير مبنية على مصاريفك الفعلية" back />

      <div className="px-5 space-y-4">
        <div className="card p-5">
          <label className="block mb-3">
            <span className="text-sm text-ink-500 mb-1 block">أريد توفير</span>
            <div className="relative">
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="input-field num text-lg font-bold text-center"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm">دج</span>
            </div>
          </label>
          <button onClick={generate} className="btn-primary w-full">
            ✨ ساعدني على التوفير
          </button>
        </div>

        {plan && (
          <div className="card p-5">
            <p className="text-sm font-medium text-ink-500 mb-3">خطة التوفير المقترحة</p>
            {plan.length === 0 ? (
              <p className="text-sm text-ink-400">
                لا توجد مصاريف كافية قابلة للتقليل هذا الشهر للوصول إلى هذا الهدف. حاول تسجيل مصاريفك أولًا
                أو تقليل المبلغ المستهدف.
              </p>
            ) : (
              <>
                <ul className="space-y-3">
                  {plan.map((p) => (
                    <li key={p.tag} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{p.tag}</p>
                        <p className="text-xs text-ink-400">{p.reason}</p>
                      </div>
                      <span className="num font-bold text-ink-600 dark:text-sand-200 shrink-0">
                        -{formatDZD(p.suggestedCut)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 font-bold">
                  <span>المجموع</span>
                  <span className="num">{formatDZD(totalPlanned)}</span>
                </div>
                {totalPlanned < Number(target) && (
                  <p className="text-xs text-ink-400 mt-2">
                    لم نصل بالكامل إلى هدفك من المصاريف القابلة للتقليل الحالية؛ يمكنك أيضًا مراجعة
                    الاشتراكات الثابتة أو تقليل ميزانية الأسبوع القادم.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
