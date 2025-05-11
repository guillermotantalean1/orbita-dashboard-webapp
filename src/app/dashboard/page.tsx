'use client';

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TodoList from "../components/TodoList";
import Profile from "../components/Profile";
import ProfileForm from "../components/ProfileForm";
import ProgressTracker from "../components/ProgressTracker";
import SolarSystem from "../components/SolarSystem";
import TestResultsModal from "../components/TestResultsModal";
import testData from "../data/test-questions.json";
import { useRouter } from "next/navigation";

// Añadir datos de ejemplo para los resultados
const sampleResults = [
  {
    testId: "personal-values",
    name: "Valores Personales",
    completionDate: "15 de mayo, 2024",
    results: [
      {
        category: "Autenticidad",
        score: 85,
        description: "Valoras ser fiel a ti mismo y a tus convicciones. Prefieres situaciones donde puedes expresar tus ideas y valores genuinos.",
        careers: ["Psicología", "Trabajo social", "Enseñanza", "Artes"]
      },
      {
        category: "Logro",
        score: 67,
        description: "Te motiva alcanzar metas y obtener reconocimiento por tus esfuerzos. Disfrutas de entornos competitivos y desafiantes.",
        careers: ["Administración de empresas", "Emprendimiento", "Ventas", "Deportes"]
      },
      {
        category: "Seguridad",
        score: 52,
        description: "Aprecias la estabilidad y la previsibilidad en tu vida y carrera. Prefieres minimizar riesgos y situaciones inciertas.",
        careers: ["Contabilidad", "Finanzas", "Administración pública", "Ingeniería"]
      },
      {
        category: "Estimulación",
        score: 73,
        description: "Buscas experiencias nuevas y emocionantes. Te atraen los desafíos y la variedad en tu vida diaria.",
        careers: ["Periodismo", "Marketing", "Diseño", "Turismo"]
      }
    ]
  },
  {
    testId: "future-vision",
    name: "Visión de Futuro",
    completionDate: "22 de mayo, 2024",
    results: [
      {
        category: "Innovador",
        score: 78,
        description: "Te orientas hacia el futuro y las nuevas posibilidades. Disfrutas crear soluciones originales para problemas complejos.",
        careers: ["Desarrollo de software", "Arquitectura", "Diseño de productos", "Investigación científica"]
      },
      {
        category: "Líder",
        score: 82,
        description: "Tienes una natural capacidad para guiar e inspirar a otros. Te sientes cómodo tomando decisiones y asumiendo responsabilidades.",
        careers: ["Gestión empresarial", "Derecho", "Política", "Consultoría"]
      },
      {
        category: "Analítico",
        score: 65,
        description: "Prefieres examinar datos y situaciones desde múltiples ángulos antes de tomar decisiones. Valoras la precisión y la lógica.",
        careers: ["Ciencia de datos", "Economía", "Investigación", "Ingeniería"]
      },
      {
        category: "Humanitario",
        score: 70,
        description: "Te motiva ayudar a los demás y contribuir al bienestar social. Buscas un propósito significativo en tu trabajo.",
        careers: ["Medicina", "Educación", "Trabajo social", "Organizaciones sin fines de lucro"]
      }
    ]
  }
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("tests");
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
  const [selectedTestResults, setSelectedTestResults] = useState<any>(null);

  // Función para manejar la visualización de resultados
  const handleViewResults = (planet: any) => {
    // Buscar los resultados de muestra para este test
    const results = sampleResults.find(r => r.testId === planet.route);
    if (results) {
      setSelectedTestResults(results);
      setShowResultsModal(true);
    } else {
      // Si no hay resultados, podemos mostrar un mensaje o redirigir al usuario
      console.log("No hay resultados disponibles para este test");
      // También podríamos abrir un modal diferente para informar al usuario
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <Profile />;
      case "progress":
        return <ProgressTracker />;
      case "tests":
        return (
          <SolarSystem 
            onViewResults={handleViewResults}
          />
        );
      case "todos":
        return <TodoList />;
      default:
        return <div className="p-6">Selecciona una sección</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {/* Modal de resultados */}
      {selectedTestResults && (
        <TestResultsModal 
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          testName={selectedTestResults.name}
          results={selectedTestResults.results}
          completionDate={selectedTestResults.completionDate}
        />
      )}
    </div>
  );
};

export default Dashboard; 