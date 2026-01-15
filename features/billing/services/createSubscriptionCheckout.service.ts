/**
 * Create Subscription Checkout Service
 *
 * Business logic for creating a MercadoPago PreApproval (subscription) checkout.
 * Returns the init_point URL where the user will be redirected to complete payment.
 *
 * @param targetPlan - The plan to upgrade to (PRO or ENTERPRISE)
 * @param userEmail - The user's email for the subscription
 * @returns The MercadoPago checkout URL (init_point)
 */

import { PreApproval } from 'mercadopago';

import { getMercadoPagoConfig } from '@/features/billing/utils/mercadopagoConfig';
import {
  getPlanPrice,
  getPlanCurrency,
  getPlanBillingFrequency,
  getPlanDisplayName,
  type PaidPlan,
} from '@/features/subscriptions/config';

/**
 * Creates a MercadoPago PreApproval subscription and returns the checkout URL
 */
export async function createSubscriptionCheckout(
  targetPlan: PaidPlan,
  userEmail: string
): Promise<string> {
  const mercadopagoConfig = getMercadoPagoConfig();
  const preApproval = new PreApproval(mercadopagoConfig);

  const planPrice = getPlanPrice(targetPlan);
  const planCurrency = getPlanCurrency(targetPlan);
  const planFrequency = getPlanBillingFrequency(targetPlan);
  const planName = getPlanDisplayName(targetPlan);

  const subscription = await preApproval.create({
    body: {
      back_url: `${process.env.APP_URL}/profile`,
      reason: `Lanzate ${planName}`,
      auto_recurring: {
        frequency: planFrequency,
        frequency_type: 'months',
        transaction_amount: planPrice,
        currency_id: planCurrency,
      },
      payer_email: userEmail,
      status: 'pending',
      external_reference: userEmail,
    },
  });

  if (!subscription.init_point) {
    throw new Error('No se pudo obtener el enlace de pago de MercadoPago');
  }

  return subscription.init_point;
}
