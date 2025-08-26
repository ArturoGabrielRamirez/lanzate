// actions/fetch-deletion-status.ts
'use server'
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { UserDeletionStatus, DeletionActionResponse } from "../types/types";
import getAuthHeaders from '../utils/get-auth-header';
import { actionWrapper } from '@/utils/lib';

// Función helper para obtener la URL base correcta
const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

/**
 * Server Action para obtener estado de eliminación
 */
export async function fetchDeletionStatusAction() {
  return actionWrapper(async () => {
    const baseUrl = getBaseUrl();
    const headers = await getAuthHeaders();

    const response = await fetch(`${baseUrl}/api/user/deletion-status`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const payload = await response.json();
    
    return {
      error: false,
      message: "Estado de eliminación obtenido exitosamente",
      payload: payload
    };
  });
}

/**
 * Server Action para solicitar eliminación
 */
export async function requestDeletionAction(
  reason: string, 
  confirmPassword: string
) {
  return actionWrapper(async () => {
    // Validaciones server-side adicionales
    if (!reason.trim() || reason.length < 10) {
      throw new Error('El motivo debe tener al menos 10 caracteres');
    }
    
    if (!confirmPassword.trim()) {
      throw new Error('La contraseña es requerida');
    }

    const baseUrl = getBaseUrl();
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/user/request-deletion`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason, confirmPassword }),
    });

    const data: DeletionActionResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar la solicitud');
    }

    // Revalidar cache relacionado con estado de usuario
    revalidateTag('user-deletion-status');
    revalidateTag('user-profile');

    return {
      error: false,
      message: "Solicitud de eliminación procesada correctamente",
      payload: data
    };
  });
}

/**
 * Server Action para cancelar eliminación
 */
export async function cancelDeletionAction(reason?: string) {
  return actionWrapper(async () => {
    const baseUrl = getBaseUrl();
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${baseUrl}/api/user/cancel-deletion`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason }),
    });

    const data: DeletionActionResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al cancelar la eliminación');
    }

    // Revalidar cache relacionado con estado de usuario
    revalidateTag('user-deletion-status');
    revalidateTag('user-profile');

    return {
      error: false,
      message: "Eliminación cancelada correctamente",
      payload: data
    };
  });
}