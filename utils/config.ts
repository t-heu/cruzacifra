import THEMES from "@/challenges.json"
import {PalavraItem} from "@/interfaces/types"

// Limites de ajudas
export const LIMITE_DICAS = 3
export const LIMITE_LETRAS_REVELADAS = 2
export const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const TEMAS_PALAVRAS: { titulo: string; palavras: PalavraItem[] }[] = THEMES as { titulo: string; palavras: PalavraItem[] }[];
