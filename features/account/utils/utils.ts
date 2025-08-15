import { UserDeletionStatus } from "../types";

// ✅ FUNCIÓN PARA ENMASCARAR EMAIL
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
  return `${maskedLocal}@${domain}`
}

// ✅ FUNCIÓN PARA OBTENER ESTADO DE ELIMINACIÓN
export async function fetchDeletionStatus(
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>, 
  onStatusChange?: () => void
): Promise<void> {
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
}

// ✅ INTERFAZ PARA PARÁMETROS DE SOLICITUD DE ELIMINACIÓN
interface DeleteRequestParams {
  reason: string;
  password: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setReason: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
  onStatusChange?: () => void;
}

// ✅ FUNCIÓN FACTORY PARA SOLICITAR ELIMINACIÓN
export function createDeleteRequestHandler(params: DeleteRequestParams) {
  const {
    reason,
    password,
    setIsLoading,
    setShowDeleteDialog,
    setReason,
    setPassword,
    setDeletionStatus,
    onStatusChange,
  } = params;

  return async (): Promise<void> => {
    // Validaciones
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
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      } else {
        alert(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
}

// ✅ INTERFAZ PARA PARÁMETROS DE CANCELACIÓN
interface CancelDeletionParams {
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCancelReason: React.Dispatch<React.SetStateAction<string>>;
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
  onStatusChange?: () => void;
  cancelReason: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// ✅ FUNCIÓN FACTORY PARA CANCELAR ELIMINACIÓN
export function createCancelDeletionHandler(params: CancelDeletionParams) {
  const {
    setShowCancelDialog,
    setCancelReason,
    setDeletionStatus,
    onStatusChange,
    cancelReason,
    setIsLoading,
  } = params;

  return async (): Promise<void> => {
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
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      } else {
        alert(data.error || 'Error al cancelar la eliminación');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
}

// ✅ INTERFAZ PARA PARÁMETROS DE CALLBACK DE ELIMINACIÓN
interface AccountDeletedParams {
  onStatusChange?: () => void;
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
}

// ✅ FUNCIÓN FACTORY PARA MANEJAR CUENTA ELIMINADA
export function createAccountDeletedHandler(params: AccountDeletedParams) {
  const { onStatusChange, setDeletionStatus } = params;

  return async (): Promise<void> => {
    try {
      // Notificar al componente padre
      onStatusChange?.();

      // Limpiar estado local
      setDeletionStatus({
        isDeletionRequested: false,
        deletionRequestedAt: null,
        displayScheduledAt: null,
        deletionScheduledAt: null,
        deletionReason: null,
        canCancel: false,
        daysRemaining: 0,
        minutesRemaining: 0,
        timeRemaining: null,
      });

      // Log para debugging
      console.log('Cuenta eliminada - limpiando estado y redirigiendo...');

    } catch (error) {
      console.error('Error en callback de eliminación:', error);
    }
  };
}

// ✅ ESTADO INICIAL PARA DELETION STATUS (REUTILIZABLE)
export const initialDeletionStatus: UserDeletionStatus = {
  isDeletionRequested: false,
  deletionRequestedAt: null,
  displayScheduledAt: null,
  deletionScheduledAt: null,
  deletionReason: null,
  canCancel: false,
  daysRemaining: 0,
  minutesRemaining: 0,
  timeRemaining: null,
};

// ✅ VALIDADORES REUTILIZABLES
export const validators = {
  deletionReason: (reason: string): { isValid: boolean; error?: string } => {
    if (!reason.trim()) {
      return { isValid: false, error: 'El motivo es requerido' };
    }
    if (reason.length < 10) {
      return { isValid: false, error: 'El motivo debe tener al menos 10 caracteres' };
    }
    return { isValid: true };
  },

  password: (password: string): { isValid: boolean; error?: string } => {
    if (!password.trim()) {
      return { isValid: false, error: 'La contraseña es requerida' };
    }
    return { isValid: true };
  }
};

// ✅ FUNCIÓN PARA MOSTRAR NOTIFICACIONES (FÁCIL DE REEMPLAZAR CON TOAST)
export const notifications = {
  success: (message: string) => {
    // TODO: Reemplazar con sistema de toast
    alert(message);
  },
  
  error: (message: string) => {
    // TODO: Reemplazar con sistema de toast  
    alert(message);
  }
};

// ✅ CONSTANTES REUTILIZABLES
export const DELETION_CONSTANTS = {
  MIN_REASON_LENGTH: 10,
  GRACE_PERIOD_DAYS: 30,
  MESSAGES: {
    DELETION_REQUESTED: 'Solicitud de eliminación enviada correctamente.',
    DELETION_CANCELLED: 'Eliminación cancelada correctamente',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    REASON_TOO_SHORT: 'El motivo debe tener al menos 10 caracteres',
    CONNECTION_ERROR: 'Error de conexión',
    ACCOUNT_DELETED: 'Cuenta eliminada - limpiando estado y redirigiendo...'
  }
} as const;