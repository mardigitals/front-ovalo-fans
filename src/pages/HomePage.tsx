import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const HomePage = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative w-full h-screen bg-[#08060d] overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-[#08060d]">
            <p className="text-cyan-400 animate-pulse font-bold tracking-widest uppercase">
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
    <div className="text-center max-w-3xl mb-12 mt-10">
      <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-cyan-400 tracking-tight leading-none">
        ¡VIVE LA PASIÓN!
      </h2>
      <p className="text-stone-400 text-lg md:text-xl">
        Explora la historia del Óvalo y gestiona tu experiencia como fan.
      </p>
    </div>
    <Link to="/login" className="relative z-10 bg-cyan-500 text-white px-12 py-5 rounded-full text-xl font-black hover:scale-105 hover:shadow-cyan-400/60 transition-transform shadow-2xl shadow-cyan-500/40 uppercase">
      ¡Únete a ÓVALO FANS!
    </Link>
  </div>
);

export default HomePage;