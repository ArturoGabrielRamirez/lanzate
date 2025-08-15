import { useEffect, useState } from "react";
import { UserDeletionStatus, DangerZoneProps } from "../../types";
import DeletionCountdown from "./deletion-countdown";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import CancelDeletionModal from "./cancel-deletion-modal";
import DeletionStatusCard from "./deletion-status-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  fetchDeletionStatus, 
  createDeleteRequestHandler, 
  createCancelDeletionHandler,
  createAccountDeletedHandler,
  initialDeletionStatus 
} from "../../utils/utils";

export default function DangerZone({ userId, onStatusChange }: DangerZoneProps) {
  // ✅ ESTADOS SIMPLIFICADOS - Solo UI state
  const [deletionStatus, setDeletionStatus] = useState<UserDeletionStatus>(initialDeletionStatus);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // ✅ CARGAR ESTADO INICIAL
  useEffect(() => {
    fetchDeletionStatus(setDeletionStatus, onStatusChange);
  }, [userId, onStatusChange]);

  // ✅ HANDLERS CREADOS CON FACTORY FUNCTIONS
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

  // ✅ RENDER - Solo lógica de UI
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ⏰ COUNTDOWN COMPONENT */}
      {deletionStatus.isDeletionRequested && deletionStatus.displayScheduledAt && (
        <DeletionCountdown
          displayScheduledDate={new Date(deletionStatus.displayScheduledAt)}
          timeRemaining={deletionStatus.timeRemaining}
        /*   onAccountDeleted={handleAccountDeleted} */
        />
      )}

      {/* 📊 STATUS CARD */}
      {deletionStatus.isDeletionRequested && (
        <DeletionStatusCard
          status={deletionStatus}
          onCancelClick={() => setShowCancelDialog(true)}
        />
      )}

      {/* ⚠️ DANGER ZONE PANEL */}
      <div className="bg-gray-800 border border-red-500/30 rounded-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400">Zona de Peligro</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">
              Eliminar cuenta permanentemente
            </h4>
            <p className="text-gray-400 mb-4">
              Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
              No podrás recuperar tu información una vez completado el proceso.
            </p>

            {/* Info Alert */}
            <Alert className="bg-blue-500/10 border-blue-500/30 mb-6">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-gray-300">
                <span className="font-semibold text-blue-400">Período de gracia:</span>{' '}
                Tendrás 30 días para cancelar la eliminación de tu cuenta.
                Después del período de gracia, la eliminación se realizará automáticamente.
              </AlertDescription>
            </Alert>
          </div>

          {/* Action Button or Status */}
          {!deletionStatus.isDeletionRequested ? (
            <Button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Solicitar eliminación de cuenta
            </Button>
          ) : (
            <Alert className="bg-gray-900/50 border-gray-600">
              <AlertDescription className="text-gray-400 text-center">
                Ya has solicitado la eliminación de tu cuenta.
                {deletionStatus.canCancel
                  ? ' Puedes cancelarla usando el botón de arriba.'
                  : ' El período de cancelación ha expirado.'
                }
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
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

      {/* ❌ CANCEL DELETION MODAL */}
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