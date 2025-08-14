import { useEffect, useState } from "react";
import { UserDeletionStatus, DangerZoneProps } from "../../types";
import DeletionCountdown from "./deletion-countdown";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import CancelDeletionModal from "./cancel-deletion-modal";
import DeletionStatusCard from "./deletion-status-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DangerZone({ userId, onStatusChange }: DangerZoneProps) {
  const [deletionStatus, setDeletionStatus] = useState<UserDeletionStatus>({
    isDeletionRequested: false,
    deletionRequestedAt: null,
    deletionScheduledAt: null,
    deletionReason: null,
    canCancel: false,
    daysRemaining: 0,
    minutesRemaining: 0,
    timeRemaining: null,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchDeletionStatus();
  }, [userId]);

  const fetchDeletionStatus = async () => {
    try {
      const response = await fetch('/api/user/deletion-status');
      if (response.ok) {
        const status = await response.json();
        setDeletionStatus(status);
        onStatusChange?.();
      }
    } catch (error) {
      console.error('Error fetching deletion status:', error);
    }
  };

  const handleDeleteRequest = async () => {
    if (!reason.trim() || reason.length < 10) {
      alert('El motivo debe tener al menos 10 caracteres');
      return;
    }

    if (!password.trim()) {
      alert('La contraseña es requerida');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, confirmPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Solicitud de eliminación enviada correctamente.');
        setShowDeleteDialog(false);
        setReason('');
        setPassword('');
        fetchDeletionStatus();
      } else {
        alert(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/cancel-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Eliminación cancelada correctamente');
        setShowCancelDialog(false);
        setCancelReason('');
        fetchDeletionStatus();
      } else {
        alert(data.error || 'Error al cancelar la eliminación');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {deletionStatus.isDeletionRequested && deletionStatus.deletionScheduledAt && (
        <DeletionCountdown
          scheduledDate={new Date(deletionStatus.deletionScheduledAt)}
          timeRemaining={deletionStatus.timeRemaining}
        />
      )}

      {deletionStatus.isDeletionRequested && (
        <DeletionStatusCard
          status={deletionStatus}
          onCancelClick={() => setShowCancelDialog(true)}
        />
      )}

      <div className="bg-gray-800 border border-red-500/30 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400">Zona de Peligro</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Eliminar cuenta permanentemente</h4>
            <p className="text-gray-400 mb-4">
              Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
              No podrás recuperar tu información una vez completado el proceso.
            </p>

            <Alert className="bg-blue-500/10 border-blue-500/30 mb-6">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-gray-300">
                <span className="font-semibold text-blue-400">Período de gracia:</span>{' '}
                Tendrás 30 días para cancelar la eliminación de tu cuenta.
                Después del período de gracia, la eliminación se realizará automáticamente.
              </AlertDescription>
            </Alert>
          </div>

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