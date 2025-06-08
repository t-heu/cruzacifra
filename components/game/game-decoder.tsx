"use client"

import { Lightbulb, RotateCcw } from "lucide-react"
import { LIMITE_LETRAS_REVELADAS } from "@/utils/config"

interface GameDecoderProps {
  codigo: Record<string, string>
  codigoUsuario: Record<string, string>
  letrasReveladas: string[]
  concluido: boolean
  revelarLetra: () => void
  atualizarCodigoUsuario: (letraCodificada: string, letraDecodificada: string) => void
  setCodigoUsuario: (codigo: Record<string, string>) => void
}

export function GameDecoder({
  codigo,
  codigoUsuario,
  letrasReveladas,
  concluido,
  revelarLetra,
  atualizarCodigoUsuario,
  setCodigoUsuario,
}: GameDecoderProps) {
  const letrasCodificadas = Object.keys(codigo).sort()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Decodificador</h3>
        <p className="text-gray-400">Substitua as letras codificadas pelas originais</p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
        {letrasCodificadas.map((letraCodificada) => {
          const estaCorreto =
            codigoUsuario[letraCodificada] && codigo[letraCodificada] === codigoUsuario[letraCodificada]
          const estaIncorreto =
            codigoUsuario[letraCodificada] && codigo[letraCodificada] !== codigoUsuario[letraCodificada]
          const foiRevelada = letrasReveladas.includes(letraCodificada)

          return (
            <div key={letraCodificada} className="flex flex-col items-center">
              <div className="text-sm font-medium mb-2 text-gray-300">{letraCodificada}</div>
              <input
                type="text"
                value={codigoUsuario[letraCodificada] || ""}
                onChange={(e) => atualizarCodigoUsuario(letraCodificada, e.target.value)}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-colors ${
                  estaCorreto
                    ? foiRevelada
                      ? "border-yellow-500 bg-yellow-900/30 text-yellow-300"
                      : "border-green-500 bg-green-900/30 text-green-300"
                    : estaIncorreto
                      ? "border-red-500 bg-red-900/30 text-red-300"
                      : "border-gray-600 bg-gray-800 text-white"
                }`}
                maxLength={1}
                disabled={concluido}
              />
              {foiRevelada && <div className="text-xs text-yellow-400 mt-1 font-medium">Revelada</div>}
            </div>
          )
        })}
      </div>

      {!concluido && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={revelarLetra}
              disabled={letrasReveladas.length >= LIMITE_LETRAS_REVELADAS}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                letrasReveladas.length >= LIMITE_LETRAS_REVELADAS
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700 border border-yellow-500"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Revelar letra ({LIMITE_LETRAS_REVELADAS - letrasReveladas.length} restantes)</span>
            </button>

            <button
              onClick={() => setCodigoUsuario({})}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar tudo</span>
            </button>
          </div>

          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-gray-700 rounded-full">
              <span className="text-sm text-gray-400">
                Letras reveladas: {letrasReveladas.length}/{LIMITE_LETRAS_REVELADAS}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
