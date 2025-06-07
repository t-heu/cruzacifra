"use client"

import { useEffect, useState } from "react"

import AdBanner from "../components/AdBanner";
import Footer from "../components/footer";
import Header from "../components/header";

import {formatarTempoRestante} from "../utils/time";

// Estrutura de uma palavra
type PalavraItem = {
  palavra: string
  dica: string
}

// Estrutura de uma palavra posicionada na grade
type PalavraPosicionada = {
  palavra: string
  dica: string
  linha: number
  coluna: number
  direcao: "horizontal" | "vertical"
  numero: number
}

// Conjuntos de palavras por tema (um tema por dia)
const TEMAS_PALAVRAS: { titulo: string; palavras: PalavraItem[] }[] = [
  {
    titulo: "Animais",
    palavras: [
      { palavra: "GATO", dica: "Animal doméstico que mia" },
      { palavra: "CACHORRO", dica: "Melhor amigo do homem" },
      { palavra: "PEIXE", dica: "Animal aquático" },
      { palavra: "COBRA", dica: "Réptil sem pernas" },
      { palavra: "TIGRE", dica: "Felino com listras" },
      { palavra: "RATO", dica: "Pequeno roedor" },
      { palavra: "URSO", dica: "Grande mamífero peludo" },
    ],
  },
  {
    titulo: "Frutas",
    palavras: [
      { palavra: "BANANA", dica: "Fruta amarela alongada" },
      { palavra: "MORANGO", dica: "Fruta vermelha pequena" },
      { palavra: "MELANCIA", dica: "Fruta grande com interior vermelho" },
      { palavra: "ABACAXI", dica: "Fruta tropical com casca áspera" },
      { palavra: "UVA", dica: "Fruta usada para fazer vinho" },
      { palavra: "MANGA", dica: "Fruta tropical doce" },
      { palavra: "PERA", dica: "Fruta em formato de gota" },
    ],
  },
  {
    titulo: "Países",
    palavras: [
      { palavra: "BRASIL", dica: "País do samba e futebol" },
      { palavra: "JAPAO", dica: "País do sol nascente" },
      { palavra: "CANADA", dica: "País da folha de bordo" },
      { palavra: "ITALIA", dica: "País da pizza e macarrão" },
      { palavra: "EGITO", dica: "País das pirâmides" },
      { palavra: "FRANCA", dica: "País da Torre Eiffel" },
      { palavra: "CHINA", dica: "País da Grande Muralha" },
    ],
  },
  {
    titulo: "Profissões",
    palavras: [
      { palavra: "MEDICO", dica: "Profissional da saúde" },
      { palavra: "PROFESSOR", dica: "Ensina em escolas" },
      { palavra: "ENGENHEIRO", dica: "Projeta construções" },
      { palavra: "COZINHEIRO", dica: "Prepara alimentos" },
      { palavra: "PILOTO", dica: "Conduz aviões" },
      { palavra: "ARTISTA", dica: "Cria obras de arte" },
      { palavra: "DENTISTA", dica: "Cuida dos dentes" },
    ],
  },
  {
    titulo: "Cores",
    palavras: [
      { palavra: "AZUL", dica: "Cor do céu" },
      { palavra: "VERMELHO", dica: "Cor do sangue" },
      { palavra: "VERDE", dica: "Cor da grama" },
      { palavra: "AMARELO", dica: "Cor do sol" },
      { palavra: "ROXO", dica: "Mistura de azul e vermelho" },
      { palavra: "LARANJA", dica: "Cor da fruta cítrica" },
      { palavra: "ROSA", dica: "Cor da flor romântica" },
    ],
  },
]

// Alfabeto para codificação
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

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
    }

    // Configura o tema
    setTemaAtual(temaHoje)
    const resultado = montarPalavrasCruzadas(temaHoje.palavras)
    setPalavrasPosicionadas(resultado.palavras)
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
  }, [codigoUsuario, codigo, concluido, dicasReveladas, tempoInicio])

  // Algoritmo para montar palavras cruzadas automaticamente
  const montarPalavrasCruzadas = (palavrasOriginais: PalavraItem[]) => {
    // Ordena palavras por tamanho (maiores primeiro para melhor encaixe)
    const palavras = [...palavrasOriginais].sort((a, b) => b.palavra.length - a.palavra.length)

    const palavrasPosicionadas: PalavraPosicionada[] = []
    const tamanhoGrade = 20 // Grade 20x20
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
    for (let i = 1; i < Math.min(palavras.length, 8); i++) {
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

    // Cria o código de substituição
    const letrasUnicas = new Set<string>()
    grade.forEach((linha) => {
      linha.forEach((letra) => {
        if (letra) letrasUnicas.add(letra)
      })
    })

    const codigo: Record<string, string> = {}
    const alfabetoEmbaralhado = embaralharArray([...ALFABETO])
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

  // Embaralha um array
  const embaralharArray = <T,>(array: T[]): T[] => {
    const novoArray = [...array]
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
    }
    return novoArray
  }

  // Revela uma dica
  const revelarDica = (index: number) => {
    if (dicasReveladas.includes(index)) return

    const novasDicasReveladas = [...dicasReveladas, index]
    setDicasReveladas(novasDicasReveladas)
  }

  // Revela uma letra do código
  const revelarLetra = () => {
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
        <div className="grid gap-1 w-full" style={{ gridTemplateColumns: `repeat(${maxColuna - minColuna + 1}, minmax(0, 1fr))` }}>
          {gradeVisivel.map((linha, linhaIndex) =>
            linha.map((celula, colunaIndex) => (
              <div
                key={`${linhaIndex}-${colunaIndex}`}
                className={`relative aspect-square border-2 flex flex-col items-center justify-center font-bold
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
            )),
          )}
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
        <Header progresso={progresso} pontuacao={pontuacao} proximoDesafio={proximoDesafio} temaAtual={temaAtual} concluido={concluido} />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
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
                {palavrasPosicionadas.map((palavra, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded">
                          {palavra.numero}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {palavra.direcao === "horizontal" ? "→" : "↓"}
                        </span>
                      </div>
                      {dicasReveladas.includes(index) ? (
                        <span className="text-gray-800">{palavra.dica}</span>
                      ) : (
                        <span className="text-gray-400">Dica oculta</span>
                      )}
                    </div>
                    {!dicasReveladas.includes(index) && !concluido && (
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
