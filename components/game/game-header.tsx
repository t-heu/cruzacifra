import { Clock, Flame, Timer, CheckCircle } from "lucide-react"
import { formatarTempo } from "@/utils/time"

interface GameHeaderProps {
  temaAtual: { titulo: string } | null
  progresso: number
  tempoAtual: number
  melhorTempo: number
  sequencia: number
  proximoDesafio: string
  concluido: boolean
  pontuacao: number
  dicasReveladas: number[]
  letrasReveladas: string[]
}

export function GameHeader({
  temaAtual,
  progresso,
  tempoAtual,
  melhorTempo,
  sequencia,
  proximoDesafio,
  concluido,
  pontuacao,
  dicasReveladas,
  letrasReveladas,
}: GameHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Título do tema */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Tema: {temaAtual?.titulo || "Carregando..."}</h2>
        <p className="text-gray-400">Desafio Diário de Palavras Cruzadas</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#edc360] mb-1">{progresso}%</div>
          <div className="text-sm text-gray-400 mb-2">Progresso</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#edc360] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{formatarTempo(tempoAtual)}</div>
          <div className="text-sm text-gray-400">Tempo Atual</div>
          {melhorTempo > 0 && <div className="text-xs text-gray-500">Melhor: {formatarTempo(melhorTempo)}</div>}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-semibold text-white">{sequencia}</div>
          <div className="text-sm text-gray-400">Sequência</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <Timer className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-sm font-semibold text-white">{proximoDesafio}</div>
          <div className="text-sm text-gray-400">Próximo Desafio</div>
        </div>
      </div>

      {/* Mensagem de conclusão */}
      {concluido && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-300 mb-2">Parabéns!</h3>
          <p className="text-green-400 mb-4">Você completou o desafio de hoje!</p>
          <div className="text-lg font-bold text-green-300 mb-2">Pontuação: {pontuacao} pontos</div>
          <div className="text-sm text-green-400">
            Tempo: {formatarTempo(tempoAtual)} | Dicas: {dicasReveladas.length} | Letras: {letrasReveladas.length}
          </div>
        </div>
      )}
    </div>
  )
}
