import { SignupForm } from '@/features/auth/components'
import { Title } from '@/features/layout/components'
export default function SignupPage() {
    return (
        <div className='p-4 grow flex flex-col max-md:pt-24'>
            <Title title='Sign Up' />
            <section className='grow flex justify-center items-center w-full'>
                <SignupForm />
            </section>
        </div>
    )
}