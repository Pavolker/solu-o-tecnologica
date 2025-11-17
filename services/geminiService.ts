import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk } from '../types';

const CATEGORY_TITLES = [
  "Tecnologias de aplicação imediata pelas empresas",
  "Tecnologias de aplicação estrutural, na cadeia produtiva",
  "Tecnologias sistêmicas, de aplicação no território"
];

export const fetchTechSolutions = async (sector: string): Promise<SearchResult> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key not found. Please set the GEMINI_API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  
  const prompt = `
    Você é um agente especialista em soluções tecnológicas. Sua missão é analisar um setor da economia e identificar as tecnologias mais avançadas para ele, com base em uma ampla pesquisa global.
    Para o setor de "${sector}", forneça uma análise detalhada. Sua pesquisa deve abranger referências internacionais de alta reputação, como Wired, The Verge, TechCrunch, Ars Technica, Reuters, Financial Times, Gartner, e outras publicações notórias do setor de tecnologia.

    Estruture sua resposta em EXATAMENTE três categorias principais, usando os seguintes títulos em negrito, precedidos por um número:
    
    **1- ${CATEGORY_TITLES[0]}**
    
    **2- ${CATEGORY_TITLES[1]}**
    
    **3- ${CATEGORY_TITLES[2]}**
    
    Dentro de CADA UMA dessas três categorias, você DEVE listar exatamente UMA tecnologia para cada um dos TRÊS elos da cadeia produtiva. Use o seguinte formato exato para cada item, incluindo o hífen e os asteriscos, mas SEM incluir os colchetes []:

    - **Suprimentos:** Descrição da tecnologia para o elo de suprimentos
    - **Design e Produção:** Descrição da tecnologia para o elo de design e produção
    - **Mercado:** Descrição da tecnologia para o elo de mercado

    Para cada tecnologia, forneça uma breve descrição de sua aplicação e impacto no setor.
    Seja conciso, preciso e baseie-se nas informações mais recentes e globais. 
    
    Após essa análise detalhada, adicione as seguintes seções, usando os títulos em negrito exatamente como mostrado:

    **As Big Threes**
    Liste as 3 maiores e mais impactantes megatendências para o setor de "${sector}". Use um formato de lista numerada (ex: 1. Tendência A...).

    **Visão de Futuro**
    Com base nas tecnologias e megatendências identificadas, escreva um parágrafo conciso e inspirador que resuma a "Visão de Futuro" para este setor.

    Responda em português brasileiro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    const categories = CATEGORY_TITLES.map((title, index) => {
      const nextTitleOrSection = CATEGORY_TITLES[index + 1] || "As Big Threes";
      const startRegex = new RegExp(`\\*\\*${index + 1}-\\s*${title}\\*\\*`, 'i');
      
      const startIndex = text.search(startRegex);
      if (startIndex === -1) {
          return { title, content: "Nenhuma informação encontrada para esta categoria." };
      }

      let endIndex;
      if (nextTitleOrSection) {
          const endRegexStr = nextTitleOrSection === "As Big Threes"
            ? `\\*\\*As Big Threes\\*\\*`
            : `\\*\\*${index + 2}-\\s*${nextTitleOrSection}\\*\\*`;
          const endRegex = new RegExp(endRegexStr, 'i');
          endIndex = text.search(endRegex);
      }
      
      const contentSlice = endIndex !== -1 && endIndex !== undefined ? text.substring(startIndex, endIndex) : text.substring(startIndex);
      const cleanContent = contentSlice.replace(startRegex, '').trim();

      return {
        title,
        content: cleanContent || "Nenhuma informação encontrada para esta categoria.",
      };
    });

    const megatrendsRegex = /\*\*As Big Threes\*\*\s*([\s\S]*?)\s*\*\*Visão de Futuro\*\*/;
    const futureVisionRegex = /\*\*Visão de Futuro\*\*\s*([\s\S]*)/;

    const megatrendsMatch = text.match(megatrendsRegex);
    const futureVisionMatch = text.match(futureVisionRegex);

    const megatrends = megatrendsMatch ? megatrendsMatch[1].trim() : "Nenhuma megatendência encontrada.";
    const futureVision = futureVisionMatch ? futureVisionMatch[1].trim() : "Nenhuma visão de futuro encontrada.";

    return { categories, sources, megatrends, futureVision };
  } catch (error) {
    console.error("Error fetching tech solutions:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a response from the AI model: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI model.");
  }
};