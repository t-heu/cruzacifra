// Estrutura de uma palavra
export type PalavraItem = {
  palavra: string
  dica: string
  categoria: string
  dificuldade: "facil" | "medio" | "dificil"
  curiosidade?: string
}

// Estrutura de uma palavra posicionada na grade
export type PalavraPosicionada = {
  palavra: string
  dica: string
  categoria: string
  dificuldade: "facil" | "medio" | "dificil"
  curiosidade?: string
  linha: number
  coluna: number
  direcao: "horizontal" | "vertical"
  numero: number
}
