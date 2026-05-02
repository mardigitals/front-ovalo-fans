import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver */}
                <Link to="/" className="inline-block mb-8 text-slate-500 hover:text-sky-500 font-bold transition-colors text-sm uppercase tracking-wider">
                ← Volver al inicio
                </Link>

                {/* Contenedor tipo Glass */}
                <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl dark:shadow-sky-500/5">
                
                    {/* Cabecera */}
                    <div className="text-center mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
                        <h1 className="title-fan text-3xl md:text-5xl mb-4">
                        Políticas de Privacidad
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-sm">
                        Última actualización: Abril de 2026
                        </p>
                    </div>

                    {/* Contenido Legal */}
                    <div className="space-y-10">
                        
                        {/* Introducción */}
                        <p className="text-fan text-lg font-medium">
                        El Club Atlético de Rafaela (en adelante, "el Club", "nosotros" o "nuestro") respeta tu privacidad y se compromete a proteger los datos personales de los usuarios de la plataforma Óvalo Fans. La presente Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos tu información, en estricto cumplimiento con la <strong className="text-slate-800 dark:text-white">Ley de Protección de Datos Personales de la República Argentina (Ley N° 25.326)</strong>.
                        </p>

                        {/* Punto 1 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">1. Información que Recopilamos</h2>
                        <p className="text-fan mb-4">
                            Para brindarte acceso a la plataforma y gestionar tus beneficios, recopilamos los siguientes datos de forma directa cuando creas tu cuenta o actualizas tu perfil:
                        </p>
                        <ul className="list-disc list-outside ml-5 space-y-2 text-fan">
                            <li><strong className="text-slate-700 dark:text-slate-300">Datos de Identificación y Contacto:</strong> Nombre y apellido, DNI, fecha de nacimiento, género, dirección de correo electrónico, número de teléfono y domicilio completo (calle, número, piso, departamento, código postal, ciudad, provincia y país).</li>
                            <li><strong className="text-slate-700 dark:text-slate-300">Datos del Perfil Fan:</strong> Alias o apodo, estado de socio del Club, afinidad por marcas de Turismo Carretera (TC) y preferencias sobre el circuito ("chicana favorita").</li>
                            <li><strong className="text-slate-700 dark:text-slate-300">Datos de Cuenta:</strong> Contraseña (almacenada de forma encriptada e irreversible) e historial de acceso (último login).</li>
                        </ul>
                        </section>

                        {/* Punto 2 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">2. Uso de la Información</h2>
                        <p className="text-fan mb-4">Tus datos personales serán utilizados exclusivamente para los siguientes fines:</p>
                        <ul className="list-disc list-outside ml-5 space-y-2 text-fan">
                            <li>Crear, gestionar y asegurar tu cuenta dentro de la plataforma Óvalo Fans.</li>
                            <li>Validar tu identidad y tu condición de socio activo del Club Atlético de Rafaela para la asignación de niveles (P1, P2, P3) y beneficios.</li>
                            <li>Gestionar el control de cupos y accesos a eventos del Autódromo Ciudad de Rafaela (ej. VIP Boxes, Pruebas Libres).</li>
                            <li>Enviarte comunicaciones oficiales, notificaciones de tu cuenta (como correos de recuperación de contraseña o reactivación), y avisos sobre nuevos beneficios.</li>
                        </ul>
                        </section>

                        {/* Punto 3 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">3. Pagos y Pasarelas de Terceros</h2>
                        <p className="text-fan">
                            Para el procesamiento de las suscripciones, Óvalo Fans utiliza pasarelas de pago externas (Mercado Pago) o validación mediante transferencias bancarias directas. <strong className="text-slate-800 dark:text-white">Óvalo Fans no captura, procesa ni almacena números de tarjetas de crédito, débito, ni credenciales bancarias en sus propios servidores.</strong> Toda transacción financiera es manejada de forma segura por el procesador de pagos bajo sus propias políticas de privacidad y seguridad.
                        </p>
                        </section>

                        {/* Punto 4 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">4. Uso de Cookies y Tecnologías de Rastreo</h2>
                        <p className="text-fan">
                            Nuestra plataforma utiliza tecnologías de almacenamiento local en tu navegador (como <em>Local Storage</em>) para guardar claves de acceso. Estos tokens son estrictamente necesarios para mantener tu sesión iniciada mientras navegas por el Dashboard y verificar tus permisos de usuario. No utilizamos cookies para rastrear tu actividad en sitios web de terceros ni para publicidad invasiva.
                        </p>
                        </section>

                        {/* Punto 5 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">5. Seguridad de los Datos</h2>
                        <p className="text-fan">
                            Implementamos medidas técnicas y organizativas de alto nivel para proteger tu información contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye la encriptación de contraseñas, comunicación cifrada entre el cliente y el servidor, y controles de acceso fuertemente restringidos.
                        </p>
                        </section>

                        {/* Punto 6 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">6. Tus Derechos (Derechos ARCO)</h2>
                        <p className="text-fan mb-4">
                            De acuerdo con la Ley N° 25.326, como titular de los datos tienes derecho a solicitar el <strong>A</strong>cceso, <strong>R</strong>ectificación, <strong>C</strong>ancelación u <strong>O</strong>posición sobre tu información personal.
                        </p>
                        <ul className="list-disc list-outside ml-5 space-y-3 text-fan mb-4">
                            <li><strong className="text-slate-700 dark:text-slate-300">Edición y Rectificación:</strong> Puedes modificar la mayoría de tus datos directamente desde la configuración de tu perfil en el Dashboard.</li>
                            <li><strong className="text-slate-700 dark:text-slate-300">Baja de Cuenta y Retención de Datos:</strong> Tienes derecho a solicitar la baja de tu cuenta en cualquier momento. Al hacerlo, tu cuenta será desactivada y tu información dejará de estar visible de forma inmediata. Sin embargo, para fines de auditoría, prevención de fraude y para permitirte reactivar tu cuenta en el futuro si así lo deseas, conservamos un registro inactivo de tus datos bajo protocolos de seguridad.</li>
                        </ul>
                        <div className="bg-slate-100 dark:bg-white/[0.03] p-4 rounded-lg border border-slate-200 dark:border-white/10 mt-6">
                            <p className="text-fan text-sm">
                            Para ejercer cualquiera de tus derechos que no puedas gestionar desde el Dashboard, puedes comunicarte con nuestro equipo enviando un correo electrónico a: <a href="mailto:privacidad@autodromorafaela.com" className="text-sky-500 hover:text-sky-400 font-bold">privacidad@autodromorafaela.com</a>
                            </p>
                        </div>
                        </section>

                        {/* Punto 7 */}
                        <section>
                        <h2 className="subtitle-fan text-2xl mb-4">7. Cambios en esta Política</h2>
                        <p className="text-fan">
                            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios significativos publicando la nueva política en esta página y, si los cambios son sustanciales, mediante un aviso destacado en tu Dashboard o por correo electrónico.
                        </p>
                        </section>

                    </div>

                </div>

                {/* Footer / Acción (usando tu botón glass-neon) */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 text-center">
                    <p className="text-fan text-sm mb-6">
                    Si tienes dudas sobre el cobro de tu membresía, contáctanos a través de nuestros canales oficiales.
                    </p>
                    <Link to="/" className="glass-neon-btn px-8 py-3 rounded-md font-bold text-slate-800 dark:text-white bg-white/5 border border-slate-300 dark:border-white/10">
                    Entendido
                    </Link>
                </div>

            </div>
        </div>
        
    );
};

export default PrivacyPolicy;