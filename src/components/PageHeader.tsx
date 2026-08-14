import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="px-5 pt-6 pb-3 flex items-start gap-3">
      {back && (
        <button
          onClick={() => navigate(-1)}
          aria-label="رجوع"
          className="mt-1 shrink-0 w-9 h-9 rounded-full bg-white dark:bg-ink-900 shadow-soft flex items-center justify-center"
        >
          <ArrowRight size={18} />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-ink-900 dark:text-sand-50">{title}</h1>
        {subtitle && <p className="text-sm text-ink-400 dark:text-ink-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
