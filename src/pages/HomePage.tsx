//import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
//import Spline from '@splinetool/react-spline';

const HomePage = () => (
  
  <div className="flex flex-col items-center justify-center min-h-screen">
    
    {/* <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
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
    </div> */}

    <div className="text-center max-w-3xl mb-12 mt-10 px-4">
      
      <h2 className="title-fan mb-4">
        ¡VIVE LA PASIÓN!
      </h2>
      
     
      <p className="text-fan">
        Explora la historia del Óvalo y gestiona tu experiencia como fan.
      </p>
    </div>

    
    <Link 
      to="/login" 
      className="mb-12 relative z-10 py-4 px-8 font-black rounded-full text-black bg-sky-500 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:scale-105 transition-all uppercase tracking-widest text-lg"
    >
      ¡Únete a ÓVALO FANS!
    </Link>
    
  </div>
);

export default HomePage;