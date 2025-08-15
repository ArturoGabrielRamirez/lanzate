import { UserDeletionStatus, DeletionActionResponse } from "../types/types";

// ✅ FUNCIÓN PARA ENMASCARAR EMAIL - Sin cambios
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
  return `${maskedLocal}@${domain}`
}

// ✅ FUNCIÓN PARA OBTENER ESTADO DE ELIMINACIÓN - Actualizada
export async function fetchDeletionStatus(
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>, 
  onStatusChange?: () => void
): Promise<void> {
  try {
    const response = await fetch('/api/user/deletion-status');
    if (response.ok) {
      const status = await response.json();
      // ✅ El backend ahora incluye isWithinActionWindow y otros campos
      setDeletionStatus(status);
      onStatusChange?.();
    }
  } catch (error) {
    console.error('Error fetching deletion status:', error);
  }
}

// ✅ INTERFAZ PARA PARÁMETROS DE SOLICITUD DE ELIMINACIÓN - Sin cambios
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

// ✅ FUNCIÓN FACTORY PARA SOLICITAR ELIMINACIÓN - Mejorada
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
    if (!reason.trim() || reason.length < DELETION_CONSTANTS.MIN_REASON_LENGTH) {
      notifications.error(`El motivo debe tener al menos ${DELETION_CONSTANTS.MIN_REASON_LENGTH} caracteres`);
      return;
    }

    if (!password.trim()) {
      notifications.error('La contraseña es requerida');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, confirmPassword: password }),
      });

      const data: DeletionActionResponse = await response.json();

      if (response.ok) {
        notifications.success(DELETION_CONSTANTS.MESSAGES.DELETION_REQUESTED);
        
        // ✅ MOSTRAR INFO ADICIONAL sobre ventana de acción
        if (data.deletionInfo?.actionWindowMinutes) {
          notifications.success(
            `Tienes ${data.deletionInfo.actionWindowMinutes} minutos para cambiar de opinión y cancelar la eliminación.`
          );
        }
        
        setShowDeleteDialog(false);
        setReason('');
        setPassword('');
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      } else {
        // ✅ MANEJAR CASOS ESPECIALES
        if (response.status === 409 && data.error?.includes('solicitud de eliminación pendiente')) {
          const existingRequest = (data as any).existingRequest;
          if (existingRequest?.isWithinActionWindow) {
            notifications.error(
              `Ya tienes una solicitud pendiente. Puedes cancelarla hasta las ${new Date(existingRequest.canCancelUntil).toLocaleTimeString()}.`
            );
          } else {
            notifications.error(data.error);
          }
        } else {
          notifications.error(data.error || 'Error al procesar la solicitud');
        }
      }
    } catch (error) {
      notifications.error(DELETION_CONSTANTS.MESSAGES.CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  };
}

// ✅ INTERFAZ PARA PARÁMETROS DE CANCELACIÓN - Sin cambios
interface CancelDeletionParams {
  setShowCancelDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setCancelReason: React.Dispatch<React.SetStateAction<string>>;
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
  onStatusChange?: () => void;
  cancelReason: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// ✅ FUNCIÓN FACTORY PARA CANCELAR ELIMINACIÓN - Mejorada
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

      const data: DeletionActionResponse = await response.json();

      if (response.ok) {
        notifications.success(DELETION_CONSTANTS.MESSAGES.DELETION_CANCELLED);
        
        // ✅ MOSTRAR INFO ADICIONAL sobre la cancelación
        if (data.cancellationInfo?.cancelledWithMinutesToSpare) {
          notifications.success(
            `Cancelación exitosa con ${data.cancellationInfo.cancelledWithMinutesToSpare} minutos de margen.`
          );
        }
        
        setShowCancelDialog(false);
        setCancelReason('');
        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      } else {
        // ✅ MANEJAR CASOS ESPECIALES de expiración
        if (response.status === 409) {
          if (data.error?.includes('período') && data.minutesPastDeadline) {
            notifications.error(
              `El período de cancelación expiró hace ${data.minutesPastDeadline} minutos.`
            );
          } else {
            notifications.error(data.error || 'No se puede cancelar la eliminación');
          }
        } else {
          notifications.error(data.error || 'Error al cancelar la eliminación');
        }
      }
    } catch (error) {
      notifications.error(DELETION_CONSTANTS.MESSAGES.CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  };
}

