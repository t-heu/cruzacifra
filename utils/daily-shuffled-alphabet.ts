// Função para embaralhar com seed fixo
export const embaralharComSeed = <T,>(array: T[], seed: number): T[] => {
  const novoArray = [...array]
  let random = seed

  for (let i = novoArray.length - 1; i > 0; i--) {
    // Gerador de números pseudo-aleatórios simples
    random = (random * 9301 + 49297) % 233280
    const j = Math.floor((random / 233280) * (i + 1))
    ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
  }
  return novoArray
}