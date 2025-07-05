'use server'

import { handleGoogleLogIn } from '../actions/handleGoogleLogIn'



import Title from '@/components/Tiltle/Title'
import GridForms from '@/components/Visuals/GridFroms'
import Divider from '@/components/Visuals/Divider'
import Form from '@/components/Form/Form'
import Label from '@/components/Form/Label'
import Input from '@/components/Form/Input'
import { handleLogIn } from '../actions/handleLogIn'

export default async function LoginPage() {
    const pageLayoutClasses = `px-10`
    const titleClasses = `row-start-1 animate-slide-in-left`
    const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center  `
    const formOtherClasses = `md:pt-2 sm:row-start-2 sm:col-start-3 sm:min-w-full `

    return (
        <GridForms className={pageLayoutClasses}>
            <Title title='Log In' className={titleClasses} />
            <Form formAction={handleLogIn} contentButton='Log In' className={formPasswordClasses} animationDir='left' >
                <Label htmlFor='email' text='Email:' className='pl-2' animationDir='left' />
                <Input required={true} htmlFor='email' animationDir='left' />
                <Label htmlFor='password' text='Password:' className='pl-2' animationDir='left' />
                <Input required={true} htmlFor='password' animationDir='left' />
            </Form>
            <Divider className='animate-slide-in-up h-2/3' />
            <Form formAction={handleGoogleLogIn} className={formOtherClasses} contentButton='Log In with Google' animationDir='right'>
                <Label htmlFor='email' text='Or login with:' className='pl-2' animationDir='right' />
            </Form>
        </GridForms>
    )
}