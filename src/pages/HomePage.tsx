// import React, { Suspense } from 'react';
// import { Link } from 'react-router-dom';
// import Spline from '@splinetool/react-spline';

// const HomePage = () => (
//   <div className="flex flex-col items-center justify-center py-12 px-4">
//     <div className="relative w-full h-screen bg-[#08060d] overflow-hidden">
//       <div className="absolute inset-0 w-full h-full z-0">
//         <Suspense fallback={
//           <div className="flex items-center justify-center h-full bg-[#08060d]">
//             <p className="text-cyan-400 animate-pulse font-bold tracking-widest uppercase">
//               Iniciando motores 3D...
//             </p>
//           </div>
//         }>
//           <Spline 
//             scene="https://prod.spline.design/BQ9SzIhf3TTzf7yv/scene.splinecode" 
//             className="w-full h-full"
//           />
//         </Suspense> 
//       </div>
//     </div>
//     <div className="text-center max-w-3xl mb-12 mt-10">
//       <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200 tracking-tighter uppercase">
//         ¡VIVE LA PASIÓN!
//       </h2>
//       <p className="text-stone-400 text-lg md:text-xl">
//         Explora la historia del Óvalo y gestiona tu experiencia como fan.
//       </p>
//     </div>
//     <Link to="/login" className="relative z-10 bg-cyan-500 text-white px-12 py-5 rounded-full text-xl font-black hover:scale-105 hover:shadow-cyan-400/60 transition-transform shadow-2xl shadow-cyan-500/40 uppercase">
//       ¡Únete a ÓVALO FANS!
//     </Link>
//   </div>
// );

// export default HomePage;
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const HomePage = () => (
  // Quitamos el bg fijo para que respete el Modo Claro/Oscuro del body
  <div className="flex flex-col items-center justify-center min-h-screen">
    
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            {/* Cambiamos a sky-500 para mantener la identidad */}
            <p className="text-sky-500 animate-pulse font-bold tracking-widest uppercase">
              Iniciando motores 3D...
            </p>
          </div>
        }>
          <Spline 
            scene="https://prod.spline.design/BQ9SzIhf3TTzf7yv/scene.splinecode" 
            className="w-full h-full"
          />
        </Suspense> 
      </div>
    </div>

    <div className="text-center max-w-3xl mb-12 mt-10 px-4">
      {/* ¡Magia pura! Solo usamos title-fan */}
      <h2 className="title-fan mb-4">
        ¡VIVE LA PASIÓN!
      </h2>
      
      {/* text-fan se encarga del tamaño y el color según el modo */}
      <p className="text-fan">
        Explora la historia del Óvalo y gestiona tu experiencia como fan.
      </p>
    </div>

    {/* Usamos el mismo estilo de botón premium que en el Login, pero redondeado completo (rounded-full) */}
    <Link 
      to="/login" 
      className="mb-12 relative z-10 py-4 px-8 font-black rounded-full text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:scale-105 transition-all uppercase tracking-widest text-lg"
    >
      ¡Únete a ÓVALO FANS!
    </Link>
    
  </div>
);

export default HomePage;