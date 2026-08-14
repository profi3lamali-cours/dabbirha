import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { APP_CONFIG } from '../config';
import { useAppData } from '../context/AppDataContext';

export default function SocialFooter() {
  const { data } = useAppData();
  const facebookUrl = data.facebookUrl || APP_CONFIG.facebookUrl;

  return (
    <div className="mt-8 mb-4 flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <a
          href={APP_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تابعنا على Instagram"
          className="w-11 h-11 rounded-full bg-white dark:bg-ink-900 shadow-soft flex items-center justify-center text-ink-600 dark:text-sand-200 hover:scale-105 transition-transform"
        >
          <InstagramIcon width={20} height={20} />
        </a>
        {facebookUrl ? (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="صفحتنا على Facebook"
            className="w-11 h-11 rounded-full bg-white dark:bg-ink-900 shadow-soft flex items-center justify-center text-ink-600 dark:text-sand-200 hover:scale-105 transition-transform"
          >
            <FacebookIcon width={20} height={20} />
          </a>
        ) : (
          <span
            className="w-11 h-11 rounded-full bg-sand-100 dark:bg-ink-800 flex items-center justify-center text-ink-300 dark:text-ink-600"
            title="لم يُحدَّد رابط Facebook بعد"
          >
            <FacebookIcon width={20} height={20} />
          </span>
        )}
      </div>
      <p className="text-xs text-ink-400 dark:text-ink-500">
        تابعنا على Instagram
        <br />
        <span className="num">@{APP_CONFIG.instagramUrl.split('/').filter(Boolean).pop()}</span>
      </p>
      <p className="text-xs text-ink-300 dark:text-ink-600">
        صُمم وطُوّر بواسطة {APP_CONFIG.developerName}
      </p>
    </div>
  );
}
