/**
 * Get MercadoPago Preapproval
 *
 * Fetches preapproval (subscription) details from MercadoPago API.
 *
 * @param preapprovalId - The MercadoPago preapproval ID
 * @returns The preapproval data from MercadoPago
 *
 * @example
 * const preapproval = await getMercadoPagoPreapproval('abc123');
 * console.log(preapproval.status); // 'authorized'
 */

import { PreApproval } from 'mercadopago';

import type { MPPreapprovalData } from '@/features/billing/types/billing';
import { getMercadoPagoConfig } from '@/features/billing/utils/mercadopagoConfig';

export async function getMercadoPagoPreapproval(preapprovalId: string): Promise<MPPreapprovalData> {
  const preapprovalClient = new PreApproval(getMercadoPagoConfig());
  const response = await preapprovalClient.get({ id: preapprovalId });

  return {
    id: response.id ?? preapprovalId,
    status: response.status ?? 'pending',
    external_reference: response.external_reference ?? undefined,
    next_payment_date: response.next_payment_date ?? undefined,
  };
}
