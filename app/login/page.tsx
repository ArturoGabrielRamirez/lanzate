import { Label } from '@/components/ui/label'
import Divider from '@/components/Visuals/Divider'
import Form from '@/features/layout/components/form'
import Title from '@/features/layout/components/title'
import ResetPasswordLink from '@/features/auth/components/reset-password-link'
import { handleGoogleLogIn } from '../../features/auth/actions/handleGoogleLogIn'
import LoginForm from '@/features/auth/components/form-login'

export default async function LoginPage() {
    const pageLayoutClasses = `px-10 grow flex items-center grid grid-rows-[1fr_1fr] grid-cols-[1fr] sm:grid-rows-[40px_1fr] sm:grid-cols-[1fr_1px_1fr] justify-center bg-white dark:bg-gray-800 sm:gap-x-20 sm:p-8`
    const titleClasses = `row-start-1`
    const formOtherClasses = `md:pt-2 sm:row-start-2 sm:col-start-3 sm:min-w-full flex justify-center`

    return (
        <div className={pageLayoutClasses}>
            <Title title='Log In' className={titleClasses} />
            <LoginForm />
            <Divider className='h-2/3' />
            <Form formAction={handleGoogleLogIn} className={formOtherClasses} contentButton='Google'>
                <Label htmlFor='google' className='pl-2'>Or login with:</Label>
            </Form>
            <ResetPasswordLink />
        </div>
    )
}