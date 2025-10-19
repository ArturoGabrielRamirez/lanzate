import { cancelDeletionAction, getDeletionStatusAction, requestDeletionAction } from "@/features/account/actions";
import { UserDeletionStatus, DeleteRequestParams, CancelDeletionParams, AccountDeletedParams, UserType } from "@/features/account/types"
import { notifyError, handleDeletionResponse } from "@/features/account/utils";
/* import { SUBTLE_BANNERS } from "./banners-presets"; */


export const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export async function fetchDeletionStatus(
  setDeletionStatus: React.Dispatch<React.SetStateAction<UserDeletionStatus>>,
  onStatusChange?: () => void
): Promise<void> {
  try {
    const result = await getDeletionStatusAction();

    if (result.error === false && result.payload) {
      setDeletionStatus(result.payload);
      onStatusChange?.();
    }
  } catch (error) {
    console.error('Error fetching deletion status:', error);
    notifyError('Error obteniendo estado de eliminación');
  }
}

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
      const result = await requestDeletionAction(reason, password);

      if (result.error === false && result.payload) {
        handleDeletionResponse(result.payload, 'request');

        setShowDeleteDialog(false);
        setReason('');
        setPassword('');

        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
}

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
      const result = await cancelDeletionAction(cancelReason);

      if (result.error === false && result.payload) {
        handleDeletionResponse(result.payload, 'cancel');
        setShowCancelDialog(false);
        setCancelReason('');

        await fetchDeletionStatus(setDeletionStatus, onStatusChange);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cancelar';
      notifyError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
}

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

export const initialDeletionStatus: UserDeletionStatus = {
  isDeletionRequested: false,
  deletionRequestedAt: null,
  displayScheduledAt: null,
  deletionScheduledAt: null,
  deletionReason: null,
  canCancel: false,
  daysRemaining: 0,
  minutesRemaining: 0,
  canDeleteUntil: null,
  canCancelUntil: null,
  isWithinActionWindow: false,
  isAnonymized: false,
  legalStatus: 'active',
};

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

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`
  }
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
  return `${maskedLocal}@${domain}`
}

export function getDisplayName(user: UserType): string {
  if (user.username?.trim()) {
    return user.username
  }
  const firstName = user.first_name?.trim()
  const lastName = user.last_name?.trim()
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ')
  }
  return user.email
}

/* export function getDefaultBannerForUser(userId: number | string): string {
  const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
  const index = isNaN(userIdAsNumber) ? 0 : userIdAsNumber % SUBTLE_BANNERS.length
  return SUBTLE_BANNERS[index].url
} */

export function formatJoinDate(date: Date | string): string {
  const joinDate = new Date(date)
  return new Intl.DateTimeFormat('es', {
    month: 'long',
    year: 'numeric'
  }).format(joinDate)
}