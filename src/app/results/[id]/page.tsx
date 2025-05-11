'use client';

import SolarSystem from '../../components/SolarSystem';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ResultDetail {
    name: string;
    progress: number;
    description?: string;
}

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const [testName, setTestName] = useState('');
    const [results, setResults] = useState<{
        name: string;
        progress: number;
        color: string;
        route: string;
    }[]>([]);
    const [selectedResult, setSelectedResult] = useState<ResultDetail | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const testResults = localStorage.getItem(`test_${params.id}_results`);
        if (testResults) {
            const data = JSON.parse(testResults);
            setTestName(data.testName);
            const formattedResults = Object.entries(data.results).map(([key, value], index) => ({
                name: key,
                progress: value as number,
                color: ["#7be495", "#4f8cff", "#ffb347", "#ff6f69"][index],
                route: `#${key}`,
                description: getResultDescription(key, value as number)
            }));
            setResults(formattedResults);
        }
    }, [params.id]);

    const getResultDescription = (category: string, score: number): string => {
        // Aquí puedes personalizar las descripciones según la categoría y el puntaje
        return `Tu puntaje en ${category} es ${score}%. Esto indica una ${score > 75 ? 'fuerte' : score > 50 ? 'moderada' : 'ligera'} afinidad con esta área. ${getDetailedDescription(category)}`;
    };

    const getDetailedDescription = (category: string): string => {
        const descriptions: { [key: string]: string } = {
            tecnologia: "Las personas con afinidad tecnológica suelen destacar en resolución de problemas, pensamiento lógico y adaptación a nuevas herramientas.",
            ciencias: "La orientación científica indica una fuerte capacidad de análisis, curiosidad por la investigación y pensamiento metódico.",
            artes: "La inclinación artística refleja creatividad, expresión personal y capacidad para pensar fuera de lo convencional.",
            humanidades: "La afinidad con humanidades sugiere empatía, comprensión social y habilidades de comunicación.",
            negocios: "La orientación hacia los negocios indica capacidad estratégica, liderazgo y visión empresarial."
        };
        return descriptions[category.toLowerCase()] || "";
    };

    const handleLearnMore = (result: any) => {
        setSelectedResult({
            name: result.name,
            progress: result.progress,
            description: result.description
        });
        setShowModal(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/assets/img/tests/bg-tests.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            
            <SolarSystem data={results} onLearnMore={handleLearnMore} />
            
            <div style={{
                position: "absolute",
                top: 40,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                textAlign: "center"
            }}>
                <h1 style={{ fontSize: 55, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{testName}</h1>
                <button
                    onClick={() => router.push('/vocational-test')}
                    className="mt-4 px-8 py-3 bg-[#E75C2C] text-white rounded-[.5rem] hover:bg-[#d04d23] transition-colors duration-200 text-lg font-medium"
                >
                    Volver a universo principal
                </button>
            </div>

            {/* Modal de detalles */}
            {showModal && selectedResult && (
                <>
                    <div className="fixed inset-0 bg-[#000000f5] z-40" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{selectedResult.name}</h2>
                            <div className="mb-6">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-[#E75C2C] h-4 rounded-full"
                                        style={{ width: `${selectedResult.progress}%` }}
                                    />
                                </div>
                                <div className="text-right text-sm text-gray-600 mt-1">
                                    {selectedResult.progress}%
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {selectedResult.description}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}