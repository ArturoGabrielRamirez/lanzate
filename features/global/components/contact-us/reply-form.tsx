"use client";

import { useState } from "react"

import { useReplySupport } from "@/features/global/hooks/use-reply-support"
import { ReplyFormProps } from "@/features/global/types"

export function ReplyForm({
    recipientEmail,
    recipientName,
    category,
    originalMessage,
    onSuccess
}: ReplyFormProps) {
    const [replyMessage, setReplyMessage] = useState("");
    const [agentName, setAgentName] = useState("El equipo de Lanzate");
    const { sendReply, loading, error, success } = useReplySupport();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await sendReply({
                recipientEmail,
                recipientName,
                category,
                originalMessage,
                replyMessage,
                agentName,
            });

            // Limpiar formulario
            setReplyMessage("");
            onSuccess?.();
        } catch (err) {
            // El error ya se maneja en el hook
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info del destinatario */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <div className="text-sm text-neutral-400 mb-1">Para:</div>
                <div className="text-white font-medium">
                    {recipientName || recipientEmail}
                </div>
                <div className="text-orange-500 text-sm">{recipientEmail}</div>
            </div>

            {/* Mensaje original (colapsado) */}
            <details className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <summary className="text-sm text-neutral-400 cursor-pointer">
                    Ver mensaje original
                </summary>
                <p className="mt-2 text-neutral-300 text-sm whitespace-pre-wrap italic">
                    {originalMessage}
                </p>
            </details>

            {/* Nombre del agente */}
            <div>
                <label className="block text-sm text-neutral-400 mb-2">
                    Firmar como:
                </label>
                <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Tu nombre"
                />
            </div>

            {/* Respuesta */}
            <div>
                <label className="block text-sm text-neutral-400 mb-2">
                    Tu respuesta:
                </label>
                <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none min-h-[200px] resize-y"
                    placeholder="Escribe tu respuesta aquí..."
                    required
                />
            </div>

            {/* Mensajes de estado */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                    ✓ Respuesta enviada correctamente
                </div>
            )}

            {/* Botón enviar */}
            <button
                type="submit"
                disabled={loading || !replyMessage.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
                {loading ? "Enviando..." : "Enviar respuesta"}
            </button>
        </form>
    );
}