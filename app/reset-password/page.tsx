import ResetPasswordForm from '@/features/auth/components/form-reset-password'
import Title from '@/features/layout/components/title'

export default function ResetPage() {

  return (
    <div className='p-4 grow flex flex-col'>
      <Title title='Reset Password' />
      <section className='grow flex justify-center items-center w-full'>
        <ResetPasswordForm />
      </section>
    </div>
  )

}