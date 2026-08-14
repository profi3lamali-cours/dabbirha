import PageHeader from '../components/PageHeader';
import SocialFooter from '../components/SocialFooter';
import { APP_CONFIG } from '../config';

export default function About() {
  return (
    <div className="pb-28">
      <PageHeader title="حول التطبيق" back />
      <div className="px-5">
        <div className="card p-6 text-center">
          <h2 className="text-2xl font-extrabold mb-1">{APP_CONFIG.appName} 🇩🇿</h2>
          <p className="text-ink-500">{APP_CONFIG.appTagline}</p>
        </div>

        <div className="card p-5 mt-4 text-sm leading-relaxed text-ink-600 dark:text-sand-200">
          <p>
            دبّرها هو مساعد مالي شخصي مصمم خصيصًا للعائلة الجزائرية، يساعدك على فهم راتبك وتوزيعه بذكاء،
            بدل الاعتماد على تخمينات أو قواعد جاهزة لا تناسب واقعك. كل الحسابات تتم محليًا على جهازك،
            دون الحاجة إلى إنترنت بعد أول استخدام.
          </p>
        </div>

        <SocialFooter />
      </div>
    </div>
  );
}
