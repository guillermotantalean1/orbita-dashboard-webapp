'use client';

import React from 'react';
import slides from '../data/slides.json';

interface SlidesProps {
  reverse?: boolean; // Para invertir la dirección del loop (arriba o abajo)
}

export default function Slides({ reverse = false }: SlidesProps) {
  // Duplicamos la lista para el efecto loop
  const carreras = slides.carreras;
  const loopCarreras = [...carreras, ...carreras];

  return (
    <div className="w-full overflow-hidden py-2">
      <div
        className={`
          flex gap-6 animate-slide
          ${reverse ? 'flex-row-reverse animate-slide-reverse' : ''}
        `}
        style={{
          animationDuration: '30s',
          animationIterationCount: 'infinite',
        }}
      >
        {loopCarreras.map((carrera, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[200px] max-w-[200px] mx-4"
          >
            {/* Fondo blanco solo para la imagen, solo bordes superiores redondeados */}
            <div className="bg-white rounded-t-2xl shadow-lg w-full flex items-center justify-center p-6">
              <img
                src={carrera.imagen.replace('../../public', '')}
                alt={carrera.nombre}
                className="w-36 h-40 object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('placeholder.png')) {
                    target.src = '/assets/placeholder.png';
                  }
                }}
              />
            </div>
            {/* Texto con borde y solo bordes inferiores redondeados */}
            <div className="w-full border border-white/20 rounded-b-2xl px-4 py-5 bg-transparent flex items-center justify-center">
              <span className="text-white text-sm font-semibold text-center">{carrera.nombre}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 
        NOTA: 
        - Agrega las imágenes de profesiones en /public/images/ o /public/assets/ según corresponda.
        - Agrega un placeholder en /public/assets/placeholder.png si quieres un fallback.
      */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-reverse {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-slide {
          animation: slide linear infinite;
        }
        .animate-slide-reverse {
          animation: slide-reverse linear infinite;
        }
      `}</style>
    </div>
  );
} 