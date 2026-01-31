
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function getBestMove(fen: string, history: string[], difficulty: Difficulty): Promise<string> {
  const difficultyPrompts: Record<Difficulty, string> = {
    [Difficulty.NOVICE]: "Novato. Comete errores tácticos infantiles.",
    [Difficulty.CASUAL]: "Aficionado. Juega sólido pero sin planes profundos.",
    [Difficulty.INTERMEDIATE]: "Intermedio. Conoce tácticas y aperturas estándar.",
    [Difficulty.ADVANCED]: "Avanzado. Cálculo preciso y presión constante.",
    [Difficulty.EXPERT]: "Experto. Nivel Gran Maestro. No perdona errores."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CHESS ENGINE.
      Level: ${difficultyPrompts[difficulty]}
      FEN: ${fen}
      History: ${history.join(', ')}
      
      TASK: Return ONLY the next move in Standard Algebraic Notation (SAN). Example: 'e4', 'Nf3', 'O-O'. NO CHAT.`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 5,
      },
    });

    const move = response.text.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9+#=]/g, '');
    return move;
  } catch (error: any) {
    // Manejo de error de cuota agotada (429) o cualquier error de API
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      console.warn("Cuota de API agotada. Usando movimiento de respaldo.");
    } else {
      console.error("Gemini Move Error:", error);
    }
    return ""; // Retorna vacío para usar el respaldo aleatorio en el App
  }
}

export async function analyzePosition(fen: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza este FEN brevemente en español (max 15 palabras): ${fen}`,
      config: { 
        temperature: 0.2,
        maxOutputTokens: 40
      }
    });
    return response.text;
  } catch (error) {
    return "Análisis no disponible por límite de cuota.";
  }
}
