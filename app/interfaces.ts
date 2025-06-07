// Estrutura de uma word
export type PalavraItem = {
  word: string
  tip: string
}

// Estrutura de uma word posicionada na grade
export type PalavraPosicionada = {
  word: string
  tip: string
  linha: number
  coluna: number
  direcao: "horizontal" | "vertical"
  numero: number
}
