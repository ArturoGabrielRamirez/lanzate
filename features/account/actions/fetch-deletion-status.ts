"use server"

import getAuthHeaders from '../utils/get-auth-header';
import { actionWrapper } from '@/utils/lib';
import { getBaseUrl } from '../utils/utils';

export default async function fetchDeletionStatusAction() {
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