"use client"

type HeaderProps = {
  setPaginaAtiva: any;
  paginaAtiva: any;
  setMenuAberto: any;
  menuAberto: any;
};

const Header = ({setPaginaAtiva, paginaAtiva, setMenuAberto, menuAberto}: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cruzacifra</h1>
              <p className="text-sm text-gray-600">Desafios diários de quebra-cabeças</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { id: "jogo", nome: "Jogo" },
              { id: "estatisticas", nome: "Estatísticas" },
              { id: "tutorial", nome: "Tutorial" },
              { id: "configuracoes", nome: "Configurações" },
              { id: "sobre", nome: "Sobre" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPaginaAtiva(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  paginaAtiva === item.id
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.nome}</span>
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuAberto && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {[
                { id: "jogo", nome: "Jogo" },
                { id: "estatisticas", nome: "Estatísticas" },
                { id: "tutorial", nome: "Tutorial" },
                { id: "configuracoes", nome: "Configurações" },
                { id: "sobre", nome: "Sobre" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPaginaAtiva(item.id)
                    setMenuAberto(false)
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    paginaAtiva === item.id
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
  </header>
  )
}

export default Header
