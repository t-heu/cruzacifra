"use client"

import { useEffect, useState } from "react"
import { Clock, HelpCircle, RefreshCw, Trophy } from "lucide-react"

import {renderGrid} from "../components/grid";
import {renderDecoder} from "../components/decoder";
import {renderTips} from "../components/tips";
import AdBanner from "../components/AdBanner";
import Footer from "../components/footer";
import HowToPlayModal from "../components/how-to-play-modal";
import VictoryOrLose from "../components/victory-or-lose";

import {generateWordCrosswords} from "../utils/generateWordCrosswords";
import {generateRandomChallenge} from "../utils/generateRandomChallenge ";

import {Challenge} from "./interfaces";

import challengesRaw from "../challenges.json";

const CHALLENGES: Challenge[] = challengesRaw.map(challenge => ({
  ...challenge,
  words: challenge.words.map(p => ({
    ...p,
    direction: (p.direction === "horizontal" || p.direction === "vertical") ? p.direction : "horizontal",
  })),
}));

// Alfabeto para codificação
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function Page() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [grid, setGrid] = useState<string[][]>([])
  const [code, setCode] = useState<Record<string, string>>({})
  const [codeUser, setCodeUser] = useState<Record<string, string>>({})
  const [tipsRevealed, setTipsRevealed] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)
  const [victoryStatus, setVictoryStatus] = useState<'win' | 'lose' | null>(null)
  const [score, setScore] = useState(0)
  const [timeStart, setTimeStart] = useState(0)
  const [nextChallenge, setNextChallenge] = useState("")
  const [progress, setProgress] = useState(0)
  const [tabActive, setTabActive] = useState("jogo")
  const [showHowToPlay, setShowHowToPlay]= useState(false)
  const [lettersRevealed, setLettersRevealed] = useState(0);

  // Inicializa o jogo
  useEffect(() => {
    const hoje = new Date()
    const diaDoAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const shouldUseRandom = diaDoAno % 2 === 0;

    const desafioHoje: Challenge = shouldUseRandom
      ? generateRandomChallenge(diaDoAno)
      : CHALLENGES[diaDoAno % CHALLENGES.length];

    // Verifica se já jogou hoje
    const ultimoJogo = localStorage.getItem("ultimoJogoCruzadas")
    const dataHoje = hoje.toLocaleDateString("pt-BR")
    let codeRestored: Record<string, string> = {}

    if (ultimoJogo === dataHoje) {
      // Recupera o estado do jogo de hoje
      const statusSaved = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")
      setCodeUser(statusSaved.codeUser || {})
      setTipsRevealed(statusSaved.tipsRevealed || [])
      setCompleted(statusSaved.completed || false)
      setScore(statusSaved.score || 0)
      setCode(statusSaved.code || {});
      if (statusSaved.completed) setVictoryStatus(statusSaved.results[statusSaved.results.length - 1].status)
      codeRestored = statusSaved.code || {}
    } else {
      // Novo jogo
      localStorage.setItem("ultimoJogoCruzadas", dataHoje)
      setCodeUser({})
      setTipsRevealed([])
      setCompleted(false)
      setScore(0)
      setCode({});
      setTimeStart(Date.now())

      // Salva o estado inicial
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codeUser: {},
          code: {},
          results: [],
          tipsRevealed: [],
          completed: false,
          score: 0,
        }),
      );
    }

    const { grid: novaGrade, code: novoCodigo } = gerarGradeECodigo(desafioHoje, codeRestored)
    // Configura o desafio
    setCurrentChallenge(desafioHoje)
    setGrid(novaGrade)
    setCode(novoCodigo)

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

    // Calcula o progress
    const totalLetras = Object.keys(code).length
    const letrasCorretas = Object.entries(codeUser).filter(
      ([codificada, decodificada]) => code[codificada] === decodificada,
    ).length

    const novoProgresso = totalLetras > 0 ? Math.floor((letrasCorretas / totalLetras) * 100) : 0
    setProgress(novoProgresso)

    // Verifica se completou o desafio
    const totalPreenchidos = Object.keys(codeUser).length
    const todosPreenchidos = totalPreenchidos === totalLetras
    const todasCorretas = novoProgresso === 100

    if (todasCorretas && !completed) {
      // Vitória
      setVictoryStatus('win')
      setCompleted(true)
      const tempoGasto = Math.floor((Date.now() - timeStart) / 1000)
      const pontuacaoBase = 1000
      const penalidade = (tempoGasto / 60) * 50 + tipsRevealed.length * 100
      const novaPontuacao = Math.max(100, Math.floor(pontuacaoBase - penalidade))
      setScore(novaPontuacao)
      saveGameState(true, novaPontuacao, 'win')
    } else if (todosPreenchidos && !todasCorretas && !completed) {
      // Derrota
      setVictoryStatus('lose')
      setCompleted(true)
      setScore(0)
      saveGameState(false, 0, 'lose')
    } else if (!completed) {
      saveGameState(false, 0)
    }
  }, [codeUser, currentChallenge, grid, code, completed, tipsRevealed, timeStart])

  function saveGameState(completedGame: boolean, scoreGame: number, status?: string) {
    const now = new Date();
    const todayStr = now.toLocaleDateString("pt-BR");

    const savedData = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}");
    const previousHistory = savedData.results ?? [];

    // Verifica se já existe resultado 'win' ou 'lose' salvo hoje
    const alreadySavedToday = previousHistory.some((entry: any) => {
      const entryDate = new Date(entry.date).toLocaleDateString("pt-BR");
      return entryDate === todayStr && (entry.status === 'win' || entry.status === 'lose');
    });

    const isWinOrLose = status === 'win' || status === 'lose';

    const newData: any = {
      ...savedData,
      codeUser,
      code,
      tipsRevealed,
      completed: completedGame,
      score: scoreGame,
      results: previousHistory, // padrão: não altera histórico
    };

    // Só adiciona se for win/lose e ainda não tiver salvo hoje
    if (isWinOrLose && !alreadySavedToday) {
      const newEntry = {
        score: scoreGame,
        date: now.toISOString(),
        completed: completedGame,
        status,
      };

      newData.results = [...previousHistory, newEntry];
    }

    // Salva sempre, mas só adiciona ao histórico uma vez por dia
    localStorage.setItem("estadoJogoCruzadas", JSON.stringify(newData));
  }

  // Gera a grade e o código para o desafio
  const gerarGradeECodigo = (desafio: Challenge, codigoExistente?: Record<string, string>) => {
    // Encontra o tamanho necessário para a grade
    let maxLinha = 0
    let maxColuna = 0

    const newWords = generateWordCrosswords(desafio.words)
    desafio.words = newWords;

    desafio.words.forEach((word) => {
      const comprimento = word.word.length
      if (word.direction === "horizontal") {
        maxLinha = Math.max(maxLinha, word.row + 1)
        maxColuna = Math.max(maxColuna, word.column + comprimento)
      } else {
        maxLinha = Math.max(maxLinha, word.row + comprimento)
        maxColuna = Math.max(maxColuna, word.column + 1)
      }
    })

    // Cria uma grade vazia
    const novaGrade: string[][] = Array(maxLinha)
      .fill(null)
      .map(() => Array(maxColuna).fill(""))

    // Preenche a grade com as words
    desafio.words.forEach((word) => {
      const letras = word.word.split("")
      letras.forEach((letra, index) => {
        if (word.direction === "horizontal") {
          novaGrade[word.row][word.column + index] = letra
        } else {
          novaGrade[word.row + index][word.column] = letra
        }
      })
    })

    // Cria um conjunto de letras únicas na grade
    const letrasUnicasSet = new Set<string>()
    novaGrade.forEach((row) => {
      row.forEach((letra) => {
        if (letra) letrasUnicasSet.add(letra)
      })
    })
    const letrasUnicas = Array.from(letrasUnicasSet)

    // Cria um código de substituição aleatório
    const novoCodigo: Record<string, string> = 
      codigoExistente && Object.keys(codigoExistente).length > 0
        ? codigoExistente
        : (() => {
            const codigo: Record<string, string> = {}
            const alfabetoEmbaralhado = embaralharArray([...ALPHABET])
            letrasUnicas.forEach((letra, index) => {
              codigo[alfabetoEmbaralhado[index]] = letra
            })
            return codigo
          })();
      
    // Codifica a grade
    const gradeCodificada: string[][] = novaGrade.map((row) =>
      row.map((letra) => {
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
  };

  // Revela uma tip
  const revelarDica = (index: number) => {
    if (tipsRevealed.includes(index)) return

    const novasDicasReveladas = [...tipsRevealed, index]
    setTipsRevealed(novasDicasReveladas)

    // Salva o estado
    localStorage.setItem(
      "estadoJogoCruzadas",
      JSON.stringify({
        codeUser,
        code,
        tipsRevealed: novasDicasReveladas,
        completed,
        score,
      }),
    )
  }

  // Revela uma letra do código
  const revelarLetra = () => {
    if (!currentChallenge) return
    if (lettersRevealed >= 3) return

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
    setLettersRevealed((prev) => prev + 1)
  }

  // Atualiza o código do usuário
  const atualizarCodigoUsuario = (
    letraCodificada: string,
    letraDecodificada: string
  ) => {
    setCodeUser((codeUserAtual) => {
      // Cria cópia para modificar
      const novoCodigoUsuario = { ...codeUserAtual };

      // Remove a letra decodificada de qualquer outra posição (exclui duplicados)
      Object.keys(novoCodigoUsuario).forEach((key) => {
        if (novoCodigoUsuario[key] === letraDecodificada.toUpperCase()) {
          delete novoCodigoUsuario[key];
        }
      });

      if (letraDecodificada) {
        const letraCorreta = code[letraCodificada] || "";

        // Função para remover acentos
        const removerAcentos = (str: string) =>
          str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Compara sem acento para validar
        if (
          removerAcentos(letraDecodificada.toLowerCase()) ===
          removerAcentos(letraCorreta.toLowerCase())
        ) {
          // Atualiza com a letra correta (com acento)
          novoCodigoUsuario[letraCodificada] = letraCorreta.toUpperCase();
        } else {
          // Atualiza com a letra digitada mesmo (sem acento ou erro)
          novoCodigoUsuario[letraCodificada] = letraDecodificada.toUpperCase();
        }
      } else {
        // Se letraDecodificada vazia, remove do código do usuário
        delete novoCodigoUsuario[letraCodificada];
      }

      return novoCodigoUsuario;
    });
  };

  return (
    <div className="bg-[#ebc260] min-h-screen w-full">
      <AdBanner
        dataAdFormat="auto"
        dataFullWidthResponsive={true}
        dataAdSlot="9380851329"
      />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="border rounded-lg shadow-sm p-6 mb-4 bg-white">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-semibold">Cruzacifra</h1>
            <p className="text-gray-600">
              Decifre o código para revelar as words cruzadas codificadas do dia: {currentChallenge?.title || ""}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm border border-gray-300 rounded px-2 py-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Próximo desafio em: {nextChallenge}
            </span>

            {completed && (
              <span className="text-sm border border-yellow-300 bg-green-50 rounded px-2 py-1 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                Pontuação: {score}
              </span>
            )}
          </div>

          {completed && <VictoryOrLose victoryStatus={victoryStatus} />}

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

            {tabActive === "jogo" && (
              <div className="overflow-x-auto w-full">
                <div className="min-w-max mx-auto p-2">
                  {renderGrid(grid, codeUser)}
                </div>
              </div>
            )}

            {tabActive === "decodificador" && (
              <div>
                {renderDecoder(currentChallenge, code, codeUser, atualizarCodigoUsuario, completed)}

                {!completed && (
                  <div className="flex justify-center mt-4 gap-2">      
                    {lettersRevealed === 3 ? (
                      <p className="text-sm flex items-center gap-1">
                        Letras reveladas
                      </p>
                    ):(
                      <button
                        onClick={revelarLetra}
                        className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Revelar uma letra
                      </button>
                    )}

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
        {showHowToPlay && <HowToPlayModal setShowHowToPlay={setShowHowToPlay} />}
      </div>

      <Footer />
    </div>
  )
}
