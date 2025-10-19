import Image from 'next/image'

import resetPasswordImage from '@/features/auth/assets/Forgot password-pana.svg'
import { ResetPassword } from '@/features/auth/components'
import { Link } from '@/i18n/naviation'

export default function ResetPage() {
  return (
    <section className="min-h-dvh relative pt-17 flex">
      <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:pb-12 lg:pb-20">
        <div className='w-full flex flex-col gap-8 lg:max-w-md md:justify-self-end'>
          <ResetPassword />
          <div>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                Ya recordaste tu contraseña?{" "}
              </h3>
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                Iniciar sesión
              </Link>
            </div>
            <div className="flex gap-2 items-center justify-center w-full">
              <h3 className="text-sm text-gray-600 dark:text-gray-400">
                No tenés una cuenta?{" "}
              </h3>
              <Link href="/login" className="text-sm text-blue-500 hover:underline">
                Registrate
              </Link>
            </div>
          </div>
        </div>
        <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-start">
          <Image
            src={resetPasswordImage}
            alt="Hero Image"
            width={5}
            className="w-full antialiased object-bottom"
          />
        </div>
      </div>
    </section>
  )
}