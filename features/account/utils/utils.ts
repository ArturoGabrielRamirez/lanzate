// utils/deletionUtils.ts - CORREGIDO para eliminar timeRemaining
import { UserDeletionStatus, DeleteRequestParams, CancelDeletionParams, AccountDeletedParams } from "../types/types";
import { notifyError, handleDeletionResponse, handleDeletionError } from "./notification-service";
import { cancelDeletionAction, fetchDeletionStatusAction, requestDeletionAction } from "../actions";

export const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// FUNCIÓN PARA OBTENER ESTADO DE ELIMINACIÓN - CORREGIDA
export async function fetchDeletionStatus(
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>,
  onStatusChange?: () => void
): Promise<void> {
  try {
    // FORMATO CORRECTO: actionWrapper devuelve { error, message, payload }
    const result = await fetchDeletionStatusAction();

    if (result.error === false && result.payload) {
      setDeletionStatus(result.payload);
      onStatusChange?.();
    }
  } catch (error) {
    console.error('Error fetching deletion status:', error);
    notifyError('Error obteniendo estado de eliminación');
  }
}

// FUNCIÓN FACTORY PARA SOLICITAR ELIMINACIÓN - CORREGIDA
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
    // Validaciones usando validators existentes
    const reasonValidation = validators.deletionReason(reason);
    if (!reasonValidation.isValid) {
      notifyError(reasonValidation.error!);
      return;
    }

    const passwordValidation = validators.password(password);
    if (!passwordValidation.isValid) {
      notifyError(passwordValidation.error!);
      return;
    }

    setIsLoading(true);

    try {
      // FORMATO CORRECTO: actionWrapper devuelve { error, message, payload }
      const result = await requestDeletionAction(reason, password);

      if (result.error === false && result.payload) {
        // Usar funciones de notificaciones para manejar respuesta exitosa
        handleDeletionResponse(result.payload, 'request');

        // Limpiar formulario
        setShowDeleteDialog(false);
        setReason('');
        setPassword('');

        // Actualizar estado
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      }

    } catch (error) {
      // Los errores del actionWrapper llegan aquí
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
}

// FUNCIÓN FACTORY PARA CANCELAR ELIMINACIÓN - CORREGIDA
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
      // FORMATO CORRECTO: actionWrapper devuelve { error, message, payload }
      const result = await cancelDeletionAction(cancelReason);

      if (result.error === false && result.payload) {
        // Usar funciones de notificaciones para manejar respuesta exitosa
        handleDeletionResponse(result.payload, 'cancel');

        // Limpiar formulario
        setShowCancelDialog(false);
        setCancelReason('');

        // Actualizar estado
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      }

    } catch (error) {
      // Los errores del actionWrapper llegan aquí
      const errorMessage = error instanceof Error ? error.message : 'Error al cancelar';
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
}

// FUNCIÓN FACTORY PARA MANEJAR CUENTA ELIMINADA - Sin cambios
export function createAccountDeletedHandler(params: AccountDeletedParams) {
  const { onStatusChange, setDeletionStatus } = params;

  return async (): Promise<void> => {
    try {
      onStatusChange?.();
      setDeletionStatus(initialDeletionStatus);
    } catch (error) {
      console.error('Error en callback de eliminación:', error);
    }
  };
}

// ESTADO INICIAL CORREGIDO: timeRemaining eliminado
export const initialDeletionStatus: UserDeletionStatus = {
  isDeletionRequested: false,
  deletionRequestedAt: null,
  displayScheduledAt: null,
  deletionScheduledAt: null,
  deletionReason: null,
  canCancel: false,
  daysRemaining: 0,
  minutesRemaining: 0,
  // timeRemaining: null, // ❌ ELIMINADO
  canDeleteUntil: null,
  canCancelUntil: null,
  isWithinActionWindow: false,
  isAnonymized: false,
  legalStatus: 'active',
};

// VALIDADORES REUTILIZABLES - Sin cambios
export const validators = {
  deletionReason: (reason: string): { isValid: boolean; error?: string } => {
    if (!reason.trim()) {
      return { isValid: false, error: 'El motivo es requerido' };
    }
    if (reason.length < DELETION_CONSTANTS.MIN_REASON_LENGTH) {
      return { isValid: false, error: `El motivo debe tener al menos ${DELETION_CONSTANTS.MIN_REASON_LENGTH} caracteres` };
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

// CONSTANTES REUTILIZABLES - Sin cambios
export const DELETION_CONSTANTS = {
  MIN_REASON_LENGTH: 10,
  GRACE_PERIOD_DAYS: 30,

  MESSAGES: {
    DELETION_REQUESTED: 'Solicitud de eliminación enviada correctamente.',
    DELETION_CANCELLED: 'Eliminación cancelada correctamente',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    REASON_TOO_SHORT: 'El motivo debe tener al menos 10 caracteres',
    CONNECTION_ERROR: 'Error de conexión',
    ACCOUNT_DELETED: 'Cuenta eliminada - limpiando estado y redirigiendo...',
    ACTION_WINDOW_EXPIRED: 'El período para realizar esta acción ha expirado',
    ACTION_WINDOW_CLOSING: 'Últimos minutos para realizar esta acción',
    PENDING_REQUEST_EXISTS: 'Ya tienes una solicitud de eliminación pendiente',
  }
} as const;

// FUNCIONES COMENTADAS se mantienen como estaban
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
  return `${maskedLocal}@${domain}`
}

/* export function getMinutesUntil(targetDate: Date | string | null): number | null {
  if (!targetDate) return null;
  
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(diff / (1000 * 60)));
} */

/* export function formatTimeRemaining(minutes: number | null): string {
  if (minutes === null || minutes <= 0) return 'Expirado';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
} */

/* export function getUrgencyLevel(minutesRemaining: number | null): 'low' | 'medium' | 'high' | 'critical' | 'expired' {
  if (minutesRemaining === null || minutesRemaining <= 0) return 'expired';
  if (minutesRemaining <= 5) return 'critical';
  if (minutesRemaining <= 30) return 'high';
  if (minutesRemaining <= 60) return 'medium';
  return 'low';
} */

/* export function getUrgencyColors(urgency: ReturnType<typeof getUrgencyLevel>): {
  text: string;
  bg: string;
  border: string;
} {
  const colors = {
    expired: { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
    critical: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    high: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    low: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  };

  return colors[urgency];
} */