import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import type { HousingStatus } from '../types';
import { Wallet, Users, Home as HomeIcon, Car, ListChecks, Target, Check } from 'lucide-react';

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const { updateProfile, addExpense, loadDemo } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [income, setIncome] = useState('');
  const [householdType, setHouseholdType] = useState<'شخص_واحد' | 'زوجان' | 'أسرة'>('أسرة');
  const [numChildren, setNumChildren] = useState('0');
  const [numMembers, setNumMembers] = useState('1');
  const [housing, setHousing] = useState<HousingStatus>('ملك');
  const [rent, setRent] = useState('');
  const [hasCar, setHasCar] = useState<boolean | null>(null);
  const [carFuel, setCarFuel] = useState('');
  const [carMaintenance, setCarMaintenance] = useState('');
  const [carInsurance, setCarInsurance] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState<{ tag: string; amount: string }[]>([
    { tag: 'كهرباء وغاز', amount: '' },
    { tag: 'ماء', amount: '' },
    { tag: 'إنترنت وهاتف', amount: '' },
  ]);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else finish();
  }
  function back() {
    if (step > 1) setStep(step - 1);
  }

  function finish() {
    updateProfile({
      monthlyIncome: Number(income) || 0,
      householdType,
      numChildren: Number(numChildren) || 0,
      numMembers: Number(numMembers) || 1,
      housingStatus: housing,
      rentAmount: housing === 'إيجار' ? Number(rent) || 0 : undefined,
      hasCar: !!hasCar,
      carFuel: hasCar ? Number(carFuel) || 0 : undefined,
      carMaintenance: hasCar ? Number(carMaintenance) || 0 : undefined,
      carInsurance: hasCar ? Number(carInsurance) || 0 : undefined,
      onboardingComplete: true,
    });

    const today = new Date().toISOString().slice(0, 10);
    if (housing === 'إيجار' && Number(rent) > 0) {
      addExpense({
        amount: Number(rent),
        categoryTag: 'إيجار',
        classification: 'ضروري',
        date: today,
        paymentMethod: 'تحويل',
        isEssential: true,
        isFixed: true,
      });
    }
    fixedExpenses.forEach((f) => {
      const amt = Number(f.amount);
      if (amt > 0) {
        addExpense({
          amount: amt,
          categoryTag: f.tag,
          classification: 'ضروري',
          date: today,
          paymentMethod: 'نقدًا',
          isEssential: true,
          isFixed: true,
        });
      }
    });

    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-ink-950 flex flex-col">
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink-500">الخطوة {step} من {TOTAL_STEPS}</span>
          <button onClick={loadDemo} className="text-sm text-ink-400 underline">
            تجربة ببيانات تجريبية
          </button>
        </div>
        <div className="h-2 rounded-full bg-sand-200 dark:bg-ink-800 overflow-hidden">
          <div
            className="h-full bg-ink-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 pb-8 overflow-y-auto">
        {step === 1 && (
          <StepShell icon={<Wallet />} title="كم دخلك الشهري؟" subtitle="سنستخدمه لبناء خطة ميزانية واقعية">
            <label className="block">
              <span className="sr-only">الدخل الشهري بالدينار</span>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="مثال: 120000"
                  className="input-field text-2xl font-bold text-center num"
                  autoFocus
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm">دج</span>
              </div>
            </label>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell icon={<Users />} title="من يعيش معك؟" subtitle="لنفهم احتياجات أسرتك">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['شخص_واحد', 'زوجان', 'أسرة'] as const).map((t) => (
                <ChoiceButton
                  key={t}
                  selected={householdType === t}
                  onClick={() => setHouseholdType(t)}
                  label={t === 'شخص_واحد' ? 'شخص واحد' : t === 'زوجان' ? 'زوجان' : 'أسرة'}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">عدد أفراد الأسرة</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={numMembers}
                  onChange={(e) => setNumMembers(e.target.value)}
                  className="input-field num"
                />
              </label>
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">عدد الأطفال</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={numChildren}
                  onChange={(e) => setNumChildren(e.target.value)}
                  className="input-field num"
                />
              </label>
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell icon={<HomeIcon />} title="السكن" subtitle="اختر وضعك السكني الحالي">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['ملك', 'إيجار', 'سكن_عائلي', 'أخرى'] as HousingStatus[]).map((h) => (
                <ChoiceButton
                  key={h}
                  selected={housing === h}
                  onClick={() => setHousing(h)}
                  label={h === 'سكن_عائلي' ? 'سكن عائلي' : h}
                />
              ))}
            </div>
            {housing === 'إيجار' && (
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">مبلغ الإيجار الشهري</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  placeholder="بالدينار"
                  className="input-field num"
                />
              </label>
            )}
          </StepShell>
        )}

        {step === 4 && (
          <StepShell icon={<Car />} title="هل لديك سيارة؟" subtitle="لحساب مصاريف الوقود والصيانة">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <ChoiceButton selected={hasCar === true} onClick={() => setHasCar(true)} label="نعم" />
              <ChoiceButton selected={hasCar === false} onClick={() => setHasCar(false)} label="لا" />
            </div>
            {hasCar && (
              <div className="grid grid-cols-1 gap-3">
                <NumField label="الوقود شهريًا" value={carFuel} onChange={setCarFuel} />
                <NumField label="الصيانة شهريًا" value={carMaintenance} onChange={setCarMaintenance} />
                <NumField label="التأمين شهريًا" value={carInsurance} onChange={setCarInsurance} />
              </div>
            )}
          </StepShell>
        )}

        {step === 5 && (
          <StepShell icon={<ListChecks />} title="مصاريفك الثابتة" subtitle="أدخل التقديرات الشهرية (يمكن تخطيها)">
            <div className="space-y-3">
              {fixedExpenses.map((f, idx) => (
                <NumField
                  key={f.tag}
                  label={f.tag}
                  value={f.amount}
                  onChange={(v) =>
                    setFixedExpenses((arr) => arr.map((x, i) => (i === idx ? { ...x, amount: v } : x)))
                  }
                />
              ))}
            </div>
          </StepShell>
        )}

        {step === 6 && (
          <StepShell icon={<Target />} title="هدفك المالي الأول" subtitle="يمكنك إضافة أهداف أخرى لاحقًا">
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-ink-500 mb-1 block">اسم الهدف</span>
                <input
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="مثال: صندوق الطوارئ، هاتف جديد..."
                  className="input-field"
                />
              </label>
              <NumField label="المبلغ المطلوب" value={goalAmount} onChange={setGoalAmount} />
            </div>
          </StepShell>
        )}
      </div>

      <div className="px-5 pb-8 pt-2 flex gap-3">
        {step > 1 && (
          <button onClick={back} className="btn-secondary flex-1">
            السابق
          </button>
        )}
        <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {step === TOTAL_STEPS ? (
            <>
              <Check size={18} /> إنهاء الإعداد
            </>
          ) : (
            'التالي'
          )}
        </button>
      </div>
    </div>
  );
}

function StepShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-sand-200 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-ink-400 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-sm font-medium border transition-colors ${
        selected
          ? 'bg-ink-600 text-white border-ink-600'
          : 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-700 text-ink-700 dark:text-sand-200'
      }`}
    >
      {label}
    </button>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink-500 mb-1 block">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="بالدينار"
        className="input-field num"
      />
    </label>
  );
}
