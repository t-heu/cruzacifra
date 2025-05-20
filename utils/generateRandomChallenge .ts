import { Word } from "../app/interfaces";

import dictionaryRaw from "../dictionary.json";

// Base dictionary: words with clues
const baseDictionary:  { palavra: string; dica: string }[] = dictionaryRaw;

// Helper to shuffle the array
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

// Main function
export function generateRandomChallenge(id: number = Date.now()): {
  id: number;
  titulo: string;
  palavras: Word[];
} {
  const selected = shuffleArray(baseDictionary).slice(0, 5);

  // Initialize with default positions (will be overwritten)
  const wordsWithDefaults: Word[] = selected.map(w => ({
    ...w,
    linha: 0,
    coluna: 0,
    direcao: "horizontal", 
  }));

  return {
    id,
    titulo: "Random",
    palavras: wordsWithDefaults,
  };
}
