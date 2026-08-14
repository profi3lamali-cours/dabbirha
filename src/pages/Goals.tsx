import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { projectGoal } from '../utils/savingsEngine';
import { formatDZD } from '../utils/format';
import { Plus, X, Trash2, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Goals() {
  const { data, addGoal, updateGoal, deleteGoal, setEmergencyFund } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [efEditing, setEfEditing] = useState(false);
  const [efTarget, setEfTarget] = useState(data.emergencyFund.target.toString());
  const [efSaved, setEfSaved] = useState(data.emergencyFund.saved.toString());

  return (
    <div className="pb-28">
      <PageHeader
        title="أهدافي"
        subtitle="خطط للمستقبل بخطوات واضحة"
        action={
          <button
            onClick={() => setShowForm(true)}
            className="w-10 h-10 rounded-full bg-ink-600 text-white flex items-center justify-center shadow-soft"
            aria-label="إضافة هدف"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5 space-y-4">
        {/* صندوق الطوارئ */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-ink-600 dark:text-sand-200" />
            <h3 className="font-bold">🚨 صندوق الطوارئ</h3>
          </div>
          {efEditing ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">الهدف (دج)</span>
                <input
                  type="number"
                  value={efTarget}
                  onChange={(e) => setEfTarget(e.target.value)}
                  className="input-field num"
                />
              </label>
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">المُدَّخر حاليًا (دج)</span>
                <input
                  type="number"
                  value={efSaved}
                  onChange={(e) => setEfSaved(e.target.value)}
                  className="input-field num"
                />
              </label>
              <button
                className="btn-primary w-full"
                onClick={() => {
                  setEmergencyFund(Number(efTarget) || 0, Number(efSaved) || 0);
                  setEfEditing(false);
                }}
              >
                حفظ
              </button>
            </div>
          ) : (
            <>
              <ProgressRow
                saved={data.emergencyFund.saved}
                target={data.emergencyFund.target}
                onEdit={() => setEfEditing(true)}
              />
            </>
          )}
        </div>

        {/* الأهداف */}
        {data.goals.length === 0 && (
          <p className="text-center text-ink-400 py-8 text-sm">لا توجد أهداف بعد. أضف هدفك الأول.</p>
        )}

        {data.goals.map((g) => {
          const proj = projectGoal(g);
          return (
            <div key={g.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold">🎯 {g.name}</h3>
                <button
                  onClick={() => deleteGoal(g.id)}
                  aria-label="حذف الهدف"
                  className="text-ink-300 hover:text-clay-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <ProgressRow
                saved={g.savedAmount}
                target={g.targetAmount}
                onAdd={(amount) => updateGoal(g.id, { savedAmount: g.savedAmount + amount })}
              />
              {proj.remaining > 0 && (
                <p className="text-sm text-ink-400 mt-3">
                  اقترح ادخار <span className="num font-medium">{formatDZD(proj.suggestedMonthly)}</span>{' '}
                  شهريًا للوصول للهدف خلال {proj.monthsToComplete} أشهر تقريبًا.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <AddGoalSheet
          onClose={() => setShowForm(false)}
          onSave={(name, target) => {
            addGoal({ name, targetAmount: target, savedAmount: 0 });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProgressRow({
  saved,
  target,
  onEdit,
  onAdd,
}: {
  saved: number;
  target: number;
  onEdit?: () => void;
  onAdd?: (amount: number) => void;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  const [addAmount, setAddAmount] = useState('');
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="num">{formatDZD(saved)}</span>
        <span className="text-ink-400 num">من {formatDZD(target)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-sand-200 dark:bg-ink-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-l from-ink-500 to-ink-700 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-ink-400">{pct}٪ مكتمل</span>
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-ink-500 underline">
            تعديل
          </button>
        )}
      </div>
      {onAdd && (
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="أضف مبلغًا مُدَّخرًا"
            className="input-field num flex-1 py-2"
          />
          <button
            onClick={() => {
              if (Number(addAmount) > 0) {
                onAdd(Number(addAmount));
                setAddAmount('');
              }
            }}
            className="btn-secondary px-4 py-2 text-sm"
          >
            إضافة
          </button>
        </div>
      )}
    </div>
  );
}

function AddGoalSheet({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (name: string, target: number) => void;
}) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const valid = name.trim().length > 0 && Number(target) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" role="dialog" aria-modal>
      <div className="w-full max-w-lg bg-white dark:bg-ink-900 rounded-t-2xl p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">هدف جديد</h2>
          <button onClick={onClose} aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">اسم الهدف</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: هاتف جديد، السفر، تجهيز المنزل..."
              className="input-field"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-500 mb-1 block">المبلغ المطلوب (دج)</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="input-field num"
            />
          </label>
          <button disabled={!valid} onClick={() => onSave(name.trim(), Number(target))} className="btn-primary w-full">
            إضافة الهدف
          </button>
        </div>
      </div>
    </div>
  );
}
