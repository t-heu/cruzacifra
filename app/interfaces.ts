export interface Word {
  palavra: string
  dica: string
  linha: number
  coluna: number
  direcao: "horizontal" | "vertical"
}

export interface Challenge {
  id: number
  titulo: string
  palavras: Word[]
}
