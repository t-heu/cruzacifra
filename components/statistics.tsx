"use client"

import { useEffect, useState } from "react"

type Estatisticas = {
  jogosCompletados: number
  pontuacaoTotal: number
  tempoTotal: number
  melhorPontuacao: number
  melhorTempo: number
  sequenciaAtual: number
  melhorSequencia: number
  dicasUsadas: number
  letrasReveladas: number
}

export default function EstatisticasComponent() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    jogosCompletados: 0,
    pontuacaoTotal: 0,
    tempoTotal: 0,
    melhorPontuacao: 0,
    melhorTempo: 0,
    sequenciaAtual: 0,
    melhorSequencia: 0,
    dicasUsadas: 0,
    letrasReveladas: 0,
  })

  const [historico, setHistorico] = useState<Array<{ data: string; pontuacao: number; tempo: number }>>([])

  useEffect(() => {
    // Pega o estado do jogo atual salvo (que você mencionou)
    const estadoSalvo = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")

    // Ajuste de variáveis conforme dados que você tem
    const pontuacaoTotal = estadoSalvo.pontuacao || 0
    const jogosCompletados = estadoSalvo.concluido ? 1 : 0 // Exemplo: só 1 jogo contado se concluído
    const tempoTotal = estadoSalvo.tempoInicio ? (Date.now() - estadoSalvo.tempoInicio) / 1000 : 0 // tempo em segundos
    const dicasUsadas = estadoSalvo.dicasReveladas ? estadoSalvo.dicasReveladas.length : 0
    const letrasReveladas = estadoSalvo.letrasReveladas ? estadoSalvo.letrasReveladas.length : 0

    // sequencia já existe com esse nome
    const sequenciaAtual = Number.parseInt(localStorage.getItem("sequenciaJogos") || "0")

    // Melhor tempo você pode manter como antes ou calcular aqui se quiser
    const melhorTempo = Number.parseInt(localStorage.getItem("melhorTempo") || "0")

    setEstatisticas({
      jogosCompletados,
      pontuacaoTotal,
      tempoTotal,
      melhorPontuacao: pontuacaoTotal, // ou outro campo, se tiver
      melhorTempo,
      sequenciaAtual,
      melhorSequencia: 0, // você pode implementar lógica para isso
      dicasUsadas,
      letrasReveladas,
    })

    // Histórico pode ser pego do localStorage, talvez "historicoJogos" não exista, adapte se necessário
    const hist = JSON.parse(localStorage.getItem("historicoJogos") || "[]")
    setHistorico(hist.slice(-10)) // Últimos 10 jogos

  }, [])

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const secs = segundos % 60

    if (horas > 0) {
      return `${horas}h ${minutos}m ${secs}s`
    } else if (minutos > 0) {
      return `${minutos}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const calcularMedia = (total: number, quantidade: number) => {
    return quantidade > 0 ? Math.round(total / quantidade) : 0
  }

  const resetarEstatisticas = () => {
    if (confirm("Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("estatisticasJogo")
      localStorage.removeItem("melhorTempo")
      localStorage.removeItem("sequenciaJogos")
      localStorage.removeItem("historicoJogos")
      setEstatisticas({
        jogosCompletados: 0,
        pontuacaoTotal: 0,
        tempoTotal: 0,
        melhorPontuacao: 0,
        melhorTempo: 0,
        sequenciaAtual: 0,
        melhorSequencia: 0,
        dicasUsadas: 0,
        letrasReveladas: 0,
      })
      setHistorico([])
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#edc360] text-[#454a3f] rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-4xl font-bold mb-2">Suas Estatísticas</h2>
        <p className="text-xl opacity-90">Acompanhe seu progresso e conquistas</p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600 mb-2">{estatisticas.jogosCompletados}</div>
          <div className="text-gray-400 font-medium">Jogos Completados</div>
          <div className="text-sm text-gray-300 mt-1">Total de desafios resolvidos</div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600 mb-2">{estatisticas.pontuacaoTotal.toLocaleString()}</div>
          <div className="text-gray-400 font-medium">Pontuação Total</div>
          <div className="text-sm text-gray-300 mt-1">Soma de todos os pontos</div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-600 mb-2">{estatisticas.sequenciaAtual}</div>
          <div className="text-gray-400 font-medium">Sequência Atual</div>
          <div className="text-sm text-gray-300 mt-1">Dias consecutivos jogando</div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center border-l-4 border-orange-500">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {estatisticas.melhorTempo > 0 ? formatarTempo(estatisticas.melhorTempo) : "N/A"}
          </div>
          <div className="text-gray-400 font-medium">Melhor Tempo</div>
          <div className="text-sm text-gray-300 mt-1">Recorde pessoal</div>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-gray-600 bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">📈 Desempenho</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300 font-medium">Pontuação Média</span>
              <span className="text-lg font-bold text-blue-600">
                {calcularMedia(estatisticas.pontuacaoTotal, estatisticas.jogosCompletados)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300 font-medium">Tempo Médio</span>
              <span className="text-lg font-bold text-green-600">
                {estatisticas.jogosCompletados > 0
                  ? formatarTempo(calcularMedia(estatisticas.tempoTotal, estatisticas.jogosCompletados))
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300 font-medium">Melhor Sequência</span>
              <span className="text-lg font-bold text-purple-600">{estatisticas.melhorSequencia} dias</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300 font-medium">Tempo Total Jogado</span>
              <span className="text-lg font-bold text-orange-600">{formatarTempo(estatisticas.tempoTotal)}</span>
            </div>
          </div>
        </div>

        <div className="border-gray-600 bg-gray-800 rounded-xl shadow-lg p-6 h-[400px] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">🏆 Conquistas</h3>
          <div className="space-y-4">
            {conquistas.map((conquista, index) => (
              <ConquistaCard
                key={index}
                titulo={conquista.titulo}
                descricao={conquista.descricao}
                icone={conquista.icone}
                ativa={conquista.condicao(estatisticas)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Histórico Recente */}
      {historico.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">📅 Histórico Recente</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pontuação</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((jogo, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{jogo.data}</td>
                    <td className="py-3 px-4 text-blue-600 font-semibold">{jogo.pontuacao}</td>
                    <td className="py-3 px-4 text-green-600">{formatarTempo(jogo.tempo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botão Reset */}
      <div className="text-center">
        <button
          onClick={resetarEstatisticas}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🗑️ Resetar Estatísticas
        </button>
      </div>
    </div>
  )
}

const conquistas = [
  {
    titulo: "Primeiro Jogo",
    descricao: "Complete seu primeiro desafio",
    icone: "🏅",
    condicao: (estatisticas: any) => estatisticas.jogosCompletados >= 1,
  },
  {
    titulo: "Uma Semana",
    descricao: "Complete 7 desafios",
    icone: "🎯",
    condicao: (estatisticas: any) => estatisticas.jogosCompletados >= 7,
  },
  {
    titulo: "Sequência de Fogo",
    descricao: "7 dias consecutivos",
    icone: "🔥",
    condicao: (estatisticas: any) => estatisticas.sequenciaAtual >= 7,
  },
  {
    titulo: "Amante dos Pontos",
    descricao: "5.000 pontos totais",
    icone: "💎",
    condicao: (estatisticas: any) => estatisticas.pontuacaoTotal >= 5000,
  },
  {
    titulo: "Mestre dos Pontos",
    descricao: "10.000 pontos totais",
    icone: "💎",
    condicao: (estatisticas: any) => estatisticas.pontuacaoTotal >= 10000,
  },
];

const ConquistaCard = ({ titulo, descricao, icone, ativa }: any) => (
  <div className={`p-4 rounded-lg border-2 ${ativa ? "bg-green-50 border-green-200" : "bg-gray-700 border-gray-500"}`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{ativa ? icone : "⭕"}</span>
      <div>
        <div className="font-semibold text-gray-300">{titulo}</div>
        <div className="text-sm text-gray-400">{descricao}</div>
      </div>
    </div>
  </div>
);
