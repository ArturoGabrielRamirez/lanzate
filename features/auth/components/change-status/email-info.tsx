import { EmailInfoProps } from "../../types";



export function EmailInfo({ targetEmail, lastResendInfo }: EmailInfoProps) {
    return (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="space-y-4">
                <p className="text-sm opacity-80">
                    Email enviado a:
                </p>
                <div className="text-xs text-gray-400 bg-white/5 rounded p-3">
                    <p className="font-medium text-blue-300 break-all">
                        {targetEmail || 'Email no disponible'}
                    </p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Haz clic en el enlace del email para continuar. Revisa también tu carpeta de spam.
                </p>
            </div>
        </div>
    );
}