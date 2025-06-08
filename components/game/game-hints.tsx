"use client"

import { ArrowRight, ArrowDown, Eye, HelpCircle } from "lucide-react"
import { LIMITE_DICAS } from "@/utils/config"
import type { PalavraPosicionada } from "@/interfaces/types"

interface GameHintsProps {
  palavrasPosicionadas: PalavraPosicionada[]
  dicasReveladas: number[]
  concluido: boolean
  revelarDica: (index: number) => void
  mostrarCuriosidade: number | null
  setMostrarCuriosidade: (index: number | null) => void
}

export function GameHints({
  palavrasPosicionadas,
  dicasReveladas,
  concluido,
  revelarDica,
  mostrarCuriosidade,
  setMostrarCuriosidade,
}: GameHintsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Dicas das Palavras</h3>
        <p className="text-gray-400">Revele dicas para ajudar a decifrar o código (máximo {LIMITE_DICAS} dicas)</p>
      </div>

      <div className="space-y-4">
        {palavrasPosicionadas.map((palavra, index) => (
          <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded">
                    {palavra.numero}
                  </span>
                  {palavra.direcao === "horizontal" ? (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {dicasReveladas.includes(index) ? palavra.dica : "Dica oculta"}
                  </div>
                  {dicasReveladas.includes(index) && (
                    <div className="text-sm text-gray-400">
                      <span className="text-blue-400">Categoria:</span> {palavra.categoria} |{" "}
                      <span className="text-[#edc360]">Dificuldade:</span>{" "}
                      <span
                        className={`font-medium ${
                          palavra.dificuldade === "facil"
                            ? "text-green-400"
                            : palavra.dificuldade === "medio"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {palavra.dificuldade}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {!dicasReveladas.includes(index) && !concluido && (
                  <button
                    onClick={() => revelarDica(index)}
                    disabled={dicasReveladas.length >= LIMITE_DICAS}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      dicasReveladas.length >= LIMITE_DICAS
                        ? "bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 border border-blue-500"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Revelar
                  </button>
                )}

                {dicasReveladas.includes(index) && palavra.curiosidade && (
                  <button
                    onClick={() => setMostrarCuriosidade(mostrarCuriosidade === index ? null : index)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-[#edc360] text-[#454a3f] hover:bg-[#edc360]/80 border border-[#edc360] transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {mostrarCuriosidade === index ? "Ocultar" : "Curiosidade"}
                  </button>
                )}
              </div>
            </div>

            {mostrarCuriosidade === index && palavra.curiosidade && (
              <div className="bg-[#edc360] border border-[#edc360] rounded-lg p-4 mt-3">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-[#454a3f] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-[#454a3f] mb-1">Você sabia?</h4>
                    <p className="text-[#454a3f] text-sm leading-relaxed">{palavra.curiosidade}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {dicasReveladas.length >= LIMITE_DICAS && !concluido && (
        <div className="text-center">
          <div className="inline-block bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-300 font-medium mb-1">Você usou todas as {LIMITE_DICAS} dicas disponíveis!</p>
            <p className="text-yellow-400 text-sm">
              Continue tentando decifrar o código com as informações que você tem.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
