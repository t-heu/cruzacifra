"use client"

import {formatarTempo} from "@/utils/time"

export type GameTabProps = {
  dicasReveladas: number[];
  temaAtual: any;
  letrasReveladas: string[];
  progresso: number;
  sequencia: number;
  melhorTempo: number;
  tempoAtual: number;
  proximoDesafio: string;
  pontuacao: number;
  concluido: boolean;
};

const GameHeader = ({
  dicasReveladas, 
  temaAtual, 
  letrasReveladas, 
  progresso,
  concluido,
  sequencia,
  melhorTempo,
  tempoAtual,
  proximoDesafio,
  pontuacao
}: GameTabProps) => {

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">🧩 {temaAtual?.titulo || ""}</h2>
        <p className="text-xl opacity-90">Desafio Diário de Palavras Cruzadas Codificadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{progresso}%</div>
          <div className="text-sm opacity-80">Progresso</div>
          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{formatarTempo(tempoAtual)}</div>
          <div className="text-sm opacity-80">Tempo Atual</div>
          {melhorTempo > 0 && <div className="text-xs opacity-70 mt-1">Melhor: {formatarTempo(melhorTempo)}</div>}
        </div>

        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{sequencia}</div>
          <div className="text-sm opacity-80">Sequência</div>
          <div className="text-xs opacity-70 mt-1">Dias consecutivos</div>
        </div>

        <div className="bg-white/20 rounded-xl p-4 text-center">
          <div className="text-lg font-bold">{proximoDesafio}</div>
          <div className="text-sm opacity-80">Próximo Desafio</div>
        </div>
      </div>

      {concluido && (
        <div className="mt-6 bg-green-500/20 border border-green-300/50 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Parabéns!</h3>
          <p className="text-lg mb-2">Você completou o desafio de hoje!</p>
          <div className="text-xl font-bold">Pontuação: {pontuacao} pontos</div>
          <div className="text-sm opacity-80 mt-1">
            Tempo: {formatarTempo(tempoAtual)} | Dicas: {dicasReveladas.length} | Letras reveladas:{" "}
            {letrasReveladas.length}
          </div>
        </div>
      )}
    </div> 
  )
}

export default GameHeader
