'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import testData from '../../data/test-questions.json';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Resultados predefinidos basados en el tipo de test
  const getTestResults = (testId: string, answers: (string | null)[]) => {
    // Ejemplo de resultados para cada test
    if (testId === 'personal-values') {
      return {
        autenticidad: 85,
        logro: 70,
        seguridad: 60,
        estimulacion: 75,
      };
    }
    else if (testId === 'future-vision') {
      return {
        innovador: 78,
        lider: 82,
        analitico: 65,
        humanitario: 70,
      };
    }
    else if (testId === 'ambiente-trabajo') {
      return {
        estructura: 70,
        creatividad: 85,
        colaboracion: 90,
        independencia: 65,
      };
    }
    // Resultados predeterminados
    return {
      habilidad1: 75,
      habilidad2: 65,
      habilidad3: 80,
      habilidad4: 70,
    };
  };

  useEffect(() => {
    const currentTest = testData.tests.find(t => t.route === params.test);
    if (currentTest) {
      setTest(currentTest);
      setAnswers(Array(currentTest.questions.length).fill(null));
    }
  }, [params.test]);

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
    
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calcular y guardar resultados
      const results = getTestResults(test.route, updated);
      const testResults = {
        testId: test.route,
        testName: test.name,
        answers: updated,
        results: results,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(`test_${test.route}_results`, JSON.stringify(testResults));
      setShowModal(true);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSkip = () => {
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
      const updated = [...answers];
      updated[current] = null;
      setAnswers(updated);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.back(); // Volver a la página anterior en lugar de redirigir al dashboard
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Círculo exterior */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
          
          {/* Círculo de progreso */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#3b82f6" 
              strokeWidth="4"
              strokeDasharray="251.2"
              strokeDashoffset="188.4"
              transform="rotate(-90 50 50)"
              className="animate-[dash_1.5s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      </div>
    );
  }

  const question = test.questions[current];
  const progressPercentage = ((current + 1) / test.questions.length) * 100;
  
  // Obtener el índice del test y determinar el color del planeta
  const testIndex = testData.tests.findIndex(t => t.route === params.test);
  const planetNumber = testIndex + 1;
  const planetColors = ["#7be495", "#4f8cff", "#ffb347", "#ff6f69"];
  const testColor = planetColors[testIndex % planetColors.length];

  return (
    <div className="min-h-screen flex flex-col bg-[#050A15] relative overflow-hidden">
      {/* Fondo con estrellas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30 animate-pulse" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Barra de progreso superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: testColor
          }}
        ></div>
      </div>

      {/* Botón de regreso */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => {
            if (confirm('¿Estás seguro que deseas salir? Tu progreso no se guardará.')) {
              router.back(); // Volver a la descripción del test
            }
          }}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Volver</span>
        </button>
      </div>

      {/* Pantalla completa para el contenido central */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl">
          {/* Cabecera del test */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 relative mr-4 flex-shrink-0">
              <img 
                src={`/assets/img/tests/planet${planetNumber}.png`}
                alt={test.name}
                className="w-16 h-16"
              />
            </div>
            <div>
              <h1 className="text-xl text-gray-300 mb-1">{test.name}</h1>
              <div className="flex items-center text-xs text-gray-400">
                <span>Pregunta {current + 1} de {test.questions.length}</span>
                <span className="mx-2">•</span>
                <span>Progreso: {Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
          
          {/* Pregunta actual */}
          <h2 className="text-2xl font-bold text-white mb-8">{question.text}</h2>
          
          {/* Opciones de respuesta */}
          <div className="grid gap-4 mb-8">
            {question.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.label)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200
                  ${answers[current] === opt.label
                    ? `bg-opacity-30 border-indigo-500 text-white`
                    : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50"}
                `}
                style={answers[current] === opt.label ? { backgroundColor: `${testColor}30`, borderColor: testColor } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          {/* Controles de navegación */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={current === 0}
              className={`px-4 py-2 rounded-lg transition-colors
                ${current === 0
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-300 hover:bg-slate-800'}
              `}
            >
              Anterior
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Omitir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de finalización */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">¡Test Completado!</h2>
            <p className="text-gray-300 text-center mb-6">Has finalizado exitosamente el test "{test.name}". Tus resultados han sido guardados.</p>
            <div className="flex justify-center">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for dash animation */}
      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 251.2;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -251.2;
          }
        }
      `}</style>
    </div>
  );
} 