import { ALFABETO } from "@/utils/config"
import type { PalavraItem, PalavraPosicionada } from "@/interfaces/types"

// Função para gerar seed baseado na data
const gerarSeedDiario = () => {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = hoje.getMonth()
  const dia = hoje.getDate()
  return ano * 10000 + mes * 100 + dia
}

// Função para embaralhar com seed fixo
const embaralharComSeed = <T,>(array: T[], seed: number): T[] => {
  const novoArray = [...array]
  let random = seed

  for (let i = novoArray.length - 1; i > 0; i--) {
    random = (random * 9301 + 49297) % 233280
    const j = Math.floor((random / 233280) * (i + 1))
    ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
  }
  return novoArray
}

// Verifica se uma palavra pode ser colocada em uma posição
const verificarPosicao = (
  palavra: string,
  linha: number,
  coluna: number,
  direcao: "horizontal" | "vertical",
  grade: string[][],
) => {
  let intersecoes = 0
  let valida = true

  for (let i = 0; i < palavra.length; i++) {
    const linhaAtual = direcao === "horizontal" ? linha : linha + i
    const colunaAtual = direcao === "horizontal" ? coluna + i : coluna

    const letraGrade = grade[linhaAtual][colunaAtual]
    const letraPalavra = palavra[i]

    if (letraGrade) {
      if (letraGrade === letraPalavra) {
        intersecoes++
      } else {
        valida = false
        break
      }
    } else {
      const adjacentes = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]

      for (const [deltaLinha, deltaColuna] of adjacentes) {
        const linhaAdj = linhaAtual + deltaLinha
        const colunaAdj = colunaAtual + deltaColuna

        if (
          linhaAdj >= 0 &&
          linhaAdj < grade.length &&
          colunaAdj >= 0 &&
          colunaAdj < grade[0].length &&
          grade[linhaAdj][colunaAdj]
        ) {
          const naDirecao =
            (direcao === "horizontal" && deltaLinha === 0) || (direcao === "vertical" && deltaColuna === 0)

          if (!naDirecao) {
            valida = false
            break
          }
        }
      }

      if (!valida) break
    }
  }

  return { valida, intersecoes }
}

// Encontra a melhor posição para uma palavra
const encontrarMelhorPosicao = (
  palavra: string,
  grade: string[][],
  palavrasExistentes: PalavraPosicionada[],
): { linha: number; coluna: number; direcao: "horizontal" | "vertical" } | null => {
  const tamanhoGrade = grade.length
  const possibilidades: Array<{
    linha: number
    coluna: number
    direcao: "horizontal" | "vertical"
    intersecoes: number
  }> = []

  for (let linha = 0; linha < tamanhoGrade; linha++) {
    for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
      if (coluna + palavra.length <= tamanhoGrade) {
        const resultado = verificarPosicao(palavra, linha, coluna, "horizontal", grade)
        if (resultado.valida && resultado.intersecoes > 0) {
          possibilidades.push({
            linha,
            coluna,
            direcao: "horizontal",
            intersecoes: resultado.intersecoes,
          })
        }
      }

      if (linha + palavra.length <= tamanhoGrade) {
        const resultado = verificarPosicao(palavra, linha, coluna, "vertical", grade)
        if (resultado.valida && resultado.intersecoes > 0) {
          possibilidades.push({
            linha,
            coluna,
            direcao: "vertical",
            intersecoes: resultado.intersecoes,
          })
        }
      }
    }
  }

  if (possibilidades.length === 0) return null

  possibilidades.sort((a, b) => b.intersecoes - a.intersecoes)
  return possibilidades[0]
}

export const montarPalavrasCruzadas = (palavrasOriginais: PalavraItem[]) => {
  const seed = gerarSeedDiario()
  const palavras = [...palavrasOriginais].sort((a, b) => b.palavra.length - a.palavra.length)

  const palavrasPosicionadas: PalavraPosicionada[] = []
  const tamanhoGrade = 25
  const grade: string[][] = Array(tamanhoGrade)
    .fill(null)
    .map(() => Array(tamanhoGrade).fill(""))

  const primeiraPalavra = palavras[0]
  const linhaCentral = Math.floor(tamanhoGrade / 2)
  const colunaCentral = Math.floor((tamanhoGrade - primeiraPalavra.palavra.length) / 2)

  palavrasPosicionadas.push({
    ...primeiraPalavra,
    linha: linhaCentral,
    coluna: colunaCentral,
    direcao: "horizontal",
    numero: 1,
  })

  for (let i = 0; i < primeiraPalavra.palavra.length; i++) {
    grade[linhaCentral][colunaCentral + i] = primeiraPalavra.palavra[i]
  }

  for (let i = 1; i < Math.min(palavras.length, 10); i++) {
    const palavra = palavras[i]
    const melhorPosicao = encontrarMelhorPosicao(palavra.palavra, grade, palavrasPosicionadas)

    if (melhorPosicao) {
      palavrasPosicionadas.push({
        ...palavra,
        ...melhorPosicao,
        numero: i + 1,
      })

      for (let j = 0; j < palavra.palavra.length; j++) {
        if (melhorPosicao.direcao === "horizontal") {
          grade[melhorPosicao.linha][melhorPosicao.coluna + j] = palavra.palavra[j]
        } else {
          grade[melhorPosicao.linha + j][melhorPosicao.coluna] = palavra.palavra[j]
        }
      }
    }
  }

  const gradeNumeros: number[][] = Array(tamanhoGrade)
    .fill(null)
    .map(() => Array(tamanhoGrade).fill(0))

  palavrasPosicionadas.forEach((palavra) => {
    gradeNumeros[palavra.linha][palavra.coluna] = palavra.numero
  })

  const letrasUnicas = new Set<string>()
  grade.forEach((linha) => {
    linha.forEach((letra) => {
      if (letra) letrasUnicas.add(letra)
    })
  })

  const codigo: Record<string, string> = {}
  const alfabetoEmbaralhado = embaralharComSeed([...ALFABETO], seed)
  const letrasArray = Array.from(letrasUnicas)

  letrasArray.forEach((letra, index) => {
    codigo[alfabetoEmbaralhado[index]] = letra
  })

  const gradeCodificada = grade.map((linha) =>
    linha.map((letra) => {
      if (!letra) return ""
      return Object.keys(codigo).find((key) => codigo[key] === letra) || ""
    }),
  )

  return {
    palavras: palavrasPosicionadas,
    grade: gradeCodificada,
    gradeNumeros,
    codigo,
  }
}
