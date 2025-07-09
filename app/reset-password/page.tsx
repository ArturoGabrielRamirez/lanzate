
import { ResetPassword } from '@/features/auth/components'
import { Title } from '@/features/layout/components'
export default function ResetPage() {

  return (
    <div className='p-4 grow flex flex-col'>
      <Title title='Reset Password' />
      <section className='grow flex justify-center items-center w-full'>
        <ResetPassword />
      </section>
    </div>
  )

}