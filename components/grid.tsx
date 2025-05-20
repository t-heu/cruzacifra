// Renderiza a grade de palavras cruzadas
export const renderGrid = (grid: string[][], codeUser: Record<string, string>) => {
  if (!grid.length) return null

  return (
    <div className="grid gap-1 mb-4 justify-center">
      {grid.map((linha, linhaIndex) => (
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
                    className={`text-base ${codeUser[letraCodificada] ? "text-blue-600" : "text-transparent"}`}
                  >
                    {codeUser[letraCodificada] || "."}
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
