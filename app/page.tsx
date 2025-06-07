"use client"

import { useEffect, useState } from "react"

import AdBanner from "../components/ad-banner";
import Footer from "../components/footer";
import Header from "../components/header";

import {formatarTempoRestante} from "../utils/time";
import {MAX_REVEAL, MAX_TIPS} from "../utils/config";
import {shuffleWithSeed} from "../utils/daily-shuffled-alphabet";

import {PalavraItem, PalavraPosicionada} from "./interfaces";

import words from "../challenges.json";

// Conjuntos de words por tema (um tema por dia)
const TEMAS_PALAVRAS: { title: string; words: PalavraItem[] }[] = words;

// Alfabeto para codificação
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function Page() {
  const [temaAtual, setTemaAtual] = useState<(typeof TEMAS_PALAVRAS)[0] | null>(null)
  const [palavrasPosicionadas, setPalavrasPosicionadas] = useState<PalavraPosicionada[]>([])
  const [grade, setGrade] = useState<string[][]>([])
  const [gradeNumeros, setGradeNumeros] = useState<number[][]>([])
  const [codigo, setCodigo] = useState<Record<string, string>>({})
  const [codigoUsuario, setCodigoUsuario] = useState<Record<string, string>>({})
  const [dicasReveladas, setDicasReveladas] = useState<number[]>([])
  const [concluido, setConcluido] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)
  const [tempoInicio, setTempoInicio] = useState(0)
  const [proximoDesafio, setProximoDesafio] = useState("")
  const [progresso, setProgresso] = useState(0)
  const [abaSelecionada, setAbaSelecionada] = useState("jogo")
  const [revealLetter, setRevealLetter] = useState<number>(0)
  const [lostOrWin, setLostOrWin] = useState<'win' | 'lost' | null>(null)

  // Inicializa o jogo
  useEffect(() => {
    const hoje = new Date()
    const diaDoAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const temaHoje = TEMAS_PALAVRAS[diaDoAno % TEMAS_PALAVRAS.length]

    // Verifica se já jogou hoje
    const ultimoJogo = localStorage.getItem("ultimoJogoCruzadas")
    const dataHoje = hoje.toLocaleDateString("pt-BR")

    if (ultimoJogo === dataHoje) {
      // Recupera o estado do jogo de hoje
      const estadoSalvo = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")
      setCodigoUsuario(estadoSalvo.codigoUsuario || {})
      setDicasReveladas(estadoSalvo.dicasReveladas || [])
      setRevealLetter(estadoSalvo.revealLetter || 0)
      setConcluido(estadoSalvo.concluido || false)
      setPontuacao(estadoSalvo.pontuacao || 0)
      setLostOrWin(estadoSalvo.lostOrWin || null)
    } else {
      // Novo jogo
      localStorage.setItem("ultimoJogoCruzadas", dataHoje)
      setCodigoUsuario({})
      setDicasReveladas([])
      setRevealLetter(0)
      setConcluido(false)
      setLostOrWin(null)
      setPontuacao(0)
      setTempoInicio(Date.now())
    }

    // Configura o tema
    setTemaAtual(temaHoje)
    const resultado = montarPalavrasCruzadas(temaHoje.words)
    setPalavrasPosicionadas(resultado.words)
    setGrade(resultado.grade)
    setGradeNumeros(resultado.gradeNumeros)
    setCodigo(resultado.codigo)

    // Calcula quando será o próximo desafio
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    amanha.setHours(0, 0, 0, 0)
    setProximoDesafio(formatarTempoRestante(amanha.getTime() - Date.now()))

    // Atualiza o contador a cada segundo
    const intervalo = setInterval(() => {
      const agora = new Date()
      const amanha = new Date()
      amanha.setDate(amanha.getDate() + 1)
      amanha.setHours(0, 0, 0, 0)
      setProximoDesafio(formatarTempoRestante(amanha.getTime() - agora.getTime()))
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  // Atualiza o progresso quando o código do usuário muda
  useEffect(() => {
    if (!codigo || Object.keys(codigo).length === 0) return

    // Calcula o progresso
    const totalLetras = Object.keys(codigo).length
    const letrasCorretas = Object.entries(codigoUsuario).filter(
      ([codificada, decodificada]) => codigo[codificada] === decodificada,
    ).length

    const novoProgresso = totalLetras > 0 ? Math.floor((letrasCorretas / totalLetras) * 100) : 0
    setProgresso(novoProgresso)

    // ✅ Verifica se o jogador completou tudo mas errou alguma
    const todasPreenchidas = Object.keys(codigoUsuario).length === totalLetras
    const todasCorretas = letrasCorretas === totalLetras

    if (todasPreenchidas && !todasCorretas && !concluido) {
      setConcluido(true)
      setPontuacao(0)
      setLostOrWin('lost')

      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          revealLetter,
          concluido: true,
          pontuacao: 0,
          lostOrWin: 'lost'
        }),
      )
      return
    }

    // Verifica se completou o desafio
    if (novoProgresso === 100 && !concluido) {
      setConcluido(true)
      setLostOrWin('win');

      const tempoGasto = Math.floor((Date.now() - tempoInicio) / 1000)
      const pontuacaoBase = 1000
      const penalidade = (tempoGasto / 60) * 50 + dicasReveladas.length * 100
      const novaPontuacao = Math.max(100, Math.floor(pontuacaoBase - penalidade))
      setPontuacao(novaPontuacao)

      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          revealLetter,
          concluido: true,
          pontuacao: novaPontuacao,
          lostOrWin: 'win'
        }),
      )
    } else if (!concluido) {
      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          revealLetter,
          concluido: false,
          pontuacao: 0,
          lostOrWin: null
        }),
      )
    }
  }, [codigoUsuario, codigo, concluido, dicasReveladas, tempoInicio])

  // Algoritmo para montar words cruzadas automaticamente
  const montarPalavrasCruzadas = (palavrasOriginais: PalavraItem[]) => {
    // Ordena words por tamanho (maiores primeiro para melhor encaixe)
    const words = [...palavrasOriginais].sort((a, b) => b.word.length - a.word.length)

    const palavrasPosicionadas: PalavraPosicionada[] = []
    const tamanhoGrade = 20 // Grade 20x20
    const grade: string[][] = Array(tamanhoGrade)
      .fill(null)
      .map(() => Array(tamanhoGrade).fill(""))

    // Coloca a primeira word no centro da grade (horizontal)
    const primeiraPalavra = words[0]
    const linhaCentral = Math.floor(tamanhoGrade / 2)
    const colunaCentral = Math.floor((tamanhoGrade - primeiraPalavra.word.length) / 2)

    palavrasPosicionadas.push({
      ...primeiraPalavra,
      linha: linhaCentral,
      coluna: colunaCentral,
      direcao: "horizontal",
      numero: 1,
    })

    // Preenche a grade com a primeira word
    for (let i = 0; i < primeiraPalavra.word.length; i++) {
      grade[linhaCentral][colunaCentral + i] = primeiraPalavra.word[i]
    }

    // Tenta posicionar as outras words
    for (let i = 1; i < Math.min(words.length, 8); i++) {
      const word = words[i]
      const melhorPosicao = encontrarMelhorPosicao(word.word, grade, palavrasPosicionadas)

      if (melhorPosicao) {
        palavrasPosicionadas.push({
          ...word,
          ...melhorPosicao,
          numero: i + 1,
        })

        // Preenche a grade com a nova word
        for (let j = 0; j < word.word.length; j++) {
          if (melhorPosicao.direcao === "horizontal") {
            grade[melhorPosicao.linha][melhorPosicao.coluna + j] = word.word[j]
          } else {
            grade[melhorPosicao.linha + j][melhorPosicao.coluna] = word.word[j]
          }
        }
      }
    }

    // Cria grade de números para as words
    const gradeNumeros: number[][] = Array(tamanhoGrade)
      .fill(null)
      .map(() => Array(tamanhoGrade).fill(0))

    palavrasPosicionadas.forEach((word) => {
      gradeNumeros[word.linha][word.coluna] = word.numero
    })

    // Cria o código de substituição
    const letrasUnicas = new Set<string>()
    grade.forEach((linha) => {
      linha.forEach((letra) => {
        if (letra) letrasUnicas.add(letra)
      })
    })

    const codigo: Record<string, string> = {}
    const shuffledAlphabet = shuffleWithSeed([...ALPHABET])
    const letrasArray = Array.from(letrasUnicas)

    letrasArray.forEach((letra, index) => {
      codigo[shuffledAlphabet[index]] = letra
    })

    // Codifica a grade
    const gradeCodificada = grade.map((linha) =>
      linha.map((letra) => {
        if (!letra) return ""
        return Object.keys(codigo).find((key) => codigo[key] === letra) || ""
      }),
    )

    return {
      words: palavrasPosicionadas,
      grade: gradeCodificada,
      gradeNumeros,
      codigo,
    }
  }

  // Encontra a melhor posição para uma word
  const encontrarMelhorPosicao = (
    word: string,
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

    // Tenta todas as posições possíveis
    for (let linha = 0; linha < tamanhoGrade; linha++) {
      for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
        // Tenta horizontal
        if (coluna + word.length <= tamanhoGrade) {
          const resultado = verificarPosicao(word, linha, coluna, "horizontal", grade)
          if (resultado.valida && resultado.intersecoes > 0) {
            possibilidades.push({
              linha,
              coluna,
              direcao: "horizontal",
              intersecoes: resultado.intersecoes,
            })
          }
        }

        // Tenta vertical
        if (linha + word.length <= tamanhoGrade) {
          const resultado = verificarPosicao(word, linha, coluna, "vertical", grade)
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

    // Retorna a posição com mais interseções
    if (possibilidades.length === 0) return null

    possibilidades.sort((a, b) => b.intersecoes - a.intersecoes)
    return possibilidades[0]
  }

  // Verifica se uma word pode ser colocada em uma posição
  const verificarPosicao = (
    word: string,
    linha: number,
    coluna: number,
    direcao: "horizontal" | "vertical",
    grade: string[][],
  ) => {
    let intersecoes = 0
    let valida = true

    for (let i = 0; i < word.length; i++) {
      const linhaAtual = direcao === "horizontal" ? linha : linha + i
      const colunaAtual = direcao === "horizontal" ? coluna + i : coluna

      const letraGrade = grade[linhaAtual][colunaAtual]
      const letraPalavra = word[i]

      if (letraGrade) {
        // Já existe uma letra nesta posição
        if (letraGrade === letraPalavra) {
          intersecoes++
        } else {
          valida = false
          break
        }
      } else {
        // Verifica se há conflitos nas células adjacentes
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
            // Só permite adjacência se for na direção da word
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

  // Revela uma tip
  const revelarDica = (index: number) => {
    if (dicasReveladas.includes(index)) return

    const novasDicasReveladas = [...dicasReveladas, index]
    setDicasReveladas(novasDicasReveladas)
  }

  // Revela uma letra do código
  const revelarLetra = () => {
    if (revealLetter > MAX_REVEAL) return;

    setRevealLetter(revealLetter+1)

    const letrasIncorretas = Object.keys(codigo).filter(
      (letraCodificada) =>
        !codigoUsuario[letraCodificada] || codigoUsuario[letraCodificada] !== codigo[letraCodificada],
    )

    if (letrasIncorretas.length === 0) return

    const letraParaRevelar = letrasIncorretas[Math.floor(Math.random() * letrasIncorretas.length)]
    const novoCodigoUsuario = { ...codigoUsuario, [letraParaRevelar]: codigo[letraParaRevelar] }
    setCodigoUsuario(novoCodigoUsuario)
  }

  // Atualiza o código do usuário
  const atualizarCodigoUsuario = (letraCodificada: string, letraDecodificada: string) => {
    const novoCodigoUsuario = { ...codigoUsuario }

    // Remove a letra decodificada de qualquer outra posição
    Object.keys(novoCodigoUsuario).forEach((key) => {
      if (novoCodigoUsuario[key] === letraDecodificada) {
        delete novoCodigoUsuario[key]
      }
    })

    // Adiciona ou remove a letra
    if (letraDecodificada) {
      novoCodigoUsuario[letraCodificada] = letraDecodificada.toUpperCase()
    } else {
      delete novoCodigoUsuario[letraCodificada]
    }

    setCodigoUsuario(novoCodigoUsuario)
  }

  // Renderiza a grade
  const renderizarGrade = () => {
    if (!grade.length) return null

    // Encontra os limites da grade com conteúdo
    let minLinha = grade.length,
      maxLinha = -1,
      minColuna = grade[0].length,
      maxColuna = -1

    for (let i = 0; i < grade.length; i++) {
      for (let j = 0; j < grade[i].length; j++) {
        if (grade[i][j]) {
          minLinha = Math.min(minLinha, i)
          maxLinha = Math.max(maxLinha, i)
          minColuna = Math.min(minColuna, j)
          maxColuna = Math.max(maxColuna, j)
        }
      }
    }

    // Adiciona margem
    minLinha = Math.max(0, minLinha - 1)
    maxLinha = Math.min(grade.length - 1, maxLinha + 1)
    minColuna = Math.max(0, minColuna - 1)
    maxColuna = Math.min(grade[0].length - 1, maxColuna + 1)

    const gradeVisivel = []
    for (let i = minLinha; i <= maxLinha; i++) {
      const linha = []
      for (let j = minColuna; j <= maxColuna; j++) {
        linha.push({ letra: grade[i][j], numero: gradeNumeros[i][j] })
      }
      gradeVisivel.push(linha)
    }

    return (
      <div className="flex justify-center mb-6">
        <div className="overflow-auto max-w-full">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${maxColuna - minColuna + 1}, 2.5rem)`
            }}
          >
            {gradeVisivel.map((linha, linhaIndex) =>
              linha.map((celula, colunaIndex) => (
                <div
                  key={`${linhaIndex}-${colunaIndex}`}
                  className={`relative w-10 h-10 border-2 flex flex-col items-center justify-center font-bold
                    text-[10px] sm:text-xs md:text-sm
                    ${celula.letra ? "border-gray-400 bg-white" : "border-transparent bg-gray-100"}
                  `}
                >
                  {celula.numero > 0 && (
                    <div className="absolute top-[2px] left-[2px] text-[9px] sm:text-[12px] text-blue-600 font-bold leading-none">
                      {celula.numero}
                    </div>
                  )}

                  {celula.letra && (
                    <div className="flex flex-col items-center leading-none">
                      <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                        {celula.letra}
                      </div>
                      <div
                        className={`text-[12px] sm:text-sm md:text-base ${
                          codigoUsuario[celula.letra] ? "text-blue-600" : "text-black"
                        }`}
                      >
                        {codigoUsuario[celula.letra] || "."}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // Renderiza o decodificador
  const renderizarDecodificador = () => {
    const letrasCodificadas = Object.keys(codigo).sort()

    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
        {letrasCodificadas.map((letraCodificada) => (
          <div key={letraCodificada} className="flex flex-col items-center">
            <div className="text-lg font-bold mb-1">{letraCodificada}</div>
            <input
              type="text"
              value={codigoUsuario[letraCodificada] || ""}
              onChange={(e) => atualizarCodigoUsuario(letraCodificada, e.target.value)}
              className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none uppercase"
              maxLength={1}
              disabled={concluido}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ebc260] py-8">
      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="9380851329"
      />
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <Header progresso={progresso} pontuacao={pontuacao} proximoDesafio={proximoDesafio} temaAtual={temaAtual} concluido={concluido} lostOrWin={lostOrWin} />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex align-center w-full justify-around">
              {["jogo", "decodificador", "dicas"].map((aba) => (
                <button
                  key={aba}
                  onClick={() => setAbaSelecionada(aba)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    abaSelecionada === aba
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {aba}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {abaSelecionada === "jogo" && renderizarGrade()}

            {abaSelecionada === "decodificador" && (
              <div>
                {renderizarDecodificador()}

                {!concluido && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {!(revealLetter > MAX_REVEAL) && (
                      <button
                        onClick={revelarLetra}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Revelar uma letra
                      </button>
                    )}

                    <button
                      onClick={() => setCodigoUsuario({})}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Limpar
                    </button>
                  </div>
                )}
              </div>
            )}

            {abaSelecionada === "dicas" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Dicas das Palavras:</h3>
                {palavrasPosicionadas.map((word, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded">
                          {word.numero}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {word.direcao === "horizontal" ? "→" : "↓"}
                        </span>
                      </div>
                      {dicasReveladas.includes(index) ? (
                        <span className="text-gray-800">{word.tip}</span>
                      ) : (
                        <span className="text-gray-400">Dica oculta</span>
                      )}
                    </div>
                    {!(dicasReveladas.length > MAX_TIPS) && (!dicasReveladas.includes(index) && !concluido) && (
                      <button
                        onClick={() => revelarDica(index)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Revelar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer dicasReveladas={dicasReveladas} />
      </div>
    </div>
  )
}
