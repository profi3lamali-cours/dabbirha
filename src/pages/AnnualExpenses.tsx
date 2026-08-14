import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { monthlyShare, totalMonthlyShare } from '../utils/annualExpenses';
import { formatDZD } from '../utils/format';
import PageHeader from '../components/PageHeader';
import { Plus, Trash2 } from 'lucide-react';

const SEASONAL_PRESETS = ['رمضان', 'عيد الفطر', 'عيد الأضحى', 'الدخول المدرسي', 'الصيف', 'الشتاء', 'أعراس ومناسبات'];

export default function AnnualExpensesPage() {
  const {
    data,
    addAnnualExpense,
    deleteAnnualExpense,
    addSeasonalEvent,
    deleteSeasonalEvent,
  } = useAppData();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');

  const [seasonName, setSeasonName] = useState(SEASONAL_PRESETS[0]);
  const [seasonAmount, setSeasonAmount] = useState('');

  return (
    <div className="pb-28">
      <PageHeader title="المصاريف السنوية والموسمية" subtitle="خطط لها من الآن بدل أن تفاجئك" back />

      <div className="px-5 space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink-500">📅 المصاريف السنوية</p>
            <span className="text-xs text-ink-400">
              الحصة الشهرية: <span className="num font-medium">{formatDZD(totalMonthlyShare(data.annualExpenses))}</span>
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {data.annualExpenses.map((a) => (
              <div key={a.id} className="flex items-center gap-3 bg-sand-50 dark:bg-ink-950 rounded-xl px-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-ink-400 num">
                    {formatDZD(a.yearlyAmount)} سنويًا · {formatDZD(monthlyShare(a))} شهريًا
                  </p>
                </div>
                <button onClick={() => deleteAnnualExpense(a.id)} className="text-ink-300 hover:text-clay-600">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {data.annualExpenses.length === 0 && (
              <p className="text-sm text-ink-400">لم تُضف أي مصروف سنوي بعد.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المصروف" className="input-field" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ السنوي"
              className="input-field num"
            />
          </div>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-field mb-2">
            <option value="">شهر الاستحقاق (اختياري)</option>
            {['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
            disabled={!name.trim() || !(Number(amount) > 0)}
            onClick={() => {
              addAnnualExpense({ name: name.trim(), yearlyAmount: Number(amount), monthDue: month ? Number(month) : undefined });
              setName('');
              setAmount('');
              setMonth('');
            }}
          >
            <Plus size={16} /> إضافة مصروف سنوي
          </button>
        </div>

        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">🎉 مناسبات ومصاريف موسمية</p>
          <div className="space-y-2 mb-4">
            {data.seasonalEvents.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-sand-50 dark:bg-ink-950 rounded-xl px-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-ink-400 num">{formatDZD(s.expectedAmount)}</p>
                </div>
                <button onClick={() => deleteSeasonalEvent(s.id)} className="text-ink-300 hover:text-clay-600">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={seasonName} onChange={(e) => setSeasonName(e.target.value)} className="input-field">
              {SEASONAL_PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="number"
              value={seasonAmount}
              onChange={(e) => setSeasonAmount(e.target.value)}
              placeholder="المبلغ المتوقع"
              className="input-field num"
            />
          </div>
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
            disabled={!(Number(seasonAmount) > 0)}
            onClick={() => {
              addSeasonalEvent({ name: seasonName, expectedAmount: Number(seasonAmount) });
              setSeasonAmount('');
            }}
          >
            <Plus size={16} /> إضافة مناسبة
          </button>
        </div>
      </div>
    </div>
  );
}
