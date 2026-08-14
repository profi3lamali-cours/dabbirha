import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('dabbirha_install_dismissed') === '1');
  const [installed, setInstalled] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches ?? false
  );

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (installed || dismissed || !deferredEvent) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-40 card p-4 flex items-center gap-3 shadow-card animate-[fadeIn_0.2s_ease-out]">
      <span className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-sand-200 flex items-center justify-center shrink-0">
        <Download size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">📲 ثبّت دبّرها على هاتفك</p>
        <p className="text-xs text-ink-400">استخدمه كتطبيق مستقل حتى بدون إنترنت</p>
      </div>
      <button
        onClick={async () => {
          await deferredEvent.prompt();
          setDeferredEvent(null);
        }}
        className="bg-ink-600 text-white text-xs font-medium rounded-lg px-3 py-2 shrink-0"
      >
        تثبيت
      </button>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem('dabbirha_install_dismissed', '1');
        }}
        aria-label="إغلاق"
        className="text-ink-300 shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
