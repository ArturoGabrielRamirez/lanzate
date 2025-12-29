"use server"

import { Resend } from 'resend';

import WaitlistWelcome from '@/features/global/components/contact-us/wait-list-welcome-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWaitlistConfirmation(email: string) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('❌ RESEND_API_KEY no configurada');
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Lanzate <soporte@mail.lanzate.app>',
            to: [email],
            subject: '¡Estás en la lista de espera de Lanzate! 🎉',
            replyTo: 'soporte@mail.lanzate.app',
            react: WaitlistWelcome({ recipientEmail: email }),
        });

        if (error) {
            console.error('❌ Error de Resend:', error);
            throw new Error(`Error al enviar email: ${JSON.stringify(error)}`);
        }

        return data;

    } catch (error) {
        console.error('💥 Excepción al enviar email:', error);
        throw error;
    }
}