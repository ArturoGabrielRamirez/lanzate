/**
 * MercadoPago Webhook Handler
 *
 * Handles incoming webhook notifications from MercadoPago for:
 * - payment.created - New payment received
 * - payment.updated - Payment status changes (including refunds)
 * - subscription_preapproval.updated - Subscription status changes
 *
 * IMPORTANT: Returns 200 immediately to avoid MercadoPago timeouts.
 * Processing happens asynchronously after the response.
 */

import {
  handlePaymentCreated,
  handlePaymentUpdated,
  handleSubscriptionPreapprovalUpdated,
} from '@/features/billing/services';

import type { WebhookNotification } from '@/features/billing/types/billing';

/**
 * POST handler for MercadoPago webhooks
 *
 * Returns 200 immediately for all notification types to prevent MercadoPago timeouts.
 * Processing is done asynchronously.
 */
export async function POST(request: Request): Promise<Response> {
  // Parse the webhook body
  let body: WebhookNotification;

  try {
    body = await request.json();
  } catch {
    // Even on parse error, return 200 to acknowledge receipt
    console.error('[Webhook] Failed to parse request body');
    return new Response(null, { status: 200 });
  }

  // Log the webhook event for debugging
  console.log(`[Webhook] Received: type=${body.type}, action=${body.action}, id=${body.data?.id}`);

  // Return 200 immediately to avoid MercadoPago timeouts
  // Process the notification asynchronously
  processWebhookAsync(body).catch((error) => {
    console.error('[Webhook] Error processing notification:', error);
  });

  return new Response(null, { status: 200 });
}

/**
 * Process webhook notification asynchronously
 *
 * This function handles the actual processing after the 200 response is sent.
 */
async function processWebhookAsync(body: WebhookNotification): Promise<void> {
  const { type, action, data } = body;

  // Determine the notification type from action or type field
  const notificationType = action || type;

  switch (notificationType) {
    case 'payment.created':
      console.log(`[Webhook] Processing payment.created for payment ${data.id}`);
      await handlePaymentCreated(data.id);
      break;

    case 'payment.updated':
      console.log(`[Webhook] Processing payment.updated for payment ${data.id}`);
      await handlePaymentUpdated(data.id);
      break;

    case 'subscription_preapproval.updated':
      console.log(`[Webhook] Processing subscription_preapproval.updated for preapproval ${data.id}`);
      await handleSubscriptionPreapprovalUpdated(data.id);
      break;

    // Handle legacy notification format (type without action)
    case 'payment':
      console.log(`[Webhook] Processing payment notification for payment ${data.id}`);
      await handlePaymentCreated(data.id);
      break;

    case 'subscription_preapproval':
      console.log(`[Webhook] Processing subscription_preapproval for preapproval ${data.id}`);
      await handleSubscriptionPreapprovalUpdated(data.id);
      break;

    default:
      // Log unknown notification types but don't error
      console.log(`[Webhook] Unknown notification type: ${notificationType}`);
  }
}
