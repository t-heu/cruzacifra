"use client"

import { useState } from "react"

type HeaderProps = {
  concluido: boolean;
  temaAtual: any; // você pode substituir `any` por um tipo mais específico, se tiver
  proximoDesafio: string;
  pontuacao: number;
  progresso: number;
  lostOrWin: string | null;
};

const Header = ({concluido, temaAtual, proximoDesafio, pontuacao, progresso, lostOrWin}: HeaderProps) => {
  const [mostrarAjuda, setMostrarAjuda] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Palavras Cruzadas Codificadas</h1>
      <p className="text-center text-gray-600 mb-4">
        Decifre o código para revelar as palavras cruzadas do dia: {temaAtual?.title || ""}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-blue-800">Próximo tema em: {proximoDesafio}</span>
        </div>

        {concluido && (
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-green-800">Pontuação: {pontuacao}</span>
          </div>
        )}

        <button
          onClick={() => setMostrarAjuda(!mostrarAjuda)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Como jogar</span>
        </button>
      </div>

      {/* Progresso */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso: {progresso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progresso}%` }}
          ></div>
        </div>
      </div>

      {/* Alerta de conclusão */}
      {concluido && (
        <div
          className={`mt-6 p-5 rounded-xl shadow-md border-l-4 ${
            lostOrWin === 'lost'
              ? 'bg-red-50 border-red-400'
              : 'bg-green-50 border-green-400'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {lostOrWin === 'lost' ? (
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.707 7.707a1 1 0 00-1.414-1.414L10 11.586l3.707-3.707a1 1 0 00-1.414-1.414L10 8.586 7.707 7.707z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              {lostOrWin === 'lost' ? (
                <>
                  <h3 className="text-red-600 font-semibold text-lg">Você perdeu!</h3>
                  <p className="text-red-500 text-sm">Tente novamente no próximo desafio.</p>
                </>
              ) : (
                <>
                  <h3 className="text-green-700 font-semibold text-lg">Parabéns!</h3>
                  <p className="text-green-600 text-sm">Você completou o desafio de hoje com sucesso!</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ajuda */}
      {mostrarAjuda && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Como jogar</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• Cada letra foi substituída por outra letra do alfabeto</p>
            <p>• Use as dicas para descobrir quais palavras estão escondidas</p>
            <p>• Digite suas suposições no decodificador</p>
            <p>• Você pode revelar dicas ou letras se precisar de ajuda</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
