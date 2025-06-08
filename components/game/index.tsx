"use client"

import { useState } from "react"

import AdBanner from "@/components/ad-banner";

import { GameHeader } from "./game-header"
import { GameTabs } from "./game-tabs"
import { GameGrid } from "./game-grid"
import { GameDecoder } from "./game-decoder"
import { GameHints } from "./game-hints"
import { useGameLogic } from "@/hooks/use-game-logic"

export default function Game() {
  const {
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
  } = useGameLogic()

  const [abaSelecionada, setAbaSelecionada] = useState("jogo")

  return (
    <div className="space-y-6">
      {/* Header do Jogo */}
      <GameHeader
        temaAtual={temaAtual}
        progresso={progresso}
        tempoAtual={tempoAtual}
        melhorTempo={melhorTempo}
        sequencia={sequencia}
        proximoDesafio={proximoDesafio}
        concluido={concluido}
        pontuacao={pontuacao}
        dicasReveladas={dicasReveladas}
        letrasReveladas={letrasReveladas}
      />

      {/* Tabs */}
      <GameTabs abaSelecionada={abaSelecionada} setAbaSelecionada={setAbaSelecionada} />

      {/* Conteúdo das Tabs */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6">
          {abaSelecionada === "jogo" && (
            <GameGrid grade={grade} gradeNumeros={gradeNumeros} codigo={codigo} codigoUsuario={codigoUsuario} />
          )}

          {abaSelecionada === "decodificador" && (
            <GameDecoder
              codigo={codigo}
              codigoUsuario={codigoUsuario}
              letrasReveladas={letrasReveladas}
              concluido={concluido}
              revelarLetra={revelarLetra}
              atualizarCodigoUsuario={atualizarCodigoUsuario}
              setCodigoUsuario={setCodigoUsuario}
            />
          )}

          {abaSelecionada === "dicas" && (
            <GameHints
              palavrasPosicionadas={palavrasPosicionadas}
              dicasReveladas={dicasReveladas}
              concluido={concluido}
              revelarDica={revelarDica}
              mostrarCuriosidade={mostrarCuriosidade}
              setMostrarCuriosidade={setMostrarCuriosidade}
            />
          )}
        </div>

        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="9380851329"
        />
      </div>
    </div>
  )
}
