'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import questionsData from '../data/questions-user.json';

export default function Questionnaire() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState(questionsData.questions);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = [...questions];
    updated[current].answer = e.target.value;
    setQuestions(updated);
  };

  const handleContinue = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Guarda nombre y ubicación en localStorage
      localStorage.setItem('userName', questions[0].answer);      // Nombre
      localStorage.setItem('userLocation', questions[1].answer);  // Ubicación
      // Redirige a la siguiente pantalla
      router.push('/vocational-test');
    }
  };

  const question = questions[current];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Fondo de imagen */}
      <img
        src="/assets/img/questionnaire/bg-questionnaire.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Título Bienvenido */}
      <h1 className="relative z-20 text-5xl font-bold text-white text-center mt-20 mb-8 drop-shadow-lg">
        Bienvenido
      </h1>

      {/* Card de la pregunta */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 py-10 w-full max-w-xl flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#23272F] mb-6 text-center">{question.question}</h2>
        {
          question.question.toLowerCase().includes("grado escolar") ? (
            <select
              value={question.answer}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6"
            >
              <option value="">Selecciona tu grado</option>
              <option value="3ro de secundaria">3ro de secundaria</option>
              <option value="4to de secundaria">4to de secundaria</option>
              <option value="5to de secundaria">5to de secundaria</option>
            </select>
          ) : question.question.toLowerCase().includes("acceso a internet") ? (
            <select
              value={question.answer}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6"
            >
              <option value="">¿Cuentas con acceso a internet?</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          ) : (
            <input
              type={question.question.toLowerCase().includes("edad") ? "number" : "text"}
              value={question.answer}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6"
              placeholder="Escribe tu respuesta aquí..."
            />
          )
        }
        <button
          onClick={handleContinue}
          disabled={!question.answer.trim()}
          className={`mt-4 w-full bg-[#F47B4B] text-white font-bold py-3 rounded-xl text-lg shadow-lg transition
            ${!question.answer.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e96a36]'}
          `}
        >
          {current < questions.length - 1 ? 'Continuar' : 'Finalizar'}
        </button>
      </div>
    </main>
  );
}
