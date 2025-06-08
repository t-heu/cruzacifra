"use client"

import { useEffect, useState } from "react"
import { TEMAS_PALAVRAS, LIMITE_DICAS, LIMITE_LETRAS_REVELADAS } from "@/utils/config"
import type { PalavraPosicionada } from "@/interfaces/types"
import { montarPalavrasCruzadas } from "@/utils/crossword-generator"
import { formatarTempoRestante } from "@/utils/time"

export function useGameLogic() {
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
  const [mostrarCuriosidade, setMostrarCuriosidade] = useState<number | null>(null)

  // Inicializa o jogo
  useEffect(() => {
    const hoje = new Date()
    const diaDoAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const temaHoje = TEMAS_PALAVRAS[diaDoAno % TEMAS_PALAVRAS.length]

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

      const jogoSalvo = JSON.parse(localStorage.getItem("jogoAtualCruzadas") || "{}")
      if (jogoSalvo.codigo && jogoSalvo.grade) {
        setCodigo(jogoSalvo.codigo)
        setGrade(jogoSalvo.grade)
        setGradeNumeros(jogoSalvo.gradeNumeros)
        setPalavrasPosicionadas(jogoSalvo.palavrasPosicionadas)
      } else {
        const resultado = montarPalavrasCruzadas(temaHoje.palavras)
        setPalavrasPosicionadas(resultado.palavras)
        setGrade(resultado.grade)
        setGradeNumeros(resultado.gradeNumeros)
        setCodigo(resultado.codigo)

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

      const ultimaSequencia = Number.parseInt(localStorage.getItem("sequenciaJogos") || "0")
      const novaSequencia = ultimaSequencia + 1
      setSequencia(novaSequencia)
      localStorage.setItem("sequenciaJogos", novaSequencia.toString())

      const resultado = montarPalavrasCruzadas(temaHoje.palavras)
      setPalavrasPosicionadas(resultado.palavras)
      setGrade(resultado.grade)
      setGradeNumeros(resultado.gradeNumeros)
      setCodigo(resultado.codigo)

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

    const melhorTempoSalvo = Number.parseInt(localStorage.getItem("melhorTempo") || "0")
    setMelhorTempo(melhorTempoSalvo)
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

  // Atualiza o progresso
  useEffect(() => {
    if (!codigo || Object.keys(codigo).length === 0) return

    const totalLetras = Object.keys(codigo).length
    const letrasCorretas = Object.entries(codigoUsuario).filter(
      ([codificada, decodificada]) => codigo[codificada] === decodificada,
    ).length

    const novoProgresso = totalLetras > 0 ? Math.floor((letrasCorretas / totalLetras) * 100) : 0
    setProgresso(novoProgresso)

    if (novoProgresso === 100 && !concluido && tempoInicio > 0) {
      setConcluido(true)
      const tempoGasto = Math.floor((Date.now() - tempoInicio) / 1000)
      const pontuacaoBase = 1000
      const bonusSequencia = sequencia * 50
      const penalidade = (tempoGasto / 60) * 30 + dicasReveladas.length * 80 + letrasReveladas.length * 100
      const novaPontuacao = Math.max(100, Math.floor(pontuacaoBase + bonusSequencia - penalidade))
      setPontuacao(novaPontuacao)

      if (melhorTempo === 0 || tempoGasto < melhorTempo) {
        setMelhorTempo(tempoGasto)
        localStorage.setItem("melhorTempo", tempoGasto.toString())
      }

      const estatisticas = JSON.parse(localStorage.getItem("estatisticasJogo") || "{}")
      estatisticas.jogosCompletados = (estatisticas.jogosCompletados || 0) + 1
      estatisticas.pontuacaoTotal = (estatisticas.pontuacaoTotal || 0) + novaPontuacao
      estatisticas.tempoTotal = (estatisticas.tempoTotal || 0) + tempoGasto
      estatisticas.dicasUsadas = (estatisticas.dicasUsadas || 0) + dicasReveladas.length
      estatisticas.letrasReveladas = (estatisticas.letrasReveladas || 0) + letrasReveladas.length
      localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticas))

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

  const revelarDica = (index: number) => {
    if (dicasReveladas.includes(index) || dicasReveladas.length >= LIMITE_DICAS) return
    setDicasReveladas([...dicasReveladas, index])
  }

  const revelarLetra = () => {
    if (letrasReveladas.length >= LIMITE_LETRAS_REVELADAS) return

    const letrasIncorretas = Object.keys(codigo).filter(
      (letraCodificada) =>
        !codigoUsuario[letraCodificada] ||
        (codigoUsuario[letraCodificada] !== codigo[letraCodificada] && !letrasReveladas.includes(letraCodificada)),
    )

    if (letrasIncorretas.length === 0) return

    const letraParaRevelar = letrasIncorretas[Math.floor(Math.random() * letrasIncorretas.length)]
    const novoCodigoUsuario = { ...codigoUsuario, [letraParaRevelar]: codigo[letraParaRevelar] }
    setCodigoUsuario(novoCodigoUsuario)
    setLetrasReveladas([...letrasReveladas, letraParaRevelar])
  }

  const atualizarCodigoUsuario = (letraCodificada: string, letraDecodificada: string) => {
    const novoCodigoUsuario = { ...codigoUsuario }

    Object.keys(novoCodigoUsuario).forEach((key) => {
      if (novoCodigoUsuario[key] === letraDecodificada) {
        delete novoCodigoUsuario[key]
      }
    })

    if (letraDecodificada) {
      novoCodigoUsuario[letraCodificada] = letraDecodificada.toUpperCase()
    } else {
      delete novoCodigoUsuario[letraCodificada]
    }

    setCodigoUsuario(novoCodigoUsuario)
  }

  return {
    temaAtual,
    palavrasPosicionadas,
    grade,
    gradeNumeros,
    codigo,
    codigoUsuario,
    dicasReveladas,
    letrasReveladas,
    concluido,
    pontuacao,
    proximoDesafio,
    progresso,
    sequencia,
    melhorTempo,
    tempoAtual,
    revelarDica,
    revelarLetra,
    atualizarCodigoUsuario,
    setCodigoUsuario,
    mostrarCuriosidade,
    setMostrarCuriosidade,
  }
}
