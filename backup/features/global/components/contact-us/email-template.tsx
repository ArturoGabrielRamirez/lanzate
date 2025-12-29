import { Html, Head, Preview, Body, Container, Section, Img, Heading, Text, Hr, Tailwind, Link, Button } from '@react-email/components';
import * as React from 'react';

import { EmailTemplateProps } from '@/features/global/types';

const logoUrl = "https://lanzate.app/logo.png";

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
    const categoryColor = category ? (categoryColors[category] || "#e56c43") : "#e56c43";

    const replyData = { email, name: name || "", category: category || "", message };
    const base64Data = Buffer.from(JSON.stringify(replyData)).toString('base64');
    const base64url = base64Data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const replyLink = `https://lanzate.app/en/reply?data=${base64url}`;

    return (
        <Html lang="es">
            <Head />
            <Preview>Nuevo mensaje de soporte - {categoryLabel || "Consulta"}</Preview>
            <Tailwind>
                <Body className="bg-black text-gray-100 font-sans p-4">
                    <Container className="bg-[#1a1a1a] p-8 rounded-xl max-w-lg border border-[#2a2a2a]">
                        {/* Header con Logo y Título */}
                        <Section className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Img
                                    src={logoUrl}
                                    width="32"
                                    height="32"
                                    alt="Lanzate"
                                    className="inline-block"
                                />
                                <Heading className="text-[28px] text-[#e56c43] font-bold m-0 inline-block">
                                    Lanzate
                                </Heading>
                            </div>
                            <Text className="text-gray-400 text-sm m-0">
                                Nuevo mensaje de soporte
                            </Text>
                        </Section>

                        {/* Categoría */}
                        {categoryLabel && (
                            <Section className="mb-6">
                                <div
                                    className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                                    style={{
                                        backgroundColor: categoryColor + "20",
                                        color: categoryColor,
                                        border: `1px solid ${categoryColor}40`
                                    }}
                                >
                                    📋 {categoryLabel}
                                </div>
                            </Section>
                        )}

                        {/* Info Usuario */}
                        <Section className="bg-[#0f0f0f] p-5 rounded-lg border border-[#2a2a2a] mb-6">
                            <div className="mb-3">
                                <Text className="text-xs text-gray-400 m-0 mb-1">Nombre</Text>
                                <Text className="text-base text-gray-100 font-medium m-0">
                                    {name || "No especificado"}
                                </Text>
                            </div>
                            <div>
                                <Text className="text-xs text-gray-400 m-0 mb-1">Email</Text>
                                <Text className="text-base text-[#e56c43] font-medium m-0">
                                    {email}
                                </Text>
                            </div>
                        </Section>

                        {/* Mensaje */}
                        <Section
                            className="bg-[#0f0f0f] p-5 rounded-lg border border-[#2a2a2a] mb-6"
                            style={{ borderLeft: `4px solid ${categoryColor}` }}
                        >
                            <Text className="text-xs text-gray-400 font-semibold m-0 mb-2">
                                MENSAJE
                            </Text>
                            <Text className="text-[15px] text-gray-100 leading-relaxed m-0 whitespace-pre-wrap">
                                {message}
                            </Text>
                        </Section>

                        {/* Botón */}
                        <Section className="text-center mb-6">
                            <Button
                                href={replyLink}
                                className="bg-[#e56c43] text-white px-8 py-3.5 rounded-lg no-underline font-semibold text-[15px] inline-block"
                                style={{ boxShadow: "0 4px 6px rgba(229, 108, 67, 0.3)" }}
                            >
                                ✉️ Responder con template
                            </Button>
                            <Text className="text-xs text-gray-500 m-0 mt-3">
                                Click para responder con el diseño de Lanzate
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Hr className="border-gray-700 my-6" />
                        <Section className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Img
                                    src={logoUrl}
                                    width="16"
                                    height="16"
                                    alt=""
                                    className="inline-block"
                                />
                                <Text className="text-xs text-gray-500 m-0 inline-block">
                                    Enviado automáticamente desde{' '}
                                    <Link href="https://lanzate.app" className="text-[#e56c43] no-underline font-medium">
                                        lanzate.app
                                    </Link>
                                </Text>
                            </div>
                            <Text className="text-xs text-gray-600 m-0">
                                {new Date().toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

export default EmailTemplate;