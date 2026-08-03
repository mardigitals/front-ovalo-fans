import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import Footer from '@/components/ui/Footer';
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/ui/SocialIcons';

const ContactoPage = () => {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#08060d] transition-colors duration-300">
      
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-16 md:py-24 animate-in fade-in duration-500 relative z-10">
        
        {/* TARJETA PRINCIPAL (Estilo Glassmorphism) */}
        <div className="w-full max-w-4xl bg-white/90 dark:bg-[#08060d]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl relative p-8 md:p-12 overflow-hidden">
          
          {/* Decoraciones de fondo sutiles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* ENCABEZADO */}
          <div className="text-center mb-10 border-b border-slate-200 dark:border-white/10 pb-8 relative z-10">
            <h1 className="title-fan text-4xl md:text-5xl text-slate-800 dark:text-white mb-4 uppercase">
              Contacto
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              ¿Tenés dudas sobre Óvalo Fans? Comunicate de manera directa con el equipo del <strong className="text-sky-500 font-bold">Autódromo de Rafaela</strong>.
            </p>
          </div>

          {/* GRILLA DE INFORMACIÓN DE CONTACTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
            
            {/* Ubicación */}
            <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group hover:border-sky-500/50 transition-colors">
              <div className="bg-sky-500/10 p-3 rounded-full text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Ubicación</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Bv. Lehmann 5500<br />
                  Rafaela, Santa Fe, Argentina
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group hover:border-green-500/50 transition-colors">
              <div className="bg-green-500/10 p-3 rounded-full text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">WhatsApp</h3>
                <a href="https://wa.me/5493492247130" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-400 text-sm hover:text-green-500 transition-colors font-medium">
                  +54 9 3492 247130
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Lunes a Viernes de 8 a 19 hs</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group hover:border-sky-500/50 transition-colors">
              <div className="bg-sky-500/10 p-3 rounded-full text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Email</h3>
                <a href="mailto:autrafaela@gmail.com" className="text-slate-600 dark:text-slate-400 text-sm hover:text-sky-500 transition-colors font-medium">
                  autrafaela@gmail.com
                </a>
              </div>
            </div>

            {/* Teléfono Fijo */}
            <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 group hover:border-sky-500/50 transition-colors">
              <div className="bg-sky-500/10 p-3 rounded-full text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Teléfono</h3>
                <a href="tel:3492247130" className="text-slate-600 dark:text-slate-400 text-sm hover:text-sky-500 transition-colors font-medium">
                  03492 - 247130
                </a>
              </div>
            </div>

          </div>

          {/* REDES SOCIALES */}
          <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-200 dark:border-white/10 relative z-10">
            <h3 className="subtitle-fan text-xl text-slate-800 dark:text-white uppercase tracking-widest mb-6">
              ¡Seguinos en nuestras redes!
            </h3>
            
            <div className="flex gap-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/autodromorafaela" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] dark:hover:bg-[#1877F2] dark:hover:text-white transition-all duration-300 hover:scale-110 shadow-sm">
               <FacebookIcon />
              </a>
              
              {/* Instagram */}
              <a href="https://www.instagram.com/autodromorafaela" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] dark:hover:bg-[#E4405F] dark:hover:text-white transition-all duration-300 hover:scale-110 shadow-sm">
                <InstagramIcon />
              </a>
              
              {/* TikTok */}
              <a href="https://www.tiktok.com/@autodromorafaela" target="_blank" rel="noopener noreferrer" className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-300 hover:scale-110 shadow-sm">
                <TikTokIcon />
              </a>
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ContactoPage;