"use client"

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { useReplySupport } from "@/features/global/hooks/use-reply-support";

function ReplyForm() {
  const searchParams = useSearchParams();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [category, setCategory] = useState("");
  const [originalMessage, setOriginalMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [agentName, setAgentName] = useState("El equipo de Lanzate");
  const [autoFilled, setAutoFilled] = useState(false);

  const { sendReply, loading, error, success } = useReplySupport();

  useEffect(() => {
    const dataParam = searchParams.get('data');

    if (dataParam && !autoFilled) {
      try {
        const decoded = atob(dataParam.replace(/-/g, '+').replace(/_/g, '/'));
        const data = JSON.parse(decoded);

        setRecipientEmail(data.email || "");
        setRecipientName(data.name || "");
        setCategory(data.category || "");
        setOriginalMessage(data.message || "");
        setAutoFilled(true);
      } catch (err) {
        console.error("Error decodificando parámetros:", err);
      }
    }
  }, [searchParams, autoFilled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendReply({
        recipientEmail,
        recipientName: recipientName || undefined,
        category: category || undefined,
        originalMessage,
        replyMessage,
        agentName,
      });

      setRecipientEmail("");
      setRecipientName("");
      setCategory("");
      setOriginalMessage("");
      setReplyMessage("");
      setAutoFilled(false);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { value: "", label: "Sin categoría" },
    { value: "technical", label: "Problema técnico" },
    { value: "products", label: "Gestión de productos" },
    { value: "ecommerce", label: "E-commerce y ventas" },
    { value: "subdomain", label: "Subdominios y dominio" },
    { value: "billing", label: "Cuenta y facturación" },
    { value: "integrations", label: "Integraciones" },
    { value: "general", label: "Consulta general" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000",
      color: "#fff",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#ea580c",
            marginBottom: "0.5rem"
          }}>
            Responder Mensaje de Soporte
          </h1>
          <p style={{ color: "#a3a3a3" }}>
            {autoFilled
              ? "✅ Formulario auto-llenado desde el email"
              : "Copia los datos del email que recibiste y envía una respuesta con template"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {/* Email del destinatario */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
                Email del destinatario *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "1rem"
                }}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            {/* Nombre del destinatario */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
                Nombre del destinatario (opcional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "1rem"
                }}
                placeholder="Juan Pérez"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {/* Categoría */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "1rem"
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre del agente */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
                Firmar como:
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#171717",
                  border: "1px solid #262626",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  color: "#fff",
                  fontSize: "1rem"
                }}
                placeholder="Tu nombre"
              />
            </div>
          </div>

          {/* Mensaje original */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
              Mensaje original del usuario *
            </label>
            <textarea
              value={originalMessage}
              onChange={(e) => setOriginalMessage(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#171717",
                border: "1px solid #262626",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "1rem",
                minHeight: "120px",
                resize: "vertical"
              }}
              placeholder="Pega aquí el mensaje que recibiste del usuario..."
              required
            />
            <p style={{ fontSize: "0.75rem", color: "#737373", marginTop: "0.25rem" }}>
              💡 Copiá el mensaje desde el email que recibiste
            </p>
          </div>

          {/* Preview del mensaje original */}
          {originalMessage && (
            <div style={{
              backgroundColor: "#171717",
              border: "1px solid #404040",
              borderRadius: "0.5rem",
              padding: "1rem"
            }}>
              <p style={{
                fontSize: "0.75rem",
                color: "#737373",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                fontWeight: "600"
              }}>
                Preview del mensaje original:
              </p>
              <p style={{
                fontSize: "0.875rem",
                color: "#d4d4d4",
                whiteSpace: "pre-wrap",
                fontStyle: "italic",
                margin: 0
              }}>
                {originalMessage}
              </p>
            </div>
          )}

          {/* Respuesta */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", color: "#a3a3a3", marginBottom: "0.5rem" }}>
              Tu respuesta *
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#171717",
                border: "1px solid #262626",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "1rem",
                minHeight: "200px",
                resize: "vertical"
              }}
              placeholder="Escribe tu respuesta aquí...

Hola [nombre], gracias por contactarnos.

[Tu respuesta]

Saludos,
[Tu nombre]"
              required
            />
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "0.5rem",
              padding: "1rem",
              color: "#f87171"
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: "0.5rem",
              padding: "1rem",
              color: "#4ade80"
            }}>
              ✅ Respuesta enviada correctamente con el template de Lanzate
            </div>
          )}

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={loading || !recipientEmail || !originalMessage || !replyMessage}
            style={{
              width: "100%",
              backgroundColor: loading || !recipientEmail || !originalMessage || !replyMessage ? "#404040" : "#ea580c",
              color: "#fff",
              fontWeight: "bold",
              padding: "1rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              fontSize: "1.125rem",
              cursor: loading || !recipientEmail || !originalMessage || !replyMessage ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loading && recipientEmail && originalMessage && replyMessage) {
                e.currentTarget.style.backgroundColor = "#c2410c";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && recipientEmail && originalMessage && replyMessage) {
                e.currentTarget.style.backgroundColor = "#ea580c";
              }
            }}
          >
            {loading ? "Enviando con template..." : "✉️ Enviar respuesta con template"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#737373", margin: 0 }}>
            El usuario recibirá tu respuesta con el diseño de Lanzate
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ReplyPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p style={{ color: "#ea580c", fontSize: "1.25rem" }}>Cargando formulario...</p>
      </div>
    }>
      <ReplyForm />
    </Suspense>
  );
}