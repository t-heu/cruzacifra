import { Word } from "../app/interfaces";

import dictionaryRaw from "../dictionary.json";

// Base dictionary: words with clues
const baseDictionary:  { word: string; tip: string }[] = dictionaryRaw;

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateRandomChallenge(seed: number): {
  id: number;
  title: string;
  words: Word[];
} {
  const selected = seededShuffle(baseDictionary, seed).slice(0, 5);

  const wordsWithDefaults: Word[] = selected.map(w => ({
    ...w,
    row: 0,
    column: 0,
    direction: "horizontal",
  }));

  return {
    id: seed,
    title: "Random",
    words: wordsWithDefaults,
  };
}
