import { toast } from "sonner";
import { EmailChangeStatus } from "../types";


interface ResendParams {
    type: 'signup' | 'recovery' | 'smart';
    email?: string;
    emailChangeStatus: EmailChangeStatus;
}

interface ResendResponse {
    message: string;
    data?: {
        email: string;
        resendType?: string;
        type: string;
        reason?: string;
    };
}

class ResendEmailService {
    private buildPayload(params: ResendParams) {
        const { type, email, emailChangeStatus } = params;

        if (type === 'smart') {
            const { status } = { status: emailChangeStatus };
            let step: 'old_email' | 'new_email' | undefined;

            if (status.hasEmailChange) {
                if (!status.oldEmailConfirmed) {
                    step = 'old_email';
                } else if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
                    step = 'new_email';
                }
            }

            return {
                type: 'email_change',
                ...(step && { step })
            };
        }

        return {
            type: type === 'recovery' ? 'recovery' : 'signup',
            email
        };
    }

    private async handleResponse(response: Response): Promise<ResendResponse> {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON. Got:', text.substring(0, 200));
            throw new Error('Server returned non-JSON response. Check server logs.');
        }

        const data = await response.json();

        if (!response.ok || data.error) {
            this.handleErrorResponse(response.status, data);
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return {
            message: data.message || "Email reenviado exitosamente",
            data: data.data
        };
    }

    private handleErrorResponse(status: number, data: any) {
        switch (status) {
            case 404:
                toast.error("No user found with this email address.");
                break;
            case 429:
                toast.error("Too many requests. Please wait a moment.");
                break;
            case 401:
                toast.error("Usuario no autenticado. Por favor, inicia sesión.");
                break;
            default:
                if (data.message?.includes('already confirmed') || data.message?.includes('ya está confirmado')) {
                    toast.info("Email is already confirmed.");
                } else if (data.message?.includes('No hay confirmaciones pendientes')) {
                    toast.info("No pending confirmations.");
                }
                break;
        }
    }

    async resend(params: ResendParams): Promise<ResendResponse> {
        const payload = this.buildPayload(params);
        
        const response = await fetch('/auth/resend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return this.handleResponse(response);
    }
}

export const resendEmailService = new ResendEmailService();