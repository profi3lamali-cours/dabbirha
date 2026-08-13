import PageHeader from '../components/PageHeader';

export default function Privacy() {
  return (
    <div className="pb-28">
      <PageHeader title="الخصوصية" back />
      <div className="px-5 space-y-4">
        <div className="card p-5 text-sm leading-relaxed space-y-3">
          <p className="font-medium">بياناتك المالية تبقى على جهازك في النسخة الحالية.</p>
          <p className="text-ink-500">
            لا يقوم دبّرها بإرسال دخلك أو مصاريفك أو أهدافك المالية إلى أي خادم خارجي. جميع البيانات
            محفوظة محليًا في متصفحك (LocalStorage) ولا يمكن لأي طرف آخر الوصول إليها.
          </p>
          <p className="text-ink-500">
            يمكنك في أي وقت تصدير بياناتك كملف JSON للاحتفاظ بنسخة، أو حذفها بالكامل من صفحة "المزيد".
          </p>
          <p className="text-ink-500">
            دبّرها مساعد للتخطيط المالي وليس مستشارًا ماليًا مرخصًا، ولا يقدّم نصائح استثمارية أو قروضًا.
          </p>
        </div>
      </div>
    </div>
  );
}
