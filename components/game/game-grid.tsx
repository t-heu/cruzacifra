import { Smartphone } from "lucide-react"

interface GameGridProps {
  grade: string[][]
  gradeNumeros: number[][]
  codigo: Record<string, string>
  codigoUsuario: Record<string, string>
}

export function GameGrid({ grade, gradeNumeros, codigo, codigoUsuario }: GameGridProps) {
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

  const numColunas = maxColuna - minColuna + 1

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Grade de Palavras Cruzadas</h3>
        <p className="text-gray-400">
          Cada letra foi substituída por outra. Use o decodificador para revelar as palavras!
        </p>
      </div>

      <div className="w-full overflow-auto">
        <div className="flex justify-center min-w-fit px-4">
          <div
            className="grid gap-1 p-4 bg-gray-700 rounded-lg mx-auto"
            style={{
              gridTemplateColumns: `repeat(${numColunas}, 1fr)`,
              minWidth: `${numColunas * 3}rem`,
            }}
          >
            {gradeVisivel.map((linha, linhaIndex) =>
              linha.map((celula, colunaIndex) => (
                <div
                  key={`${linhaIndex}-${colunaIndex}`}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 border flex flex-col items-center justify-center text-sm font-medium transition-colors ${
                    celula.letra ? "border-gray-600 bg-gray-800 hover:bg-gray-750" : "border-gray-600 bg-gray-800"
                  }`}
                >
                  {celula.numero > 0 && (
                    <div className="absolute top-[2px] left-[2px] text-xs text-blue-400 font-semibold leading-none mb-1">{celula.numero}</div>
                  )}
                  {celula.letra && (
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-400 mb-1">{celula.letra}</div>
                      <div
                        className={`text-sm font-semibold ${
                          codigoUsuario[celula.letra]
                            ? codigo[celula.letra] === codigoUsuario[celula.letra]
                              ? "text-green-400"
                              : "text-red-400"
                            : "text-blue-800"
                        }`}
                      >
                        {codigoUsuario[celula.letra] || "?"}
                      </div>
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      </div>

      <div className="text-center sm:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/20 rounded-lg border border-blue-700">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <p className="text-sm text-blue-300">Deslize para ver toda a grade</p>
        </div>
      </div>
    </div>
  )
}
