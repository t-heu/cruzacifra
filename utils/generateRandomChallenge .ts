import { Word } from "../app/interfaces";

import dictionaryRaw from "../dictionary.json";

// Base dictionary: words with clues
const baseDictionary:  { word: string; tip: string }[] = dictionaryRaw;

// Helper to shuffle the array
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

// Main function
export function generateRandomChallenge(id: number = Date.now()): {
  id: number;
  title: string;
  words: Word[];
} {
  const selected = shuffleArray(baseDictionary).slice(0, 5);

  // Initialize with default positions (will be overwritten)
  const wordsWithDefaults: Word[] = selected.map(w => ({
    ...w,
    row: 0,
    column: 0,
    direction: "horizontal", 
  }));

  return {
    id,
    title: "Random",
    words: wordsWithDefaults,
  };
}
