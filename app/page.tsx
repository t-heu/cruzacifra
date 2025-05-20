"use client"

import { useEffect, useState } from "react"
import { Clock, Check, HelpCircle, RefreshCw, Trophy } from "lucide-react"

import {renderGrid} from "../components/grid";
import {renderDecoder} from "../components/decoder";
import {renderTips} from "../components/tips";

import {Challenge} from "./interfaces";

import challenges from "../challenges.json";

// Desafios diários
const CHALLENGES = challenges

// Alfabeto para codificação
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function PalavrasCruzadasCodigo() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [grid, setGrid] = useState<string[][]>([])
  //const [gradeDecodificada, setGradeDecodificada] = useState<string[][]>([])
  const [code, setCode] = useState<Record<string, string>>({})
  const [codeUser, setCodeUser] = useState<Record<string, string>>({})
  const [tipsRevealed, setTipsRevealed] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeStart, setTimeStart] = useState(0)
  const [nextChallenge, setNextChallenge] = useState("")
  const [progress, setProgress] = useState(0)
  //const [letrasUnicas, setLetrasUnicas] = useState<string[]>([])
  const [tabActive, setTabActive] = useState("jogo")
  const [showHowToPlay, setShowHowToPlay]= useState(false)

  // Inicializa o jogo
  useEffect(() => {
    const hoje = new Date()
    const diaDoAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const desafioHoje = CHALLENGES[diaDoAno % CHALLENGES.length] as Challenge;

    // Verifica se já jogou hoje
    const ultimoJogo = localStorage.getItem("ultimoJogoCruzadas")
    const dataHoje = hoje.toLocaleDateString("pt-BR")

    if (ultimoJogo === dataHoje) {
      // Recupera o estado do jogo de hoje
      const estadoSalvo = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")
      setCodeUser(estadoSalvo.codeUser || {})
      setTipsRevealed(estadoSalvo.tipsRevealed || [])
      setCompleted(estadoSalvo.completed || false)
      setScore(estadoSalvo.score || 0)
    } else {
      // Novo jogo
      localStorage.setItem("ultimoJogoCruzadas", dataHoje)
      setCodeUser({})
      setTipsRevealed([])
      setCompleted(false)
      setScore(0)
      setTimeStart(Date.now())

      // Salva o estado inicial
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codeUser: {},
          tipsRevealed: [],
          completed: false,
          score: 0,
        }),
      )
    }

    // Configura o desafio
    setCurrentChallenge(desafioHoje)
    const { grid: novaGrade, code: novoCodigo, letrasUnicas: novasLetrasUnicas } = gerarGradeECodigo(desafioHoje)
    setGrid(novaGrade)
    setCode(novoCodigo)
    //setLetrasUnicas(novasLetrasUnicas)
    atualizarGradeDecodificada(novaGrade, {})

    // Calcula quando será o próximo desafio
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    amanha.setHours(0, 0, 0, 0)
    setNextChallenge(formatarTempoRestante(amanha.getTime() - Date.now()))

    // Atualiza o contador a cada segundo
    const intervalo = setInterval(() => {
      const agora = new Date()
      const amanha = new Date()
      amanha.setDate(amanha.getDate() + 1)
      amanha.setHours(0, 0, 0, 0)
      setNextChallenge(formatarTempoRestante(amanha.getTime() - agora.getTime()))
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  // Atualiza o progress quando o código do usuário muda
  useEffect(() => {
    if (!currentChallenge) return

    atualizarGradeDecodificada(grid, codeUser)

    // Calcula o progress
    const totalLetras = Object.keys(code).length
    const letrasCorretas = Object.entries(codeUser).filter(
      ([codificada, decodificada]) => code[codificada] === decodificada,
    ).length

    const novoProgresso = totalLetras > 0 ? Math.floor((letrasCorretas / totalLetras) * 100) : 0
    setProgress(novoProgresso)

    // Verifica se completou o desafio
    if (novoProgresso === 100 && !completed) {
      setCompleted(true)
      const tempoGasto = Math.floor((Date.now() - timeStart) / 1000)
      const pontuacaoBase = 1000
      const penalidade = (tempoGasto / 60) * 50 + tipsRevealed.length * 100
      const novaPontuacao = Math.max(100, Math.floor(pontuacaoBase - penalidade))
      setScore(novaPontuacao)

      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codeUser,
          tipsRevealed,
          completed: true,
          score: novaPontuacao,
        }),
      )
    } else if (!completed) {
      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codeUser,
          tipsRevealed,
          completed: false,
          score: 0,
        }),
      )
    }
  }, [codeUser, currentChallenge, grid, code, completed, tipsRevealed, timeStart])

  // Gera a grade e o código para o desafio
  const gerarGradeECodigo = (desafio: (typeof CHALLENGES)[0]) => {
    // Encontra o tamanho necessário para a grade
    let maxLinha = 0
    let maxColuna = 0

    desafio.palavras.forEach((palavra) => {
      const comprimento = palavra.palavra.length
      if (palavra.direcao === "horizontal") {
        maxLinha = Math.max(maxLinha, palavra.linha + 1)
        maxColuna = Math.max(maxColuna, palavra.coluna + comprimento)
      } else {
        maxLinha = Math.max(maxLinha, palavra.linha + comprimento)
        maxColuna = Math.max(maxColuna, palavra.coluna + 1)
      }
    })

    // Cria uma grade vazia
    const novaGrade: string[][] = Array(maxLinha)
      .fill(null)
      .map(() => Array(maxColuna).fill(""))

    // Preenche a grade com as palavras
    desafio.palavras.forEach((palavra) => {
      const letras = palavra.palavra.split("")
      letras.forEach((letra, index) => {
        if (palavra.direcao === "horizontal") {
          novaGrade[palavra.linha][palavra.coluna + index] = letra
        } else {
          novaGrade[palavra.linha + index][palavra.coluna] = letra
        }
      })
    })

    // Cria um conjunto de letras únicas na grade
    const letrasUnicasSet = new Set<string>()
    novaGrade.forEach((linha) => {
      linha.forEach((letra) => {
        if (letra) {
          letrasUnicasSet.add(letra)
        }
      })
    })
    const letrasUnicas = Array.from(letrasUnicasSet)

    // Cria um código de substituição aleatório
    const novoCodigo: Record<string, string> = {}
    const alfabetoEmbaralhado = embaralharArray([...ALPHABET])

    letrasUnicas.forEach((letra, index) => {
      novoCodigo[alfabetoEmbaralhado[index]] = letra
    })

    // Codifica a grade
    const gradeCodificada: string[][] = novaGrade.map((linha) =>
      linha.map((letra) => {
        if (!letra) return ""
        const letraCodificada = Object.keys(novoCodigo).find((key) => novoCodigo[key] === letra) || ""
        return letraCodificada
      }),
    )

    return {
      grid: gradeCodificada,
      code: novoCodigo,
      letrasUnicas,
    }
  }

  // Atualiza a grade decodificada com base no código do usuário
  const atualizarGradeDecodificada = (gradeCodificada: string[][], codeUser: Record<string, string>) => {
    const novaGradeDecodificada = gradeCodificada.map((linha) =>
      linha.map((letraCodificada) => {
        if (!letraCodificada) return ""
        return codeUser[letraCodificada] || ""
      }),
    )

    //setGradeDecodificada(novaGradeDecodificada)
  }

  // Embaralha um array
  const embaralharArray = <T,>(array: T[]): T[] => {
    const novoArray = [...array]
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
    }
    return novoArray
  }

  // Formata o tempo restante para o próximo desafio
  const formatarTempoRestante = (ms: number) => {
    const segundos = Math.floor((ms / 1000) % 60)
    const minutos = Math.floor((ms / (1000 * 60)) % 60)
    const horas = Math.floor((ms / (1000 * 60 * 60)) % 24)

    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`
  }

  // Revela uma dica
  const revelarDica = (index: number) => {
    if (tipsRevealed.includes(index)) return

    const novasDicasReveladas = [...tipsRevealed, index]
    setTipsRevealed(novasDicasReveladas)

    // Salva o estado
    localStorage.setItem(
      "estadoJogoCruzadas",
      JSON.stringify({
        codeUser,
        tipsRevealed: novasDicasReveladas,
        completed,
        score,
      }),
    )
  }

  // Revela uma letra do código
  const revelarLetra = () => {
    if (!currentChallenge) return

    // Encontra uma letra que ainda não foi revelada corretamente
    const letrasIncorretas = Object.keys(code).filter(
      (letraCodificada) =>
        !codeUser[letraCodificada] || codeUser[letraCodificada] !== code[letraCodificada],
    )

    if (letrasIncorretas.length === 0) return

    // Escolhe uma letra aleatória para revelar
    const letraParaRevelar = letrasIncorretas[Math.floor(Math.random() * letrasIncorretas.length)]
    const novoCodigoUsuario = { ...codeUser, [letraParaRevelar]: code[letraParaRevelar] }
    setCodeUser(novoCodigoUsuario)
  }

  // Atualiza o código do usuário
  const atualizarCodigoUsuario = (letraCodificada: string, letraDecodificada: string) => {
    const novoCodigoUsuario = { ...codeUser }

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

    setCodeUser(novoCodigoUsuario)
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="border rounded-lg shadow-sm p-6 mb-4">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-semibold">Palavras Cruzadas Codificadas</h1>
          <p className="text-gray-600">
            Decifre o código para revelar as palavras cruzadas do dia: {currentChallenge?.titulo || ""}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm border border-gray-300 rounded px-2 py-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Próximo desafio em: {nextChallenge}
          </span>

          {completed && (
            <span className="text-sm border border-green-300 bg-green-50 rounded px-2 py-1 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-600" />
              Pontuação: {score}
            </span>
          )}
        </div>

        {completed && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 p-3 rounded mb-4">
            <Check className="h-4 w-4 text-green-600 mt-1" />
            <div>
              <p className="font-semibold">Parabéns!</p>
              <p className="text-sm text-gray-700">Você completou o desafio de hoje!</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progresso: {progress}%</span>
            {!completed && (
              <button
                onClick={() => setShowHowToPlay(true)}
                className="text-sm px-2 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4" />
                Como jogar
              </button>
            )}
          </div>

          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="grid grid-cols-3 mb-6 border-b">
            {["jogo", "decodificador", "dicas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActive(tab)}
                className={`py-2 text-sm border-b-2 ${
                  tabActive === tab
                    ? "border-blue-500 font-semibold"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {tabActive === "jogo" && <div className="flex justify-center">{renderGrid(grid, codeUser)}</div>}

          {tabActive === "decodificador" && (
            <div>
              {renderDecoder(currentChallenge, code, codeUser, atualizarCodigoUsuario, completed)}

              {!completed && (
                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={revelarLetra}
                    className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Revelar uma letra
                  </button>

                  <button
                    onClick={() => setCodeUser({})}
                    className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Limpar
                  </button>
                </div>
              )}
            </div>
          )}

          {tabActive === "dicas" && <div>{renderTips(currentChallenge, tipsRevealed, completed, revelarDica)}</div>}
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <div>{tipsRevealed.length} dicas reveladas</div>
          <div>{new Date().toLocaleDateString("pt-BR")}</div>
        </div>
      </div>

      {/* Modal "Como jogar" */}
      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Como jogar</h2>
            <p className="mb-2">
              Neste jogo, você precisa decifrar um código para revelar as palavras cruzadas.
            </p>
            <ol className="list-decimal pl-5 space-y-1 mb-4 text-sm text-gray-700">
              <li>Cada letra foi substituída por outra letra do alfabeto</li>
              <li>Use as dicas para tentar descobrir quais palavras estão escondidas</li>
              <li>Digite suas suposições no decodificador abaixo da grade</li>
              <li>Você pode revelar dicas ou letras se precisar de ajuda</li>
            </ol>
            <div className="text-right">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
