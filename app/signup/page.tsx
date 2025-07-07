
import Input from '@/components/Form/Input'
import Label from '@/components/Form/Label'
import Title from '@/features/layout/components/title'
import GridForms from '@/components/Visuals/GridFroms'
import { handleSignup } from '../../features/auth/actions/handleSignUp'
import Divider from '@/components/Visuals/Divider'
import Form from '@/features/layout/components/form'
import InputField from '@/features/layout/components/input'


export default async function SignupPage() {
    const pageLayoutClasses = `px-10 grow flex items-center`
    const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`

    return (
        <GridForms className={pageLayoutClasses}>
            <Title title='Sign Up' />
            <Form formAction={handleSignup}
                contentButton='Sign Up'
                successMessage='Signed up successfully!'
                loadingMessage='Signing up...'
                className={formPasswordClasses}>
                <InputField name='email' label='Email:' type='email' />
                <InputField name='password' label='Password:' type='password' />
            </Form>
            <Divider className='h-2/3' />
        </GridForms>
    )
}