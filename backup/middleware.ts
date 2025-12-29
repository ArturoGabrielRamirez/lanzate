import { createNEMO, MiddlewareConfig } from '@rescale/nemo';
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware'

import { handleSubdomain, updateSession } from '@/features/middleware/utils';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing)

const middlewares: MiddlewareConfig = {
  '/:path*': [
    async (request: NextRequest) => {

      const intlResponse = intlMiddleware(request)

      if (intlResponse.ok === false) {
        return intlResponse
      }

      const supabaseResponse = await updateSession(request, intlResponse)

      const subdomainResponse = await handleSubdomain(request, supabaseResponse)

      return subdomainResponse
    }
  ],
};

export const middleware = createNEMO(middlewares)

export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|_vercel|auth|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};