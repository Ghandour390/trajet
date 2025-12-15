import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState Component
 * Reusable empty state display for lists and tables
 */
export default function EmptyState({
  title = 'Aucune donnée',
  description = 'Aucun élément à afficher pour le moment.',
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Inbox size={32} className="text-gray-400 dark:text-slate-500" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {ActionIcon && <ActionIcon size={20} className="mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
