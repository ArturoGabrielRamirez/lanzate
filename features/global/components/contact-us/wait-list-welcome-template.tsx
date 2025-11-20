import { Html, Head, Preview, Body, Container, Section, Img, Heading, Text, Hr, Tailwind } from '@react-email/components'
import * as React from 'react'

import { XLogo, FacebookLogo, InstagramLogo } from '@/features/auth/components/social-logo'
import { WaitlistWelcomeProps } from '@/features/global/types'

const logoUrl = "https://lanzate.app/logo.png";



export function WaitlistWelcome({ recipientEmail }: WaitlistWelcomeProps) {
    return (
        <Html lang="es">
            <Head />
            <Preview>¡Estás en la lista de espera de Lanzate!</Preview>
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
                                Lista de espera
                            </Text>
                        </Section>

                        {/* Contenido Principal */}
                        <Section className="bg-[#0f0f0f] p-6 rounded-lg border border-[#2a2a2a] border-l-4 border-l-[#e56c43]">
                            <Text className="text-lg text-gray-100 mb-4">
                                ¡Hola! 👋
                            </Text>
                            <Text className="text-gray-300 leading-relaxed mb-4">
                                Gracias por tu interés en <strong className="text-[#e56c43]">Lanzate</strong>. 
                                Hemos añadido tu correo <strong className="text-[#e56c43]">{recipientEmail}</strong> a 
                                nuestra lista de espera.
                            </Text>
                            <Text className="text-gray-300 leading-relaxed mb-4">
                                Estamos trabajando arduamente en los últimos detalles.
                                Te notificaremos inmediatamente en cuanto la plataforma esté
                                lista para que puedas empezar a impulsar tu negocio.
                            </Text>
                            <Text className="text-gray-300 leading-relaxed font-semibold">
                                ¡Gracias por tu paciencia! 🚀
                            </Text>
                        </Section>

                        {/* Redes Sociales */}
                        <Section className="text-center my-6">
                            <Text className="text-gray-400 text-sm mb-4">
                                Mientras tanto, podés seguirnos en nuestras redes sociales
                            </Text>
                            <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border={0}>
                                <tr>
                                    <td style={{ padding: '0 8px' }}>
                                        <a 
                                            href="https://x.com/Lanzate_app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0f0f0f',
                                                border: '1px solid #2a2a2a',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <XLogo style={{ fontSize: '18px', color: '#ffffff' }} />
                                        </a>
                                    </td>
                                    <td style={{ padding: '0 8px' }}>
                                        <a 
                                            href="https://www.facebook.com/profile.php?id=61583496417536"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0f0f0f',
                                                border: '1px solid #2a2a2a',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <FacebookLogo style={{ fontSize: '18px', color: '#1877F2' }} />
                                        </a>
                                    </td>
                                    <td style={{ padding: '0 8px' }}>
                                        <a 
                                            href="https://instagram.com/lanzate.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0f0f0f',
                                                border: '1px solid #2a2a2a',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <InstagramLogo style={{ fontSize: '18px', color: '#E4405F' }} />
                                        </a>
                                    </td>
                                </tr>
                            </table>
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
                                    Este email fue enviado por{' '}
                                    <a href="https://lanzate.app" className="text-[#e56c43] no-underline font-medium">
                                        lanzate.app
                                    </a>
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

export default WaitlistWelcome;