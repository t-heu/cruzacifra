export interface Word {
  word: string
  tip: string
  row: number
  column: number
  direction: "horizontal" | "vertical"
}

export interface Challenge {
  id: number
  title: string
  words: Word[]
}
