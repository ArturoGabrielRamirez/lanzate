import * as React from "react"

import { ReplyEmailTemplateProps } from "@/features/global/types"

export function ReplyEmailTemplate({
    recipientName,
    /*  recipientEmail,  */
    category,
    originalMessage,
    replyMessage,
    agentName = "El equipo de Lanzate"
}: ReplyEmailTemplateProps) {
    const categoryLabels: Record<string, string> = {
        technical: "Problema técnico",
        products: "Gestión de productos",
        ecommerce: "E-commerce y ventas",
        subdomain: "Subdominios y dominio",
        billing: "Cuenta y facturación",
        integrations: "Integraciones",
        general: "Consulta general",
    };

    const categoryColors: Record<string, string> = {
        technical: "#ef4444",
        products: "#f59e0b",
        ecommerce: "#10b981",
        subdomain: "#3b82f6",
        billing: "#8b5cf6",
        integrations: "#ec4899",
        general: "#6b7280",
    };

    const categoryLabel = category ? (categoryLabels[category] || "Soporte") : null;
    const categoryColor = category ? (categoryColors[category] || "#ea580c") : "#ea580c";

    return (
        <div
            style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                lineHeight: "1.6",
                backgroundColor: "#0a0a0a",
                padding: "40px 20px",
                color: "#e5e5e5",
            }}
        >
            <div
                style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "16px",
                    padding: "32px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    border: "1px solid #2a2a2a",
                }}
            >
                {/* Header con logo */}
                <div style={{ marginBottom: "32px", textAlign: "center" }}>
                    <h1
                        style={{
                            color: "#ea580c",
                            fontSize: "28px",
                            fontWeight: "bold",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Lanzate
                    </h1>
                    <p style={{ color: "#999", margin: 0, fontSize: "14px" }}>
                        Respuesta a tu consulta
                    </p>
                </div>

                {/* Saludo personalizado */}
                <div style={{ marginBottom: "24px" }}>
                    <p style={{ margin: 0, color: "#e5e5e5", fontSize: "16px" }}>
                        Hola {recipientName || "👋"},
                    </p>
                </div>

                {/* Categoría badge (solo si existe) */}
                {categoryLabel && (
                    <div style={{ marginBottom: "24px" }}>
                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: categoryColor + "20",
                                color: categoryColor,
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                border: `1px solid ${categoryColor}40`,
                            }}
                        >
                            📋 {categoryLabel}
                        </span>
                    </div>
                )}

                {/* Respuesta principal */}
                <div
                    style={{
                        backgroundColor: "#0f0f0f",
                        borderRadius: "12px",
                        padding: "24px",
                        marginBottom: "24px",
                        border: "1px solid #2a2a2a",
                        borderLeft: `4px solid ${categoryColor}`,
                    }}
                >
                    <p style={{
                        margin: 0,
                        color: "#e5e5e5",
                        fontSize: "15px",
                        whiteSpace: "pre-wrap",
                        lineHeight: "1.7"
                    }}>
                        {replyMessage}
                    </p>
                </div>

                {/* Firma */}
                <div style={{ marginBottom: "32px" }}>
                    <p style={{ margin: "0 0 4px 0", color: "#e5e5e5", fontSize: "15px" }}>
                        Saludos,
                    </p>
                    <p style={{ margin: 0, color: "#ea580c", fontSize: "15px", fontWeight: "600" }}>
                        {agentName}
                    </p>
                </div>

                {/* Mensaje original (colapsado) */}
                <div
                    style={{
                        backgroundColor: "#0a0a0a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "24px",
                        border: "1px solid #1a1a1a",
                    }}
                >
                    <p style={{
                        margin: "0 0 12px 0",
                        color: "#666",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                    }}>
                        Tu mensaje original
                    </p>
                    <p style={{
                        margin: 0,
                        color: "#999",
                        fontSize: "14px",
                        whiteSpace: "pre-wrap",
                        fontStyle: "italic"
                    }}>
                        {originalMessage}
                    </p>
                </div>

                {/* CTA - Responder */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <p style={{ margin: "0 0 16px 0", color: "#999", fontSize: "14px" }}>
                        ¿Necesitas más ayuda? Responde directamente a este email.
                    </p>
                </div>

                {/* Footer */}
                <div
                    style={{
                        paddingTop: "24px",
                        borderTop: "1px solid #2a2a2a",
                        textAlign: "center",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                        Este email fue enviado por{" "}
                        <a
                            href="https://lanzate.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#ea580c", textDecoration: "none", fontWeight: "500" }}
                        >
                            lanzate.app
                        </a>
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#555" }}>
                        {new Date().toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}