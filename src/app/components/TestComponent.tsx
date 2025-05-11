'use client';

import React, { useState } from 'react';
import { Test, TestOption } from '../data/tests-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faQuestion, faChartPie, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface TestComponentProps {
  test: Test;
  onComplete: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ test, onComplete }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(TestOption | null)[]>(Array(test.questions.length).fill(null));
  const [showModal, setShowModal] = useState(false);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});

  // Initialize dimension scores if the test has dimensions
  React.useEffect(() => {
    if (test.dimensions) {
      const initialScores: Record<string, number> = {};
      test.dimensions.forEach((dimension: string) => {
        initialScores[dimension] = 0;
      });
      setDimensionScores(initialScores);
    }
  }, [test]);

  const calculateResults = (answers: (TestOption | null)[]) => {
    // For tests with dimensions, calculate scores per dimension
    if (test.dimensions) {
      const results: Record<string, number> = { ...dimensionScores };
      
      // Sum scores for each answered question
      answers.forEach((answer, index) => {
        if (answer !== null) {
          const question = test.questions[index];
          const dimension = question.dimension;
          
          if (dimension && answer.score !== undefined) {
            results[dimension] = (results[dimension] || 0) + answer.score;
          }
        }
      });
      
      // Calculate percentage scores (assuming max score = number of questions per dimension)
      const dimensionQuestionCounts: Record<string, number> = {};
      test.questions.forEach((q) => {
        if (q.dimension) {
          dimensionQuestionCounts[q.dimension] = (dimensionQuestionCounts[q.dimension] || 0) + 1;
        }
      });
      
      // Convert to percentages
      Object.keys(results).forEach(dim => {
        const maxPossible = dimensionQuestionCounts[dim] || 1;
        results[dim] = Math.round((results[dim] / maxPossible) * 100);
      });
      
      return results;
    }
    
    // For traditional tests, return some default values
    return {
      habilidad1: 75,
      habilidad2: 65,
      habilidad3: 80,
      habilidad4: 70,
    };
  };

  const handleSelect = (option: TestOption) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
    
    // Update dimension scores if applicable
    if (test.dimensions) {
      const question = test.questions[current];
      if (question.dimension && option.score !== undefined) {
        setDimensionScores(prev => ({
          ...prev,
          [question.dimension]: (prev[question.dimension] || 0) + option.score
        }));
      }
    }
    
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calculate and save results
      const results = calculateResults(updated);
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
    onComplete();
  };

  const question = test.questions[current];
  const progressPercentage = ((current + 1) / test.questions.length) * 100;
  
  // Get the test color
  const testColor = test.color || "#4f8cff";
  
  // Estimated time to complete the test (30 seconds per question)
  const estimatedMinutes = Math.ceil((test.questions.length * 30) / 60);

  // Create a starry background component that can be reused
  const StarryBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
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
  );

  if (showIntro) {
    return (
      <div className="relative">
        <StarryBackground />
        
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl">
          {/* Test introduction header with planet icon */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div 
              className="w-20 h-20 mb-4 relative flex-shrink-0 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${testColor}40, ${testColor}90)` }}
            >
              <img 
                src={`/assets/img/tests/planet${test.id || 1}.png`}
                alt={test.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-2xl text-white font-bold mb-2">{test.name}</h1>
            <div className="text-md text-gray-300 max-w-md mx-auto">
              {test.description.split('.')[0]}. {/* Just the first sentence for simplicity */}
            </div>
          </div>
          
          {/* Fun visual info section */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faQuestion} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{test.questions.length}</div>
              <div className="text-xs text-gray-400">Preguntas</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faClock} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{estimatedMinutes}</div>
              <div className="text-xs text-gray-400">Minutos</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faChartPie} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{test.dimensions ? test.dimensions.length : 4}</div>
              <div className="text-xs text-gray-400">Resultados</div>
            </div>
          </div>
          
          {/* Simplified test info with illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-800/30 flex items-start">
              <div className="bg-blue-800/40 p-3 rounded-full mr-4">
                <FontAwesomeIcon icon={faQuestion} className="text-blue-300 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-blue-300 mb-1">¿Qué descubrirás?</h3>
                <p className="text-gray-300 text-sm">
                  {test.dimensions ? (
                    <>
                      Con el test de <strong>{test.name}</strong> descubrirás tus niveles de {test.dimensions.slice(0, 3).join(', ')}{test.dimensions.length > 3 ? ' y más' : ''}, lo que te ayudará a identificar carreras que se alinean con tus fortalezas naturales.
                    </>
                  ) : (
                    <>
                      Este test de <strong>{test.name}</strong> te revelará aspectos clave de tu personalidad que te ayudarán a encontrar una carrera donde puedas destacar y sentirte realizado.
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-5 border border-green-800/30 flex items-start">
              <div className="bg-green-800/40 p-3 rounded-full mr-4">
                <FontAwesomeIcon icon={faArrowRight} className="text-green-300 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-green-300 mb-1">¿Cómo funciona?</h3>
                <p className="text-gray-300 text-sm">
                  Responde con sinceridad a {test.questions.length} preguntas sencillas. No hay respuestas correctas o incorrectas, solo elige la opción que mejor te describa. ¡Solo tomará {estimatedMinutes} minutos!
                </p>
              </div>
            </div>
          </div>
          
          {/* Fun start button */}
          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-4 px-6 flex items-center justify-center bg-gradient-to-r rounded-xl text-white text-lg font-medium group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundImage: `linear-gradient(to right, ${testColor}, ${testColor}CC)` }}
          >
            <span>¡Empezar mi viaje!</span>
            <svg className="ml-3 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <StarryBackground />

      {/* Barra de progreso superior */}
      <div className="w-full h-1 bg-gray-800 mb-6">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: testColor
          }}
        ></div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl">
        {/* Cabecera del test */}
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 relative mr-4 flex-shrink-0 bg-gradient-to-br from-indigo-500/40 to-purple-600/40 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{test.name.charAt(0)}</span>
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
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200
                ${answers[current]?.label === opt.label
                  ? `bg-opacity-30 border-indigo-500 text-white`
                  : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50"}
              `}
              style={answers[current]?.label === opt.label ? { backgroundColor: `${testColor}30`, borderColor: testColor } : {}}
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

      {/* Modal de finalización */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-indigo-500/30 shadow-2xl">
            {/* Animación de completado */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#22c55e" 
                    strokeWidth="4"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">¡Test completado!</h2>
            <p className="text-gray-400 text-center mb-6">Has completado el test de {test.name}.</p>
            
            <div className="grid gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-3">Tus resultados están listos para ser explorados</div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/40 to-purple-600/40 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{test.name.charAt(0)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors"
            >
              Ver mis resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestComponent; 