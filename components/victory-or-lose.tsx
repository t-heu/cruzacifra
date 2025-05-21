"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react";

type victoryOrLoseProps = {
  victoryStatus: 'win' | 'lose' | null;
};

type Result = {
  score: number;
  completed: boolean;
  date: string;
  status: 'win' | 'lose';
};

const VictoryOrLose = ({ victoryStatus }: victoryOrLoseProps) => {
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    const statusSaved = JSON.parse(localStorage.getItem("estadoJogoCruzadas") || "{}")
    setResults(statusSaved.results || [])
  },[]);

  const totalPartidas = results.length;
  const victories = results.filter(r => r.status === 'win').length;
  const defeats = results.filter(r => r.status === 'lose').length;

  // % de vitórias em relação às partidas completas (completed)
  const completedGames = results.filter(r => r.completed);
  const winPercentage = completedGames.length > 0
    ? Math.round(victories / completedGames.length * 100)
    : 0;

  // cálculo da maior sequência de vitórias atual (contando da última partida para trás)
  let currentWinStreak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].status === 'win') currentWinStreak++;
    else break;
  }

  const renderStats = (
    <div className="text-sm text-gray-700 mb-4 whitespace-pre-line">
      {totalPartidas} {totalPartidas === 1 ? 'jogo' : 'jogos'}
      {'\n'}
      {winPercentage}% de vitórias
      {'\n'}
      {currentWinStreak} sequência{currentWinStreak === 1 ? '' : 's'} de vitórias
      {'\n'}
      {victories} vitória{victories === 1 ? '' : 's'}
      {'\n'}
      {defeats} derrota{defeats === 1 ? '' : 's'}
    </div>
  );

  return (
    <>
      {victoryStatus === 'win' && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 p-3 rounded mb-4">
          <Check className="h-4 w-4 text-green-600 mt-1" />
          <div>
            <p className="font-semibold">Parabéns!</p>
            <p className="text-sm text-gray-700">Você completou o desafio de hoje!</p>
            {renderStats}
          </div>
        </div>
      )}

      {victoryStatus === 'lose' && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-3 rounded mb-4">
          💀
          <div>
            <p className="font-semibold">Desafio não completado</p>
            <p className="text-sm text-gray-700">Você usou todas as letras, mas não concluiu o desafio.</p>
            {renderStats}
          </div>
        </div>
      )}
    </>
  );
};

export default VictoryOrLose;