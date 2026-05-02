import { Link } from 'react-router-dom';

const TermsConditionsPage = () => {
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
            <h1 className="title-fan text-3xl md:text-5xl mb-4">Términos y Condiciones de Membresía</h1>
            <p className="text-fan mb-10">
              Última actualización: Abril de 2026. Al suscribirte a Óvalo Fans, la comunidad oficial del Autódromo Ciudad de Rafaela (autodromorafaela.com), aceptas los siguientes términos de uso.
            </p>
          </div>

          <div className="space-y-10">
          
            {/* SECCIÓN 1: CUENTAS */}
            <section>
              <h2 className="subtitle-fan mb-4">1. Cuentas de Usuario y Acceso</h2>
              <ul className="list-disc pl-5 space-y-3 text-fan">
                <li><strong>Creación y Seguridad:</strong> Eres responsable de mantener la confidencialidad de tu cuenta. Utilizamos cifrado avanzado para proteger tus credenciales.</li>
                <li><strong>Socios del Club:</strong> Los socios activos del Club Atlético de Rafaela con cuota al día acceden automáticamente al nivel "P3 Bronce" tras validar su identidad en el sistema.</li>
                <li><strong>Recuperación:</strong> Los enlaces para restablecer contraseñas son temporales.</li>
              </ul>
            </section>

            {/* SECCIÓN 2: PAGOS */}
            <section>
              <h2 className="subtitle-fan mb-4">2. Facturación y Pagos</h2>
              <ul className="list-disc pl-5 space-y-3 text-fan">
                <li><strong>Métodos:</strong> Los pagos se procesan de forma automatizada y segura a través de Mercado Pago, o mediante transferencia bancaria sujeta a validación manual (envío de comprobante vía WhatsApp).</li>
                <li><strong>Ciclos de Facturación:</strong> Ofrecemos planes mensuales recurrentes y planes anuales (con bonificación aplicada al momento del pago).</li>
                <li><strong>Estado de la Cuenta:</strong> Para acceder a cualquier beneficio o contenido de la plataforma, la suscripción debe figurar estrictamente en estado <strong>"Activo"</strong>. Las cuentas en estado "Suspendida" o "Vencida" perderán el acceso a los beneficios inmediatamente.</li>
              </ul>
            </section>

            {/* SECCIÓN 3: BENEFICIOS Y REGLAS (Sincronizado con Backend v1.0) */}
            <section>
              <h2 className="subtitle-fan mb-4">3. Reglas de Uso de Beneficios</h2>
              <p className="text-fan mb-3">Los beneficios se rigen por un sistema escalonado (Ejemplo: P1 puede acceder a beneficios de P2 y P3.). Las validaciones se realizan en tiempo real:</p>
              
              <ul className="list-disc pl-5 space-y-4 text-fan">
                <li>
                  <p className="subtitle-fan">Nivel P1 Oro (Exclusividad):</p> 
                  <br/>• <strong>VIP Boxes:</strong> Requiere 12 meses de antigüedad y 12 pagos verificados. Válido para un (1) evento por año calendario (o según disponibilidad de cupos establecida por la Subcomisión de Automovilismo), exclusivo para la categoría Turismo Carretera (TC).
                  <br/>• <strong>Sala de Prensa y Pace Car:</strong> Requieren suscripción activa y antigüedad de 12 meses. Límite: 1 vez por año calendario.
                  <br/>• <strong>Placa en la Recta:</strong> Beneficio de única vez tras cumplir el primer año de permanencia ininterrumpida.
                </li>

                <li>
                  <p className="subtitle-fan">Nivel P2 Plata (Experiencias):</p> 
                  <br/>• <strong>Fast Access:</strong> Requiere 2 meses de antigüedad y 2 pagos. Genera un código QR único por evento (exclusivo TC).
                  <br/>• <strong>Regalo Superfan:</strong> 1 unidad por año calendario tras cumplir 12 meses de antigüedad.
                  <br/>• <strong>Visitas Guiadas:</strong> Máximo de 2 cupos por año calendario.
                </li>

                <li>
                  <p className="subtitle-fan">Nivel P3 Bronce (Acceso base):</p> 
                  <br/>• <strong>Pruebas Libres:</strong> Requiere 1 mes de antigüedad y 1 pago. Cupo limitado de 3 usos por mes calendario.
                  <br/>• <strong>Carreras y Recitales:</strong> Límite de 1 entrada con descuento por persona por evento. Para carreras, aplica solo a eventos del año en curso. Para recitales, el beneficio aplica incluso para eventos del año próximo si la preventa está activa.
                </li>
              </ul>

              <div className="bg-institucional-celeste/5 border-l-4 border-institucional-celeste p-4 mt-6">
                <p className="text-sm italic text-fan">
                  * Nota: Los beneficios se consideran "utilizados" una vez aprobada la solicitud. En caso de que una solicitud sea <strong>Rechazada</strong> por la administración, el cupo correspondiente será reintegrado a la cuenta del usuario automáticamente.
                </p>
              </div>
            </section>

            {/* SECCIÓN 4: CANCELACIONES */}
            <section>
              <h2 className="subtitle-fan mb-4">4. Cancelaciones y Bajas</h2>
              <ul className="list-disc pl-5 space-y-3 text-fan">
                <li>Puedes cancelar tu suscripción mensual en cualquier momento desde tu perfil. La cancelación evitará cobros futuros, pero no se emitirán reembolsos por meses ya abonados o planes anuales en curso.</li>
                <li>Los datos históricos se mantendrán para facilitar la reactivación futura de la cuenta si así lo deseas.</li>
              </ul>
            </section>

            {/* SECCIÓN 5: MAL USO Y HACKING */}
            <section>
              <h2 className="subtitle-fan mb-4">5. Fraude, Compartir Cuentas y Seguridad</h2>
              <ul className="list-disc pl-5 space-y-3 text-fan">
                <li><strong>Uso Personal:</strong> Las cuentas son estrictamente personales e intransferibles. El sistema cruza automáticamente la identidad del usuario logueado con el titular del medio de pago para prevenir fraudes.</li>
                <li><strong>Protección de Contenido:</strong> El material multimedia exclusivo cuenta con protección de enlaces. Intentar vulnerar las URLs, extraer contenido, o compartir credenciales resultará en el <strong>bloqueo inmediato y permanente</strong> de la cuenta sin derecho a reembolso.</li>
                <li>Nos reservamos el derecho de suspender cuentas que presenten patrones de actividad inusual, sospecha de hacking, o cualquier violación a este reglamento.</li>
              </ul>
            </section>

            {/* SECCIÓN 6: PRIVACIDAD */}
            <section>
              <h2 className="subtitle-fan mb-4">6. Privacidad y Datos</h2>
              <ul className="list-disc pl-5 space-y-3 text-fan">
                <li>Toda la información recolectada (emails, teléfonos, datos de membresía) es propiedad exclusiva del Club Atlético de Rafaela y será utilizada únicamente para la gestión de la plataforma Óvalo Fans y comunicaciones oficiales.</li>
              </ul>
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

export default TermsConditionsPage;