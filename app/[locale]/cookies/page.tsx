import { FileText } from "lucide-react";
import Link from "next/link";

function CookiesPolicy() {
    return (
        <section className="container mx-auto px-4 pt-20 md:pt-24">
            <div className="text-left flex flex-col gap-8">
                <div>
                    <div className="flex items-center gap-2 text-primary">
                        <FileText />
                        <h2 className="text-2xl font-bold font-oswald">POLÍTICA DE COOKIES</h2>
                    </div>
                    <p className="text-muted-foreground font-quattrocento">
                        Última actualización: <strong>30 de octubre de 2025</strong>
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">INTRODUCCIÓN</h2>
                    <div className="mb-4">
                        <p className="text-sm leading-relaxed mb-4">
                            Esta Política de Cookies explica cómo Lanzáte (&quot;nosotros&quot;, &quot;nuestro&quot;, &quot;la Empresa&quot;) utiliza cookies y tecnologías similares cuando visitás nuestro sitio web <a href="https://www.lanzate.app" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app</a> y usás nuestra aplicación móvil Lanzáte App (en conjunto, los &quot;Servicios&quot;).
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Esta política explica qué son estas tecnologías, por qué las usamos, y tus derechos para controlar nuestro uso de ellas. En algunos casos, podemos usar cookies y tecnologías similares para recolectar información personal, o información que se convierte en personal si la combinamos con otra información.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Esta Política de Cookies se complementa con nuestra <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad</Link> y nuestros <Link href="/terms-and-conditions" className="text-blue-600 hover:text-blue-800 underline">Términos y Condiciones</Link>. El uso de cookies está sujeto a la Ley 25.326 de Protección de Datos Personales de la República Argentina y las disposiciones de la Dirección Nacional de Protección de Datos Personales (DNPDP).
                        </p>

                        <p className="text-sm leading-relaxed mb-6">
                            Para más información sobre cómo procesamos tus datos personales, por favor revisá nuestra Política de Privacidad en <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app/privacy-policy</Link>.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">

                    <div className="md:sticky md:top-20 self-start mb-8 lg:mb-0">
                        <h2 className="text-2xl font-bold mb-6">ÍNDICE</h2>
                        <div className="space-y-2 text-sm">
                            <div><a href="#que-son-cookies" className="text-blue-600 hover:text-blue-800 underline">1. ¿QUÉ SON LAS COOKIES?</a></div>
                            <div><a href="#por-que-usamos" className="text-blue-600 hover:text-blue-800 underline">2. ¿POR QUÉ USAMOS COOKIES?</a></div>
                            <div><a href="#tipos-cookies" className="text-blue-600 hover:text-blue-800 underline">3. TIPOS DE COOKIES QUE USAMOS</a></div>
                            <div><a href="#cookies-esenciales" className="text-blue-600 hover:text-blue-800 underline">4. COOKIES ESENCIALES</a></div>
                            <div><a href="#cookies-rendimiento" className="text-blue-600 hover:text-blue-800 underline">5. COOKIES DE RENDIMIENTO Y ANALÍTICAS</a></div>
                            <div><a href="#cookies-funcionalidad" className="text-blue-600 hover:text-blue-800 underline">6. COOKIES DE FUNCIONALIDAD</a></div>
                            <div><a href="#cookies-publicidad" className="text-blue-600 hover:text-blue-800 underline">7. COOKIES DE PUBLICIDAD Y MARKETING</a></div>
                            <div><a href="#cookies-terceros" className="text-blue-600 hover:text-blue-800 underline">8. COOKIES DE TERCEROS</a></div>
                            <div><a href="#como-controlar" className="text-blue-600 hover:text-blue-800 underline">9. CÓMO CONTROLAR LAS COOKIES</a></div>
                            <div><a href="#app-movil" className="text-blue-600 hover:text-blue-800 underline">10. APLICACIÓN MÓVIL</a></div>
                            <div><a href="#actualizaciones" className="text-blue-600 hover:text-blue-800 underline">11. ACTUALIZACIONES DE ESTA POLÍTICA</a></div>
                            <div><a href="#contacto" className="text-blue-600 hover:text-blue-800 underline">12. CONTACTO</a></div>
                        </div>
                    </div>

                    <div>
                        <section id="que-son-cookies" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">1. ¿QUÉ SON LAS COOKIES?</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Las cookies son pequeños archivos de datos que se colocan en tu computadora o dispositivo móvil cuando visitás un sitio web. Las cookies son ampliamente utilizadas por los propietarios de sitios web para hacer que sus sitios funcionen, o para que funcionen de manera más eficiente, así como para proporcionar información estadística.
                                </p>

                                <p>
                                    Las cookies establecidas por el propietario del sitio web (en este caso, Lanzáte) se llaman &quot;cookies propias&quot; o &quot;cookies de primera parte&quot;. Las cookies establecidas por partes distintas al propietario del sitio web se llaman &quot;cookies de terceros&quot;. Las cookies de terceros permiten que se proporcionen características o funcionalidades de terceros en o a través del sitio web (por ejemplo, publicidad, contenido interactivo y análisis). Las partes que establecen estas cookies de terceros pueden reconocer tu computadora tanto cuando visita el sitio web en cuestión como cuando visita ciertos otros sitios web.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Tecnologías Similares</h3>
                                <p>
                                    También usamos otras tecnologías similares como web beacons (a veces llamados &quot;píxeles de seguimiento&quot; o &quot;gifs transparentes&quot;). Estos son archivos gráficos diminutos que contienen un identificador único que nos permite reconocer cuando alguien ha visitado nuestros Servicios o abierto un correo electrónico que le hemos enviado. Esto nos permite, por ejemplo, monitorear los patrones de tráfico de los usuarios de una página dentro de nuestros Servicios a otra, entregar o comunicarnos con cookies, entender si has llegado a nuestros Servicios desde un anuncio en línea mostrado en un sitio web de terceros, mejorar el rendimiento del sitio y medir el éxito de las campañas de marketing por correo electrónico.
                                </p>

                                <p className="mt-4">
                                    Conforme a la Ley 25.326 y las disposiciones de la DNPDP, el uso de cookies que recolecten datos personales requiere de tu consentimiento informado, excepto para aquellas estrictamente necesarias para el funcionamiento del servicio.
                                </p>
                            </div>
                        </section>

                        <section id="por-que-usamos" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">2. ¿POR QUÉ USAMOS COOKIES?</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Usamos cookies propias y de terceros por varias razones:</p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Funcionalidad esencial:</strong> Algunas cookies son requeridas por razones técnicas para que nuestros Servicios operen. Nos referimos a estas como cookies &quot;esenciales&quot; o &quot;estrictamente necesarias&quot;. Estas cookies no requieren tu consentimiento según la legislación argentina.</li>
                                    <li><strong>Rendimiento y análisis:</strong> Otras cookies nos permiten rastrear y orientar los intereses de nuestros usuarios para mejorar la experiencia en nuestros Servicios. Estas cookies requieren tu consentimiento.</li>
                                    <li><strong>Personalización:</strong> Las cookies nos ayudan a proporcionarte contenido personalizado y recordar tus preferencias. Requieren tu consentimiento.</li>
                                    <li><strong>Seguridad:</strong> Las cookies nos ayudan a identificar y prevenir riesgos de seguridad. Algunas son esenciales y otras requieren consentimiento.</li>
                                    <li><strong>Publicidad:</strong> Terceros sirven cookies a través de nuestros Servicios con fines publicitarios, analíticos y otros propósitos. Estas cookies siempre requieren tu consentimiento.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="tipos-cookies" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">3. TIPOS DE COOKIES QUE USAMOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Usamos varios tipos diferentes de cookies, que pueden categorizarse de la siguiente manera:</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Por Duración</h3>
                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies de Sesión:</strong> Estas cookies son temporales y se eliminan cuando cerrás tu navegador.</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies Persistentes:</strong> Estas cookies permanecen en tu dispositivo por un período de tiempo establecido o hasta que las eliminés manualmente.</p>
                                </div>

                                <h3 className="text-lg font-bold mb-3 mt-6">Por Finalidad</h3>
                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies Estrictamente Necesarias:</strong> Estas cookies son esenciales para el funcionamiento de nuestros Servicios. No requieren consentimiento según la legislación argentina.</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies de Rendimiento:</strong> Estas cookies recolectan información sobre cómo los visitantes usan nuestros Servicios. Requieren tu consentimiento.</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies de Funcionalidad:</strong> Estas cookies permiten que nuestros Servicios recuerden las elecciones que hacés. Requieren tu consentimiento.</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cookies de Publicidad/Marketing:</strong> Estas cookies se utilizan para entregar anuncios relevantes para vos. Siempre requieren tu consentimiento.</p>
                                </div>
                            </div>
                        </section>

                        <section id="cookies-esenciales" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">4. COOKIES ESENCIALES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estas cookies son estrictamente necesarias para proporcionarte servicios disponibles a través de nuestros Servicios y para usar algunas de sus características, como el acceso a áreas seguras. Debido a que estas cookies son estrictamente necesarias para entregar los Servicios, no podés rechazarlas sin afectar el funcionamiento de nuestros Servicios.
                                </p>

                                <p className="rounded-lg">
                                    <strong>Base Legal:</strong> Estas cookies no requieren tu consentimiento conforme a la legislación argentina, ya que son indispensables para prestar el servicio que solicitaste.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-primary p-4 border border-primary mt-4">
                                        <thead className="bg-accent">
                                            <tr>
                                                <th className="px-4 py-2 border-b text-left font-bold">Nombre de Cookie</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Finalidad</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Duración</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border-b">lanzate_session</td>
                                                <td className="px-4 py-2 border-b">Mantiene tu sesión de inicio de sesión activa</td>
                                                <td className="px-4 py-2 border-b">Sesión</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">csrf_token</td>
                                                <td className="px-4 py-2 border-b">Protección de seguridad contra falsificación de solicitudes entre sitios (CSRF)</td>
                                                <td className="px-4 py-2 border-b">Sesión</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">cookie_consent</td>
                                                <td className="px-4 py-2 border-b">Recuerda tus preferencias de cookies</td>
                                                <td className="px-4 py-2 border-b">1 año</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b-primary">auth_token</td>
                                                <td className="px-4 py-2 border-b-primary">Token de autenticación para mantener tu sesión segura</td>
                                                <td className="px-4 py-2 border-b-primary">7 días</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section id="cookies-rendimiento" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">5. COOKIES DE RENDIMIENTO Y ANALÍTICAS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estas cookies recolectan información sobre cómo los visitantes usan nuestros Servicios, por ejemplo, qué páginas visitan los visitantes con más frecuencia, y si reciben mensajes de error de las páginas web. Estas cookies no recolectan información que identifique a un visitante. Toda la información que estas cookies recolectan es agregada y, por lo tanto, anónima. Solo se usa para mejorar cómo funcionan nuestros Servicios.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Tu Consentimiento:</strong> Estas cookies requieren tu consentimiento explícito. Podés aceptarlas o rechazarlas a través del panel de gestión de cookies que aparece al visitar nuestro sitio por primera vez.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-primary p-4 border border-primary mt-4">
                                        <thead className="bg-accent">
                                            <tr>
                                                <th className="px-4 py-2 border-b text-left font-bold">Nombre de Cookie</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Proveedor</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Finalidad</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Duración</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border-b">_ga</td>
                                                <td className="px-4 py-2 border-b">Google Analytics</td>
                                                <td className="px-4 py-2 border-b">Distingue usuarios únicos asignando un número generado aleatoriamente</td>
                                                <td className="px-4 py-2 border-b">2 años</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">_ga_[ID]</td>
                                                <td className="px-4 py-2 border-b">Google Analytics</td>
                                                <td className="px-4 py-2 border-b">Persiste el estado de la sesión de Google Analytics</td>
                                                <td className="px-4 py-2 border-b">2 años</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">_gid</td>
                                                <td className="px-4 py-2 border-b">Google Analytics</td>
                                                <td className="px-4 py-2 border-b">Distingue usuarios para estadísticas diarias</td>
                                                <td className="px-4 py-2 border-b">24 horas</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b-primary">_gat</td>
                                                <td className="px-4 py-2 border-b-primary">Google Analytics</td>
                                                <td className="px-4 py-2 border-b-primary">Limita la tasa de solicitudes para no sobrecargar servidores</td>
                                                <td className="px-4 py-2 border-b-primary">1 minuto</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section id="cookies-funcionalidad" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">6. COOKIES DE FUNCIONALIDAD</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estas cookies permiten que nuestros Servicios recuerden las elecciones que hacés (como tu nombre de usuario, idioma o la región en la que te encontrás) y proporcionan características mejoradas y más personales. Estas cookies también pueden usarse para recordar cambios que hayas realizado en el tamaño del texto, fuentes y otras partes de páginas web que podés personalizar.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Tu Consentimiento:</strong> Estas cookies requieren tu consentimiento. Podés gestionarlas a través del panel de preferencias de cookies.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-primary p-4 border border-primary mt-4">
                                        <thead className="bg-accent">
                                            <tr>
                                                <th className="px-4 py-2 border-b text-left font-bold">Nombre de Cookie</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Finalidad</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Duración</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border-b">language_preference</td>
                                                <td className="px-4 py-2 border-b">Recuerda tu selección de idioma para mostrarte contenido en tu idioma preferido</td>
                                                <td className="px-4 py-2 border-b">1 año</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">theme_preference</td>
                                                <td className="px-4 py-2 border-b">Recuerda tu preferencia de tema (modo oscuro/claro)</td>
                                                <td className="px-4 py-2 border-b">1 año</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">user_preferences</td>
                                                <td className="px-4 py-2 border-b">Almacena tus configuraciones personalizadas de la plataforma</td>
                                                <td className="px-4 py-2 border-b">6 meses</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">dashboard_layout</td>
                                                <td className="px-4 py-2 border-b">Recuerda cómo configuraste tu panel de control</td>
                                                <td className="px-4 py-2 border-b">1 año</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section id="cookies-publicidad" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">7. COOKIES DE PUBLICIDAD Y MARKETING</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estas cookies se utilizan para entregar anuncios más relevantes para vos y tus intereses. También se usan para limitar la cantidad de veces que ves un anuncio, así como para ayudar a medir la efectividad de la campaña publicitaria. Recuerdan que has visitado un sitio web y esta información puede ser compartida con otras organizaciones, como anunciantes.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Tu Consentimiento:</strong> Estas cookies siempre requieren tu consentimiento explícito. Sin tu consentimiento, no se instalarán ni activarán estas cookies.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-primary p-4 border border-primary mt-4">
                                        <thead className="bg-accent">
                                            <tr>
                                                <th className="px-4 py-2 border-b text-left font-bold">Nombre de Cookie</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Proveedor</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Finalidad</th>
                                                <th className="px-4 py-2 border-b text-left font-bold">Duración</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border-b">_fbp</td>
                                                <td className="px-4 py-2 border-b">Facebook</td>
                                                <td className="px-4 py-2 border-b">Rastrea visitas a través de sitios web para publicidad dirigida</td>
                                                <td className="px-4 py-2 border-b">3 meses</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b">_gcl_au</td>
                                                <td className="px-4 py-2 border-b">Google AdSense</td>
                                                <td className="px-4 py-2 border-b">Rastrea clics en anuncios y conversiones de Google Ads</td>
                                                <td className="px-4 py-2 border-b">3 meses</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border-b-primary">IDE</td>
                                                <td className="px-4 py-2 border-b-primary">Google DoubleClick</td>
                                                <td className="px-4 py-2 border-b-primary">Mide la efectividad de anuncios y orienta publicidad relevante</td>
                                                <td className="px-4 py-2 border-b-primary">1 año</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="mt-4">
                                    <strong>Opciones de Exclusión (Opt-Out):</strong> Podés excluirte de la publicidad dirigida visitando los siguientes enlaces:
                                </p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li><a href="http://www.aboutads.info/choices/" className="text-blue-600 hover:text-blue-800 underline">Digital Advertising Alliance (EE.UU.)</a></li>
                                    <li><a href="http://www.youronlinechoices.com/" className="text-blue-600 hover:text-blue-800 underline">Your Online Choices (Europa)</a></li>
                                    <li><a href="https://www.networkadvertising.org/choices/" className="text-blue-600 hover:text-blue-800 underline">Network Advertising Initiative</a></li>
                                    <li><a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:text-blue-800 underline">Preferencias de Anuncios de Facebook</a></li>
                                    <li><a href="https://adssettings.google.com/" className="text-blue-600 hover:text-blue-800 underline">Configuración de Anuncios de Google</a></li>
                                </ul>
                            </div>
                        </section>

                        <section id="cookies-terceros" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">8. COOKIES DE TERCEROS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Además de nuestras propias cookies, también podemos usar varias cookies de terceros para reportar estadísticas de uso de los Servicios, entregar anuncios en y a través de los Servicios, entre otros. Estas cookies de terceros están regidas por las políticas de privacidad respectivas de las partes que las establecen.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Servicios de Terceros que Usamos</h3>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Google Analytics:</strong> Usamos Google Analytics para analizar el uso de nuestros Servicios. Google Analytics recopila información sobre el uso del sitio web mediante cookies. Para más información sobre las cookies de Google Analytics, por favor visitá <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" className="text-blue-600 hover:text-blue-800 underline">Uso de Cookies de Google Analytics</a>.</p>
                                    <p className="mt-2"><strong>Política de Privacidad:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Google</a></p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Google Ads:</strong> Usamos Google Ads para fines publicitarios. Google puede usar cookies para mostrar anuncios basados en tus visitas anteriores a nuestro sitio web. Para más información, por favor visitá <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:text-blue-800 underline">Publicidad de Google</a>.</p>
                                    <p className="mt-2"><strong>Política de Privacidad:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Google</a></p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Facebook Pixel:</strong> Usamos Facebook Pixel para rastrear conversiones y crear audiencias para campañas publicitarias. Para más información, por favor visitá <a href="https://www.facebook.com/privacy/explanation" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Facebook</a>.</p>
                                    <p className="mt-2"><strong>Política de Privacidad:</strong> <a href="https://www.facebook.com/privacy/explanation" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Facebook</a></p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Hotjar:</strong> Usamos Hotjar para entender cómo los usuarios interactúan con nuestros Servicios mediante mapas de calor y grabaciones de sesiones. Para más información, por favor visitá <a href="https://www.hotjar.com/legal/policies/privacy/" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Hotjar</a>.</p>
                                    <p className="mt-2"><strong>Exclusión (Opt-out):</strong> <a href="https://www.hotjar.com/legal/compliance/opt-out" className="text-blue-600 hover:text-blue-800 underline">Excluirse de Hotjar</a></p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Mercado Pago:</strong> Usamos cookies de Mercado Pago para procesar pagos de forma segura. Mercado Pago establece sus propias cookies para gestionar transacciones y prevenir fraudes.</p>
                                    <p className="mt-2"><strong>Política de Privacidad:</strong> <a href="https://www.mercadopago.com.ar/privacidad" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad de Mercado Pago</a></p>
                                </div>

                                <p className="mt-6">
                                    <strong>Importante:</strong> No controlamos las cookies de terceros y te recomendamos que revises las políticas de privacidad de estos terceros para entender cómo usan tus datos.
                                </p>
                            </div>
                        </section>

                        <section id="como-controlar" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">9. CÓMO CONTROLAR LAS COOKIES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Tenés derecho a decidir si aceptás o rechazás cookies. Conforme a la legislación argentina, te solicitaremos tu consentimiento explícito para las cookies no esenciales antes de que sean instaladas en tu dispositivo.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Panel de Gestión de Cookies</h3>
                                <p>
                                    Podés ejercer tus derechos sobre cookies configurando tus preferencias en el Panel de Gestión de Consentimiento de Cookies que aparece cuando visitás nuestros Servicios por primera vez. Para modificar tus preferencias posteriormente, podés:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Hacer clic en el enlace &quot;Gestionar Cookies&quot; en el pie de página de nuestro sitio web</li>
                                    <li>Acceder a la configuración de cookies desde tu perfil de usuario</li>
                                    <li>Borrar las cookies de tu navegador y volver a visitar nuestro sitio (aparecerá nuevamente el panel)</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Controles del Navegador</h3>
                                <p>
                                    La mayoría de los navegadores web te permiten controlar las cookies a través de sus configuraciones de preferencias. Sin embargo, si limitás la capacidad de los sitios web para establecer cookies, podés empeorar tu experiencia general de usuario, ya que algunas funcionalidades pueden dejar de funcionar correctamente.
                                </p>

                                <p>Aquí tenés enlaces para configurar cookies en los navegadores más populares:</p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:text-blue-800 underline">Google Chrome</a></li>
                                    <li><a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" className="text-blue-600 hover:text-blue-800 underline">Mozilla Firefox</a></li>
                                    <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:text-blue-800 underline">Microsoft Edge</a></li>
                                    <li><a href="https://support.apple.com/es-es/HT201265" className="text-blue-600 hover:text-blue-800 underline">Safari (Desktop)</a></li>
                                    <li><a href="https://support.apple.com/es-es/HT201265" className="text-blue-600 hover:text-blue-800 underline">Safari (Mobile)</a></li>
                                    <li><a href="https://support.google.com/chrome/answer/2392971" className="text-blue-600 hover:text-blue-800 underline">Chrome (Mobile)</a></li>
                                    <li><a href="https://help.opera.com/es/latest/web-preferences/#cookies" className="text-blue-600 hover:text-blue-800 underline">Opera</a></li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Enlaces de Exclusión (Opt-Out)</h3>
                                <p>Para servicios específicos de terceros, podés usar los siguientes enlaces de exclusión:</p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-800 underline">Complemento de Inhabilitación para Navegadores de Google Analytics</a></li>
                                    <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:text-blue-800 underline">Preferencias de Anuncios de Facebook</a></li>
                                    <li><strong>Hotjar:</strong> <a href="https://www.hotjar.com/legal/compliance/opt-out" className="text-blue-600 hover:text-blue-800 underline">Excluirse de Hotjar</a></li>
                                    <li><strong>Google Ads:</strong> <a href="https://adssettings.google.com/" className="text-blue-600 hover:text-blue-800 underline">Configuración de Anuncios de Google</a></li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Do Not Track (No Rastrear)</h3>
                                <p>
                                    Algunos navegadores incluyen una función &quot;Do Not Track&quot; (No Rastrear) que te permite indicar a los sitios web que no querés que tu actividad en línea sea rastreada. Estas funciones aún no son uniformes, y actualmente nuestros Servicios no responden a estas señales de &quot;Do Not Track&quot;. Sin embargo, respetamos tus preferencias de cookies establecidas en nuestro panel de gestión.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Consecuencias de Deshabilitar Cookies</h3>
                                <p>
                                    Si elegís deshabilitar o rechazar cookies:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Algunas funcionalidades de nuestros Servicios pueden no estar disponibles</li>
                                    <li>Es posible que tengas que iniciar sesión cada vez que visitás nuestro sitio</li>
                                    <li>Tus preferencias personalizadas no se recordarán</li>
                                    <li>La experiencia de usuario puede verse reducida</li>
                                    <li>Algunas páginas pueden no cargarse correctamente</li>
                                </ul>
                            </div>
                        </section>

                        <section id="app-movil" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">10. APLICACIÓN MÓVIL</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Nuestra aplicación móvil puede usar tecnologías similares a las cookies para recolectar y almacenar información. Si bien las aplicaciones móviles no usan cookies de la misma manera que los sitios web, pueden usar otras tecnologías tales como:
                                </p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>SDKs (Kits de Desarrollo de Software):</strong> SDKs de terceros que proporcionan servicios de análisis, informes de errores y servicios publicitarios.</li>
                                    <li><strong>Almacenamiento Local:</strong> Información almacenada localmente en tu dispositivo para recordar tus preferencias y mejorar el rendimiento de la aplicación.</li>
                                    <li><strong>Identificadores de Dispositivo:</strong> Identificadores únicos asociados con tu dispositivo para fines analíticos y publicitarios.</li>
                                    <li><strong>Tokens de Sesión:</strong> Para mantener tu sesión activa de forma segura.</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">SDKs de Terceros en la Aplicación</h3>
                                <p>
                                    Nuestra aplicación móvil puede incluir los siguientes SDKs de terceros:
                                </p>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Google Analytics para Firebase:</strong> Para análisis de uso de la aplicación</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Facebook SDK:</strong> Para inicio de sesión con Facebook e Instagram</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Mercado Pago SDK:</strong> Para procesar pagos de forma segura</p>
                                </div>

                                <h3 className="text-lg font-bold mb-3 mt-6">Controlar Tecnologías en la Aplicación Móvil</h3>
                                <p>
                                    Podés controlar algunas de estas tecnologías a través de la configuración de tu dispositivo:
                                </p>

                                <h4 className="font-bold mb-2 mt-4">iOS (iPhone/iPad):</h4>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Configuración → Privacidad y Seguridad → Publicidad de Apple → Personalizar Anuncios (desactivar)</li>
                                    <li>Configuración → Privacidad y Seguridad → Seguimiento → Permitir que las apps soliciten rastrearte (desactivar)</li>
                                    <li>Configuración → [Nombre de la App] → Permisos</li>
                                </ul>

                                <h4 className="font-bold mb-2 mt-4">Android:</h4>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Configuración → Google → Anuncios → Inhabilitar Personalización de Anuncios</li>
                                    <li>Configuración → Google → Anuncios → Restablecer ID de Publicidad</li>
                                    <li>Configuración → Aplicaciones → [Nombre de la App] → Permisos</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Permisos de la Aplicación</h3>
                                <p>
                                    Nuestra aplicación puede solicitar los siguientes permisos:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Cámara:</strong> Para escanear códigos de barras de productos y códigos QR</li>
                                    <li><strong>Almacenamiento:</strong> Para guardar imágenes de productos y documentos</li>
                                    <li><strong>Ubicación:</strong> Para funciones relacionadas con la ubicación de tu tienda (opcional)</li>
                                    <li><strong>Notificaciones:</strong> Para enviarte alertas sobre ventas, stock bajo, etc.</li>
                                </ul>
                                <p className="mt-2">
                                    Podés gestionar estos permisos en cualquier momento desde la configuración de tu dispositivo.
                                </p>
                            </div>
                        </section>

                        <section id="actualizaciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">11. ACTUALIZACIONES DE ESTA POLÍTICA</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en las cookies que usamos o por otras razones operativas, legales o regulatorias. Por favor, visitá esta Política de Cookies regularmente para estar informado sobre nuestro uso de cookies y tecnologías relacionadas.
                                </p>

                                <p>
                                    Te notificaremos sobre cualquier cambio material publicando la nueva Política de Cookies en esta página y actualizando la fecha de &quot;Última actualización&quot; en la parte superior.
                                </p>

                                <p>
                                    Para cambios significativos en cómo usamos cookies, también te notificaremos mediante:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Un aviso destacado en nuestro sitio web</li>
                                    <li>Un correo electrónico a la dirección registrada en tu cuenta</li>
                                    <li>Una notificación en la aplicación móvil</li>
                                    <li>Solicitándote nuevamente tu consentimiento cuando sea necesario</li>
                                </ul>

                                <p>
                                    La fecha que figura en la parte superior de esta Política de Cookies indica cuándo fue actualizada por última vez.
                                </p>

                                <p>
                                    Si has deshabilitado una o más cookies, podemos seguir usando información recolectada de cookies antes de que se estableciera tu preferencia de inhabilitación. Sin embargo, dejaremos de usar la cookie inhabilitada para recolectar cualquier información adicional.
                                </p>
                            </div>
                        </section>

                        <section id="contacto" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">12. CONTACTO</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Si tenés alguna pregunta sobre nuestro uso de cookies o esta Política de Cookies, por favor contactanos:</p>

                                <div className="bg-accent text-accent-foreground p-6 rounded-lg border-2 border-primary">
                                    <p className="font-bold text-lg mb-3">Lanzáte</p>
                                    <p><strong>Domicilio Legal:</strong></p>
                                    <p>Las Palmas 735</p>
                                    <p>Atlántida, Santa Clara del Mar</p>
                                    <p>Buenos Aires, CP 7609</p>
                                    <p>República Argentina</p>
                                    <p className="mt-4"><strong>Contacto:</strong></p>
                                    <p>Teléfono: <a href="tel:+5491135069709" className="text-blue-600 hover:text-blue-800 underline">+54 9 11 3506-9709</a></p>
                                    <p>Email: <a href="mailto:info@lanzate.app" className="text-blue-600 hover:text-blue-800 underline">info@lanzate.app</a></p>
                                    <p>Sitio Web: <a href="https://www.lanzate.app" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app</a></p>
                                    <p className="mt-4"><strong>Responsable de Protección de Datos:</strong></p>
                                    <p>Email: <a href="mailto:info@lanzate.app" className="text-blue-600 hover:text-blue-800 underline">info@lanzate.app</a></p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-6">
                                    <p className="font-bold mb-2">Horario de Atención:</p>
                                    <p>Lunes a Viernes de 9:00 a 18:00 hs (hora de Argentina)</p>
                                    <p className="text-xs mt-2">Tiempo de respuesta estimado: 10 días hábiles</p>
                                </div>

                                <p className="mt-6">
                                    Para más información sobre nuestras prácticas de privacidad, por favor revisá nuestra Política de Privacidad en <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app/privacy-policy</Link>.
                                </p>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-6">
                                    <p className="font-bold mb-2">Dirección Nacional de Protección de Datos Personales (DNPDP):</p>
                                    <p>Si tenés alguna inquietud sobre cómo manejamos las cookies o considerás que tus derechos no han sido respetados, podés contactar a la autoridad de protección de datos:</p>
                                    <p className="mt-2">Agencia de Acceso a la Información Pública</p>
                                    <p>Av. Pte. Gral. Julio A. Roca 710, Piso 3º</p>
                                    <p>C1067ABP - Ciudad Autónoma de Buenos Aires</p>
                                    <p>Tel: 0800-222-DATOS (3286)</p>
                                    <p>Web: <a href="https://www.argentina.gob.ar/aaip" className="text-blue-600 hover:text-blue-800 underline">www.argentina.gob.ar/aaip</a></p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CookiesPolicy;