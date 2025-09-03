"use server"

import { actionWrapper } from "@/utils/lib";
import { getBaseUrl } from "../utils/utils";
import getAuthHeaders from "../utils/get-auth-header";
import { DeletionActionResponse } from "../types/types";
import { revalidateTag } from "next/cache";

export default async function requestDeletionAction(
  reason: string, 
  confirmPassword: string
) {
  return actionWrapper(async () => {
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

    revalidateTag('user-deletion-status');
    revalidateTag('user-profile');

    return {
      error: false,
      message: "Solicitud de eliminación procesada correctamente",
      payload: data
    };
  });
}