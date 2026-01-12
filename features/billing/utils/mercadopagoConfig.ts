/**
 * MercadoPago Configuration
 *
 * Lazy-loaded singleton configuration for MercadoPago SDK.
 * Configuration is only created when first accessed, allowing
 * tests to mock the functions without requiring MP_ACCESS_TOKEN.
 *
 * @example
 * import { getMercadoPagoConfig } from '@/features/billing/utils/mercadopagoConfig';
 * const payment = await new Payment(getMercadoPagoConfig()).get({ id: '123' });
 */

import { MercadoPagoConfig } from 'mercadopago';

let _config: MercadoPagoConfig | null = null;

/**
 * Gets the MercadoPago configuration instance.
 * Creates the instance on first call (lazy initialization).
 *
 * @throws Error if MP_ACCESS_TOKEN environment variable is not set
 */
export function getMercadoPagoConfig(): MercadoPagoConfig {
  if (!_config) {
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error('MP_ACCESS_TOKEN environment variable is required');
    }
    _config = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }
  return _config;
}

/**
 * @deprecated Use getMercadoPagoConfig() instead for lazy initialization
 */
export const mercadopagoConfig = {
  get accessToken() {
    return getMercadoPagoConfig().accessToken;
  },
} as MercadoPagoConfig;
