import SignupForm from '@/features/auth/components/form-signup'
import Title from '@/features/layout/components/title'

export default function SignupPage() {
    return (
        <div className='p-4 grow flex flex-col'>
            <Title title='Sign Up' />
            <section className='grow flex justify-center items-center w-full'>
                <SignupForm />
            </section>
        </div>
    )
}