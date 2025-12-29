'use server'

import { validateNewUserCreationAction } from '@/features/account/actions'
import { findUserAnonymizedData, getSignUpPermissionData, insertUserData } from '@/features/auth/data'
import { SignupFormPayload } from '@/features/auth/types'
import { insertLogEntry } from '@/features/global/data/insert-log-entry.data'
import { actionWrapper } from '@/features/global/utils'

export async function handleSignup(payload: SignupFormPayload) {
    return actionWrapper(async () => {

        const { email, password, username } = payload
        const emailStr = (() => {
            if (typeof email === 'string') return email
            if (email && typeof email === 'object' && 'email' in email) {
                const maybeEmail = (email as Record<string, unknown>)['email']
                return typeof maybeEmail === 'string' ? maybeEmail : ''
            }
            return ''
        })()

        const passwordStr = (() => {
            if (typeof password === 'string') return password
            if (password && typeof password === 'object' && 'password' in password) {
                const maybePassword = (password as Record<string, unknown>)['password']
                return typeof maybePassword === 'string' ? maybePassword : ''
            }
            return ''
        })()

        try {
            const validation = await validateNewUserCreationAction(emailStr)

            if (!validation.payload?.canCreate && validation.payload?.conflict) {
                throw new Error('Ya existe una cuenta activa con este correo electrónico')
            }

        } catch (validationError) {
            if (validationError instanceof Error && validationError.message.includes('Ya existe una cuenta activa con este correo electrónico')) {
                throw new Error('Error en validación:', validationError)
            }
        }

        const activeUser = await findUserAnonymizedData({ email: emailStr })

        if (activeUser) throw new Error('Ya existe una cuenta activa con este correo electrónico')


        const { hasError: signUpError, payload: signUpData, message: signUpMessage } = await getSignUpPermissionData({ email: emailStr, password: passwordStr })
        if (signUpError) throw new Error(signUpMessage)
        if (!signUpData) throw new Error('No se devolvió ningún usuario al registrarse')

        const { hasError: insertError, payload: user } = await insertUserData({
            email: emailStr,
            provider: "email",
            supabaseUserId: signUpData.id,
            username,
        })

        if (insertError) throw new Error('Error al insertar usuario en la base de datos')

        await insertLogEntry({
            action: "CREATE",
            entity_type: "USER",
            entity_id: user.id,
            user_id: user.id,
            action_initiator: "Formulario de registro",
            details: `Usuario se registró usando el formulario de registro${activeUser ? ' (correo electrónico previamente anonimizado)' : ''}`
        })

        return {
            hasError: false,
            message: "Usuario registrado exitosamente",
            payload: signUpData
        }
    })
}