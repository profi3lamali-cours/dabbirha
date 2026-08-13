import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { computeBudget } from '../utils/budgetEngine';
import { computeFinancialScore, scoreLabel } from '../utils/financialScore';
import { formatDZD } from '../utils/format';
import { CATEGORY_META } from '../types';
import { Sparkles, TrendingDown, HelpCircle, Sliders, ChevronLeft, PiggyBank } from 'lucide-react';
import SocialFooter from '../components/SocialFooter';
import { APP_CONFIG } from '../config';

export default function Home() {
  const { data } = useAppData();
  const { profile, expenses, annualExpenses, emergencyFund, goals } = data;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(thisMonth)),
    [expenses, thisMonth]
  );

  const budget = useMemo(
    () => computeBudget(profile, monthlyExpenses, annualExpenses),
    [profile, monthlyExpenses, annualExpenses]
  );

  const score = useMemo(
    () => computeFinancialScore(budget, emergencyFund, goals),
    [budget, emergencyFund, goals]
  );

  const scorePercent = score.total;
  const remainingPositive = budget.remaining >= 0;

  return (
    <div className="pb-24">
      <div className="px-5 pt-8 pb-4">
        <p className="text-sm text-ink-400">{APP_CONFIG.appTagline}</p>
        <h1 className="text-2xl font-extrabold mt-1 flex items-center gap-2">
          {APP_CONFIG.appName} <span aria-hidden>🇩🇿</span>
        </h1>
      </div>

      <div className="px-5 space-y-4">
        {/* بطاقة الدخل والمتبقي */}
        <div className="card p-5">
          <p className="text-sm text-ink-400 mb-1">دخلك هذا الشهر</p>
          <p className="text-3xl font-extrabold num">{formatDZD(budget.income)}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100 dark:border-ink-800">
            <div>
              <p className="text-sm text-ink-400 mb-1">المتبقي</p>
              <p
                className={`text-xl font-bold num ${
                  remainingPositive ? 'text-ink-600 dark:text-sand-200' : 'text-clay-600'
                }`}
              >
                {formatDZD(budget.remaining)}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-ink-400 mb-1">الميزانية الأسبوعية</p>
              <p className="text-xl font-bold num">{formatDZD(budget.weeklyBudgetRemaining)}</p>
            </div>
          </div>
        </div>

        {/* الصحة المالية */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-ink-500">صحتك المالية</p>
            <span className="text-xs text-ink-300">مؤشر توجيهي</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-extrabold num shrink-0">{scorePercent}<span className="text-base text-ink-300">/100</span></div>
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-sand-200 dark:bg-ink-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-ink-500 to-ink-700 transition-all duration-500"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <p className="text-xs text-ink-400 mt-1.5">{scoreLabel(scorePercent)}</p>
            </div>
          </div>
        </div>

        {/* إجراءات سريعة */}
        <div className="grid grid-cols-2 gap-3">
          <QuickAction to="/more/savings-plan" icon={<Sparkles size={20} />} label="ساعدني على التوفير" />
          <QuickAction to="/more/can-i-buy" icon={<HelpCircle size={20} />} label="هل أستطيع شراء هذا؟" />
          <QuickAction to="/more/simulator" icon={<Sliders size={20} />} label="ماذا لو؟" />
          <QuickAction to="/goals" icon={<PiggyBank size={20} />} label="أهدافي" />
        </div>

        {/* توزيع المصاريف */}
        <div className="card p-5">
          <p className="text-sm font-medium text-ink-500 mb-3">توزيع مصاريف هذا الشهر</p>
          <div className="space-y-2.5">
            {(['ضروري', 'مهم', 'قابل_للتقليل', 'كمالي'] as const).map((cat) => {
              const amount =
                cat === 'ضروري'
                  ? budget.essential
                  : cat === 'مهم'
                  ? budget.important
                  : cat === 'قابل_للتقليل'
                  ? budget.reducible
                  : budget.discretionary;
              const pct = budget.totalSpent > 0 ? (amount / budget.totalSpent) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>
                      {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                    </span>
                    <span className="num text-ink-500">{formatDZD(amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-sand-100 dark:bg-ink-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORY_META[cat].color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {monthlyExpenses.length === 0 && (
            <p className="text-sm text-ink-400 mt-3">لم تسجّل أي مصروف هذا الشهر بعد.</p>
          )}
        </div>

        {!remainingPositive && (
          <div className="card p-4 border-clay-500/30 bg-clay-500/5 flex items-start gap-3">
            <TrendingDown className="text-clay-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-clay-700 dark:text-clay-400 text-sm">
                مصاريفك تجاوزت دخلك هذا الشهر
              </p>
              <Link
                to="/more/simulator"
                className="text-sm text-ink-600 dark:text-sand-200 underline flex items-center gap-1 mt-1"
              >
                جرّب خطة "أنقذني هذا الشهر" <ChevronLeft size={14} />
              </Link>
            </div>
          </div>
        )}

        <SocialFooter />
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="card p-4 flex flex-col items-start gap-2 hover:shadow-card transition-shadow active:scale-[0.98]"
    >
      <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-sand-200 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-sm font-medium leading-snug">{label}</span>
    </Link>
  );
}
