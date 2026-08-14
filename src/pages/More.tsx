import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  HelpCircle,
  Sliders,
  CalendarClock,
  Sun,
  Moon,
  Download,
  Upload,
  Trash2,
  Info,
  ShieldQuestion,
  ChevronLeft,
  FlaskConical,
} from 'lucide-react';
import { exportAppDataAsJSON, importAppDataFromJSON } from '../utils/storage';
import { useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SocialFooter from '../components/SocialFooter';

export default function More() {
  const { data, setTheme, resetAllData, loadDemo, exitDemo, replaceAllData } = useAppData();
  const { showToast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleExport() {
    const json = exportAppDataAsJSON(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dabbirha-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير بياناتك بنجاح', '📤');
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importAppDataFromJSON(reader.result as string);
      if (result) {
        replaceAllData(result);
        showToast('تم استيراد بياناتك بنجاح', '📥');
      } else {
        showToast('لم نتمكن من قراءة هذا الملف', '⚠️');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="pb-28">
      <PageHeader title="المزيد" subtitle="الإعدادات والأدوات الإضافية" />

      <div className="px-5 space-y-3">
        <Section title="أدوات ذكية">
          <MenuLink to="/more/savings-plan" icon={<Sparkles size={18} />} label="ساعدني على التوفير" />
          <MenuLink to="/more/can-i-buy" icon={<HelpCircle size={18} />} label="هل أستطيع شراء هذا؟" />
          <MenuLink to="/more/simulator" icon={<Sliders size={18} />} label="ماذا لو؟ (محاكي الميزانية)" />
          <MenuLink to="/more/annual" icon={<CalendarClock size={18} />} label="المصاريف السنوية والموسمية" />
        </Section>

        <Section title="المظهر">
          <div className="card p-2 flex">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium ${
                data.theme === 'light' ? 'bg-ink-600 text-white' : 'text-ink-500'
              }`}
            >
              <Sun size={16} /> فاتح
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium ${
                data.theme === 'dark' ? 'bg-ink-600 text-white' : 'text-ink-500'
              }`}
            >
              <Moon size={16} /> داكن
            </button>
          </div>
        </Section>

        <Section title="البيانات والخصوصية">
          <p className="text-xs text-ink-400 px-1 mb-2">
            بياناتك المالية تبقى على جهازك في النسخة الحالية. لا يتم إرسال أي معلومة إلى خادم خارجي.
          </p>
          <button onClick={handleExport} className="card p-4 flex items-center gap-3 w-full text-right">
            <Download size={18} className="text-ink-500" />
            <span className="flex-1 text-sm font-medium">تصدير بياناتي (JSON)</span>
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="card p-4 flex items-center gap-3 w-full text-right"
          >
            <Upload size={18} className="text-ink-500" />
            <span className="flex-1 text-sm font-medium">استيراد بيانات</span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.target.value = '';
            }}
          />

          {data.isDemoMode ? (
            <button
              onClick={() => {
                exitDemo();
                showToast('تم حذف البيانات التجريبية', '🧹');
              }}
              className="card p-4 flex items-center gap-3 w-full text-right"
            >
              <FlaskConical size={18} className="text-ink-500" />
              <span className="flex-1 text-sm font-medium">إنهاء وضع التجربة وبدء ميزانيتي</span>
            </button>
          ) : (
            <button onClick={loadDemo} className="card p-4 flex items-center gap-3 w-full text-right">
              <FlaskConical size={18} className="text-ink-500" />
              <span className="flex-1 text-sm font-medium">تجربة التطبيق ببيانات تجريبية</span>
            </button>
          )}

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="card p-4 flex items-center gap-3 w-full text-right border-clay-500/30"
            >
              <Trash2 size={18} className="text-clay-600" />
              <span className="flex-1 text-sm font-medium text-clay-600">حذف جميع البيانات</span>
            </button>
          ) : (
            <div className="card p-4 border-clay-500/40 bg-clay-500/5">
              <p className="text-sm mb-3">هل أنت متأكد؟ سيتم حذف كل بياناتك المالية نهائيًا من هذا الجهاز.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    resetAllData();
                    setConfirmDelete(false);
                    showToast('تم حذف جميع البيانات', '🗑️');
                  }}
                  className="flex-1 bg-clay-600 text-white rounded-xl py-2.5 text-sm font-medium"
                >
                  حذف نهائيًا
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 btn-secondary py-2.5 text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="حول">
          <MenuLink to="/more/about" icon={<Info size={18} />} label="حول التطبيق" />
          <MenuLink to="/more/privacy" icon={<ShieldQuestion size={18} />} label="الخصوصية" />
        </Section>

        <SocialFooter />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-400 px-1 mb-2 mt-4">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function MenuLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="card p-4 flex items-center gap-3">
      <span className="text-ink-500">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronLeft size={16} className="text-ink-300" />
    </Link>
  );
}
