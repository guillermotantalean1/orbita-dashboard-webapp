'use client';

import React from 'react';

const ProgressTracker = () => {
  // Mock progress data
  const progress = {
    completedTests: 2,
    totalTests: 4,
    completionPercentage: 50,
    testProgress: [
      { 
        id: "personal-values", 
        name: "Valores Personales", 
        status: "completed", 
        completedAt: "2024-05-15", 
        score: 85,
        planet: 1
      },
      { 
        id: "future-vision", 
        name: "Visión de Futuro", 
        status: "completed", 
        completedAt: "2024-05-22", 
        score: 78,
        planet: 2
      },
      { 
        id: "ambiente-trabajo", 
        name: "Ambiente de Trabajo", 
        status: "pending", 
        completedAt: null, 
        score: null,
        planet: 3
      },
      { 
        id: "social-skills", 
        name: "Habilidades Sociales", 
        status: "pending", 
        completedAt: null, 
        score: null,
        planet: 4
      }
    ],
    recommendations: [
      "Completar el Test de Ambiente de Trabajo para obtener una visión más completa de tus preferencias",
      "Revisar los resultados del Test de Valores Personales para identificar tus principales motivaciones"
    ]
  };

  // Function to get color based on score
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-600';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Seguimiento de Exploración</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Overall progress card */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl">
          <h2 className="text-lg font-medium text-white mb-4">Progreso General</h2>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress.completionPercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">{progress.completionPercentage}%</span>
                <span className="text-xs text-blue-300">Completado</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Tests completados</p>
            <p className="text-xl font-medium text-white">{progress.completedTests} de {progress.totalTests}</p>
          </div>
        </div>
        
        {/* Planet exploration map */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl">
          <h2 className="text-lg font-medium text-white mb-4">Mapa de Exploración</h2>
          
          <div className="relative py-2">
            {/* Connection line */}
            <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-indigo-500/30 z-0"></div>
            
            {/* Planets */}
            {progress.testProgress.map((test, index) => (
              <div key={index} className="flex items-start mb-4 relative z-10">
                <div className="mr-4 flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${test.status === "completed" ? "border-2 border-green-500/50" : "border-2 border-indigo-500/30"}`}>
                    <img 
                      src={`/assets/img/tests/planet${test.planet}.png`}
                      alt={test.name}
                      className="w-12 h-12"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{test.name}</h3>
                      <p className="text-xs text-gray-400">
                        {test.status === "completed" 
                          ? `Completado el ${test.completedAt}` 
                          : "Pendiente de exploración"}
                      </p>
                    </div>
                    {test.status === "completed" && (
                      <div className={`px-2 py-1 rounded-full text-xs text-white ${getScoreColor(test.score)}`}>
                        {test.score}%
                      </div>
                    )}
                  </div>
                  
                  {test.status === "completed" ? (
                    <button 
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={() => {/* View results logic */}}
                    >
                      Ver resultados
                    </button>
                  ) : (
                    <button 
                      className="mt-2 text-xs px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full hover:bg-indigo-800/50 transition-colors"
                      onClick={() => {/* Start test logic */}}
                    >
                      Iniciar exploración
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recommendations card */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl mb-10">
        <h2 className="text-lg font-medium text-white mb-4">Recomendaciones Personalizadas</h2>
        
        <ul className="space-y-3">
          {progress.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-300">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Skills radar chart (simplified representation) */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl">
        <h2 className="text-lg font-medium text-white mb-6">Análisis de Habilidades</h2>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-64 h-64">
            {/* Radar background */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Background circles */}
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="#1E293B" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="transparent" stroke="#1E293B" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="transparent" stroke="#1E293B" strokeWidth="1" />
              <circle cx="100" cy="100" r="20" fill="transparent" stroke="#1E293B" strokeWidth="1" />
              
              {/* Axes */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#1E293B" strokeWidth="1" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="#1E293B" strokeWidth="1" />
              <line x1="38.8" y1="38.8" x2="161.2" y2="161.2" stroke="#1E293B" strokeWidth="1" />
              <line x1="38.8" y1="161.2" x2="161.2" y2="38.8" stroke="#1E293B" strokeWidth="1" />
              
              {/* Radar chart data polygon */}
              <polygon
                points="100,40 150,70 130,130 70,130 50,70"
                fill="rgba(99,102,241,0.2)"
                stroke="#6366F1"
                strokeWidth="2"
              />
              
              {/* Data points */}
              <circle cx="100" cy="40" r="4" fill="#6366F1" />
              <circle cx="150" cy="70" r="4" fill="#6366F1" />
              <circle cx="130" cy="130" r="4" fill="#6366F1" />
              <circle cx="70" cy="130" r="4" fill="#6366F1" />
              <circle cx="50" cy="70" r="4" fill="#6366F1" />
            </svg>
            
            {/* Skills labels */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-center">
              <span className="text-xs text-blue-300">Comunicación</span>
            </div>
            <div className="absolute top-1/4 right-0 transform translate-x-1 text-center">
              <span className="text-xs text-blue-300">Análisis</span>
            </div>
            <div className="absolute bottom-1/4 right-0 transform translate-x-1 text-center">
              <span className="text-xs text-blue-300">Creatividad</span>
            </div>
            <div className="absolute bottom-1/4 left-0 transform -translate-x-1 text-center">
              <span className="text-xs text-blue-300">Liderazgo</span>
            </div>
            <div className="absolute top-1/4 left-0 transform -translate-x-1 text-center">
              <span className="text-xs text-blue-300">Adaptabilidad</span>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm">
          Este análisis se basa en los tests completados hasta ahora. Completa más tests para obtener un perfil más preciso.
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker; 