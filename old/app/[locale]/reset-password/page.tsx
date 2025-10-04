
import { ResetPassword } from '@/features/auth/components'

export default function ResetPage() {
  return (
    <div className='p-4 grow flex flex-col pt-17 relative z-10'>
      <section className='grow flex justify-center items-center w-full'>
        <ResetPassword />
      </section>
    </div>
  )
}