// utils/notification-service.ts
import { toast } from "sonner";
import { DeletionActionResponse } from "../types/types";

/**
 * Funciones para manejo de notificaciones
 */
export function notifySuccess(message: string): void {
  toast.success(message);
}

export function notifyError(message: string): void {
  toast.error(message);
}

export function notifyInfo(message: string): void {
  toast(message);
}

/**
 * Maneja notificaciones específicas para respuestas de eliminación
 */
export function handleDeletionResponse(response: DeletionActionResponse, type: 'request' | 'cancel'): void {
  if (type === 'request') {
    notifySuccess('Solicitud de eliminación enviada correctamente.');
    
    if (response.deletionInfo?.actionWindowMinutes) {
      notifySuccess(
        `Tienes ${response.deletionInfo.actionWindowMinutes} minutos para cambiar de opinión y cancelar la eliminación.`
      );
    }
  } else {
    notifySuccess('Eliminación cancelada correctamente');
    
    if (response.cancellationInfo?.cancelledWithMinutesToSpare) {
      notifySuccess(
        `Cancelación exitosa con ${response.cancellationInfo.cancelledWithMinutesToSpare} minutos de margen.`
      );
    }
  }
}

/**
 * Maneja errores específicos de eliminación con contexto mejorado
 */
export function handleDeletionError(
  error: boolean, 
  status?: number, 
  data?: any, 
  message?: string,
  type: 'request' | 'cancel' = 'request'
): void {
  if (status === 409 && error) {
    if (type === 'request' && message?.includes('solicitud de eliminación pendiente')) {
      const existingRequest = data?.existingRequest;
      if (existingRequest?.isWithinActionWindow) {
        notifyError(
          `Ya tienes una solicitud pendiente. Puedes cancelarla hasta las ${new Date(existingRequest.canCancelUntil).toLocaleTimeString()}.`
        );
      } else {
        notifyError(message);
      }
    } else if (type === 'cancel' && message?.includes('período') && data?.minutesPastDeadline) {
      notifyError(
        `El período de cancelación expiró hace ${data.minutesPastDeadline} minutos.`
      );
    } else {
      notifyError(message || 'Conflicto en la operación');
    }
  } else {
    notifyError(message || 'Error en la operación');
  }
}