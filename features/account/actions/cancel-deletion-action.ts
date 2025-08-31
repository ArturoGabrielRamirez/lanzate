"use server"

import {  DeletionActionResponse } from "../types/types";
import getAuthHeaders from '../utils/get-auth-header';
import { actionWrapper } from '@/utils/lib';
import { getBaseUrl } from '../utils/utils';
import { revalidateTag } from "next/cache";

export default async function cancelDeletionAction(reason?: string) {
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

    revalidateTag('user-deletion-status');
    revalidateTag('user-profile');

    return {
      error: false,
      message: "Eliminación cancelada correctamente",
      payload: data
    };
  });
}