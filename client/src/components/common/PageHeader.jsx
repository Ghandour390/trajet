import Button from './Button';

/**
 * PageHeader Component
 * Reusable page header with title, subtitle and optional action button
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  actionLabel, 
  actionIcon: ActionIcon, 
  onAction,
  actionVariant = 'primary'
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant={actionVariant}>
          {ActionIcon && <ActionIcon size={20} className="mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
