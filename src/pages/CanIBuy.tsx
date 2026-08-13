import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { computeBudget, impactOfNewPurchase } from '../utils/budgetEngine';
import { totalMonthlyGoalContributions } from '../utils/savingsEngine';
import { formatDZD } from '../utils/format';
import PageHeader from '../components/PageHeader';

export default function CanIBuy() {
  const { data } = useAppData();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<ReturnType<typeof impactOfNewPurchase> | null>(null);

  const monthKey = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(
    () => data.expenses.filter((e) => e.date.startsWith(monthKey)),
    [data.expenses, monthKey]
  );
  const budget = useMemo(
    () => computeBudget(data.profile, monthlyExpenses, data.annualExpenses),
    [data.profile, monthlyExpenses, data.annualExpenses]
  );
  const monthlySavingsTarget = totalMonthlyGoalContributions(data.goals) || budget.suggestedSavings;

  function check() {
    const p = Number(price);
    if (p > 0) {
      setResult(impactOfNewPurchase(p, budget, monthlySavingsTarget));
    }
  }

  const verdictMeta = {
    ok: { emoji: '🟢', label: 'يمكنك الشراء', color: 'text-ink-700 dark:text-sand-100' },
    caution: { emoji: '🟠', label: 'يمكنك الشراء لكن سيؤثر على هدفك', color: 'text-sand-600' },
    risky: { emoji: '🔴', label: 'لا ننصح بالشراء حاليًا', color: 'text-clay-600' },
  } as const;

  return (
    <div className="pb-28">
      <PageHeader title="هل أستطيع شراء هذا؟" subtitle="قرار شراء مدروس بناءً على ميزانيتك" back />

      <div className="px-5 space-y-4">
        <div className="card p-5 space-y-3">
          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">اسم المنتج</span>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="مثال: هاتف، أثاث، ملابس..."
              className="input-field"
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">السعر (دج)</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="يرجى إدخال مبلغ صحيح"
              className="input-field num"
            />
          </label>
          <button disabled={!(Number(price) > 0)} onClick={check} className="btn-primary w-full">
            تحقّق
          </button>
        </div>

        {result && (
          <div className="card p-5">
            <p className={`text-lg font-bold ${verdictMeta[result.verdict].color}`}>
              {verdictMeta[result.verdict].emoji} {verdictMeta[result.verdict].label}
            </p>
            {productName && <p className="text-sm text-ink-400 mt-1">لـ "{productName}"</p>}

            <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800 space-y-1 text-sm">
              <p>
                المتبقي بعد الشراء: <span className="num font-medium">{formatDZD(result.newRemaining)}</span>
              </p>
              {result.monthsToRecover > 0 && (
                <p>
                  ستحتاج تقريبًا <span className="num font-medium">{result.monthsToRecover}</span> أشهر
                  لتعويض الفرق من ادخارك الشهري.
                </p>
              )}
            </div>

            {result.verdict !== 'ok' && (
              <div className="mt-4 pt-4 border-t border-ink-100 dark:border-ink-800">
                <p className="text-sm font-medium mb-2">بدائل مقترحة:</p>
                <ul className="text-sm text-ink-500 space-y-1 list-disc pr-4">
                  <li>الانتظار حتى الشهر القادم</li>
                  <li>الادخار التدريجي لهذا المنتج كهدف مستقل</li>
                  <li>تقليص مصروف كمالي آخر هذا الشهر لتعويض الفرق</li>
                  <li>البحث عن منتج مماثل بسعر أقل</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
