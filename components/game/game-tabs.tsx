"use client"

import { Grid3X3, Code, Lightbulb } from "lucide-react"

interface GameTabsProps {
  abaSelecionada: string
  setAbaSelecionada: (aba: string) => void
}

export function GameTabs({ abaSelecionada, setAbaSelecionada }: GameTabsProps) {
  const tabs = [
    { id: "jogo", nome: "Grade", icone: Grid3X3 },
    { id: "decodificador", nome: "Código", icone: Code },
    { id: "dicas", nome: "Dicas", icone: Lightbulb },
  ]

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <nav className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icone
          return (
            <button
              key={tab.id}
              onClick={() => setAbaSelecionada(tab.id)}
              className={`flex-1 px-6 py-4 text-center transition-colors border-b-2 ${
                abaSelecionada === tab.id
                  ? "border-[#edc360] bg-[#edc360]/20 text-[#edc360]/80"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.nome}</span>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
