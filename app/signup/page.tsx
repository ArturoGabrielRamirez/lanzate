import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Label from '@/components/Form/Label'
import Title from '@/features/layout/components/title'
import GridForms from '@/components/Visuals/GridFroms'
import { handleSignup } from '../actions/handleSignUp'
import Divider from '@/components/Visuals/Divider'


export default async function SignupPage() {
    const pageLayoutClasses = `px-10 grow flex items-center`
    const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`

    return (
        <GridForms className={pageLayoutClasses}>
            <Title title='Sign Up' />
            <Form formAction={handleSignup} contentButton='Sign Up' className={formPasswordClasses}>
                <Label htmlFor='email' text='Email:' className='pl-2' />
                <Input required={true} htmlFor='email' />
                <Label htmlFor='password' text='Password:' className='pl-2' />
                <Input required={true} htmlFor='password' />
            </Form>
            <Divider className='h-2/3' />
        </GridForms>
    )
}