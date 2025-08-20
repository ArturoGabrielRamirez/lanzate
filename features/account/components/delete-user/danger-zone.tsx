import { useState, useEffect } from 'react';
import { UserDeletionStatus } from '../../types/types';
import { createAccountDeletedHandler, createCancelDeletionHandler, createDeleteRequestHandler, fetchDeletionStatus, initialDeletionStatus } from '../../utils/utils';
import DeleteConfirmationModal from './delete-confirmation-modal';
import DeletionCountdown from './deletion-countdown';
import DeletionStatusCard from './deletion-status-card';
import CancelDeletionModal from './cancel-deletion-modal';

export default function DangerZone({ userId, onStatusChange }: { userId: number; onStatusChange?: () => void }) {
  const [deletionStatus, setDeletionStatus] = useState<UserDeletionStatus>(initialDeletionStatus);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDeletionStatus(setDeletionStatus, onStatusChange);
  }, [onStatusChange]);

  const handleDeleteRequest = createDeleteRequestHandler({
    reason,
    password,
    setIsLoading,
    setShowDeleteDialog,
    setReason,
    setPassword,
    setDeletionStatus,
    onStatusChange,
  });

  const handleCancelDeletion = createCancelDeletionHandler({
    setShowCancelDialog,
    setCancelReason,
    setDeletionStatus,
    onStatusChange,
    cancelReason,
    setIsLoading,
  });

  const handleAccountDeleted = createAccountDeletedHandler({
    onStatusChange,
    setDeletionStatus,
  });

  if (!deletionStatus.isDeletionRequested) {
    return (
      <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold text-lg mb-4">Zona de Peligro</h3>
        <p className="text-gray-300 mb-4">
          Eliminar tu cuenta es una acción irreversible. Todos tus datos serán eliminados permanentemente.
        </p>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Eliminar Cuenta
        </button>

        <DeleteConfirmationModal
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteRequest}
          reason={reason}
          setReason={setReason}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {deletionStatus.displayScheduledAt && (
        <DeletionCountdown
          displayScheduledDate={new Date(deletionStatus.displayScheduledAt)}
          timeRemaining={deletionStatus.timeRemaining}
          canCancelUntil={deletionStatus.canCancelUntil ? new Date(deletionStatus.canCancelUntil) : undefined}
          isWithinActionWindow={deletionStatus.isWithinActionWindow}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      <DeletionStatusCard
        status={deletionStatus}
        onCancelClick={() => setShowCancelDialog(true)}
        scheduledDate={new Date(deletionStatus.displayScheduledAt || deletionStatus.canCancelUntil || Date.now())}
      />

      <CancelDeletionModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelDeletion}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        isLoading={isLoading}
      />
    </div>
  );
}