"use client"

import { Menu, X, Home, LucideProps } from "lucide-react"
import { Dispatch, SetStateAction, ForwardRefExoticComponent, RefAttributes } from "react"

interface MenuItem {
  id: string;
  nome: string;
  icone: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

type HeaderProps = {
  menuItems: MenuItem[];
  setPaginaAtiva: Dispatch<SetStateAction<string>>;
  paginaAtiva: string;
  setMenuAberto: Dispatch<SetStateAction<boolean>>;
  menuAberto: boolean;
};

const Header = ({menuItems, setPaginaAtiva, paginaAtiva, setMenuAberto, menuAberto}: HeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-semibold text-white">Cruzacifra</h1>
              <p className="text-sm text-gray-400">Desafio diário</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => {
              const IconComponent = item.icone
              return (
                <button
                  key={item.id}
                  onClick={() => setPaginaAtiva(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    paginaAtiva === item.id
                      ? "bg-[#edc360] text-[#454a3f]"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.nome}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuAberto && (
          <div className="md:hidden pb-4 border-t border-gray-700 pt-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icone
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPaginaAtiva(item.id)
                      setMenuAberto(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      paginaAtiva === item.id
                        ? "bg-[#edc360] text-[#454a3f]"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.nome}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
