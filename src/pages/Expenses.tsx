import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import type { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { CATEGORY_META } from '../types';
import { formatDZD } from '../utils/format';
import { Plus, Search, X, Trash2, Pencil, PartyPopper } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const CATEGORIES: ExpenseCategory[] = ['ضروري', 'مهم', 'قابل_للتقليل', 'كمالي'];
const PAYMENTS: PaymentMethod[] = ['نقدًا', 'بطاقة', 'تحويل', 'أخرى'];

export default function Expenses() {
  const { data, addExpense, updateExpense, deleteExpense } = useAppData();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState<ExpenseCategory | 'الكل'>('الكل');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    return data.expenses
      .filter((e) => (filterCat === 'الكل' ? true : e.classification === filterCat))
      .filter(
        (e) =>
          !query ||
          e.categoryTag.includes(query) ||
          (e.description || '').includes(query)
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [data.expenses, filterCat, query]);

  function handleDeleteLuxury(e: Expense) {
    deleteExpense(e.id);
    showToast(`وفرت ${formatDZD(e.amount)}`, '🎉');
  }

  return (
    <div className="pb-28">
      <PageHeader
        title="المصاريف"
        subtitle={`${data.expenses.length} عملية مسجّلة`}
        action={
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="w-10 h-10 rounded-full bg-ink-600 text-white flex items-center justify-center shadow-soft"
            aria-label="إضافة مصروف"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث في المصاريف..."
            className="input-field pr-10"
            aria-label="بحث في المصاريف"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {(['الكل', ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                filterCat === c
                  ? 'bg-ink-600 text-white border-ink-600'
                  : 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-700 text-ink-600 dark:text-sand-200'
              }`}
            >
              {c === 'الكل' ? 'الكل' : `${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`}
            </button>
          ))}
        </div>

        <div className="space-y-2 mt-2">
          {filtered.length === 0 && (
            <p className="text-center text-ink-400 py-10 text-sm">لا توجد مصاريف مطابقة.</p>
          )}
          {filtered.map((e) => (
            <div key={e.id} className="card p-4 flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_META[e.classification].color }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{e.categoryTag}</p>
                <p className="text-xs text-ink-400">
                  {e.date} · {e.paymentMethod} · {CATEGORY_META[e.classification].label}
                </p>
              </div>
              <p className="font-bold num shrink-0">{formatDZD(e.amount)}</p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditing(e);
                    setShowForm(true);
                  }}
                  aria-label="تعديل"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:bg-sand-100 dark:hover:bg-ink-800"
                >
                  <Pencil size={15} />
                </button>
                {e.classification === 'كمالي' ? (
                  <button
                    onClick={() => handleDeleteLuxury(e)}
                    aria-label="حذفها والتوفير"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-sand-100 dark:hover:bg-ink-800"
                    title="حذفها"
                  >
                    <PartyPopper size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => deleteExpense(e.id)}
                    aria-label="حذف"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:bg-sand-100 dark:hover:bg-ink-800"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <ExpenseFormSheet
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={(payload) => {
            if (editing) updateExpense(editing.id, payload);
            else addExpense(payload);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ExpenseFormSheet({
  initial,
  onClose,
  onSave,
}: {
  initial: Expense | null;
  onClose: () => void;
  onSave: (payload: Omit<Expense, 'id'>) => void;
}) {
  const [amount, setAmount] = useState(initial?.amount?.toString() || '');
  const [tag, setTag] = useState(initial?.categoryTag || '');
  const [classification, setClassification] = useState<ExpenseCategory>(
    initial?.classification || 'ضروري'
  );
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial?.paymentMethod || 'نقدًا');
  const [notes, setNotes] = useState(initial?.notes || '');

  const valid = Number(amount) > 0 && tag.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" role="dialog" aria-modal>
      <div className="w-full max-w-lg bg-white dark:bg-ink-900 rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{initial ? 'تعديل المصروف' : 'إضافة مصروف'}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="w-8 h-8 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">المبلغ (دج)</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field num text-lg font-bold"
              placeholder="يرجى إدخال مبلغ صحيح"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">الوصف / الفئة</span>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="input-field"
              placeholder="مثال: مطاعم، كهرباء، مدرسة..."
            />
          </label>

          <div>
            <span className="text-sm text-ink-500 mb-2 block">التصنيف</span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setClassification(c)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition-colors text-right ${
                    classification === c
                      ? 'bg-ink-600 text-white border-ink-600'
                      : 'bg-white dark:bg-ink-950 border-ink-200 dark:border-ink-700'
                  }`}
                >
                  {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-ink-500 mb-1 block">التاريخ</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="text-sm text-ink-500 mb-1 block">طريقة الدفع</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="input-field"
              >
                {PAYMENTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">ملاحظات (اختياري)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none"
              rows={2}
            />
          </label>

          <button
            disabled={!valid}
            onClick={() =>
              onSave({
                amount: Number(amount),
                categoryTag: tag.trim(),
                classification,
                description: tag.trim(),
                date,
                paymentMethod,
                isEssential: classification === 'ضروري' || classification === 'مهم',
                notes,
              })
            }
            className="btn-primary w-full mt-2"
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
