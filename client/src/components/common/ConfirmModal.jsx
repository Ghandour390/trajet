import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmModal Component
 * Reusable confirmation dialog for delete/destructive actions
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmer la suppression',
  message,
  itemName,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="text-center sm:text-left">
        {/* Icon */}
        <div className="mx-auto sm:mx-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          {message || (
            <>
              Êtes-vous sûr de vouloir supprimer{' '}
              {itemName && (
                <span className="font-semibold text-gray-900 dark:text-white">
                  {itemName}
                </span>
              )}
              {' '}? Cette action est irréversible.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
