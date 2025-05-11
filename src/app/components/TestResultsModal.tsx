import React from 'react';

interface TestResult {
  category: string;
  score: number;
  description: string;
  careers?: string[];
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testName: string;
  results: TestResult[];
  completionDate?: string;
}

const TestResultsModal: React.FC<TestResultsModalProps> = ({
  isOpen,
  onClose,
  testName,
  results,
  completionDate
}) => {
  if (!isOpen) return null;

  // Encuentra la categoría con mayor puntuación
  const topCategory = [...results].sort((a, b) => b.score - a.score)[0];

  // Helper para convertir puntuación a porcentaje visual
  const getPercentageWidth = (score: number) => {
    return `${Math.min(Math.max(score, 0), 100)}%`;
  };

  // Helper para obtener color según puntuación
  const getCategoryColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay de fondo */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Contenido del modal */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto z-10 relative animate-fadeIn">
        {/* Cabecera con botón de cerrar */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Resultados: {testName}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          {/* Fecha de realización */}
          {completionDate && (
            <p className="text-slate-400 mb-6">
              Completado el {completionDate}
            </p>
          )}
          
          {/* Resumen principal */}
          <div className="bg-indigo-900/30 rounded-xl p-6 mb-8 border border-indigo-500/20">
            <h3 className="text-xl font-bold text-white mb-2">Resultado destacado</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {topCategory.score}%
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{topCategory.category}</h4>
                <p className="text-indigo-300">Tu categoría más destacada</p>
              </div>
            </div>
            <p className="text-slate-300">
              {topCategory.description}
            </p>
          </div>
          
          {/* Todas las categorías */}
          <h3 className="text-xl font-bold text-white mb-4">Resultados por categoría</h3>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-white">{result.category}</h4>
                  <span className="font-bold text-white">{result.score}%</span>
                </div>
                
                {/* Barra de progreso */}
                <div className="h-2 bg-slate-700 rounded-full mb-3">
                  <div 
                    className={`h-full rounded-full ${getCategoryColor(result.score)}`} 
                    style={{ width: getPercentageWidth(result.score) }}
                  ></div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3">{result.description}</p>
                
                {/* Carreras recomendadas */}
                {result.careers && result.careers.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-indigo-300 mb-2">Carreras recomendadas:</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.careers.map((career, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-900/50 text-xs rounded-full text-indigo-200 border border-indigo-500/30">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pie del modal */}
        <div className="border-t border-slate-800 p-6 flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cerrar
          </button>
          <button 
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            Guardar resultados
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsModal; 