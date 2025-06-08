"use client"

import { useState } from "react"

import Game from "@/components/game"
import Header from "@/components/header"
import Statistics from "@/components/statistics"

import { Home, BarChart3, BookOpen, Info } from "lucide-react"

const HomePage = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("jogo")
  const [menuAberto, setMenuAberto] = useState(false)

  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case "jogo":
        return <Game />
      case "estatisticas":
        return <Statistics />
      case "tutorial":
        return <TutorialPlaceholder />
      case "sobre":
        return <AboutPlaceholder />
      default:
        return <Game />
    }
  }

  const menuItems = [
    { id: "jogo", nome: "Jogo", icone: Home },
    { id: "estatisticas", nome: "Estatísticas", icone: BarChart3 },
    { id: "tutorial", nome: "Tutorial", icone: BookOpen },
    { id: "sobre", nome: "Sobre", icone: Info },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <Header 
        menuItems={menuItems}
        setPaginaAtiva={setPaginaAtiva}
        paginaAtiva={paginaAtiva}
        setMenuAberto={setMenuAberto}
        menuAberto={menuAberto}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderizarConteudo()}</main>
    </div>
  )
}

const TutorialPlaceholder = () => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
    <div className="text-center mb-8">
      <BookOpen className="w-12 h-12 text-[#edc360] mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-white mb-2">Como Jogar</h2>
    </div>
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-8 h-8 bg-[#edc360] text-[#454a3f] rounded-full flex items-center justify-center font-semibold text-sm">
          1
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Observe a Grade</h3>
          <p className="text-gray-400">
            Cada letra foi substituída por outra letra do alfabeto. Sua missão é descobrir o código!
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-8 h-8 bg-[#edc360] text-[#454a3f] rounded-full flex items-center justify-center font-semibold text-sm">
          2
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Use as Dicas</h3>
          <p className="text-gray-400">
            Revele dicas sobre as palavras para ajudar a decifrar o código de substituição.
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-8 h-8 bg-[#edc360] text-[#454a3f] rounded-full flex items-center justify-center font-semibold text-sm">
          3
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">Decodifique</h3>
          <p className="text-gray-400">
            Use o decodificador para tentar diferentes combinações de letras até descobrir todas as palavras.
          </p>
        </div>
      </div>
    </div>
  </div>
)

const AboutPlaceholder = () => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
    <div className="text-center mb-8">
      <Info className="w-12 h-12 text-[#edc360] mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-white mb-2">Sobre o Jogo</h2>
    </div>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">O que é Cruzacifra?</h3>
        <p className="text-gray-400 leading-relaxed">
          Um jogo de quebra-cabeças único que combina palavras cruzadas tradicionais com elementos de decodificação.
          Cada letra foi substituída por outra, criando um código que você precisa decifrar.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Benefícios</h3>
        <ul className="text-gray-400 space-y-2">
          <li>• Exercita o raciocínio lógico e dedutivo</li>
          <li>• Melhora o vocabulário e conhecimento geral</li>
          <li>• Desenvolve habilidades de reconhecimento de padrões</li>
          <li>• Proporciona relaxamento e diversão</li>
        </ul>
      </div>
    </div>
  </div>
)

export default HomePage
