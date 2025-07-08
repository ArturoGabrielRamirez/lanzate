import { Label } from '@/components/ui/label'
import Form from '@/features/layout/components/form'
import Title from '@/features/layout/components/title'
import ResetPasswordLink from '@/features/auth/components/reset-password-link'
import { handleGoogleLogIn } from '../../features/auth/actions/handleGoogleLogIn'
import LoginForm from '@/features/auth/components/form-login'

export default async function LoginPage() {


    return (
        <div className="p-4 grow flex flex-col">
            <Title title='Log In' />
            <div className='flex flex-col lg:flex-row gap-4 w-full max-w-4xl mx-auto grow items-center'>
                <div className='w-full lg:pr-10'>
                    <LoginForm />
                    <ResetPasswordLink />
                </div>
                <div className='lg:w-1 lg:h-100 w-full h-1 bg-primary/50'></div>
                <Form formAction={handleGoogleLogIn} className={"w-full grid place-content-left lg:pl-10"} contentButton='Google'>
                    <Label htmlFor='google' className='mb-2 w-full text-center justify-center'>Or login with:</Label>
                </Form>
            </div>
        </div>
    )
}