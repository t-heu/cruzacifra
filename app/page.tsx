"use client"

import { useState } from "react"

import JogoComponent from "@/components/game"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Statistics from "@/components/statistics"

const HomePage = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("jogo")
  const [menuAberto, setMenuAberto] = useState(false)

  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case "jogo":
        return <JogoComponent />
      case "estatisticas":
        return <Statistics />
      case "tutorial":
        return <TutorialPlaceholder />
      case "configuracoes":
        return <ConfigPlaceholder />
      case "sobre":
        return <AboutPlaceholder />
      default:
        return <JogoComponent />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header setPaginaAtiva={setPaginaAtiva} paginaAtiva={paginaAtiva} setMenuAberto={setMenuAberto} menuAberto={menuAberto} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderizarConteudo()}</main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

const TutorialPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Como Jogar</h2>
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Observe a Grade</h3>
          <p className="text-gray-600">
            Cada letra foi substituída por outra letra do alfabeto. Sua missão é descobrir o código!
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Use as Dicas</h3>
          <p className="text-gray-600">
            Revele dicas sobre as palavras para ajudar a decifrar o código de substituição.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Decodifique</h3>
          <p className="text-gray-600">
            Use o decodificador para tentar diferentes combinações de letras até descobrir todas as palavras.
          </p>
        </div>
      </div>
    </div>
  </div>
)

const ConfigPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-xl p-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Configurações</h2>
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800">Tema Escuro</h3>
          <p className="text-sm text-gray-600">Ativar modo escuro para melhor experiência noturna</p>
        </div>
        <button className="bg-gray-300 rounded-full w-12 h-6 relative">
          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
        </button>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800">Sons</h3>
          <p className="text-sm text-gray-600">Ativar efeitos sonoros do jogo</p>
        </div>
        <button className="bg-gray-300 rounded-full w-12 h-6 relative">
          <div className="bg-white w-5 h-5 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
        </button>
      </div>
    </div>
  </div>
)

const AboutPlaceholder = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sobre o Jogo</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">O que é Palavras Cruzadas Codificadas?</h3>
        <p className="text-gray-600 leading-relaxed">
          Um jogo de quebra-cabeças único que combina palavras cruzadas tradicionais com elementos de decodificação.
          Cada letra foi substituída por outra, criando um código que você precisa decifrar para revelar as palavras
          escondidas.
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Benefícios</h3>
        <ul className="text-gray-600 space-y-2">
          <li>• Exercita o raciocínio lógico e dedutivo</li>
          <li>• Melhora o vocabulário e conhecimento geral</li>
          <li>• Desenvolve habilidades de reconhecimento de padrões</li>
          <li>• Proporciona relaxamento e diversão</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Novos Desafios Diários</h3>
        <p className="text-gray-600 leading-relaxed">
          Todos os dias às 00:00 um novo tema e conjunto de palavras são disponibilizados, garantindo sempre um desafio
          fresco e interessante para exercitar sua mente.
        </p>
      </div>
    </div>
  </div>
)

export default HomePage
