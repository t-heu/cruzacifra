"use client"

import { useEffect, useState } from "react"

import {formatarTempoRestante} from "@/utils/time"
import {embaralharComSeed} from "@/utils/daily-shuffled-alphabet"
import {PalavraPosicionada, PalavraItem} from "@/interfaces/types"

import AdBanner from "@/components/ad-banner";
import GameTabs from "@/components/game/game-tabs"
import GameHeader from "@/components/game/game-header"

import THEMES from "@/challenges.json"

// Conjuntos expandidos de palavras por tema
const TEMAS_PALAVRAS: { titulo: string; palavras: PalavraItem[] }[] = THEMES as { titulo: string; palavras: PalavraItem[] }[];

// Alfabeto para codificação
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function JogoComponent() {
  const [temaAtual, setTemaAtual] = useState<(typeof TEMAS_PALAVRAS)[0] | null>(null)
  const [palavrasPosicionadas, setPalavrasPosicionadas] = useState<PalavraPosicionada[]>([])
  const [grade, setGrade] = useState<string[][]>([])
  const [gradeNumeros, setGradeNumeros] = useState<number[][]>([])
  const [codigo, setCodigo] = useState<Record<string, string>>({})
  const [codigoUsuario, setCodigoUsuario] = useState<Record<string, string>>({})
  const [dicasReveladas, setDicasReveladas] = useState<number[]>([])
  const [letrasReveladas, setLetrasReveladas] = useState<string[]>([])
  const [concluido, setConcluido] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)
  const [tempoInicio, setTempoInicio] = useState(0)
  const [proximoDesafio, setProximoDesafio] = useState("")
  const [progresso, setProgresso] = useState(0)
  const [sequencia, setSequencia] = useState(0)
  const [melhorTempo, setMelhorTempo] = useState(0)
  const [tempoAtual, setTempoAtual] = useState(0)

  // Função para gerar seed baseado na data
  const gerarSeedDiario = () => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = hoje.getMonth()
    const dia = hoje.getDate()
    return ano * 10000 + mes * 100 + dia
  }

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
      setLetrasReveladas(estadoSalvo.letrasReveladas || [])
      setConcluido(estadoSalvo.concluido || false)
      setPontuacao(estadoSalvo.pontuacao || 0)
      setTempoInicio(estadoSalvo.tempoInicio || Date.now())

      // Recupera o código e grade salvos
      const jogoSalvo = JSON.parse(localStorage.getItem("jogoAtualCruzadas") || "{}")
      if (jogoSalvo.codigo && jogoSalvo.grade) {
        setCodigo(jogoSalvo.codigo)
        setGrade(jogoSalvo.grade)
        setGradeNumeros(jogoSalvo.gradeNumeros)
        setPalavrasPosicionadas(jogoSalvo.palavrasPosicionadas)
      } else {
        // Gera o jogo com seed fixo
        const resultado = montarPalavrasCruzadas(temaHoje.palavras)
        setPalavrasPosicionadas(resultado.palavras)
        setGrade(resultado.grade)
        setGradeNumeros(resultado.gradeNumeros)
        setCodigo(resultado.codigo)

        // Salva o jogo gerado
        localStorage.setItem(
          "jogoAtualCruzadas",
          JSON.stringify({
            codigo: resultado.codigo,
            grade: resultado.grade,
            gradeNumeros: resultado.gradeNumeros,
            palavrasPosicionadas: resultado.palavras,
          }),
        )
      }
    } else {
      // Novo jogo
      localStorage.setItem("ultimoJogoCruzadas", dataHoje)
      const novoTempoInicio = Date.now()
      setCodigoUsuario({})
      setDicasReveladas([])
      setLetrasReveladas([])
      setConcluido(false)
      setPontuacao(0)
      setTempoInicio(novoTempoInicio)

      // Atualiza sequência
      const ultimaSequencia = Number.parseInt(localStorage.getItem("sequenciaJogos") || "0")
      const novaSequencia = ultimaSequencia + 1
      setSequencia(novaSequencia)
      localStorage.setItem("sequenciaJogos", novaSequencia.toString())

      // Gera o jogo com seed fixo
      const resultado = montarPalavrasCruzadas(temaHoje.palavras)
      setPalavrasPosicionadas(resultado.palavras)
      setGrade(resultado.grade)
      setGradeNumeros(resultado.gradeNumeros)
      setCodigo(resultado.codigo)

      // Salva o jogo gerado
      localStorage.setItem(
        "jogoAtualCruzadas",
        JSON.stringify({
          codigo: resultado.codigo,
          grade: resultado.grade,
          gradeNumeros: resultado.gradeNumeros,
          palavrasPosicionadas: resultado.palavras,
        }),
      )
    }

    // Recupera estatísticas
    const melhorTempoSalvo = Number.parseInt(localStorage.getItem("melhorTempo") || "0")
    setMelhorTempo(melhorTempoSalvo)

    // Configura o tema
    setTemaAtual(temaHoje)
  }, [])

  // Timer para próximo desafio
  useEffect(() => {
    const atualizarTimer = () => {
      const agora = new Date()
      const amanha = new Date()
      amanha.setDate(amanha.getDate() + 1)
      amanha.setHours(0, 0, 0, 0)
      setProximoDesafio(formatarTempoRestante(amanha.getTime() - agora.getTime()))
    }

    atualizarTimer()
    const intervalo = setInterval(atualizarTimer, 1000)
    return () => clearInterval(intervalo)
  }, [])

  // Timer do jogo atual
  useEffect(() => {
    if (concluido || tempoInicio === 0) return

    const timerJogo = setInterval(() => {
      setTempoAtual(Math.floor((Date.now() - tempoInicio) / 1000))
    }, 1000)

    return () => clearInterval(timerJogo)
  }, [concluido, tempoInicio])

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

    // Verifica se completou o desafio
    if (novoProgresso === 100 && !concluido && tempoInicio > 0) {
      setConcluido(true)
      const tempoGasto = Math.floor((Date.now() - tempoInicio) / 1000)
      const pontuacaoBase = 1000
      const bonusSequencia = sequencia * 50
      const penalidade = (tempoGasto / 60) * 30 + dicasReveladas.length * 80 + letrasReveladas.length * 100
      const novaPontuacao = Math.max(100, Math.floor(pontuacaoBase + bonusSequencia - penalidade))
      setPontuacao(novaPontuacao)

      // Atualiza melhor tempo
      if (melhorTempo === 0 || tempoGasto < melhorTempo) {
        setMelhorTempo(tempoGasto)
        localStorage.setItem("melhorTempo", tempoGasto.toString())
      }

      // Salva estatísticas
      const estatisticas = JSON.parse(localStorage.getItem("estatisticasJogo") || "{}")
      estatisticas.jogosCompletados = (estatisticas.jogosCompletados || 0) + 1
      estatisticas.pontuacaoTotal = (estatisticas.pontuacaoTotal || 0) + novaPontuacao
      estatisticas.tempoTotal = (estatisticas.tempoTotal || 0) + tempoGasto
      estatisticas.dicasUsadas = (estatisticas.dicasUsadas || 0) + dicasReveladas.length
      estatisticas.letrasReveladas = (estatisticas.letrasReveladas || 0) + letrasReveladas.length
      localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticas))

      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          letrasReveladas,
          concluido: true,
          pontuacao: novaPontuacao,
          tempoInicio,
        }),
      )
    } else if (!concluido && tempoInicio > 0) {
      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          letrasReveladas,
          concluido: false,
          pontuacao: 0,
          tempoInicio,
        }),
      )
    }
  }, [codigoUsuario, codigo, concluido, dicasReveladas, letrasReveladas, tempoInicio, sequencia, melhorTempo])

  // Algoritmo para montar palavras cruzadas automaticamente
  const montarPalavrasCruzadas = (palavrasOriginais: PalavraItem[]) => {
    const seed = gerarSeedDiario()

    // Ordena palavras por tamanho (maiores primeiro para melhor encaixe)
    const palavras = [...palavrasOriginais].sort((a, b) => b.palavra.length - a.palavra.length)

    const palavrasPosicionadas: PalavraPosicionada[] = []
    const tamanhoGrade = 25 // Grade maior para mais palavras
    const grade: string[][] = Array(tamanhoGrade)
      .fill(null)
      .map(() => Array(tamanhoGrade).fill(""))

    // Coloca a primeira palavra no centro da grade (horizontal)
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

    // Preenche a grade com a primeira palavra
    for (let i = 0; i < primeiraPalavra.palavra.length; i++) {
      grade[linhaCentral][colunaCentral + i] = primeiraPalavra.palavra[i]
    }

    // Tenta posicionar as outras palavras
    for (let i = 1; i < Math.min(palavras.length, 10); i++) {
      const palavra = palavras[i]
      const melhorPosicao = encontrarMelhorPosicao(palavra.palavra, grade, palavrasPosicionadas)

      if (melhorPosicao) {
        palavrasPosicionadas.push({
          ...palavra,
          ...melhorPosicao,
          numero: i + 1,
        })

        // Preenche a grade com a nova palavra
        for (let j = 0; j < palavra.palavra.length; j++) {
          if (melhorPosicao.direcao === "horizontal") {
            grade[melhorPosicao.linha][melhorPosicao.coluna + j] = palavra.palavra[j]
          } else {
            grade[melhorPosicao.linha + j][melhorPosicao.coluna] = palavra.palavra[j]
          }
        }
      }
    }

    // Cria grade de números para as palavras
    const gradeNumeros: number[][] = Array(tamanhoGrade)
      .fill(null)
      .map(() => Array(tamanhoGrade).fill(0))

    palavrasPosicionadas.forEach((palavra) => {
      gradeNumeros[palavra.linha][palavra.coluna] = palavra.numero
    })

    // Cria o código de substituição com seed fixo
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

    // Codifica a grade
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

    // Tenta todas as posições possíveis
    for (let linha = 0; linha < tamanhoGrade; linha++) {
      for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
        // Tenta horizontal
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

        // Tenta vertical
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

    // Retorna a posição com mais interseções
    if (possibilidades.length === 0) return null

    possibilidades.sort((a, b) => b.intersecoes - a.intersecoes)
    return possibilidades[0]
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
            // Só permite adjacência se for na direção da palavra
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

  return (
    <div className="space-y-8">
      {/* Header do Jogo */}
      <GameHeader 
        concluido
        temaAtual={temaAtual}
        tempoAtual={tempoAtual}
        melhorTempo={melhorTempo}
        letrasReveladas={letrasReveladas}
        dicasReveladas={dicasReveladas}
        proximoDesafio={proximoDesafio}
        sequencia={sequencia}
        pontuacao={pontuacao}
        progresso={progresso}
      />

      {/* Tabs */}
      <GameTabs 
        codigo={codigo}
        codigoUsuario={codigoUsuario}
        setCodigoUsuario={setCodigoUsuario}
        concluido
        dicasReveladas={dicasReveladas}
        setDicasReveladas={setDicasReveladas}
        grade={grade}
        gradeNumeros={gradeNumeros}
        letrasReveladas={letrasReveladas}
        setLetrasReveladas={setLetrasReveladas}
        palavrasPosicionadas={palavrasPosicionadas}
      />

      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="9380851329"
      />
    </div>
  )
}
