import Form from '@/components/Form/Form'
import Input from '@/components/Form/Input'
import Label from '@/components/Form/Label'
import Title from '@/components/Tiltle/Title'
import GridForms from '@/components/Visuals/GridFroms'
import { handleSignup } from '../actions/handleSignUp'


export default async function SignupPage() {
    const pageLayoutClasses = `px-10`
    const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`

    return (
        <GridForms className={pageLayoutClasses}>
            <Title title='Sign Up' />
            <Form formAction={handleSignup} contentButton='Sign Up' className={formPasswordClasses} animationDir='left'>
                <Label htmlFor='email' text='Email:' className='pl-2' animationDir='left' />
                <Input required={true} htmlFor='email' animationDir='left' />
                <Label htmlFor='password' text='Password:' className='pl-2' animationDir='left' />
                <Input required={true} htmlFor='password' animationDir='left' />
            </Form>
        </GridForms>
    )
}