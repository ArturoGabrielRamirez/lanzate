import { FileText } from "lucide-react"

function PrivacyPolicy() {
    return (
        <section className="container mx-auto px-4 pt-20 md:pt-24">
            <div className="text-left flex flex-col gap-8">
                <div>
                    <div className="flex items-center gap-2 text-primary">
                        <FileText />
                        <h2 className="text-2xl font-bold font-oswald">POLÍTICA DE PRIVACIDAD</h2>
                    </div>
                    <p className="text-muted-foreground font-quattrocento">
                        Última actualización: <strong>30 de octubre de 2025</strong>
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">INTRODUCCIÓN</h2>
                    <div className="mb-4">
                        <p className="text-sm leading-relaxed mb-4">
                            Lanzáte (&quot;nosotros&quot;, &quot;nuestro&quot;, &quot;la Empresa&quot;) respeta tu privacidad y está comprometida con la protección de tus datos personales conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina y sus normas complementarias.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Somos Lanzáte, con domicilio legal en Las Palmas 735, Atlántida, Santa Clara del Mar, Buenos Aires 7609, Argentina. Operamos el sitio web <a href="https://www.lanzate.app" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app</a> y la aplicación móvil Lanzáte App.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Esta Política de Privacidad te informa sobre cómo recolectamos, usamos, compartimos y protegemos tu información personal cuando usás nuestros servicios. También te explica tus derechos como titular de datos personales según la legislación argentina vigente.
                        </p>

                        <p className="text-sm leading-relaxed mb-6">
                            Si tenés alguna pregunta sobre esta Política de Privacidad o querés ejercer tus derechos, podés contactarnos usando los datos que aparecen al final de este documento.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">

                    <div className="md:sticky md:top-20 self-start mb-8 lg:mb-0">
                        <h2 className="text-2xl font-bold mb-6">ÍNDICE</h2>
                        <div className="space-y-2 text-sm">
                            <div><a href="#informacion-importante" className="text-blue-600 hover:text-blue-800 underline">1. INFORMACIÓN IMPORTANTE Y RESPONSABLE</a></div>
                            <div><a href="#datos-recolectados" className="text-blue-600 hover:text-blue-800 underline">2. DATOS PERSONALES QUE RECOLECTAMOS</a></div>
                            <div><a href="#como-recolectamos" className="text-blue-600 hover:text-blue-800 underline">3. CÓMO RECOLECTAMOS TUS DATOS</a></div>
                            <div><a href="#como-usamos" className="text-blue-600 hover:text-blue-800 underline">4. CÓMO USAMOS TUS DATOS PERSONALES</a></div>
                            <div><a href="#compartir-datos" className="text-blue-600 hover:text-blue-800 underline">5. COMPARTIR TUS DATOS PERSONALES</a></div>
                            <div><a href="#integraciones-terceros" className="text-blue-600 hover:text-blue-800 underline">6. INTEGRACIONES CON TERCEROS</a></div>
                            <div><a href="#transferencias" className="text-blue-600 hover:text-blue-800 underline">7. TRANSFERENCIAS INTERNACIONALES</a></div>
                            <div><a href="#seguridad" className="text-blue-600 hover:text-blue-800 underline">8. SEGURIDAD DE LOS DATOS</a></div>
                            <div><a href="#retencion" className="text-blue-600 hover:text-blue-800 underline">9. RETENCIÓN DE DATOS</a></div>
                            <div><a href="#tus-derechos" className="text-blue-600 hover:text-blue-800 underline">10. TUS DERECHOS COMO TITULAR</a></div>
                            <div><a href="#cookies" className="text-blue-600 hover:text-blue-800 underline">11. COOKIES Y TECNOLOGÍAS SIMILARES</a></div>
                            <div><a href="#menores" className="text-blue-600 hover:text-blue-800 underline">12. PRIVACIDAD DE MENORES</a></div>
                            <div><a href="#cambios" className="text-blue-600 hover:text-blue-800 underline">13. CAMBIOS A ESTA POLÍTICA</a></div>
                            <div><a href="#contacto" className="text-blue-600 hover:text-blue-800 underline">14. CONTACTO</a></div>
                        </div>
                    </div>

                    <div>
                        <section id="informacion-importante" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">1. INFORMACIÓN IMPORTANTE Y RESPONSABLE</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <h3 className="text-lg font-bold mb-3">Responsable del Tratamiento</h3>
                                <p>
                                    Lanzáte es el responsable del tratamiento de tus datos personales conforme a la Ley 25.326 y las Disposiciones de la Dirección Nacional de Protección de Datos Personales (DNPDP).
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Contacto</h3>
                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <p><strong>Razón Social:</strong> Lanzáte</p>
                                    <p><strong>Correo electrónico:</strong> info@lanzate.app</p>
                                    <p><strong>Domicilio Legal:</strong> Las Palmas 735, Atlántida, Santa Clara del Mar, Buenos Aires 7609, Argentina</p>
                                    <p><strong>Teléfono:</strong> +54 9 11 3506-9709</p>
                                    <p><strong>Responsable de Protección de Datos:</strong> info@lanzate.app</p>
                                </div>

                                <p className="mt-4">
                                    Tenés derecho a presentar una denuncia ante la Dirección Nacional de Protección de Datos Personales (DNPDP), Organismo de Control de la Ley 25.326, ubicado en Sarmiento 1118, Piso 5º, C.A.B.A., o a través de su sitio web <a href="https://www.argentina.gob.ar/aaip" className="text-blue-600 hover:text-blue-800 underline">www.argentina.gob.ar/aaip</a>. Sin embargo, te agradeceríamos que nos contactes primero para poder resolver tus inquietudes.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Base de Datos Registrada</h3>
                                <p>
                                    Nuestras bases de datos se encuentran debidamente inscriptas ante el Registro Nacional de Bases de Datos de la DNPDP, conforme lo exige la legislación argentina vigente.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Finalidad de esta Política</h3>
                                <p>
                                    Esta Política de Privacidad te explica cómo Lanzáte recolecta y procesa tu información personal cuando:
                                </p>
                                <ul className="list-disc ml-6 space-y-2 mt-2">
                                    <li>Te registrás en nuestra plataforma</li>
                                    <li>Usás nuestros servicios de gestión de tiendas, stock y empleados</li>
                                    <li>Te conectás mediante redes sociales (Google, Facebook, Instagram, X)</li>
                                    <li>Realizás pagos a través de Mercado Pago</li>
                                    <li>Creás o gestionás subtiendas</li>
                                    <li>Navegás por nuestro sitio web o aplicación móvil</li>
                                </ul>

                                <p className="mt-4">
                                    Este sitio web y aplicación móvil están dirigidos a personas mayores de 18 años. No recolectamos intencionalmente datos de menores de edad.
                                </p>
                            </div>
                        </section>

                        <section id="datos-recolectados" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">2. DATOS PERSONALES QUE RECOLECTAMOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Conforme a la Ley 25.326, recolectamos solo aquellos datos personales que sean necesarios para cumplir con la finalidad de nuestros servicios. Los datos personales son cualquier información que permite identificarte como persona.
                                </p>

                                <p>Podemos recolectar, usar, almacenar y transferir las siguientes categorías de datos personales:</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Identidad</h3>
                                <p>Incluyen nombre, apellido, DNI/CUIL/CUIT, fecha de nacimiento, sexo, imagen de perfil.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Contacto</h3>
                                <p>Incluyen dirección postal, dirección de facturación, dirección de entrega, correo electrónico y números de teléfono.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos Financieros</h3>
                                <p>Incluyen datos de cuentas bancarias, CBU/CVU, datos de tarjetas de crédito/débito, información de Mercado Pago. <strong>Importante:</strong> No almacenamos datos completos de tarjetas; estos son procesados directamente por los proveedores de pago.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos Transaccionales</h3>
                                <p>Incluyen detalles sobre pagos realizados, productos y servicios adquiridos o vendidos, historial de transacciones, facturación.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos Técnicos</h3>
                                <p>Incluyen dirección IP, datos de inicio de sesión, tipo y versión de navegador, configuración de zona horaria y ubicación, tipo y versión de extensiones del navegador, sistema operativo y plataforma, y otras tecnologías en los dispositivos que usás para acceder a nuestra plataforma.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Perfil</h3>
                                <p>Incluyen tu nombre de usuario y contraseña, compras o pedidos realizados, preferencias, intereses, opiniones y respuestas a encuestas.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Uso</h3>
                                <p>Incluyen información sobre cómo usás nuestro sitio web, productos y servicios, incluyendo datos de navegación, páginas visitadas, tiempo de permanencia.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos Comerciales</h3>
                                <p>Si operás una tienda o subtienda: inventario de productos, gestión de stock, información de empleados (con su consentimiento), datos de ventas, reportes comerciales.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Redes Sociales</h3>
                                <p>Si te conectás mediante Google, Facebook, Instagram o X: nombre de usuario, correo electrónico, foto de perfil, lista de amigos/seguidores (según los permisos que otorgues).</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Datos de Marketing y Comunicaciones</h3>
                                <p>Incluyen tus preferencias para recibir comunicaciones comerciales nuestras y de terceros, y tus preferencias de comunicación.</p>

                                <p className="mt-6">
                                    También recolectamos, usamos y compartimos <strong>Datos Agregados</strong> como datos estadísticos o demográficos. Los Datos Agregados pueden derivarse de tus datos personales pero no se consideran datos personales legalmente ya que no revelan directa ni indirectamente tu identidad.
                                </p>

                                <p>
                                    <strong>No recolectamos Datos Sensibles</strong> (origen racial o étnico, opiniones políticas, convicciones religiosas o filosóficas, afiliación sindical, información sobre salud, vida sexual u orientación sexual) salvo que sea estrictamente necesario y contemos con tu consentimiento explícito o esté permitido por ley.
                                </p>
                            </div>
                        </section>

                        <section id="como-recolectamos" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">3. CÓMO RECOLECTAMOS TUS DATOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Usamos diferentes métodos para recolectar datos personales de vos y sobre vos, incluyendo:</p>

                                <h3 className="text-lg font-bold mb-3">Interacciones Directas</h3>
                                <p>Nos podés proporcionar tus datos de Identidad, Contacto y Financieros completando formularios o comunicándote con nosotros. Esto incluye datos personales que proporcionás cuando:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Te registrás en nuestra plataforma</li>
                                    <li>Creás una tienda o subtienda</li>
                                    <li>Agregás empleados a tu negocio</li>
                                    <li>Cargás productos o gestionás tu inventario</li>
                                    <li>Realizás o recibís pagos</li>
                                    <li>Te suscribís a nuestro servicio o boletines</li>
                                    <li>Solicitás que te enviemos información comercial</li>
                                    <li>Participás en sorteos, promociones o encuestas</li>
                                    <li>Nos brindás comentarios o nos contactás</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Tecnologías Automatizadas</h3>
                                <p>Al interactuar con nuestro sitio web y aplicación móvil, recolectamos automáticamente Datos Técnicos sobre tu equipo, acciones de navegación y patrones de uso. Recolectamos estos datos usando cookies, registros del servidor y otras tecnologías similares.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Inicio de Sesión con Redes Sociales</h3>
                                <p>Si elegís iniciar sesión mediante Google, Facebook, Instagram o X, recibiremos la información que hayas autorizado compartir según la configuración de privacidad de esas plataformas. Esto puede incluir:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Nombre y apellido</li>
                                    <li>Dirección de correo electrónico</li>
                                    <li>Foto de perfil</li>
                                    <li>Lista de contactos (solo si lo autorizás)</li>
                                    <li>Información pública de tu perfil</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Terceros y Fuentes Públicas</h3>
                                <p>Podemos recibir datos personales sobre vos de varios terceros y fuentes públicas:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Datos Técnicos de proveedores de análisis como Google Analytics</li>
                                    <li>Datos de Contacto, Financieros y Transaccionales de proveedores de servicios de pago como Mercado Pago</li>
                                    <li>Datos de Identidad y Contacto de plataformas de redes sociales (Google, Facebook, Instagram, X) cuando las conectás con tu cuenta</li>
                                    <li>Datos de Identidad y Contacto de fuentes de acceso público (registros públicos, directorios comerciales)</li>
                                </ul>
                            </div>
                        </section>

                        <section id="como-usamos" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">4. CÓMO USAMOS TUS DATOS PERSONALES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Solo usaremos tus datos personales cuando la ley argentina nos lo permita. Conforme al Artículo 5 de la Ley 25.326, requerimos tu consentimiento previo, informado y libre para el tratamiento de tus datos, excepto en los casos previstos por la ley.
                                </p>

                                <p>Más comúnmente, usaremos tus datos personales en las siguientes circunstancias:</p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Cuando sea necesario para ejecutar un contrato que hayamos celebrado con vos</li>
                                    <li>Cuando sea necesario para cumplir con una obligación legal (facturación, reportes impositivos, etc.)</li>
                                    <li>Cuando sea necesario para nuestros intereses legítimos (mejorar nuestros servicios, prevenir fraude) y tus derechos no prevalezcan sobre esos intereses</li>
                                    <li>Cuando hayas dado tu consentimiento explícito</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Finalidades Específicas</h3>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Registrarte como usuario</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto</p>
                                    <p><strong>Base legal:</strong> Ejecución del contrato</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Crear y gestionar tu tienda/subtienda</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Comerciales, Datos de Empleados</p>
                                    <p><strong>Base legal:</strong> Ejecución del contrato, Consentimiento</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Procesar pagos y transacciones (mediante Mercado Pago)</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Financieros, Transaccionales</p>
                                    <p><strong>Base legal:</strong> Ejecución del contrato, Obligación legal</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Gestionar inventario y stock</p>
                                    <p><strong>Datos usados:</strong> Identidad, Comerciales</p>
                                    <p><strong>Base legal:</strong> Ejecución del contrato</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Gestionar permisos y accesos de empleados</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Perfil</p>
                                    <p><strong>Base legal:</strong> Ejecución del contrato, Consentimiento de los empleados</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Permitir inicio de sesión mediante redes sociales</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Datos de Redes Sociales</p>
                                    <p><strong>Base legal:</strong> Consentimiento</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Administrar y proteger nuestro negocio y plataforma (solución de problemas, análisis de datos, pruebas, mantenimiento, soporte, reportes y hosting)</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Técnicos</p>
                                    <p><strong>Base legal:</strong> Intereses legítimos, Obligación legal</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Finalidad:</strong> Enviarte comunicaciones comerciales (solo con tu consentimiento)</p>
                                    <p><strong>Datos usados:</strong> Identidad, Contacto, Marketing</p>
                                    <p><strong>Base legal:</strong> Consentimiento (podés retirarlo en cualquier momento)</p>
                                </div>

                                <h3 className="text-lg font-bold mb-3 mt-6">Marketing</h3>
                                <p>
                                    Te enviaremos comunicaciones comerciales solo si nos diste tu consentimiento explícito. Podés retirar tu consentimiento en cualquier momento usando el enlace de &quot;darme de baja&quot; en los correos electrónicos o contactándonos directamente.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Cambio de Finalidad</h3>
                                <p>
                                    Solo usaremos tus datos personales para las finalidades para las cuales los recolectamos, salvo que consideremos razonablemente que necesitamos usarlos por otra razón compatible con la finalidad original. Si necesitamos usar tus datos para una finalidad no relacionada, te notificaremos y te explicaremos la base legal que nos permite hacerlo.
                                </p>
                            </div>
                        </section>

                        <section id="compartir-datos" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">5. COMPARTIR TUS DATOS PERSONALES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Podemos compartir tus datos personales con las siguientes categorías de terceros:</p>

                                <h3 className="text-lg font-bold mb-3">Terceros Internos</h3>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Otras empresas del Grupo Lanzáte (si las hubiera)</li>
                                    <li>Personal autorizado de Lanzáte que necesite acceder a tus datos para prestar los servicios</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Terceros Externos - Proveedores de Servicios</h3>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Mercado Pago:</strong> Para procesar pagos y transacciones. Sus datos se comparten según su política de privacidad.</li>
                                    <li><strong>Proveedores de hosting y servidores:</strong> Para almacenar y procesar tu información de manera segura</li>
                                    <li><strong>Proveedores de servicios de análisis:</strong> Como Google Analytics, para entender cómo se usan nuestros servicios</li>
                                    <li><strong>Proveedores de servicios de email:</strong> Para enviarte comunicaciones autorizadas</li>
                                    <li><strong>Proveedores de servicios de soporte técnico:</strong> Para brindarte asistencia cuando la necesités</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Redes Sociales</h3>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Google:</strong> Cuando usás Login con Google</li>
                                    <li><strong>Facebook/Meta:</strong> Cuando usás Login con Facebook o Instagram</li>
                                    <li><strong>X (anteriormente Twitter):</strong> Cuando usás Login con X</li>
                                </ul>
                                <p className="mt-2">Cada red social tiene su propia política de privacidad que gobierna el uso de tus datos en sus plataformas.</p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Autoridades Gubernamentales</h3>
                                <p>Podemos compartir tus datos con autoridades gubernamentales argentinas cuando:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Sea requerido por ley (ARCA, otros organismos de control)</li>
                                    <li>Sea necesario para proteger nuestros derechos legales</li>
                                    <li>Sea necesario para prevenir fraude o actividades ilegales</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Compradores de Nuestro Negocio</h3>
                                <p>
                                    En caso de que vendamos, transfiramos o fusionemos partes de nuestro negocio o activos, tus datos personales pueden ser compartidos con los potenciales o nuevos propietarios. Te notificaremos sobre cualquier cambio de propiedad.
                                </p>

                                <p className="mt-4">
                                    <strong>Importante:</strong> Requerimos a todos los terceros que respeten la seguridad de tus datos personales y que los traten conforme a la ley argentina. No permitimos que nuestros proveedores de servicios usen tus datos personales para sus propios fines comerciales y solo les permitimos procesarlos para finalidades específicas y según nuestras instrucciones.
                                </p>

                                <p>
                                    Antes de compartir tus datos con terceros para fines de marketing, te pediremos tu consentimiento explícito.
                                </p>
                            </div>
                        </section>

                        <section id="integraciones-terceros" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">6. INTEGRACIONES CON TERCEROS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Nuestra plataforma se integra con varios servicios de terceros. Es importante que entiendas cómo funcionan estas integraciones:
                                </p>

                                <h3 className="text-lg font-bold mb-3">Mercado Pago</h3>
                                <p>
                                    Usamos Mercado Pago como procesador de pagos. Cuando realizás o recibís un pago:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Mercado Pago recolecta y procesa tus datos financieros directamente</li>
                                    <li>No almacenamos datos completos de tarjetas de crédito/débito</li>
                                    <li>Mercado Pago tiene su propia Política de Privacidad que deberías revisar</li>
                                    <li>Los datos de transacciones son compartidos entre Lanzáte y Mercado Pago para completar el servicio</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Login Social (Google, Facebook, Instagram, X)</h3>
                                <p>
                                    Si elegís iniciar sesión mediante redes sociales:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Solo accedemos a la información que vos autorizás compartir</li>
                                    <li>Podés revisar y modificar los permisos en cualquier momento desde tu cuenta de la red social</li>
                                    <li>Tu relación con estas plataformas se rige por sus propias políticas de privacidad</li>
                                    <li>Podés desconectar tu cuenta de redes sociales en cualquier momento desde tu perfil de Lanzáte</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Google Analytics y Servicios de Análisis</h3>
                                <p>
                                    Usamos herramientas de análisis para entender cómo se usan nuestros servicios:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Estas herramientas pueden usar cookies y tecnologías similares</li>
                                    <li>Recolectan información sobre tu uso de la plataforma de forma anónima o pseudónima</li>
                                    <li>Podés desactivar estas herramientas ajustando la configuración de cookies</li>
                                </ul>

                                <p className="mt-4">
                                    <strong>Responsabilidad sobre Integraciones:</strong> No somos responsables por las prácticas de privacidad de estos terceros. Te recomendamos que revises sus políticas de privacidad antes de usar sus servicios a través de nuestra plataforma.
                                </p>
                            </div>
                        </section>

                        <section id="transferencias" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">7. TRANSFERENCIAS INTERNACIONALES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Algunos de nuestros proveedores de servicios están ubicados fuera de Argentina, lo que implica que tus datos personales pueden ser transferidos y procesados en otros países.
                                </p>

                                <p>
                                    Conforme al Artículo 12 de la Ley 25.326 y la Disposición DNPDP 60/2016, cuando transferimos datos personales fuera de Argentina, aseguramos que:
                                </p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li>El país de destino proporcione un nivel de protección adecuado a los datos personales, según lo determinado por la DNPDP</li>
                                    <li>Se implementen cláusulas contractuales apropiadas que garanticen la protección de tus datos</li>
                                    <li>Exista una autorización previa de la DNPDP cuando sea requerida</li>
                                    <li>Se obtenga tu consentimiento explícito cuando sea necesario</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Países con Nivel Adecuado de Protección</h3>
                                <p>
                                    Según la normativa argentina, los siguientes países/regiones son considerados con nivel adecuado de protección:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Países miembros de la Unión Europea</li>
                                    <li>Países que han sido declarados con nivel adecuado por la DNPDP</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Transferencias a Estados Unidos</h3>
                                <p>
                                    Algunos de nuestros proveedores (como Google, Facebook, X) están basados en Estados Unidos. Para estas transferencias:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Utilizamos cláusulas contractuales estándar aprobadas</li>
                                    <li>Verificamos que cumplan con el EU-U.S. Data Privacy Framework cuando aplique</li>
                                    <li>Implementamos medidas de seguridad adicionales</li>
                                </ul>

                                <p className="mt-4">
                                    Si querés más información sobre las salvaguardias específicas que implementamos para proteger tus datos en transferencias internacionales, podés contactarnos.
                                </p>
                            </div>
                        </section>

                        <section id="seguridad" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">8. SEGURIDAD DE LOS DATOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Conforme al Artículo 9 de la Ley 25.326, implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales contra pérdida accidental, uso no autorizado, acceso, alteración o divulgación.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Medidas de Seguridad Técnicas</h3>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Encriptación de datos en tránsito (SSL/TLS)</li>
                                    <li>Encriptación de datos sensibles en reposo</li>
                                    <li>Firewalls y sistemas de detección de intrusiones</li>
                                    <li>Autenticación de dos factores disponible</li>
                                    <li>Backups regulares y seguros</li>
                                    <li>Protección contra malware y virus</li>
                                    <li>Monitoreo continuo de seguridad</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Medidas de Seguridad Organizativas</h3>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Acceso limitado a datos personales solo a empleados, agentes y contratistas que necesiten conocerlos por motivos comerciales</li>
                                    <li>Acuerdos de confidencialidad con todo el personal con acceso a datos</li>
                                    <li>Capacitación en protección de datos para el personal</li>
                                    <li>Procedimientos de gestión de incidentes de seguridad</li>
                                    <li>Revisiones periódicas de seguridad</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Notificación de Brechas de Seguridad</h3>
                                <p>
                                    En caso de una brecha de seguridad que afecte tus datos personales, te notificaremos dentro de las 72 horas de tomar conocimiento del incidente, según lo requiere la normativa argentina. También notificaremos a la DNPDP cuando corresponda.
                                </p>

                                <p className="mt-4">
                                    <strong>Tu Responsabilidad:</strong> Vos también tenés responsabilidad en mantener la seguridad de tu cuenta:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Mantené tu contraseña segura y no la compartas</li>
                                    <li>No uses la misma contraseña en múltiples sitios</li>
                                    <li>Cerrá sesión cuando uses computadoras compartidas</li>
                                    <li>Habilitá la autenticación de dos factores</li>
                                    <li>Notificanos inmediatamente si sospechás un uso no autorizado de tu cuenta</li>
                                </ul>
                            </div>
                        </section>

                        <section id="retencion" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">9. RETENCIÓN DE DATOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <h3 className="text-lg font-bold mb-3">¿Por cuánto tiempo conservamos tus datos?</h3>
                                <p>
                                    Solo retendremos tus datos personales durante el tiempo necesario para cumplir con las finalidades para las cuales fueron recolectados, incluyendo el cumplimiento de requisitos legales, contables, impositivos o de reporte.
                                </p>

                                <p>
                                    Para determinar el período apropiado de retención, consideramos:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>La cantidad, naturaleza y sensibilidad de los datos personales</li>
                                    <li>El riesgo potencial de daño por uso no autorizado o divulgación</li>
                                    <li>Las finalidades del tratamiento</li>
                                    <li>Si podemos lograr esas finalidades por otros medios</li>
                                    <li>Los requisitos legales, regulatorios, impositivos y contables aplicables</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Períodos de Retención Específicos</h3>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Datos de cuenta activa:</strong> Mientras tu cuenta esté activa</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Datos transaccionales y de facturación:</strong> 10 años desde la última transacción (requisito legal de ARCA)</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Datos de empleados:</strong> Según lo requiera la legislación laboral argentina (mínimo 2 años después de finalizada la relación laboral)</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Datos de marketing:</strong> Hasta que retires tu consentimiento o 2 años de inactividad</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Datos técnicos y de uso:</strong> 2 años desde la última actividad</p>
                                </div>

                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-4">
                                    <p><strong>Cuenta cerrada:</strong> 90 días después del cierre (salvo obligaciones legales de retención)</p>
                                </div>

                                <h3 className="text-lg font-bold mb-3 mt-6">Eliminación y Anonimización</h3>
                                <p>
                                    Una vez transcurrido el período de retención:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Eliminaremos de forma segura tus datos personales de nuestros sistemas activos</li>
                                    <li>Podemos anonimizar tus datos para fines estadísticos o de investigación, de modo que ya no te identifiquen</li>
                                    <li>Podemos retener información anónima o agregada indefinidamente</li>
                                </ul>

                                <p className="mt-4">
                                    Podés solicitarnos que eliminemos tus datos antes del período de retención (ver sección &quot;Tus Derechos&quot;). Sin embargo, podemos necesitar retener cierta información para cumplir con obligaciones legales o resolver disputas.
                                </p>
                            </div>
                        </section>

                        <section id="tus-derechos" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">10. TUS DERECHOS COMO TITULAR</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Conforme a la Ley 25.326, tenés los siguientes derechos respecto a tus datos personales:
                                </p>

                                <h3 className="text-lg font-bold mb-3">Derecho de Acceso</h3>
                                <p>
                                    Tenés derecho a solicitar y obtener información sobre qué datos personales tuyos estamos procesando, con qué finalidad, a quién se los compartimos, y por cuánto tiempo los conservaremos. Este derecho lo podés ejercer de forma gratuita cada 6 meses, salvo que exista un interés legítimo.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho de Rectificación</h3>
                                <p>
                                    Tenés derecho a solicitar la corrección de datos inexactos o desactualizados, o a completar datos incompletos. Podés actualizar muchos de tus datos directamente desde tu perfil.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho de Supresión (&quot;Derecho al Olvido&quot;)</h3>
                                <p>
                                    Tenés derecho a solicitar la eliminación de tus datos personales cuando:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Ya no sean necesarios para las finalidades para las cuales fueron recolectados</li>
                                    <li>Retires tu consentimiento y no haya otra base legal para el tratamiento</li>
                                    <li>Te opongas al tratamiento y no haya motivos legítimos prevalentes</li>
                                    <li>Hayamos tratado tus datos de manera ilícita</li>
                                    <li>Deban eliminarse para cumplir con una obligación legal</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho de Oposición</h3>
                                <p>
                                    Tenés derecho a oponerte al tratamiento de tus datos personales en cualquier momento, particularmente cuando:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Usamos tus datos con fines de marketing directo (podés darte de baja en cualquier momento)</li>
                                    <li>Procesamos tus datos basándonos en intereses legítimos</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho a Retirar el Consentimiento</h3>
                                <p>
                                    Cuando el tratamiento se base en tu consentimiento, tenés derecho a retirarlo en cualquier momento. Esto no afectará la licitud del tratamiento anterior al retiro del consentimiento.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho de Portabilidad</h3>
                                <p>
                                    Tenés derecho a recibir tus datos personales en un formato estructurado, de uso común y lectura mecánica, y a transmitirlos a otro responsable sin impedimentos.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Derecho a la Limitación del Tratamiento</h3>
                                <p>
                                    Tenés derecho a solicitar la suspensión del tratamiento de tus datos cuando:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Impugnes la exactitud de los datos</li>
                                    <li>El tratamiento sea ilícito pero no quieras que se eliminen</li>
                                    <li>Ya no necesitemos los datos pero vos los necesites para reclamaciones legales</li>
                                    <li>Te hayas opuesto al tratamiento mientras verificamos si nuestros motivos legítimos prevalecen</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Cómo Ejercer tus Derechos</h3>
                                <p>
                                    Para ejercer cualquiera de estos derechos, podés:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Enviar un correo electrónico a: <strong>info@lanzate.app</strong></li>
                                    <li>Acceder a la configuración de tu cuenta (para algunos derechos)</li>
                                    <li>Enviarnos una carta a nuestra dirección postal</li>
                                </ul>

                                <h3 className="text-lg font-bold mb-3 mt-6">Sin Costo</h3>
                                <p>
                                    No tenés que pagar ninguna tarifa para ejercer tus derechos. Sin embargo, podemos cobrar una tarifa razonable si tu solicitud es manifiestamente infundada, repetitiva o excesiva. También podemos negarnos a cumplir con la solicitud en estas circunstancias.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Verificación de Identidad</h3>
                                <p>
                                    Podemos necesitar solicitarte información específica para confirmar tu identidad y garantizar tu derecho a acceder a tus datos personales. Esta es una medida de seguridad para asegurar que los datos no se divulguen a ninguna persona que no tenga derecho a recibirlos.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Plazo de Respuesta</h3>
                                <p>
                                    Intentaremos responder a todas las solicitudes legítimas dentro de los 10 días hábiles conforme establece la Ley 25.326. Ocasionalmente, podría tomarnos más tiempo si tu solicitud es particularmente compleja o si has realizado varias solicitudes. En este caso, te notificaremos y te mantendremos actualizado.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Reclamo ante la Autoridad</h3>
                                <p>
                                    Si considerás que no hemos atendido adecuadamente tus derechos, tenés derecho a presentar un reclamo ante la Dirección Nacional de Protección de Datos Personales (DNPDP):
                                </p>
                                <div className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary mt-2">
                                    <p><strong>Dirección Nacional de Protección de Datos Personales</strong></p>
                                    <p>Agencia de Acceso a la Información Pública</p>
                                    <p>Av. Pte. Gral. Julio A. Roca 710, Piso 3º</p>
                                    <p>C1067ABP - Ciudad Autónoma de Buenos Aires</p>
                                    <p>Tel: 0800-222-DATOS (3286)</p>
                                    <p>Web: <a href="https://www.argentina.gob.ar/aaip" className="text-blue-600 hover:text-blue-800 underline">www.argentina.gob.ar/aaip</a></p>
                                </div>
                            </div>
                        </section>

                        <section id="cookies" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">11. COOKIES Y TECNOLOGÍAS SIMILARES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Nuestro sitio web y aplicación utilizan cookies y tecnologías similares para mejorar tu experiencia, personalizar contenido y analizar cómo se usan nuestros servicios.
                                </p>

                                <h3 className="text-lg font-bold mb-3">¿Qué son las Cookies?</h3>
                                <p>
                                    Las cookies son pequeños archivos de texto que se colocan en tu dispositivo (computadora, celular, tablet) cuando visitás sitios web. Se usan ampliamente para hacer que los sitios web funcionen de manera más eficiente y para proporcionar información a los propietarios del sitio.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Tipos de Cookies que Usamos</h3>

                                <h4 className="font-bold mb-2">1. Cookies Estrictamente Necesarias</h4>
                                <p>Son esenciales para que puedas navegar por el sitio y usar sus funciones. Sin estas cookies, servicios como el carrito de compras o la facturación electrónica no funcionarían. <strong>Estas cookies no requieren tu consentimiento</strong> según la normativa argentina.</p>

                                <h4 className="font-bold mb-2 mt-4">2. Cookies de Rendimiento/Analíticas</h4>
                                <p>Nos permiten reconocer y contar el número de visitantes y ver cómo se mueven por nuestro sitio. Esto nos ayuda a mejorar la forma en que funciona, por ejemplo, asegurando que los usuarios encuentren fácilmente lo que buscan. <strong>Requieren tu consentimiento.</strong></p>
                                <p className="text-xs mt-1">Ejemplo: Google Analytics</p>

                                <h4 className="font-bold mb-2 mt-4">3. Cookies de Funcionalidad</h4>
                                <p>Se usan para reconocerte cuando volvés a nuestro sitio. Esto nos permite personalizar el contenido, saludarte por tu nombre y recordar tus preferencias (por ejemplo, tu elección de idioma o región). <strong>Requieren tu consentimiento.</strong></p>

                                <h4 className="font-bold mb-2 mt-4">4. Cookies de Publicidad/Marketing</h4>
                                <p>Registran tu visita a nuestro sitio, las páginas que visitaste y los enlaces que seguiste. Usaremos esta información para hacer que nuestro sitio y la publicidad que se muestra sean más relevantes para tus intereses. <strong>Requieren tu consentimiento.</strong></p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Cómo Controlar las Cookies</h3>
                                <p>
                                    Tenés varias opciones para controlar las cookies:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li><strong>Panel de Preferencias:</strong> Cuando visitás nuestro sitio por primera vez, te mostramos un banner donde podés aceptar o rechazar diferentes tipos de cookies</li>
                                    <li><strong>Configuración del Navegador:</strong> Podés configurar tu navegador para rechazar todas o algunas cookies, o para que te avise cuando los sitios establezcan o accedan a cookies</li>
                                    <li><strong>Eliminar Cookies:</strong> Podés eliminar todas las cookies que ya están en tu dispositivo</li>
                                </ul>

                                <p className="mt-4">
                                    <strong>Importante:</strong> Si desactivás o rechazás cookies, algunas partes de nuestro sitio pueden volverse inaccesibles o no funcionar correctamente.
                                </p>

                                <h3 className="text-lg font-bold mb-3 mt-6">Cookies de Terceros</h3>
                                <p>
                                    Algunos de nuestros socios comerciales (como Google Analytics, Facebook Pixel) también pueden colocar cookies en tu dispositivo cuando usás nuestros servicios. No controlamos estas cookies de terceros y te recomendamos que revises las políticas de privacidad de estos terceros.
                                </p>
                            </div>
                        </section>

                        <section id="menores" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">12. PRIVACIDAD DE MENORES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Nuestros servicios están dirigidos a personas mayores de 18 años. Conforme a la Ley 25.326, no recolectamos intencionalmente datos personales de menores de 18 años sin el consentimiento de sus padres o tutores legales.
                                </p>

                                <p>
                                    Si sos menor de 18 años, <strong>no uses nuestros servicios</strong> sin el consentimiento y supervisión de tus padres o tutores legales.
                                </p>

                                <p>
                                    Si sos padre, madre o tutor legal y descubrís que tu hijo/a menor de 18 años nos ha proporcionado datos personales sin tu consentimiento, por favor contactanos inmediatamente. Tomaremos medidas para eliminar esa información de nuestros servidores.
                                </p>

                                <p>
                                    <strong>Para empleados menores de edad:</strong> Si un comercio registra empleados menores de 18 años (lo cual está permitido bajo ciertas condiciones en la legislación laboral argentina), requerimos:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Autorización expresa del padre, madre o tutor legal</li>
                                    <li>Cumplimiento con toda la normativa laboral aplicable a menores</li>
                                    <li>Documentación de autorización de trabajo si corresponde</li>
                                </ul>
                            </div>
                        </section>

                        <section id="cambios" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">13. CAMBIOS A ESTA POLÍTICA</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Podemos actualizar nuestra Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas, en la legislación, o por otros motivos operativos, legales o regulatorios.
                                </p>

                                <p>
                                    Te notificaremos sobre cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;Última actualización&quot; en la parte superior.
                                </p>

                                <p>
                                    Para cambios significativos, también te notificaremos por:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Correo electrónico (a la dirección registrada en tu cuenta)</li>
                                    <li>Un aviso destacado en nuestro sitio web y aplicación</li>
                                    <li>Una notificación push en la aplicación móvil</li>
                                </ul>

                                <p>
                                    Te aconsejamos revisar esta Política de Privacidad periódicamente para estar al tanto de cualquier cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.
                                </p>

                                <p>
                                    <strong>Tu consentimiento:</strong> Al continuar usando nuestros servicios después de que los cambios entren en vigencia, estás aceptando la Política de Privacidad revisada. Si no estás de acuerdo con los cambios, deberías dejar de usar nuestros servicios y podés solicitar la eliminación de tu cuenta.
                                </p>
                            </div>
                        </section>

                        <section id="contacto" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">14. CONTACTO</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Si tenés alguna pregunta sobre esta Política de Privacidad o querés ejercer tus derechos, por favor contactanos:</p>

                                <div className="bg-accent text-accent-foreground p-6 rounded-lg border-2 border-primary">
                                    <p className="font-bold text-lg mb-3">Lanzáte</p>
                                    <p><strong>Domicilio Legal:</strong></p>
                                    <p>Las Palmas 735</p>
                                    <p>Atlántida, Santa Clara del Mar</p>
                                    <p>Buenos Aires, CP 7609</p>
                                    <p>República Argentina</p>

                                    <p className="mt-4"><strong>Contacto:</strong></p>
                                    <p>Teléfono: +54 9 11 3506-9709</p>
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
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PrivacyPolicy