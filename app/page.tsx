"use client"

import { useEffect, useState } from "react"
import { Clock, Check, HelpCircle, RefreshCw, Trophy } from "lucide-react"
import challenges from "../challenges.json";

// Desafios diários
const DESAFIOS = challenges

// Alfabeto para codificação
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function PalavrasCruzadasCodigo() {
  const [desafioAtual, setDesafioAtual] = useState<(typeof DESAFIOS)[0] | null>(null)
  const [grade, setGrade] = useState<string[][]>([])
  const [gradeDecodificada, setGradeDecodificada] = useState<string[][]>([])
  const [codigo, setCodigo] = useState<Record<string, string>>({})
  const [codigoUsuario, setCodigoUsuario] = useState<Record<string, string>>({})
  const [dicasReveladas, setDicasReveladas] = useState<number[]>([])
  const [concluido, setConcluido] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)
  const [tempoInicio, setTempoInicio] = useState(0)
  const [proximoDesafio, setProximoDesafio] = useState("")
  const [progresso, setProgresso] = useState(0)
  const [letrasUnicas, setLetrasUnicas] = useState<string[]>([])
  const [tabAtiva, setTabAtiva] = useState("jogo")

  const [mostrarComoJogar, setMostrarComoJogar]= useState(false)

  // Inicializa o jogo
  useEffect(() => {
    const hoje = new Date()
    const diaDoAno = Math.floor(
      (hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const desafioHoje = DESAFIOS[diaDoAno % DESAFIOS.length]

    // Verifica se já jogou hoje
    const ultimoJogo = localStorage.getItem("ultimoJogoCruzadas")
    const dataHoje = hoje.toLocaleDateString("pt-BR")

    if (ultimoJogo === dataHoje) {
      // Recupera o estado do jogo de hoje
      const estadoSalvo = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")
      setCodigoUsuario(estadoSalvo.codigoUsuario || {})
      setDicasReveladas(estadoSalvo.dicasReveladas || [])
      setConcluido(estadoSalvo.concluido || false)
      setPontuacao(estadoSalvo.pontuacao || 0)
    } else {
      // Novo jogo
      localStorage.setItem("ultimoJogoCruzadas", dataHoje)
      setCodigoUsuario({})
      setDicasReveladas([])
      setConcluido(false)
      setPontuacao(0)
      setTempoInicio(Date.now())

      // Salva o estado inicial
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario: {},
          dicasReveladas: [],
          concluido: false,
          pontuacao: 0,
        }),
      )
    }

    // Configura o desafio
    setDesafioAtual(desafioHoje)
    const { grade: novaGrade, codigo: novoCodigo, letrasUnicas: novasLetrasUnicas } = gerarGradeECodigo(desafioHoje)
    setGrade(novaGrade)
    setCodigo(novoCodigo)
    setLetrasUnicas(novasLetrasUnicas)
    atualizarGradeDecodificada(novaGrade, {})

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
    if (!desafioAtual) return

    atualizarGradeDecodificada(grade, codigoUsuario)

    // Calcula o progresso
    const totalLetras = Object.keys(codigo).length
    const letrasCorretas = Object.entries(codigoUsuario).filter(
      ([codificada, decodificada]) => codigo[codificada] === decodificada,
    ).length

    const novoProgresso = totalLetras > 0 ? Math.floor((letrasCorretas / totalLetras) * 100) : 0
    setProgresso(novoProgresso)

    // Verifica se completou o desafio
    if (novoProgresso === 100 && !concluido) {
      setConcluido(true)
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
          concluido: true,
          pontuacao: novaPontuacao,
        }),
      )
    } else if (!concluido) {
      // Salva o estado
      localStorage.setItem(
        "estadoJogoCruzadas",
        JSON.stringify({
          codigoUsuario,
          dicasReveladas,
          concluido: false,
          pontuacao: 0,
        }),
      )
    }
  }, [codigoUsuario, desafioAtual, grade, codigo, concluido, dicasReveladas, tempoInicio])

  // Gera a grade e o código para o desafio
  const gerarGradeECodigo = (desafio: (typeof DESAFIOS)[0]) => {
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
    const alfabetoEmbaralhado = embaralharArray([...ALFABETO])

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
      grade: gradeCodificada,
      codigo: novoCodigo,
      letrasUnicas,
    }
  }

  // Atualiza a grade decodificada com base no código do usuário
  const atualizarGradeDecodificada = (gradeCodificada: string[][], codigoUsuario: Record<string, string>) => {
    const novaGradeDecodificada = gradeCodificada.map((linha) =>
      linha.map((letraCodificada) => {
        if (!letraCodificada) return ""
        return codigoUsuario[letraCodificada] || ""
      }),
    )

    setGradeDecodificada(novaGradeDecodificada)
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
    if (dicasReveladas.includes(index)) return

    const novasDicasReveladas = [...dicasReveladas, index]
    setDicasReveladas(novasDicasReveladas)

    // Salva o estado
    localStorage.setItem(
      "estadoJogoCruzadas",
      JSON.stringify({
        codigoUsuario,
        dicasReveladas: novasDicasReveladas,
        concluido,
        pontuacao,
      }),
    )
  }

  // Revela uma letra do código
  const revelarLetra = () => {
    if (!desafioAtual) return

    // Encontra uma letra que ainda não foi revelada corretamente
    const letrasIncorretas = Object.keys(codigo).filter(
      (letraCodificada) =>
        !codigoUsuario[letraCodificada] || codigoUsuario[letraCodificada] !== codigo[letraCodificada],
    )

    if (letrasIncorretas.length === 0) return

    // Escolhe uma letra aleatória para revelar
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

  // Renderiza a grade de palavras cruzadas
  const renderizarGrade = () => {
    if (!grade.length) return null

    return (
      <div className="grid gap-1 mb-4 justify-center">
        {grade.map((linha, linhaIndex) => (
          <div key={linhaIndex} className="flex gap-1">
            {linha.map((letraCodificada, colunaIndex) => (
              <div
                key={`${linhaIndex}-${colunaIndex}`}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold border ${
                  letraCodificada ? "border-gray-400 bg-white" : "border-transparent"
                }`}
              >
                {letraCodificada && (
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500">{letraCodificada}</div>
                    <div
                      className={`text-base ${codigoUsuario[letraCodificada] ? "text-blue-600" : "text-transparent"}`}
                    >
                      {codigoUsuario[letraCodificada] || "."}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  // Renderiza o decodificador
  const renderizarDecodificador = () => {
    if (!desafioAtual) return null

    // Obtém todas as letras codificadas únicas
    const letrasCodificadas = Object.keys(codigo).sort()

    return (
      <div className="grid grid-cols-5 gap-2 mb-4">
        {letrasCodificadas.map((letraCodificada) => (
          <div key={letraCodificada} className="flex flex-col items-center">
            <div className="text-lg font-bold">{letraCodificada}</div>
            <input
              type="text"
              value={codigoUsuario[letraCodificada] || ""}
              onChange={(e) => atualizarCodigoUsuario(letraCodificada, e.target.value)}
              className="w-10 h-10 text-center uppercase border-2 border-[#eee] rounded"
              maxLength={1}
              disabled={concluido}
            />
          </div>
        ))}
      </div>
    )
  }

  // Renderiza as dicas
  const renderizarDicas = () => {
    if (!desafioAtual) return null

    return (
      <div className="space-y-2 mb-4">
        <h3 className="font-medium">Dicas:</h3>
        {desafioAtual.palavras.map((palavra, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm border border-gray-300 rounded px-2 py-0.5 mr-2 bg-gray-50">
                {palavra.direcao === "horizontal" ? "→" : "↓"}
              </span>
              {dicasReveladas.includes(index) ? (
                <span>{palavra.dica}</span>
              ) : (
                <span className="text-gray-400">Dica oculta</span>
              )}
            </div>

            {!dicasReveladas.includes(index) && !concluido && (
              <button
                onClick={() => revelarDica(index)}
                className="text-sm flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Revelar
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="border rounded-lg shadow-sm p-6 mb-4">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-semibold">Palavras Cruzadas Codificadas</h1>
          <p className="text-gray-600">
            Decifre o código para revelar as palavras cruzadas do dia: {desafioAtual?.titulo || ""}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm border border-gray-300 rounded px-2 py-1 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Próximo desafio em: {proximoDesafio}
          </span>

          {concluido && (
            <span className="text-sm border border-green-300 bg-green-50 rounded px-2 py-1 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-600" />
              Pontuação: {pontuacao}
            </span>
          )}
        </div>

        {concluido && (
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
            <span className="text-sm">Progresso: {progresso}%</span>
            {!concluido && (
              <button
                onClick={() => setMostrarComoJogar(true)}
                className="text-sm px-2 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4" />
                Como jogar
              </button>
            )}
          </div>

          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${progresso}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="grid grid-cols-3 mb-6 border-b">
            {["jogo", "decodificador", "dicas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabAtiva(tab)}
                className={`py-2 text-sm border-b-2 ${
                  tabAtiva === tab
                    ? "border-blue-500 font-semibold"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {tabAtiva === "jogo" && <div className="flex justify-center">{renderizarGrade()}</div>}

          {tabAtiva === "decodificador" && (
            <div>
              {renderizarDecodificador()}

              {!concluido && (
                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={revelarLetra}
                    className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Revelar uma letra
                  </button>

                  <button
                    onClick={() => setCodigoUsuario({})}
                    className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center gap-1 hover:bg-gray-100"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Limpar
                  </button>
                </div>
              )}
            </div>
          )}

          {tabAtiva === "dicas" && <div>{renderizarDicas()}</div>}
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <div>{dicasReveladas.length} dicas reveladas</div>
          <div>{new Date().toLocaleDateString("pt-BR")}</div>
        </div>
      </div>

      {/* Modal "Como jogar" */}
      {mostrarComoJogar && (
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
                onClick={() => setMostrarComoJogar(false)}
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
