'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import testData from '../../data/test-questions.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Resultados predefinidos basados en el tipo de test
  const getTestResults = (testId: string, answers: (string | null)[]) => {
    // Ejemplo de resultados para test de personalidad
    if (testId === 'personality') {
      return {
        amabilidad: 85,
        extroversion: 70,
        responsabilidad: 90,
        estabilidadEmocional: 75,
      };
    }
    // Ejemplo de resultados para test vocacional
    return {
      tecnologia: 92,
      ciencias: 85,
      artes: 65,
      humanidades: 78,
    };
  };

  useEffect(() => {
    const currentTest = testData.tests.find(t => t.route === `/test/${params.id}`);
    if (currentTest) {
      setTest(currentTest);
      setAnswers(Array(currentTest.questions.length).fill(null));
    }
  }, [params.id]);

  if (!test) {
    return <div>Cargando...</div>;
  }

  const question = test.questions[current];

  const handleSelect = (option: string) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
    
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calcular y guardar resultados
      const results = getTestResults(test.id, updated);
      const testResults = {
        testId: test.id,
        testName: test.name,
        answers: updated,
        results: results,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(`test_${test.id}_results`, JSON.stringify(testResults));
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
    router.push(`/results/${test.id}`); // Redirigir a la página de resultados
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Overlay de fondo para el modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-[#000000f5] transition-all"></div>
      )}
      {/* Modal de finalización */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl px-10 py-10 max-w-md w-full flex flex-col items-center relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            <img
              src="/assets/img/hero/rocket.png"
              alt="Ilustración"
              className="w-28 h-28 mb-4"
              style={{ objectFit: 'contain' }}
            />
            <h2 className="text-2xl font-bold text-center mb-2">¡Felicitaciones!</h2>
            <h3 className="text-xl font-semibold text-center mb-4">Has finalizado el Test de personalidad</h3>
            <p className="text-gray-500 text-center mb-2">En unos minutos llegarán tus resultados</p>
          </div>
        </div>
      )}
      {/* Fondo de imagen */}
      <img
        src="/assets/img/questionnaire/bg-questionnaire.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Imagen ilustrativa */}
      <div className="w-[520px] h-screen flex items-center justify-center bg-transparent relative z-10">
        <img
          src="/assets/img/tests/test-placeholder.png"
          alt="Ilustración"
          className="object-cover w-full h-full"
          style={{ maxHeight: '100vh' }}
        />
      </div>
      {/* Card de pregunta */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#e5e5e5] px-16 py-12 max-w-3xl w-full min-h-[520px] flex flex-col relative">
          <div className="text-gray-400 text-lg mb-4">{test.name}</div>
          <div className="text-2xl text-[#23272F] mb-8 text-left leading-snug">{question.text}</div>
          <div className="flex flex-col gap-4 mb-8">
            {question.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.label)}
                className={`w-full text-left px-8 py-5 rounded-xl border-2 font-semibold text-lg transition-all duration-200 cursor-pointer
                  ${answers[current] === opt.label
                    ? "bg-[#E75C2C] text-white shadow-lg border-[#E75C2C]"
                    : "bg-white border-[#e5e5e5] hover:bg-[#E75C2C] hover:text-white hover:shadow-md hover:border-[#E75C2C]"}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={handleBack}
                disabled={current === 0}
                className={`font-semibold text-base flex items-center gap-1 transition-all duration-150
                  ${current === 0
                    ? 'text-[#E75C2C] opacity-40 cursor-default'
                    : 'text-[#E75C2C] cursor-pointer hover:bg-[#ffe6de] hover:text-[#b53d1a] rounded-lg px-2 py-1'}`}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Volver atrás
              </button>
              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Omitir pregunta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}