"use client"

import { useState, useEffect } from 'react'
import { UserDeletionStatus } from '../../types/types'
import {
  createAccountDeletedHandler,
  createCancelDeletionHandler,
  createDeleteRequestHandler,
  fetchDeletionStatus,
  initialDeletionStatus,
} from '../../utils/utils'
import DeleteConfirmationModal from './delete-confirmation-modal'
import DeletionCountdown from './deletion-countdown'
import DeletionStatusCard from './deletion-status-card'
import CancelDeletionModal from './cancel-deletion-modal'

export default function DangerZone({
  userId,
  onStatusChange,
}: {
  userId: number
  onStatusChange?: () => void
}) {
  const [deletionStatus, setDeletionStatus] =
    useState<UserDeletionStatus>(initialDeletionStatus)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [reason, setReason] = useState('')
  const [password, setPassword] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDeletionStatus(setDeletionStatus, onStatusChange)
  }, [onStatusChange, userId])

  const handleDeleteRequest = createDeleteRequestHandler({
    reason,
    password,
    setIsLoading,
    setShowDeleteDialog,
    setReason,
    setPassword,
    setDeletionStatus,
    onStatusChange,
  })

  const handleCancelDeletion = createCancelDeletionHandler({
    setShowCancelDialog,
    setCancelReason,
    setDeletionStatus,
    onStatusChange,
    cancelReason,
    setIsLoading,
  })

  const handleAccountDeleted = createAccountDeletedHandler({
    onStatusChange,
    setDeletionStatus,
  })

  if (!deletionStatus.isDeletionRequested) {
    return (
      <div className="bg-gray-800 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold text-lg mb-4">
          Zona de Peligro
        </h3>
        <p className="text-gray-300 mb-4">
          Eliminar tu cuenta es una acción irreversible. Todos tus datos serán
          eliminados permanentemente.
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
    )
  }

  if (deletionStatus.isAnonymized) {
    return (
      <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 text-center">
        <h3 className="text-red-400 font-semibold text-lg mb-2">
          Cuenta eliminada
        </h3>
        <p className="text-gray-400">
          Tu cuenta fue anonimizada el{' '}
          {deletionStatus.anonymizedAt
            ? new Date(deletionStatus.anonymizedAt).toLocaleString()
            : 'desconocido'}
          . Los datos sensibles ya no están disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 🔥 CORRECCIÓN: Mostrar mensaje de gracia si canCancel es true */}
      {deletionStatus.canCancel && deletionStatus.canCancelUntil && (
        <div className="bg-blue-900/40 border border-blue-600 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            ✅ Puedes cancelar la eliminación de tu cuenta hasta el{' '}
            <strong>
              {new Date(deletionStatus.canCancelUntil).toLocaleString()}
            </strong>
            .
          </p>
        </div>
      )}

      {/* 🔥 NUEVO: Mensaje de urgencia solo en la ventana de acción */}
      {deletionStatus.isWithinActionWindow && deletionStatus.canCancel && (
        <div className="bg-red-900/40 border border-red-600 rounded-lg p-4">
          <p className="text-sm text-red-300">
            ⚠️ <strong>Últimos minutos:</strong> La eliminación está próxima. Si quieres cancelar, hazlo ahora.
          </p>
        </div>
      )}

      {deletionStatus.legalRetentionUntil && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
          <p className="text-sm text-yellow-300">
            📜 Por motivos legales, tus datos se mantendrán hasta el{' '}
            <strong>
              {new Date(deletionStatus.legalRetentionUntil).toLocaleDateString()}
            </strong>
            .
          </p>
        </div>
      )}

      {deletionStatus.displayScheduledAt && (
        <DeletionCountdown
          displayScheduledDate={new Date(deletionStatus.displayScheduledAt)}
          canCancelUntil={
            deletionStatus.canCancelUntil
              ? new Date(deletionStatus.canCancelUntil)
              : undefined
          }
          isWithinActionWindow={deletionStatus.isWithinActionWindow}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      <DeletionStatusCard
        status={deletionStatus}
        onCancelClick={() => setShowCancelDialog(true)}
        scheduledDate={new Date(
          deletionStatus.displayScheduledAt ||
          deletionStatus.canCancelUntil ||
          Date.now()
        )}
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
  )
}