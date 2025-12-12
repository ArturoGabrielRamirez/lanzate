import { createNEMO, MiddlewareConfig } from '@rescale/nemo';
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware'

import { updateSession } from '@/features/middleware/utils/supabase';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing)

const middlewares: MiddlewareConfig = {
  '/:path*': [
    async (request: NextRequest) => {
      //Intl middleware : takes care of the internationalization
      const intlResponse = intlMiddleware(request)

      //if the intl middleware is not ok, redirect to the default locale
      if (intlResponse.ok === false) {
        return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url))
      }

      //Supabase middleware : takes care of the authentication
      const supabaseResponse = await updateSession(request, intlResponse)

      // Ensure we return the response that preserves the locale rewrite
      return supabaseResponse
    }
  ],
};

export const middleware = createNEMO(middlewares)

export const config = {
  matcher: [
    '/((?!api|_next|static|favicon.ico|_vercel|auth|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};