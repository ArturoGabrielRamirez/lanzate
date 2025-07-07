'use server'

import { Label } from '@/components/ui/label'
import Divider from '@/components/Visuals/Divider'
import Form from '@/features/layout/components/form'
import GridForms from '@/components/Visuals/GridFroms'
import Title from '@/features/layout/components/title'
import InputField from '@/features/layout/components/input'
import { handleLogIn } from '../../features/auth/actions/handleLogIn'
import ResetPasswordLink from '@/features/auth/components/reset-password-link'
import { handleGoogleLogIn } from '../../features/auth/actions/handleGoogleLogIn'

export default async function LoginPage() {
    const pageLayoutClasses = `px-10 grow flex items-center`
    const titleClasses = `row-start-1`
    const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`
    const formOtherClasses = `md:pt-2 sm:row-start-2 sm:col-start-3 sm:min-w-full flex justify-center`

    return (
        <GridForms className={pageLayoutClasses}>
            <Title title='Log In' className={titleClasses} />
            <Form
                formAction={handleLogIn}
                contentButton='Log In'
                successMessage='Logged in successfully!'
                loadingMessage='Logging in...'
                className={formPasswordClasses}  >
                <InputField name='email' label='Email:' type='email' />
                <InputField name='password' label='Password:' type='password' />
            </Form>
            <ResetPasswordLink />
            <Divider className='h-2/3' />
            <Form formAction={handleGoogleLogIn} className={formOtherClasses} contentButton='Google'>
                <Label htmlFor='google' className='pl-2'>Or login with:</Label>
            </Form>
        </GridForms>
    )
}