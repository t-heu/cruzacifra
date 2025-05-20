import { HelpCircle } from "lucide-react"

import {Challenge} from "../app/interfaces";

// Renderiza as dicas
export const renderTips = (currentChallenge: Challenge | null, tipsRevealed: number[], completed: boolean, revelarDica: (index: number) => void) => {
  if (!currentChallenge) return null

  return (
    <div className="space-y-2 mb-4">
      <h3 className="font-medium">Dicas:</h3>
      {currentChallenge.words.map((word, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm border border-gray-300 rounded px-2 py-0.5 mr-2 bg-gray-50">
              {word.direction === "horizontal" ? "→" : "↓"}
            </span>
            {tipsRevealed.includes(index) ? (
              <span>{word.tip}</span>
            ) : (
              <span className="text-gray-400">Dica oculta</span>
            )}
          </div>

          {!tipsRevealed.includes(index) && !completed && (
            <button
              onClick={() => revelarDica(index)}
              className="text-sm flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Revelar
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
