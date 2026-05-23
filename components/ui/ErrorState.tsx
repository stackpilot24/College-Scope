import { SearchX, ServerCrash } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  type?: 'empty' | 'error';
  title?: string;
  message?: string;
  action?: { label: string; href: string };
}

export function ErrorState({
  type = 'empty',
  title,
  message,
  action,
}: ErrorStateProps) {
  const defaults = {
    empty: {
      icon: <SearchX className="w-12 h-12 text-gray-400" />,
      title: 'No colleges found',
      message: 'Try adjusting your filters or search query.',
    },
    error: {
      icon: <ServerCrash className="w-12 h-12 text-red-400" />,
      title: 'Something went wrong',
      message: 'We could not load the data. Please try again.',
    },
  }[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {defaults.icon}
      <h3 className="mt-4 text-lg font-semibold text-gray-700">{title ?? defaults.title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{message ?? defaults.message}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 btn-primary text-sm inline-block"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