// ✅ INTERFAZ PARA PARÁMETROS DE CALLBACK DE ELIMINACIÓN - Sin cambios
interface AccountDeletedParams {
  onStatusChange?: () => void;
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>;
}

// ✅ FUNCIÓN FACTORY PARA MANEJAR CUENTA ELIMINADA - Sin cambios
export function createAccountDeletedHandler(params: AccountDeletedParams) {
  const { onStatusChange, setDeletionStatus } = params;

  return async (): Promise<void> => {
    try {
      // Notificar al componente padre
      onStatusChange?.();

      // Limpiar estado local
      setDeletionStatus(initialDeletionStatus);

      // Log para debugging
      console.log(DELETION_CONSTANTS.MESSAGES.ACCOUNT_DELETED);

    } catch (error) {
      console.error('Error en callback de eliminación:', error);
    }
  };
}

// ✅ ESTADO INICIAL PARA DELETION STATUS - Actualizado
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
  
  // ✅ NUEVAS PROPIEDADES
  canDeleteUntil: null,
  canCancelUntil: null,
  isWithinActionWindow: false,
  isAnonymized: false,
  legalStatus: 'active',
};

// ✅ VALIDADORES REUTILIZABLES - Sin cambios
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

// ✅ FUNCIÓN PARA MOSTRAR NOTIFICACIONES - Sin cambios
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

// ✅ CONSTANTES REUTILIZABLES - Actualizadas
export const DELETION_CONSTANTS = {
  MIN_REASON_LENGTH: 10,
  GRACE_PERIOD_DAYS: 30,
  
  // ✅ NUEVAS CONSTANTES para ventana de acción
  ACTION_WINDOW_CALCULATION: 'round_to_next_hour',
  
  MESSAGES: {
    DELETION_REQUESTED: 'Solicitud de eliminación enviada correctamente.',
    DELETION_CANCELLED: 'Eliminación cancelada correctamente',
    PASSWORD_REQUIRED: 'La contraseña es requerida',
    REASON_TOO_SHORT: 'El motivo debe tener al menos 10 caracteres',
    CONNECTION_ERROR: 'Error de conexión',
    ACCOUNT_DELETED: 'Cuenta eliminada - limpiando estado y redirigiendo...',
    
    // ✅ NUEVOS MENSAJES
    ACTION_WINDOW_EXPIRED: 'El período para realizar esta acción ha expirado',
    ACTION_WINDOW_CLOSING: 'Últimos minutos para realizar esta acción',
    PENDING_REQUEST_EXISTS: 'Ya tienes una solicitud de eliminación pendiente',
  }
} as const;

// ✅ NUEVAS FUNCIONES UTILITARIAS para tiempo

/**
 * Calcula minutos restantes hasta una fecha límite
 */
export function getMinutesUntil(targetDate: Date | string | null): number | null {
  if (!targetDate) return null;
  
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(diff / (1000 * 60)));
}

/**
 * Formatea tiempo restante en formato legible
 */
export function formatTimeRemaining(minutes: number | null): string {
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
}

/**
 * Determina la urgencia basada en tiempo restante
 */
export function getUrgencyLevel(minutesRemaining: number | null): 'low' | 'medium' | 'high' | 'critical' | 'expired' {
  if (minutesRemaining === null || minutesRemaining <= 0) return 'expired';
  if (minutesRemaining <= 5) return 'critical';
  if (minutesRemaining <= 30) return 'high';
  if (minutesRemaining <= 60) return 'medium';
  return 'low';
}

/**
 * Obtiene colores CSS basados en urgencia
 */
export function getUrgencyColors(urgency: ReturnType<typeof getUrgencyLevel>): {
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
}