import Title from '@/features/layout/components/title'
import GridForms from '@/components/Visuals/GridFroms'
import { handleSignup } from '../../features/auth/actions/handleSignUp'
import Divider from '@/components/Visuals/Divider'
import Form from '@/features/layout/components/form'
import InputField from '@/features/layout/components/input'
/* import { signupSchema } from '@/features/auth/schemas/signupSchema' */
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SignupForm from '@/features/auth/components/form-signup'


export default function SignupPage() {
    return (
        <SignupForm />
        /*  <Form
           formAction={handleSignup}
           resolver={yupResolver(signupSchema)}
           contentButton="Sign up"
           successRedirect="/check-email"
           successMessage="Te registraste con éxito. Revisa tu email."
         >
           <InputField name="email" label="Email" type="email" />
           <InputField name="password" label="Password" type="password" />
         </Form> */
    )
}