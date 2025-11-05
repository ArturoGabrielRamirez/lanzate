import { FileText } from "lucide-react";
import Link from "next/link";

function TermsAndConditions() {
    return (
        <section className="container mx-auto px-4 pt-20 md:pt-24">
            <div className="text-left flex flex-col gap-8">
                <div>
                    <div className="flex items-center gap-2 text-primary">
                        <FileText />
                        <h2 className="text-2xl font-bold font-oswald">TÉRMINOS Y CONDICIONES</h2>
                    </div>
                    <p className="text-muted-foreground font-quattrocento">
                        Última actualización: <strong>30 de octubre de 2025</strong>
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">ACUERDO CON NUESTROS TÉRMINOS LEGALES</h2>
                    <div className="mb-4">
                        <p className="text-sm leading-relaxed mb-4">
                            Somos Lanzáte (&quot;la Empresa&quot;, &quot;nosotros&quot;, &quot;nuestro&quot;), una empresa registrada en Argentina con domicilio en Las Palmas 735, Atlántida, Santa Clara del Mar, Buenos Aires 7609, República Argentina.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Operamos el sitio web <a href="https://www.lanzate.app" className="text-blue-600 hover:text-blue-800 underline">https://www.lanzate.app</a> (el &quot;Sitio&quot;), la aplicación móvil Lanzáte App (la &quot;App&quot;), así como cualquier otro producto y servicio relacionado que haga referencia o se vincule a estos términos legales (los &quot;Términos Legales&quot;) (en conjunto, los &quot;Servicios&quot;).
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Podés contactarnos por teléfono al +54 9 11 3506-9709, por correo electrónico a info@lanzate.app, o por correo postal a Las Palmas 735, Atlántida, Santa Clara del Mar, Buenos Aires 7609, Argentina.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Estos Términos Legales constituyen un acuerdo legalmente vinculante entre vos, ya sea personalmente o en nombre de una entidad (&quot;vos&quot;, &quot;tu&quot;), y Lanzáte, respecto a tu acceso y uso de los Servicios. Al acceder a los Servicios, reconocés que has leído, entendido y aceptado estar obligado por todos estos Términos Legales. <strong>SI NO ESTÁS DE ACUERDO CON TODOS ESTOS TÉRMINOS LEGALES, ENTONCES TENÉS EXPRESAMENTE PROHIBIDO USAR LOS SERVICIOS Y DEBÉS DISCONTINUAR SU USO INMEDIATAMENTE.</strong>
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Te brindaremos aviso previo de cualquier cambio programado en los Servicios que estés usando. Los Términos Legales modificados entrarán en vigencia al ser publicados o al notificarte por info@lanzate.app, según se indique en el mensaje de correo electrónico. Al continuar usando los Servicios después de la fecha de vigencia de cualquier cambio, aceptás estar obligado por los términos modificados.
                        </p>

                        <p className="text-sm leading-relaxed mb-4">
                            Los Servicios están destinados a usuarios que tengan al menos 18 años de edad. Las personas menores de 18 años no tienen permitido usar o registrarse en los Servicios, conforme a la legislación argentina vigente.
                        </p>

                        <p className="text-sm leading-relaxed mb-6">
                            Te recomendamos que imprimas una copia de estos Términos Legales para tus registros.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
                    <div className="md:sticky md:top-20 self-start mb-8 lg:mb-0">
                        <h2 className="text-2xl font-bold mb-6">ÍNDICE</h2>
                        <div className="space-y-2 text-sm">
                            <div><a href="#servicios" className="text-blue-600 hover:text-blue-800 underline">1. NUESTROS SERVICIOS</a></div>
                            <div><a href="#propiedad-intelectual" className="text-blue-600 hover:text-blue-800 underline">2. DERECHOS DE PROPIEDAD INTELECTUAL</a></div>
                            <div><a href="#representaciones" className="text-blue-600 hover:text-blue-800 underline">3. DECLARACIONES DEL USUARIO</a></div>
                            <div><a href="#registro" className="text-blue-600 hover:text-blue-800 underline">4. REGISTRO DE USUARIO</a></div>
                            <div><a href="#compras" className="text-blue-600 hover:text-blue-800 underline">5. COMPRAS Y PAGO</a></div>
                            <div><a href="#suscripciones" className="text-blue-600 hover:text-blue-800 underline">6. SUSCRIPCIONES</a></div>
                            <div><a href="#actividades-prohibidas" className="text-blue-600 hover:text-blue-800 underline">7. ACTIVIDADES PROHIBIDAS</a></div>
                            <div><a href="#contenido-usuario" className="text-blue-600 hover:text-blue-800 underline">8. CONTRIBUCIONES GENERADAS POR USUARIOS</a></div>
                            <div><a href="#licencia-contribucion" className="text-blue-600 hover:text-blue-800 underline">9. LICENCIA DE CONTRIBUCIÓN</a></div>
                            <div><a href="#resenas" className="text-blue-600 hover:text-blue-800 underline">10. LINEAMIENTOS PARA RESEÑAS</a></div>
                            <div><a href="#app-movil" className="text-blue-600 hover:text-blue-800 underline">11. LICENCIA DE APLICACIÓN MÓVIL</a></div>
                            <div><a href="#redes-sociales" className="text-blue-600 hover:text-blue-800 underline">12. REDES SOCIALES</a></div>
                            <div><a href="#terceros" className="text-blue-600 hover:text-blue-800 underline">13. SITIOS WEB Y CONTENIDO DE TERCEROS</a></div>
                            <div><a href="#gestion" className="text-blue-600 hover:text-blue-800 underline">14. GESTIÓN DE LOS SERVICIOS</a></div>
                            <div><a href="#privacidad" className="text-blue-600 hover:text-blue-800 underline">15. POLÍTICA DE PRIVACIDAD</a></div>
                            <div><a href="#plazo-terminacion" className="text-blue-600 hover:text-blue-800 underline">16. PLAZO Y TERMINACIÓN</a></div>
                            <div><a href="#modificaciones" className="text-blue-600 hover:text-blue-800 underline">17. MODIFICACIONES E INTERRUPCIONES</a></div>
                            <div><a href="#ley-aplicable" className="text-blue-600 hover:text-blue-800 underline">18. LEY APLICABLE</a></div>
                            <div><a href="#resolucion-disputas" className="text-blue-600 hover:text-blue-800 underline">19. RESOLUCIÓN DE DISPUTAS</a></div>
                            <div><a href="#correcciones" className="text-blue-600 hover:text-blue-800 underline">20. CORRECCIONES</a></div>
                            <div><a href="#descargo" className="text-blue-600 hover:text-blue-800 underline">21. DESCARGO DE RESPONSABILIDAD</a></div>
                            <div><a href="#limitaciones" className="text-blue-600 hover:text-blue-800 underline">22. LIMITACIONES DE RESPONSABILIDAD</a></div>
                            <div><a href="#indemnizacion" className="text-blue-600 hover:text-blue-800 underline">23. INDEMNIZACIÓN</a></div>
                            <div><a href="#datos-usuario" className="text-blue-600 hover:text-blue-800 underline">24. DATOS DEL USUARIO</a></div>
                            <div><a href="#comunicaciones-electronicas" className="text-blue-600 hover:text-blue-800 underline">25. COMUNICACIONES, TRANSACCIONES Y FIRMAS ELECTRÓNICAS</a></div>
                            <div><a href="#disposiciones-varias" className="text-blue-600 hover:text-blue-800 underline">26. DISPOSICIONES VARIAS</a></div>
                            <div><a href="#contacto" className="text-blue-600 hover:text-blue-800 underline">27. CONTACTO</a></div>
                        </div>
                    </div>
                    <div>
                        <section id="servicios" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">1. NUESTROS SERVICIOS</h2>
                            <p className="text-sm leading-relaxed mb-4">
                                La información proporcionada al usar los Servicios no está destinada a ser distribuida o usada por ninguna persona o entidad en ninguna jurisdicción o país donde dicha distribución o uso sea contrario a la ley o regulación, o que nos someta a cualquier requisito de registro dentro de dicha jurisdicción o país.
                            </p>
                            <p className="text-sm leading-relaxed">
                                En consecuencia, aquellas personas que elijan acceder a los Servicios desde otras ubicaciones lo hacen por su propia iniciativa y son las únicas responsables del cumplimiento de las leyes locales, si y en la medida en que las leyes locales sean aplicables, incluyendo pero no limitado a la Ley de Defensa del Consumidor N° 24.240 y sus modificatorias.
                            </p>
                        </section>

                        <section id="propiedad-intelectual" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">2. DERECHOS DE PROPIEDAD INTELECTUAL</h2>

                            <h3 className="text-lg font-bold mb-3">Nuestra propiedad intelectual</h3>
                            <div className="space-y-4 text-sm leading-relaxed">
                                <p>
                                    Somos el propietario o el licenciatario de todos los derechos de propiedad intelectual en nuestros Servicios, incluyendo todo el código fuente, bases de datos, funcionalidad, software, diseños de sitios web, audio, video, texto, fotografías y gráficos en los Servicios (en conjunto, el &quot;Contenido&quot;), así como las marcas comerciales, marcas de servicio y logotipos contenidos en ellos (las &quot;Marcas&quot;).
                                </p>
                                <p>
                                    Nuestro Contenido y Marcas están protegidos por las leyes de derechos de autor y marcas comerciales de la República Argentina (Ley 11.723 de Propiedad Intelectual y Ley 22.362 de Marcas y Designaciones), así como por tratados internacionales de los cuales Argentina es parte.
                                </p>
                                <p>
                                    El Contenido y las Marcas se proporcionan en o a través de los Servicios &quot;TAL CUAL&quot; solo para tu uso personal y no comercial o propósito comercial interno.
                                </p>
                            </div>

                            <h3 className="text-lg font-bold mb-3 mt-6">Tu uso de nuestros Servicios</h3>
                            <div className="space-y-4 text-sm leading-relaxed">
                                <p>
                                    Sujeto a tu cumplimiento con estos Términos Legales, incluyendo la sección <a href="#actividades-prohibidas" className="text-blue-600 hover:text-blue-800 underline">&quot;ACTIVIDADES PROHIBIDAS&quot;</a> más abajo, te otorgamos una licencia no exclusiva, no transferible y revocable para:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>acceder a los Servicios; y</li>
                                    <li>descargar o imprimir una copia de cualquier porción del Contenido al que hayas obtenido acceso apropiadamente,</li>
                                </ul>
                                <p>únicamente para tu uso personal y no comercial o propósito comercial interno.</p>

                                <p>
                                    Excepto como se establece en esta sección o en otro lugar de nuestros Términos Legales, ninguna parte de los Servicios y ningún Contenido o Marcas puede ser copiado, reproducido, agregado, republicado, cargado, publicado, mostrado públicamente, codificado, traducido, transmitido, distribuido, vendido, licenciado o explotado de cualquier otra manera para cualquier propósito comercial, sin nuestro permiso previo por escrito expreso.
                                </p>

                                <p>
                                    Si deseás hacer cualquier uso de los Servicios, Contenido o Marcas que no sea como se establece en esta sección o en otro lugar de nuestros Términos Legales, dirigí tu solicitud a: info@lanzate.app. Si alguna vez te otorgamos el permiso para publicar, reproducir o mostrar públicamente cualquier parte de nuestros Servicios o Contenido, debés identificarnos como los propietarios o licenciatarios de los Servicios, Contenido o Marcas y asegurar que cualquier aviso de derechos de autor o propiedad aparezca o sea visible al publicar, reproducir o mostrar nuestro Contenido.
                                </p>

                                <p>Nos reservamos todos los derechos que no te otorgamos expresamente en y sobre los Servicios, Contenido y Marcas.</p>

                                <p>
                                    Cualquier violación de estos Derechos de Propiedad Intelectual constituirá una violación material de nuestros Términos Legales y tu derecho a usar nuestros Servicios terminará inmediatamente.
                                </p>
                            </div>

                            <h3 className="text-lg font-bold mb-3 mt-6">Tus envíos y contribuciones</h3>
                            <div className="space-y-4 text-sm leading-relaxed">
                                <p>
                                    Por favor, revisá esta sección y la sección <a href="#actividades-prohibidas" className="text-blue-600 hover:text-blue-800 underline">&quot;ACTIVIDADES PROHIBIDAS&quot;</a> cuidadosamente antes de usar nuestros Servicios para entender (a) los derechos que nos otorgás y (b) las obligaciones que tenés cuando publicás o subís cualquier contenido a través de los Servicios.
                                </p>

                                <p>
                                    <strong>Envíos:</strong> Al enviarnos directamente cualquier pregunta, comentario, sugerencia, idea, feedback u otra información sobre los Servicios (&quot;Envíos&quot;), aceptás cedernos todos los derechos de propiedad intelectual sobre dicho Envío. Aceptás que seremos propietarios de este Envío y tendremos derecho a su uso y difusión sin restricciones para cualquier propósito lícito, comercial o de otro tipo, sin reconocimiento ni compensación para vos.
                                </p>

                                <p>
                                    <strong>Contribuciones:</strong> Los Servicios pueden invitarte a chatear, contribuir o participar en blogs, tableros de mensajes, foros en línea y otras funcionalidades durante las cuales podés crear, enviar, publicar, mostrar, transmitir, publicar, distribuir o difundir contenido y materiales a nosotros o a través de los Servicios, incluyendo pero no limitado a texto, escritos, video, audio, fotografías, música, gráficos, comentarios, reseñas, sugerencias de calificación, información personal u otro material (&quot;Contribuciones&quot;). Cualquier Envío que se publique públicamente también será tratado como una Contribución.
                                </p>

                                <p>
                                    Entendés que las Contribuciones pueden ser vistas por otros usuarios de los Servicios y posiblemente a través de sitios web de terceros.
                                </p>

                                <p>
                                    <strong>Cuando publicás Contribuciones, nos otorgás una licencia (incluyendo el uso de tu nombre, marcas comerciales y logotipos):</strong> Al publicar cualquier Contribución, nos otorgás una licencia sin restricciones, ilimitada, irrevocable, perpetua, no exclusiva, transferible, libre de regalías, totalmente pagada y mundial para: usar, copiar, reproducir, distribuir, vender, revender, publicar, transmitir, retitular, almacenar, ejecutar públicamente, mostrar públicamente, reformatear, traducir, extractar (en todo o en parte) y explotar tus Contribuciones (incluyendo, sin limitación, tu imagen, nombre y voz) para cualquier propósito, comercial, publicitario o de otro tipo, para preparar obras derivadas de, o incorporar en otras obras, tus Contribuciones, y para sublicenciar las licencias otorgadas en esta sección. Nuestro uso y distribución puede ocurrir en cualquier formato de medios y a través de cualquier canal de medios.
                                </p>

                                <p>
                                    Esta licencia incluye nuestro uso de tu nombre, nombre de la empresa y nombre de franquicia, según corresponda, y cualquiera de las marcas comerciales, marcas de servicio, nombres comerciales, logotipos e imágenes personales y comerciales que proporciones.
                                </p>

                                <p>
                                    <strong>Sos responsable de lo que publicás o subís:</strong> Al enviarnos Envíos y/o publicar Contribuciones a través de cualquier parte de los Servicios o hacer que las Contribuciones sean accesibles a través de los Servicios vinculando tu cuenta a través de los Servicios a cualquiera de tus cuentas de redes sociales, vos:
                                </p>

                                <ul className="list-disc ml-6 space-y-2">
                                    <li>confirmás que has leído y estás de acuerdo con nuestras <a href="#actividades-prohibidas" className="text-blue-600 hover:text-blue-800 underline">&quot;ACTIVIDADES PROHIBIDAS&quot;</a> y no publicarás, enviarás, publicarás, subirás o transmitirás a través de los Servicios ningún Envío ni publicarás ninguna Contribución que sea ilegal, acosadora, odiosa, dañina, difamatoria, obscena, intimidante, abusiva, discriminatoria, amenazante para cualquier persona o grupo, sexualmente explícita, falsa, inexacta, engañosa o fraudulenta;</li>
                                    <li>en la medida en que lo permita la ley aplicable, renunciás a todos los derechos morales sobre cualquier Envío y/o Contribución;</li>
                                    <li>garantizás que dichos Envíos y/o Contribuciones son originales tuyos o que tenés los derechos y licencias necesarios para enviar dichos Envíos y/o Contribuciones y que tenés plena autoridad para otorgarnos los derechos mencionados anteriormente en relación con tus Envíos y/o Contribuciones; y</li>
                                    <li>garantizás y representás que tus Envíos y/o Contribuciones no constituyen información confidencial.</li>
                                </ul>

                                <p>
                                    Sos el único responsable de tus Envíos y/o Contribuciones y aceptás expresamente reembolsarnos por todas y cada una de las pérdidas que podamos sufrir debido a tu incumplimiento de (a) esta sección, (b) los derechos de propiedad intelectual de cualquier tercero, o (c) la ley aplicable.
                                </p>

                                <p>
                                    <strong>Podemos eliminar o editar tu Contenido:</strong> Aunque no tenemos obligación de monitorear ninguna Contribución, tendremos el derecho de eliminar o editar cualquier Contribución en cualquier momento sin previo aviso si, en nuestra opinión razonable, consideramos que dichas Contribuciones son dañinas o infringen estos Términos Legales. Si eliminamos o editamos dichas Contribuciones, también podemos suspender o deshabilitar tu cuenta y reportarte a las autoridades.
                                </p>
                            </div>
                        </section>

                        <section id="representaciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">3. DECLARACIONES DEL USUARIO</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Al usar los Servicios, declarás y garantizás que:</p>
                                <p>
                                    (1) toda la información de registro que envíes será verdadera, precisa, actual y completa; (2) mantendrás la precisión de dicha información y actualizarás rápidamente dicha información de registro según sea necesario; (3) tenés la capacidad legal y aceptás cumplir con estos Términos Legales; (4) no sos menor de edad en la jurisdicción en la que residís, ni menor de 18 años; (5) no accederás a los Servicios a través de medios automatizados o no humanos, ya sea a través de un bot, script o de otro modo; (6) no usarás los Servicios para ningún propósito ilegal o no autorizado; y (7) tu uso de los Servicios no violará ninguna ley o regulación aplicable.
                                </p>
                                <p>
                                    Si proporcionás cualquier información que sea falsa, inexacta, no actual o incompleta, tenemos el derecho de suspender o terminar tu cuenta y rechazar cualquier uso actual o futuro de los Servicios (o cualquier porción de los mismos).
                                </p>
                            </div>
                        </section>

                        <section id="registro" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">4. REGISTRO DE USUARIO</h2>
                            <p className="text-sm leading-relaxed">
                                Es posible que debas registrarte para usar los Servicios. Aceptás mantener tu contraseña confidencial y serás responsable de todo uso de tu cuenta y contraseña. Nos reservamos el derecho de eliminar, reclamar o cambiar un nombre de usuario que selecciones si determinamos, a nuestro exclusivo criterio, que dicho nombre de usuario es inapropiado, obsceno o de otro modo objetable.
                            </p>
                        </section>

                        <section id="compras" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">5. COMPRAS Y PAGO</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>Aceptamos las siguientes formas de pago:</p>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Visa</li>
                                    <li>Mastercard</li>
                                    <li>American Express</li>
                                    <li>Mercado Pago</li>
                                    <li>Transferencia bancaria</li>
                                </ul>

                                <p>
                                    Aceptás proporcionar información de compra y cuenta actual, completa y precisa para todas las compras realizadas a través de los Servicios. Además, aceptás actualizar rápidamente la información de cuenta y pago, incluyendo dirección de correo electrónico, método de pago y fecha de vencimiento de la tarjeta de pago, para que podamos completar tus transacciones y contactarte según sea necesario. Se agregará el impuesto al valor agregado (IVA) al precio de las compras según lo requiera la legislación argentina. Podemos cambiar los precios en cualquier momento. Todos los pagos serán en Pesos Argentinos (ARS).
                                </p>

                                <p>
                                    Aceptás pagar todos los cargos a los precios vigentes en ese momento para tus compras y cualquier tarifa de envío aplicable, y nos autorizás a cobrar a tu proveedor de pago elegido dichos montos al realizar tu pedido. Nos reservamos el derecho de corregir cualquier error o equivocación en los precios, incluso si ya hemos solicitado o recibido el pago.
                                </p>

                                <p>
                                    Nos reservamos el derecho de rechazar cualquier pedido que realices con nosotros. Podemos, a nuestro exclusivo criterio, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Estas restricciones pueden incluir pedidos realizados por o bajo la misma cuenta de cliente, la misma tarjeta de crédito y/o pedidos que usen la misma dirección de facturación y/o envío.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Facturación:</strong> Conforme a las regulaciones de ARCA, emitiremos la factura electrónica correspondiente por todas las transacciones realizadas. Si necesitás factura tipo A o B, por favor indicalo en tu perfil y proporcioná tu CUIT/CUIL.
                                </p>
                            </div>
                        </section>

                        <section id="suscripciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">6. SUSCRIPCIONES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <h3 className="text-lg font-bold mb-3">Facturación y Renovación</h3>
                                <p>
                                    Tu suscripción continuará y se renovará automáticamente a menos que la canceles. Aceptás que podemos cobrar a tu método de pago de forma recurrente sin requerir tu aprobación previa para cada cargo recurrente, hasta que canceles el pedido aplicable. La duración de tu ciclo de facturación dependerá del tipo de plan de suscripción que elijas al comprar la suscripción.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Importante sobre renovaciones:</strong> Conforme al Artículo 10 bis de la Ley de Defensa del Consumidor (Ley 24.240), te notificaremos con al menos 3 días de anticipación antes de cada renovación automática, indicándote el monto a cobrar y tu derecho a cancelar sin costo.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Prueba Gratuita</h3>
                                <p>
                                    Ofrecemos una prueba gratuita a nuevos usuarios que se registren en los Servicios. La cuenta no será cobrada y la suscripción será suspendida hasta que se actualice a una versión paga al final de la prueba gratuita.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Cancelación y Derecho de Arrepentimiento</h3>
                                <p>
                                    Podés cancelar tu suscripción en cualquier momento iniciando sesión en tu cuenta o contactándonos usando la información de contacto proporcionada más abajo. Tu cancelación tendrá efecto al final del período pagado actual.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Derecho de Arrepentimiento:</strong> Conforme al Artículo 34 de la Ley de Defensa del Consumidor, tenés derecho a arrepentirte de tu compra dentro de los 10 días corridos desde la contratación del servicio, sin necesidad de dar explicaciones y sin costo alguno. Para ejercer este derecho, contactanos a info@lanzate.app.
                                </p>

                                <p>
                                    Si no estás satisfecho con nuestros Servicios, por favor envianos un correo electrónico a info@lanzate.app.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Cambios de Tarifa</h3>
                                <p>
                                    Podemos, de vez en cuando, realizar cambios en la tarifa de suscripción y te comunicaremos cualquier cambio de precio de acuerdo con la ley aplicable. Te notificaremos con al menos 30 días de anticipación sobre cualquier aumento de precio.
                                </p>
                            </div>
                        </section>

                        <section id="actividades-prohibidas" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">7. ACTIVIDADES PROHIBIDAS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>No podés acceder o usar los Servicios para ningún propósito que no sea aquel para el cual hacemos disponibles los Servicios. Los Servicios no pueden ser usados en conexión con ningún esfuerzo comercial excepto aquellos que estén específicamente respaldados o aprobados por nosotros.</p>

                                <p>Como usuario de los Servicios, aceptás no:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Recuperar sistemáticamente datos u otro contenido de los Servicios para crear o compilar, directa o indirectamente, una colección, compilación, base de datos o directorio sin permiso por escrito nuestro.</li>
                                    <li>Engañar, defraudar o inducir a error a nosotros y a otros usuarios, especialmente en cualquier intento de conocer información sensible de la cuenta como contraseñas de usuario.</li>
                                    <li>Eludir, deshabilitar o interferir de otro modo con las características relacionadas con la seguridad de los Servicios, incluidas las características que impiden o restringen el uso o la copia de cualquier Contenido o que imponen limitaciones en el uso de los Servicios y/o el Contenido contenido en ellos.</li>
                                    <li>Menospreciar, empañar o dañar de otro modo, en nuestra opinión, a nosotros y/o los Servicios.</li>
                                    <li>Usar cualquier información obtenida de los Servicios para acosar, abusar o dañar a otra persona.</li>
                                    <li>Hacer uso indebido de nuestros servicios de soporte o enviar informes falsos de abuso o mala conducta.</li>
                                    <li>Usar los Servicios de manera inconsistente con cualquier ley o regulación aplicable.</li>
                                    <li>Participar en el encuadre no autorizado o la vinculación a los Servicios.</li>
                                    <li>Cargar o transmitir (o intentar cargar o transmitir) virus, troyanos u otro material, incluido el uso excesivo de mayúsculas y spam (publicación continua de texto repetitivo), que interfiera con el uso y disfrute ininterrumpido de los Servicios por parte de cualquiera o que modifique, perjudique, interrumpa, altere o interfiera con el uso, características, funciones, operación o mantenimiento de los Servicios.</li>
                                    <li>Participar en cualquier uso automatizado del sistema, como el uso de scripts para enviar comentarios o mensajes, o el uso de cualquier minería de datos, robots o herramientas similares de recopilación y extracción de datos.</li>
                                    <li>Eliminar el aviso de derechos de autor u otros derechos de propiedad de cualquier Contenido.</li>
                                    <li>Intentar hacerse pasar por otro usuario o persona o usar el nombre de usuario de otro usuario.</li>
                                    <li>Cargar o transmitir (o intentar cargar o transmitir) cualquier material que actúe como un mecanismo pasivo o activo de recopilación o transmisión de información, incluidos, entre otros, formatos de intercambio de gráficos claros (&quot;gifs&quot;), píxeles 1×1, web bugs, cookies o otros dispositivos similares (a veces denominados &quot;spyware&quot; o &quot;mecanismos de recopilación pasiva&quot; o &quot;pcms&quot;).</li>
                                    <li>Interferir, interrumpir o crear una carga indebida en los Servicios o en las redes o servicios conectados a los Servicios.</li>
                                    <li>Acosar, molestar, intimidar o amenazar a cualquiera de nuestros empleados o agentes que se dediquen a proporcionarte cualquier parte de los Servicios.</li>
                                    <li>Intentar eludir cualquier medida de los Servicios diseñada para prevenir o restringir el acceso a los Servicios, o cualquier parte de los Servicios.</li>
                                    <li>Copiar o adaptar el software de los Servicios, incluidos, entre otros, Flash, PHP, HTML, JavaScript u otro código.</li>
                                    <li>Salvo que lo permita la ley aplicable, descifrar, descompilar, desensamblar o aplicar ingeniería inversa a cualquiera del software que comprende o de alguna manera forma parte de los Servicios.</li>
                                    <li>Excepto como resultado del uso estándar de motores de búsqueda o navegadores de Internet, usar, lanzar, desarrollar o distribuir cualquier sistema automatizado, incluidos, entre otros, cualquier araña, robot, utilidad de trucos, raspador o lector fuera de línea que acceda a los Servicios, o usar o lanzar cualquier script no autorizado u otro software.</li>
                                    <li>Usar un agente de compra o agente de compras para realizar compras en los Servicios.</li>
                                    <li>Hacer cualquier uso no autorizado de los Servicios, incluyendo la recopilación de nombres de usuario y/o direcciones de correo electrónico de usuarios por medios electrónicos o de otro tipo con el propósito de enviar correo electrónico no solicitado, o crear cuentas de usuario por medios automatizados o bajo pretextos falsos.</li>
                                    <li>Usar los Servicios como parte de cualquier esfuerzo para competir con nosotros o usar los Servicios y/o el Contenido para cualquier esfuerzo generador de ingresos o empresa comercial.</li>
                                    <li>Vender o transferir tu perfil.</li>
                                </ul>
                            </div>
                        </section>

                        <section id="contenido-usuario" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">8. CONTRIBUCIONES GENERADAS POR USUARIOS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Los Servicios pueden invitarte a chatear, contribuir o participar en blogs, tableros de mensajes, foros en línea y otras funcionalidades, y pueden brindarte la oportunidad de crear, enviar, publicar, mostrar, transmitir, publicar, distribuir o difundir contenido y materiales a nosotros o a través de los Servicios, incluyendo, entre otros, texto, escritos, video, audio, fotografías, gráficos, comentarios, sugerencias o información personal u otro material (colectivamente, &quot;Contribuciones&quot;). Las Contribuciones pueden ser vistas por otros usuarios de los Servicios y a través de sitios web de terceros. Como tal, cualquier Contribución que transmitas puede ser tratada de acuerdo con la <a href="#privacidad" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad</a> de los Servicios.
                                </p>
                                <p>
                                    Al crear o poner a disposición cualquier Contribución, por la presente declarás y garantizás que:
                                </p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>La creación, distribución, transmisión, exhibición pública o ejecución, y el acceso, descarga o copia de tus Contribuciones no infringirán ni violarán los derechos de propiedad, incluidos, entre otros, los derechos de autor, patentes, marcas comerciales, secretos comerciales o derechos morales de ningún tercero.</li>
                                    <li>Sos el creador y propietario o tenés las licencias, derechos, consentimientos, liberaciones y permisos necesarios para usar y autorizarnos a nosotros, a los Servicios y a otros usuarios de los Servicios a usar tus Contribuciones de cualquier manera contemplada por los Servicios y estos Términos Legales.</li>
                                    <li>Tenés el consentimiento por escrito, liberación y/o permiso de todas y cada una de las personas individuales identificables en tus Contribuciones para usar el nombre o semejanza de cada una de esas personas individuales identificables para permitir la inclusión y el uso de tus Contribuciones de cualquier manera contemplada por los Servicios y estos Términos Legales.</li>
                                    <li>Tus Contribuciones no son falsas, inexactas o engañosas.</li>
                                    <li>Tus Contribuciones no son publicidad no solicitada o no autorizada, materiales promocionales, esquemas piramidales, cartas en cadena, spam, correos masivos o &quot;phishing&quot;.</li>
                                    <li>Tus Contribuciones no son obscenas, lascivas, lujuriosas, sucias, violentas, acosadoras, difamatorias, calumniosas o de otra manera objetables (según lo determinemos nosotros).</li>
                                    <li>Tus Contribuciones no ridiculizan, se burlan, menosprecian, intimidan o abusan de nadie.</li>
                                    <li>Tus Contribuciones no se utilizan para acosar o amenazar (en el sentido legal de esos términos) a ningún otro usuario ni para promover la violencia contra un usuario o clase de usuarios.</li>
                                    <li>Tus Contribuciones no violan ninguna ley, regulación o norma aplicable.</li>
                                    <li>Tus Contribuciones no violan los derechos de privacidad o publicidad de ningún tercero.</li>
                                    <li>Tus Contribuciones no incluyen ningún material que solicite información personal de nadie menor de 18 años o explote a personas menores de 18 años de manera sexual o violenta.</li>
                                    <li>Tus Contribuciones no violan ninguna ley concerniente a pornografía infantil, o destinada a proteger la salud o el bienestar de los menores.</li>
                                    <li>Tus Contribuciones no incluyen ningún comentario ofensivo que esté conectado a la raza, origen nacional, género, preferencia sexual o discapacidad física.</li>
                                    <li>Tus Contribuciones no violan de otra manera, ni se vinculan a material que viole, ninguna disposición de estos Términos Legales, o cualquier ley o regulación aplicable.</li>
                                </ul>
                                <p>
                                    Cualquier uso de los Servicios que viole lo anterior infringe estos Términos Legales y puede resultar, entre otras cosas, en la terminación o suspensión de tus derechos para usar los Servicios.
                                </p>
                            </div>
                        </section>

                        <section id="licencia-contribucion" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">9. LICENCIA DE CONTRIBUCIÓN</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Al publicar tus Contribuciones en cualquier parte de los Servicios, automáticamente otorgás, y declarás y garantizás que tenés el derecho de otorgar, a nosotros una licencia sin restricciones, ilimitada, irrevocable, perpetua, no exclusiva, transferible, libre de regalías, totalmente pagada y mundial para alojar, usar, copiar, reproducir, divulgar, vender, revender, publicar, retitular, archivar, almacenar, almacenar en caché, traficar, realizar públicamente, mostrar públicamente, reformatear, traducir, transmitir, extractar (incluyendo, sin limitación, la idea, concepto, técnica o know-how para cualquier propósito), y distribuir dichas Contribuciones (incluyendo, sin limitación, tu imagen y voz) para cualquier propósito, comercial, publicitario o de otro tipo, y para preparar obras derivadas de, o incorporar en otras obras, dichas Contribuciones, y para otorgar y autorizar sublicencias de lo anterior. El uso y la distribución pueden ocurrir en cualquier formato de medios y a través de cualquier canal de medios.
                                </p>
                                <p>
                                    Esta licencia se aplicará a cualquier forma, medio o tecnología ahora conocida o desarrollada en el futuro, e incluye nuestro uso de tu nombre, nombre de la empresa y nombre de franquicia, según corresponda, y cualquiera de las marcas comerciales, marcas de servicio, nombres comerciales, logotipos e imágenes personales y comerciales que proporciones. Renunciás a todos los derechos morales en tus Contribuciones y garantizás que no se han afirmado derechos morales en tus Contribuciones.
                                </p>
                                <p>
                                    No afirmamos ninguna propiedad sobre tus Contribuciones. Conservás la propiedad total de todas tus Contribuciones y cualquier derecho de propiedad intelectual o cualquier otro derecho de propiedad asociado con tus Contribuciones. No somos responsables de ninguna declaración o representación en tus Contribuciones proporcionadas por vos en cualquier área de los Servicios. Sos el único responsable de tus Contribuciones a los Servicios y aceptás expresamente exonerarnos de toda responsabilidad y abstenerte de cualquier acción legal contra nosotros con respecto a tus Contribuciones.
                                </p>
                                <p>
                                    Tenemos el derecho, a nuestro exclusivo y absoluto criterio, (1) de editar, redactar o cambiar de otra manera cualquier Contribución; (2) de recategorizar cualquier Contribución para colocarla en ubicaciones más apropiadas en los Servicios; y (3) de seleccionar o negarnos a publicar cualquier Contribución. No tenemos ninguna obligación de ejercer estos derechos.
                                </p>
                            </div>
                        </section>

                        <section id="resenas" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">10. LINEAMIENTOS PARA RESEÑAS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Podemos proporcionarte áreas en los Servicios para dejar reseñas o calificaciones. Al publicar una reseña, debés cumplir con los siguientes criterios: (1) debes tener experiencia de primera mano con la persona/entidad que está siendo reseñada; (2) tus reseñas no deben contener lenguaje ofensivo, blasfemo, abusivo, racista, odioso o de acoso; (3) tus reseñas no deben contener referencias discriminatorias basadas en religión, raza, género, origen nacional, edad, estado civil, orientación sexual o discapacidad; (4) tus reseñas no deben contener referencias a actividad ilegal; (5) no debes estar afiliado a competidores si publicás reseñas negativas; (6) no debes sacar conclusiones sobre la legalidad de la conducta; (7) no puedes publicar declaraciones falsas o engañosas; y (8) no puedes organizar a otros para publicar reseñas, ya sean positivas o negativas.
                                </p>
                                <p>
                                    Podemos aceptar, rechazar o eliminar reseñas a nuestro exclusivo criterio. No tenemos absolutamente ninguna obligación de seleccionar o eliminar reseñas, incluso si alguien considera que las reseñas son objetables o inexactas. Las reseñas no están respaldadas por nosotros y no representan necesariamente nuestras opiniones o las opiniones de ninguno de nuestros afiliados o socios. No asumimos responsabilidad por ninguna reseña ni por ninguna reclamación, responsabilidad o pérdida resultante de cualquier reseña. Al publicar una reseña, por la presente nos otorgás un derecho y licencia perpetuos, no exclusivos, mundiales, libres de regalías, totalmente pagados, asignables y sublicenciables para reproducir, modificar, traducir, transmitir por cualquier medio, mostrar, ejecutar y/o distribuir todo el contenido relacionado con la reseña.
                                </p>
                            </div>
                        </section>

                        <section id="app-movil" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">11. LICENCIA DE APLICACIÓN MÓVIL</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <h3 className="text-lg font-bold mb-3">Licencia de uso</h3>
                                <p>
                                    Si accedés a los Servicios a través de una aplicación móvil, te otorgamos un derecho revocable, no exclusivo, no transferible y limitado para instalar y usar la aplicación móvil en dispositivos electrónicos de tu propiedad o que controlás, y para acceder y usar la aplicación móvil en dichos dispositivos estrictamente de acuerdo con los términos y condiciones de esta licencia de aplicación móvil contenida en estos Términos Legales. No debés: (1) descompilar, aplicar ingeniería inversa, desensamblar, intentar derivar el código fuente de, o descifrar la aplicación; (2) realizar cualquier modificación, adaptación, mejora, mejora, traducción o trabajo derivado de la aplicación; (3) violar cualquier ley, regla o regulación aplicable en relación con tu acceso o uso de la aplicación; (4) eliminar, alterar u ocultar cualquier aviso de propiedad (incluido cualquier aviso de derechos de autor o marca comercial) de nosotros o los licenciantes de la aplicación; (5) usar la aplicación para cualquier esfuerzo generador de ingresos, empresa comercial o cualquier otro propósito para el que no esté diseñada o destinada; (6) poner la aplicación a disposición a través de una red u otro entorno que permita el acceso o uso por parte de múltiples dispositivos o usuarios a la vez; (7) usar la aplicación para crear un producto, servicio o software que sea, directa o indirectamente, competitivo o de alguna manera sustituto de la aplicación; (8) usar la aplicación para enviar consultas automatizadas a cualquier sitio web o para enviar cualquier correo electrónico comercial no solicitado; o (9) usar cualquier información de propiedad nuestra o nuestras interfaces o nuestra otra propiedad intelectual en el diseño, desarrollo, fabricación, licencia o distribución de cualquier aplicación, accesorios o dispositivos para usar con la aplicación.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Dispositivos de Apple y Android</h3>
                                <p>
                                    Los siguientes términos se aplican cuando usás una aplicación móvil obtenida de Apple Store o Google Play (cada uno un &quot;Distribuidor de Aplicaciones&quot;) para acceder a los Servicios: (1) La licencia que se te otorga para nuestra aplicación móvil se limita a una licencia no transferible para usar la aplicación en un dispositivo que use los sistemas operativos Apple iOS o Android, según corresponda, y de acuerdo con las reglas de uso establecidas en los términos de servicio aplicables del Distribuidor de Aplicaciones; (2) Somos responsables de proporcionar cualquier servicio de mantenimiento y soporte con respecto a la aplicación móvil según se especifica en los términos y condiciones de esta licencia de aplicación móvil contenida en estos Términos Legales o según lo requiera la ley aplicable, y reconocés que cada Distribuidor de Aplicaciones no tiene ninguna obligación de proporcionar ningún servicio de mantenimiento y soporte con respecto a la aplicación móvil; (3) En caso de cualquier falla de la aplicación móvil para cumplir con cualquier garantía aplicable, podés notificar al Distribuidor de Aplicaciones, y el Distribuidor de Aplicaciones, de acuerdo con sus términos y políticas, puede reembolsarte el precio de compra, si lo hubiera, pagado por la aplicación móvil, y en la máxima medida permitida por la ley aplicable, el Distribuidor de Aplicaciones no tendrá ninguna otra obligación de garantía con respecto a la aplicación móvil; (4) Declarás y garantizás que (i) no estás ubicado en un país sujeto a un embargo del gobierno de los Estados Unidos, o que ha sido designado por el gobierno de los Estados Unidos como un país de &quot;apoyo terrorista&quot; y (ii) no estás incluido en ninguna lista del gobierno de los Estados Unidos de partes prohibidas o restringidas; (5) Debés cumplir con los términos de acuerdo de terceros aplicables al usar la aplicación móvil, por ejemplo, si usás una aplicación VoIP, entonces no debes violar su acuerdo de servicio de datos inalámbricos al usar la aplicación móvil; y (6) Reconocés y aceptás que los Distribuidores de Aplicaciones son terceros beneficiarios de los términos y condiciones de esta licencia de aplicación móvil contenida en estos Términos Legales, y que cada Distribuidor de Aplicaciones tendrá el derecho (y se considerará que ha aceptado el derecho) de hacer cumplir los términos y condiciones de esta licencia de aplicación móvil contra vos como tercero beneficiario de la misma.
                                </p>
                            </div>
                        </section>

                        <section id="redes-sociales" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">12. REDES SOCIALES</h2>
                            <p className="text-sm leading-relaxed">
                                Como parte de la funcionalidad de los Servicios, podés vincular tu cuenta con cuentas en línea que tengas con proveedores de servicios de terceros (cada una de esas cuentas, una &quot;Cuenta de Terceros&quot;): ya sea (1) proporcionando la información de inicio de sesión de tu Cuenta de Terceros a través de los Servicios; o (2) permitiéndonos acceder a tu Cuenta de Terceros, según lo permitido bajo los términos y condiciones aplicables que rigen el uso de cada Cuenta de Terceros. Declarás y garantizás que tienes derecho a revelarnos la información de inicio de sesión de tu Cuenta de Terceros y/o a concedernos acceso a tu Cuenta de Terceros, sin incumplimiento por tu parte de ninguno de los términos y condiciones que rigen la Cuenta de Terceros aplicable, y sin obligarnos a pagar ninguna tarifa ni a someternos a ninguna limitación de uso impuesta por el proveedor de servicios externo de la Cuenta de Terceros. Al concedernos acceso a cualquier Cuenta de Terceros, reconocés y aceptás que podemos acceder, poner a disposición y almacenar (si corresponde) cualquier contenido que nos hayas proporcionado y almacenado en tu Cuenta de Terceros (&quot;Contenido de Redes Sociales&quot;), de modo que esté disponible en y a través de los Servicios a través de tu cuenta, incluidos, entre otros, cualquier lista de amigos y seguidores. A menos que se especifique lo contrario en estos Términos Legales, todo el Contenido de Redes Sociales, si lo hay, se considerará Contribuciones. Si ya no deseás que tu Cuenta de Terceros esté conectada a los Servicios, podés desconectar la conexión en el Servicio.
                            </p>
                        </section>

                        <section id="terceros" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">13. SITIOS WEB Y CONTENIDO DE TERCEROS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Los Servicios pueden contener (o se te puede enviar a través de los Servicios) enlaces a otros sitios web (&quot;Sitios Web de Terceros&quot;) así como artículos, fotografías, texto, gráficos, imágenes, diseños, música, sonido, video, información, aplicaciones, software y otro contenido o elementos pertenecientes o provenientes de terceros (&quot;Contenido de Terceros&quot;). Dichos Sitios Web de Terceros y Contenido de Terceros no son investigados, monitoreados o verificados en cuanto a precisión, adecuación o exhaustividad por nuestra parte, y no somos responsables de ningún Sitio Web de Terceros accedido a través de los Servicios o de ningún Contenido de Terceros publicado, disponible a través o instalado desde los Servicios, incluyendo el contenido, la precisión, la ofensividad, las opiniones, la fiabilidad, las prácticas de privacidad u otras políticas de o contenidas en los Sitios Web de Terceros o el Contenido de Terceros. La inclusión, vinculación o permiso para el uso o la instalación de cualquier Sitio Web de Terceros o cualquier Contenido de Terceros no implica una aprobación o respaldo por nuestra parte. Si decidís abandonar los Servicios y acceder a los Sitios Web de Terceros o usar o instalar cualquier Contenido de Terceros, lo hacés bajo tu propio riesgo y debes tener en cuenta que estos Términos Legales ya no rigen. Debes revisar los términos y políticas aplicables, incluidas las prácticas de privacidad y recopilación de datos, de cualquier sitio web al que navegues desde los Servicios o en relación con las aplicaciones que uses o instales desde los Servicios. Cualquier compra que realices a través de Sitios Web de Terceros se realizará a través de otros sitios web y de otras empresas, y no asumimos ninguna responsabilidad con respecto a dichas compras que son exclusivamente entre vos y el tercero aplicable. Aceptás y reconocés que no respaldamos los productos o servicios ofrecidos en Sitios Web de Terceros y nos eximirás de cualquier daño causado por tu compra de dichos productos o servicios. Además, nos eximirás de cualquier pérdida que sufras o daño que se te cause en relación con o resulte de cualquier manera de cualquier Contenido de Terceros o cualquier contacto con Sitios Web de Terceros.
                                </p>

                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Limitación:</strong> No nos hacemos responsables por el contenido, la precisión, la adecuación o las prácticas de privacidad de los Sitios Web de Terceros. El uso de Sitios Web de Terceros y Contenido de Terceros es bajo tu propio riesgo.
                                </p>
                            </div>
                        </section>

                        <section id="gestion" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">14. GESTIÓN DE LOS SERVICIOS</h2>
                            <p className="text-sm leading-relaxed">
                                Nos reservamos el derecho, pero no la obligación, de: (1) monitorear los Servicios en busca de violaciones de estos Términos Legales; (2) tomar las acciones legales apropiadas contra cualquier persona que, a nuestro exclusivo criterio, viole la ley o estos Términos Legales, incluyendo, sin limitación, reportar a dicho usuario a las autoridades; (3) a nuestro exclusivo criterio y sin limitación, rechazar, restringir el acceso, limitar la disponibilidad o deshabilitar (en la medida de lo tecnológicamente posible) cualquiera de tus Contribuciones o cualquier porción de ellas; (4) a nuestro exclusivo criterio y sin limitación, aviso o responsabilidad, eliminar de los Servicios o deshabilitar de otra manera todos los archivos y contenido que sean de tamaño excesivo o de alguna manera gravosos para nuestros sistemas; y (5) administrar de otra manera los Servicios de una manera diseñada para proteger nuestros derechos y propiedad y facilitar el funcionamiento adecuado de los Servicios.
                            </p>
                        </section>

                        <section id="privacidad" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">15. POLÍTICA DE PRIVACIDAD</h2>
                            <p className="text-sm leading-relaxed">
                                Nos preocupamos por la privacidad de los datos y la seguridad. Por favor, revisá nuestra <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Política de Privacidad</Link>: Al usar los Servicios, aceptás estar obligado por nuestra Política de Privacidad, que se incorpora a estos Términos Legales. Tené en cuenta que los Servicios están alojados en Argentina y en servidores ubicados fuera del territorio argentino. Si accedés a los Servicios desde cualquier otra región del mundo con leyes u otros requisitos que rijan la recopilación, el uso o la divulgación de datos personales que difieren de las leyes aplicables en Argentina (Ley de Protección de Datos Personales N° 25.326 y sus modificatorias), entonces a través de tu uso continuado de los Servicios, estás transfiriendo tus datos a Argentina y a servidores ubicados en el exterior, y aceptás expresamente que tus datos sean transferidos y procesados en Argentina y/o en el extranjero. Además, no aceptamos a sabiendas, solicitudes, ni solicitamos a sabiendas información de niños ni comercializamos con niños. Por lo tanto, de acuerdo con la Ley de Protección de Datos Personales y la legislación de protección de datos, si tomamos conocimiento de que alguien menor de 18 años nos ha proporcionado información personal sin el consentimiento verificable de los padres, eliminaremos esa información de los Servicios lo más rápido posible.
                            </p>
                        </section>

                        <section id="plazo-terminacion" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">16. PLAZO Y TERMINACIÓN</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estos Términos Legales permanecerán en plena vigencia y efecto mientras uses los Servicios. SIN LIMITAR CUALQUIER OTRA DISPOSICIÓN DE ESTOS TÉRMINOS LEGALES, NOS RESERVAMOS EL DERECHO DE, A NUESTRO EXCLUSIVO CRITERIO Y SIN AVISO NI RESPONSABILIDAD, DENEGAR EL ACCESO Y EL USO DE LOS SERVICIOS (INCLUIDO EL BLOQUEO DE CIERTAS DIRECCIONES IP) A CUALQUIER PERSONA POR CUALQUIER RAZÓN O SIN RAZÓN, INCLUYENDO SIN LIMITACIÓN POR INCUMPLIMIENTO DE CUALQUIER DECLARACIÓN, GARANTÍA O PACTO CONTENIDO EN ESTOS TÉRMINOS LEGALES O DE CUALQUIER LEY O REGULACIÓN APLICABLE. PODEMOS TERMINAR TU USO O PARTICIPACIÓN EN LOS SERVICIOS O ELIMINAR TU CUENTA Y CUALQUIER CONTENIDO O INFORMACIÓN QUE HAYAS PUBLICADO EN CUALQUIER MOMENTO, SIN AVISO, A NUESTRO EXCLUSIVO CRITERIO.
                                </p>
                                <p>
                                    Si terminamos o suspendemos tu cuenta por cualquier razón, tenés prohibido registrarte y crear una nueva cuenta bajo tu nombre, un nombre falso o prestado, o el nombre de cualquier tercero, incluso si estás actuando en nombre del tercero. Además de terminar o suspender tu cuenta, nos reservamos el derecho de tomar las acciones legales apropiadas, incluyendo, sin limitación, la búsqueda de reparación civil, penal y por mandamiento judicial.
                                </p>
                            </div>
                        </section>

                        <section id="modificaciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">17. MODIFICACIONES E INTERRUPCIONES</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Nos reservamos el derecho de cambiar, modificar o eliminar el contenido de los Servicios en cualquier momento o por cualquier razón a nuestro exclusivo criterio sin previo aviso. Sin embargo, no tenemos la obligación de actualizar ninguna información en nuestros Servicios. También nos reservamos el derecho de modificar o discontinuar la totalidad o parte de los Servicios sin previo aviso en cualquier momento. No seremos responsables ante vos ni ante ningún tercero por ninguna modificación, cambio de precio, suspensión o interrupción de los Servicios.
                                </p>
                                <p>
                                    No podemos garantizar que los Servicios estarán disponibles en todo momento. Podemos experimentar problemas de hardware, software u otros problemas o necesitar realizar mantenimiento relacionado con los Servicios, lo que resulta en interrupciones, retrasos o errores. Nos reservamos el derecho de cambiar, revisar, actualizar, suspender, discontinuar o modificar de otra manera los Servicios en cualquier momento o por cualquier razón sin aviso a vos. Aceptás que no tenemos ninguna responsabilidad por cualquier pérdida, daño o inconveniente causado por tu incapacidad para acceder o usar los Servicios durante cualquier interrupción o discontinuación de los Servicios. Nada en estos Términos Legales se interpretará como que nos obliga a mantener y soportar los Servicios o a suministrar correcciones, actualizaciones o lanzamientos en relación con los mismos.
                                </p>
                            </div>
                        </section>

                        <section id="ley-aplicable" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">18. LEY APLICABLE</h2>
                            <div className="text-sm leading-relaxed">
                                <p>
                                    Estos Términos Legales y tu uso de los Servicios se rigen e interpretan de acuerdo con las leyes de la República Argentina, aplicables a acuerdos celebrados y a ser ejecutados en su totalidad dentro de la República Argentina, sin tener en cuenta sus principios de conflicto de leyes.
                                </p>
                            </div>
                        </section>

                        <section id="resolucion-disputas" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">19. RESOLUCIÓN DE DISPUTAS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <h3 className="text-lg font-bold mb-3">Negociaciones Informales</h3>
                                <p>
                                    Para acelerar la resolución y controlar el costo de cualquier disputa, controversia o reclamo relacionado con estos Términos Legales (cada uno una &quot;Disputa&quot; y colectivamente, las &quot;Disputas&quot;) presentada por vos o por nosotros (individualmente, una &quot;Parte&quot; y colectivamente, las &quot;Partes&quot;), las Partes acuerdan intentar primero negociar cualquier Disputa (excepto aquellas Disputas expresamente provistas a continuación) informalmente por al menos sesenta (60) días antes de iniciar el arbitraje. Dichas negociaciones informales comienzan tras la notificación escrita de una Parte a la otra Parte.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Arbitraje Obligatorio</h3>
                                <p>
                                    Cualquier Disputa que surja de o esté relacionada con la validez, interpretación o cumplimiento de estos Términos Legales, que no pueda resolverse mediante negociaciones informales, será sometida a arbitraje conforme a las reglas del Tribunal de Arbitraje General de la Bolsa de Comercio de Buenos Aires. La sede del arbitraje será la Ciudad Autónoma de Buenos Aires, Argentina. El idioma del arbitraje será el español. El número de árbitros será uno (1).
                                </p>
                                <p>
                                    Las Partes acuerdan que el arbitraje se considerará un proceso judicial para la interrupción de la prescripción de las acciones legales.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Restricciones</h3>
                                <p>
                                    Las Partes acuerdan que cualquier arbitraje se limitará a la Disputa entre las Partes individualmente. En la máxima medida permitida por la ley, (a) ningún arbitraje se unirá con ningún otro procedimiento; (b) no existe derecho o autoridad para que ninguna Disputa sea arbitrada sobre una base de demanda colectiva o para utilizar procedimientos de demanda colectiva; y (c) no existe derecho o autoridad para que ninguna Disputa se presente en una supuesta capacidad representativa en nombre del público en general o de cualquier otra persona.
                                </p>

                                <h3 className="text-lg font-bold mb-3">Excepciones a las Negociaciones Informales y el Arbitraje</h3>
                                <p>
                                    Las Partes acuerdan que las siguientes Disputas no están sujetas a las disposiciones anteriores relativas a las negociaciones informales obligatorias y el arbitraje obligatorio: (a) cualquier Disputa que busque hacer cumplir o proteger, o con respecto a la validez de, cualquiera de los derechos de propiedad intelectual de una Parte; (b) cualquier Disputa relacionada con, o que surja de, alegaciones de robo, piratería, invasión de la privacidad o uso no autorizado; y (c) cualquier reclamo de alivio por mandato judicial. Si se determina que esta disposición no es legal o no es ejecutable, entonces ninguna de las Partes elegirá arbitrar ninguna Disputa que caiga dentro de esa porción de esta disposición que se encuentre que no es legal o no es ejecutable, y dicha Disputa será decidida por un tribunal de jurisdicción competente dentro de los tribunales enumerados para jurisdicción anteriormente, y las Partes acuerdan someterse a la jurisdicción personal de ese tribunal.
                                </p>
                                <p className="bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                    <strong>Jurisdicción en Argentina:</strong> Las Partes acuerdan someterse a la jurisdicción y competencia exclusiva de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, Argentina, para cualquier acción legal o procedimiento que no esté sujeto a arbitraje obligatorio.
                                </p>
                            </div>
                        </section>

                        <section id="correcciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">20. CORRECCIONES</h2>
                            <p className="text-sm leading-relaxed">
                                Puede haber información en los Servicios que contenga errores tipográficos, inexactitudes u omisiones, incluidas descripciones, precios, disponibilidad y otra información diversa. Nos reservamos el derecho de corregir cualquier error, inexactitud u omisión y de cambiar o actualizar la información en los Servicios en cualquier momento, sin previo aviso.
                            </p>
                        </section>

                        <section id="descargo" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">21. DESCARGO DE RESPONSABILIDAD</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    LOS SERVICIOS SE PROPORCIONAN TAL CUAL Y SEGÚN DISPONIBILIDAD. ACEPTÁS QUE TU USO DE LOS SERVICIOS SERÁ BAJO TU PROPIO RIESGO. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, RENUNCIAMOS A TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, EN RELACIÓN CON LOS SERVICIOS Y TU USO DE ELLOS, INCLUYENDO, SIN LIMITACIÓN, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. NO OFRECEMOS GARANTÍAS NI DECLARACIONES SOBRE LA EXACTITUD O INTEGRIDAD DEL CONTENIDO DE LOS SERVICIOS O EL CONTENIDO DE CUALQUIER SITIO WEB VINCULADO A LOS SERVICIOS Y NO ASUMIREMOS NINGUNA RESPONSABILIDAD U OBLIGACIÓN POR CUALQUIER (1) ERROR, EQUIVOCACIÓN O INEXACTITUD DEL CONTENIDO Y LOS MATERIALES, (2) DAÑO PERSONAL O DAÑO A LA PROPIEDAD, DE CUALQUIER NATURALEZA, RESULTANTE DE TU ACCESO Y USO DE LOS SERVICIOS, (3) ACCESO O USO NO AUTORIZADO DE NUESTROS SERVIDORES SEGUROS Y/O TODA LA INFORMACIÓN PERSONAL Y/O FINANCIERA ALMACENADA EN ELLOS, (4) CUALQUIER INTERRUPCIÓN O CESE DE LA TRANSMISIÓN HACIA O DESDE LOS SERVICIOS, (5) CUALQUIER ERROR, VIRUS, TROYANO O SIMILAR QUE PUEDA SER TRANSMITIDO A O A TRAVÉS DE LOS SERVICIOS POR CUALQUIER TERCERO, Y/O (6) CUALQUIER ERROR U OMISIÓN EN CUALQUIER CONTENIDO Y MATERIALES O POR CUALQUIER PÉRDIDA O DAÑO DE CUALQUIER TIPO INCURRIDO COMO RESULTADO DEL USO DE CUALQUIER CONTENIDO PUBLICADO, TRANSMITIDO O PUESTO A DISPOSICIÓN DE OTRA MANERA A TRAVÉS DE LOS SERVICIOS. NO GARANTIZAMOS, RESPALDAMOS, GARANTIZAMOS NI ASUMIMOS RESPONSABILIDAD POR NINGÚN PRODUCTO O SERVICIO PUBLICITADO U OFRECIDO POR UN TERCERO A TRAVÉS DE LOS SERVICIOS, CUALQUIER SITIO WEB CON HIPERVÍNCULO O CUALQUIER SITIO WEB O APLICACIÓN MÓVIL PRESENTADA EN CUALQUIER BANNER U OTRA PUBLICIDAD, Y NO SEREMOS PARTE DE NI DE NINGUNA MANERA SEREMOS RESPONSABLES DE MONITOREAR NINGUNA TRANSACCIÓN ENTRE VOS Y CUALQUIER PROVEEDOR TERCERO DE PRODUCTOS O SERVICIOS.
                                </p>
                                <p>
                                    AL IGUAL QUE CON LA COMPRA DE UN PRODUCTO O SERVICIO A TRAVÉS DE CUALQUIER MEDIO O EN CUALQUIER ENTORNO, DEBÉS USAR TU MEJOR JUICIO Y EJERCER PRECAUCIÓN DONDE SEA APROPIADO.
                                </p>
                            </div>
                        </section>

                        <section id="limitaciones" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">22. LIMITACIONES DE RESPONSABILIDAD</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    EN NINGÚN CASO NOSOTROS O NUESTROS DIRECTORES, EMPLEADOS O AGENTES SEREMOS RESPONSABLES ANTE VOS O CUALQUIER TERCERO POR DAÑOS DIRECTOS, INDIRECTOS, CONSECUENTES, EJEMPLARES, INCIDENTALES, ESPECIALES O PUNITIVOS, INCLUIDAS PÉRDIDAS DE GANANCIAS, PÉRDIDAS DE INGRESOS, PÉRDIDA DE DATOS O CUALQUIER OTRO DAÑO QUE SURJA DE TU USO DE LOS SERVICIOS, INCLUSO SI HEMOS SIDO ADVERTIDOS DE LA POSIBILIDAD DE TALES DAÑOS.
                                </p>
                                <p>
                                    A PESAR DE CUALQUIER COSA EN CONTRARIO CONTENIDA EN EL PRESENTE DOCUMENTO, NUESTRA RESPONSABILIDAD HACIA VOS POR CUALQUIER CAUSA, CUALQUIERA SEA LA FORMA DE LA ACCIÓN, SIEMPRE SE LIMITARÁ A LA CANTIDAD MENOR ENTRE EL MONTO PAGADO, SI LO HUBIERA, POR VOS A NOSOTROS DURANTE EL PERÍODO DE TRES (3) MESES ANTERIOR A CUALQUIER CAUSA DE ACCIÓN QUE SURJA Y $1,000 ARS. CIERTAS LEYES ARGENTINAS NO PERMITEN LIMITACIONES EN GARANTÍAS IMPLÍCITAS O LA EXCLUSIÓN O LIMITACIÓN DE CIERTOS DAÑOS. SI ESTAS LEYES SE APLICAN A VOS, ALGUNAS O TODAS LAS EXENCIONES O LIMITACIONES ANTERIORES PUEDEN NO APLICARSE A VOS, Y PODRÍAS TENER DERECHOS ADICIONALES.
                                </p>
                            </div>
                        </section>

                        <section id="indemnizacion" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">23. INDEMNIZACIÓN</h2>
                            <p className="text-sm leading-relaxed">
                                Aceptás defendernos, indemnizarnos y mantenernos indemnes, incluyendo a nuestras subsidiarias, afiliadas y a todos nuestros respectivos funcionarios, agentes, socios y empleados, de y contra cualquier pérdida, daño, responsabilidad, reclamo o demanda, incluidos honorarios y gastos razonables de abogados, realizados por cualquier tercero debido a o que surja de: (1) tus Contribuciones; (2) el uso de los Servicios; (3) el incumplimiento de estos Términos Legales; (4) cualquier incumplimiento de tus declaraciones y garantías establecidas en estos Términos Legales; (5) tu violación de los derechos de un tercero, incluidos, entre otros, los derechos de propiedad intelectual; o (6) cualquier acto manifiestamente dañino hacia cualquier otro usuario de los Servicios con el que te conectaste a través de los Servicios. No obstante lo anterior, nos reservamos el derecho, a tu cargo, de asumir la defensa y control exclusivos de cualquier asunto por el cual debas indemnizarnos, y aceptás cooperar, a tu cargo, con nuestra defensa de dichos reclamos. Haremos esfuerzos razonables para notificarte de cualquier reclamo, acción o procedimiento sujeto a esta indemnización al tomar conocimiento de ello.
                            </p>
                        </section>

                        <section id="datos-usuario" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">24. DATOS DEL USUARIO</h2>
                            <p className="text-sm leading-relaxed">
                                Retendremos ciertos datos que transmitís a los Servicios con el fin de gestionar el rendimiento de los Servicios, así como datos relacionados con tu uso de los Servicios. Aunque realizamos copias de seguridad de datos de forma rutinaria, sos el único responsable de todos los datos que transmitís o que se relacionan con cualquier actividad que hayas emprendido utilizando los Servicios. Aceptás que no tendremos ninguna responsabilidad ante vos por cualquier pérdida o corrupción de dichos datos, y por la presente renunciás a cualquier derecho de acción contra nosotros que surja de dicha pérdida o corrupción de datos.
                            </p>
                        </section>

                        <section id="comunicaciones-electronicas" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">25. COMUNICACIONES, TRANSACCIONES Y FIRMAS ELECTRÓNICAS</h2>
                            <p className="text-sm leading-relaxed">
                                Las visitas a los Servicios, el envío de correos electrónicos y la cumplimentación de formularios en línea constituyen comunicaciones electrónicas. Aceptás recibir comunicaciones electrónicas y aceptás que todos los acuerdos, avisos, divulgaciones y otras comunicaciones que te proporcionamos electrónicamente, por correo electrónico y en los Servicios, satisfacen cualquier requisito legal de que dicha comunicación sea por escrito. POR LA PRESENTE ACEPTÁS EL USO DE FIRMAS ELECTRÓNICAS, CONTRATOS, PEDIDOS Y OTROS REGISTROS, Y LA ENTREGA ELECTRÓNICA DE AVISOS, POLÍTICAS Y REGISTROS DE TRANSACCIONES INICIADAS O COMPLETADAS POR NOSOTROS O A TRAVÉS DE LOS SERVICIOS. Por la presente renunciás a cualquier derecho o requisito bajo cualquier estatuto, regulación, regla, ordenanza u otra ley en cualquier jurisdicción que requiera una firma original o la entrega o retención de registros no electrónicos.
                            </p>
                        </section>

                        <section id="disposiciones-varias" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">26. DISPOSICIONES VARIAS</h2>
                            <div className="text-sm leading-relaxed space-y-4">
                                <p>
                                    Estos Términos Legales y cualquier política o regla operativa publicada por nosotros en los Servicios o con respecto a los Servicios constituyen el acuerdo y entendimiento completo entre vos y nosotros. Nuestra falta de ejercicio o aplicación de cualquier derecho o disposición de estos Términos Legales no operará como una renuncia a tal derecho o disposición. Estos Términos Legales operan en la máxima medida permitida por la ley. Podemos ceder cualquiera o todos nuestros derechos y obligaciones a otros en cualquier momento. No seremos responsables de ninguna pérdida, daño, retraso o falta de acción causada por cualquier causa fuera de nuestro control razonable. Si se determina que alguna disposición o parte de una disposición de estos Términos Legales es ilegal, nula o inaplicable, esa disposición o parte de la disposición se considera separable de estos Términos Legales y no afecta la validez y aplicabilidad de las disposiciones restantes. No existe ninguna relación de empresa conjunta, sociedad, empleo o agencia creada entre vos y nosotros como resultado de estos Términos Legales o el uso de los Servicios. Aceptás que estos Términos Legales no se interpretarán en nuestra contra en virtud de haberlos redactado. Por la presente renunciás a todas y cada una de las defensas que puedas tener basadas en la forma electrónica de estos Términos Legales y la falta de firma por parte de las partes para ejecutar estos Términos Legales.
                                </p>
                            </div>
                        </section>

                        <section id="contacto" className="mb-8">
                            <h2 className="text-xl font-bold mb-4">27. CONTACTO</h2>
                            <p className="pb-4">
                                Para resolver una queja con respecto a los Servicios o para recibir más información sobre el uso de los Servicios, por favor contáctanos en:
                            </p>
                            <div className="text-sm leading-relaxed space-y-4 bg-accent text-accent-foreground p-4 rounded-lg border border-primary">
                                <p>
                                    <strong>Lanzáte</strong><br />
                                    Las Palmas 735, Atlántida, Santa Clara del Mar, Buenos Aires 7609, Argentina<br />
                                    Teléfono: <a href="tel:+5491135069709" className="text-blue-600 hover:text-blue-800 underline">+54 9 11 3506-9709</a><br />
                                    Correo electrónico: <a href="mailto:info@lanzate.app" className="text-blue-600 hover:text-blue-800 underline">info@lanzate.app</a>
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TermsAndConditions;