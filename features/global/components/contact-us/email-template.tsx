import * as React from "react"

import { EmailTemplateProps } from "@/features/global/types"

export function EmailTemplate({ name, email, category, message }: EmailTemplateProps) {
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

    // Crear link para responder - codificamos en base64url
    const replyData = {
        email,
        name: name || "",
        category: category || "",
        message
    };

    // Convertir a base64url (compatible con URLs)
    const base64 = Buffer.from(JSON.stringify(replyData)).toString('base64');
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const replyLink = `https://lanzate.app/en/reply?data=${base64url}`;

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
                        Nuevo mensaje de soporte
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

                {/* Información del usuario */}
                <div
                    style={{
                        backgroundColor: "#0f0f0f",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "24px",
                        border: "1px solid #2a2a2a",
                    }}
                >
                    <div style={{ marginBottom: "12px" }}>
                        <p style={{ margin: "0 0 4px 0", color: "#999", fontSize: "13px" }}>
                            Nombre
                        </p>
                        <p style={{ margin: 0, color: "#e5e5e5", fontSize: "16px", fontWeight: "500" }}>
                            {name || "No especificado"}
                        </p>
                    </div>
                    <div>
                        <p style={{ margin: "0 0 4px 0", color: "#999", fontSize: "13px" }}>
                            Email
                        </p>
                        <p style={{ margin: 0, color: "#ea580c", fontSize: "16px", fontWeight: "500" }}>
                            {email}
                        </p>
                    </div>
                </div>

                {/* Mensaje */}
                <div
                    style={{
                        backgroundColor: "#0f0f0f",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "24px",
                        border: "1px solid #2a2a2a",
                        borderLeft: `4px solid ${categoryColor}`,
                    }}
                >
                    <p style={{ margin: "0 0 8px 0", color: "#999", fontSize: "13px", fontWeight: "600" }}>
                        MENSAJE
                    </p>
                    <p style={{ margin: 0, color: "#e5e5e5", fontSize: "15px", whiteSpace: "pre-wrap" }}>
                        {message}
                    </p>
                </div>

                {/* Botón de respuesta rápida */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <a
                        href={replyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            backgroundColor: "#ea580c",
                            color: "#ffffff",
                            padding: "14px 32px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "15px",
                            border: "none",
                            boxShadow: "0 4px 6px rgba(234, 88, 12, 0.3)",
                        }}
                    >
                        ✉️ Responder con template
                    </a>
                    <p style={{ margin: "12px 0 0 0", fontSize: "13px", color: "#666" }}>
                        Click para responder con el diseño de Lanzate
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
                        Enviado automáticamente desde{" "}
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