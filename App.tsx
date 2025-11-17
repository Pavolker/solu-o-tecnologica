import React, { useState, useCallback, FC } from 'react';
import { SearchResult, TechnologyCategory } from './types';
import { fetchTechSolutions } from './services/geminiService';

// Icons defined as Functional Components
const TechIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ChainIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const SystemIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 4.092a.5.5 0 01.638-.585 10.02 10.02 0 017.962 0 .5.5 0 01.638.585l-1.14 3.421a.5.5 0 01-.638.292 7.978 7.978 0 00-6.044 0 .5.5 0 01-.638-.292L7.88 4.092zM12 18.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z" />
  </svg>
);

const SearchIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const MegatrendsIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const FutureVisionIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const App: FC = () => {
  const [sector, setSector] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = useCallback(async () => {
    if (!sector.trim()) {
      setError("Por favor, insira um setor da economia.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchTechSolutions(sector);
      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  }, [sector]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleDownload = () => {
    if (!result) return;

    let content = `PROJETO FORESIGHT - ANÁLISE TECNOLÓGICA\n`;
    content += `Setor: ${sector}\n`;
    content += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `${'='.repeat(60)}\n\n`;

    // Adicionar categorias
    result.categories.forEach((cat, index) => {
      content += `${index + 1}. ${cat.title.toUpperCase()}\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `${cat.content}\n\n`;
    });

    // Adicionar megatendências
    if (result.megatrends && result.megatrends !== "Nenhuma megatendência encontrada.") {
      content += `AS BIG THREES\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `${result.megatrends}\n\n`;
    }

    // Adicionar visão de futuro
    if (result.futureVision && result.futureVision !== "Nenhuma visão de futuro encontrada.") {
      content += `VISÃO DE FUTURO\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `${result.futureVision}\n\n`;
    }

    // Criar o blob e fazer download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foresight-${sector.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = (content: string) => {
    return content.split('\n').filter(line => line.trim() !== '').map((line, index) => {
      const match = line.trim().match(/^- \*\*(Suprimentos|Design e Produção|Mercado):\*\* (.*)/);

      if (match) {
        const subheading = match[1];
        const description = match[2];
        return (
          <div key={index} className="relative pl-6">
            <div className="absolute left-0 top-1.5 h-2.5 w-2.5 bg-sky-500 rounded-full ring-2 ring-slate-900"></div>
            <p className="text-slate-300">
              <strong className="font-semibold text-sky-400">{subheading}:</strong> {description}
            </p>
          </div>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
      return (
        <p key={index} className="text-gray-300 pl-6">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };
  
  const renderMegatrends = (content: string) => {
    return content.split('\n').filter(line => line.trim().match(/^\d\./)).map((line, index) => {
      const cleanLine = line.replace(/^\d\.\s*/, '');
      return (
        <li key={index} className="flex items-start">
          <span className="mr-4 mt-2 flex-shrink-0 h-2 w-2 bg-amber-400 rounded-full ring-2 ring-amber-400/30"></span>
          <span className="text-slate-300">{cleanLine}</span>
        </li>
      );
    });
  };

  const categoryIcons: { [key: string]: React.ReactNode } = {
    "Tecnologias de aplicação imediata pelas empresas": <TechIcon />,
    "Tecnologias de aplicação estrutural, na cadeia produtiva": <ChainIcon />,
    "Tecnologias sistêmicas, de aplicação no território": <SystemIcon />,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center my-8 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
            Projeto Foresight: Agente Especialista em Soluções Tecnológicas
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            Seu agente de IA para descobrir as tecnologias de ponta em qualquer setor da economia.
          </p>
        </header>

        <main className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-4 z-10 bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 shadow-lg">
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ex: Agricultura, Saúde, Varejo..."
              className="flex-grow bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando...
                </>
              ) : (
                <>
                  <SearchIcon />
                  <span className="ml-2">Buscar Soluções</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDownload}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  <DownloadIcon />
                  <span>Baixar Relatório</span>
                </button>
              </div>
              {result.categories.map((cat: TechnologyCategory, index: number) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      {categoryIcons[cat.title] || <TechIcon />}
                      <h2 className="ml-4 text-2xl font-semibold text-slate-100">{cat.title}</h2>
                    </div>
                    <div className="space-y-4">
                        {renderContent(cat.content)}
                    </div>
                  </div>
                </div>
              ))}

              {result.megatrends && result.megatrends !== "Nenhuma megatendência encontrada." && (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6">
                          <div className="flex items-center mb-6">
                              <MegatrendsIcon />
                              <h2 className="ml-4 text-2xl font-semibold text-slate-100">As Big Threes</h2>
                          </div>
                          <ul className="space-y-4">
                              {renderMegatrends(result.megatrends)}
                          </ul>
                      </div>
                  </div>
              )}

              {result.futureVision && result.futureVision !== "Nenhuma visão de futuro encontrada." && (
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6">
                          <div className="flex items-center mb-6">
                              <FutureVisionIcon />
                              <h2 className="ml-4 text-2xl font-semibold text-slate-100">Visão de Futuro</h2>
                          </div>
                          <p className="text-slate-300 leading-relaxed italic">"{result.futureVision}"</p>
                      </div>
                  </div>
              )}
            </div>
          )}

          {!loading && !result && !error && (
            <div className="text-center py-16 text-slate-500">
              <p>Insira um setor econômico para iniciar a análise de tecnologias.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;