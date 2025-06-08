"use client"

import { useState } from "react"

import {PalavraPosicionada} from "@/interfaces/types"
import {LIMITE_LETRAS_REVELADAS, LIMITE_DICAS} from "@/utils/config"

export type GameTabProps = {
  dicasReveladas: number[];
  setDicasReveladas: React.Dispatch<React.SetStateAction<number[]>>;
  letrasReveladas: string[];
  setLetrasReveladas: React.Dispatch<React.SetStateAction<string[]>>;
  codigo: Record<string, string>;
  codigoUsuario: Record<string, string>;
  setCodigoUsuario: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  grade: string[][];
  gradeNumeros: number[][];
  concluido: boolean;
  palavrasPosicionadas: PalavraPosicionada[];
};

const GameTab = ({
  dicasReveladas, 
  setDicasReveladas, 
  letrasReveladas, 
  codigo,
  codigoUsuario,
  setCodigoUsuario,
  setLetrasReveladas,
  grade,
  gradeNumeros,
  concluido,
  palavrasPosicionadas
}: GameTabProps) => {
  const [abaSelecionada, setAbaSelecionada] = useState("jogo")
  const [mostrarCuriosidade, setMostrarCuriosidade] = useState<number | null>(null)

  // Revela uma dica
  const revelarDica = (index: number) => {
    if (dicasReveladas.includes(index) || dicasReveladas.length >= LIMITE_DICAS) return

    const novasDicasReveladas = [...dicasReveladas, index]
    setDicasReveladas(novasDicasReveladas)
  }

  // Revela uma letra do código
  const revelarLetra = () => {
    if (letrasReveladas.length >= LIMITE_LETRAS_REVELADAS) return

    const letrasIncorretas = Object.keys(codigo).filter(
      (letraCodificada) =>
        !codigoUsuario[letraCodificada] ||
        (codigoUsuario[letraCodificada] !== codigo[letraCodificada] && !letrasReveladas.includes(letraCodificada)),
    )

    if (letrasIncorretas.length === 0) return

    const letraParaRevelar = letrasIncorretas[Math.floor(Math.random() * letrasIncorretas.length)]
    const novoCodigoUsuario = { ...codigoUsuario, [letraParaRevelar]: codigo[letraParaRevelar] }
    setCodigoUsuario(novoCodigoUsuario)
    setLetrasReveladas([...letrasReveladas, letraParaRevelar])
  }

  // Atualiza o código do usuário
  const atualizarCodigoUsuario = (letraCodificada: string, letraDecodificada: string) => {
    const novoCodigoUsuario = { ...codigoUsuario }

    // Remove a letra decodificada de qualquer outra posição
    Object.keys(novoCodigoUsuario).forEach((key) => {
      if (novoCodigoUsuario[key] === letraDecodificada) {
        delete novoCodigoUsuario[key]
      }
    })

    // Adiciona ou remove a letra
    if (letraDecodificada) {
      novoCodigoUsuario[letraCodificada] = letraDecodificada.toUpperCase()
    } else {
      delete novoCodigoUsuario[letraCodificada]
    }

    setCodigoUsuario(novoCodigoUsuario)
  }

  // Renderiza a grade
  const renderizarGrade = () => {
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

    // Adiciona margem
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
      <div className="mb-8">
        {/* Container com scroll para telas menores */}
        <div className="w-full overflow-auto">
          <div className="flex justify-center min-w-fit px-4">
            <div
              className="grid gap-1 p-4 bg-white rounded-xl shadow-lg border-2 border-blue-100 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${numColunas}, 1fr)`,
                minWidth: `${numColunas * 3.5}rem`, // Garante largura mínima
              }}
            >
              {gradeVisivel.map((linha, linhaIndex) =>
                linha.map((celula, colunaIndex) => (
                  <div
                    key={`${linhaIndex}-${colunaIndex}`}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 border-2 flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      celula.letra
                        ? "border-blue-300 bg-gradient-to-br from-white to-blue-50 hover:shadow-md"
                        : "border-transparent bg-gray-50"
                    }`}
                  >
                    {celula.numero > 0 && (
                      <div className="absolute top-[2px] left-[2px] text-xs text-blue-700 font-bold leading-none mb-1">{celula.numero}</div>
                    )}
                    {celula.letra && (
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">{celula.letra}</div>
                        <div
                          className={`text-sm font-bold ${
                            codigoUsuario[celula.letra]
                              ? codigo[celula.letra] === codigoUsuario[celula.letra]
                                ? "text-green-600"
                                : "text-red-500"
                              : "text-transparent"
                          }`}
                        >
                          {codigoUsuario[celula.letra] || "."}
                        </div>
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>

        {/* Indicador de scroll para mobile */}
        <div className="text-center mt-2 sm:hidden">
          <p className="text-xs text-gray-500">💡 Deslize horizontalmente para ver toda a grade</p>
        </div>
      </div>
    )
  }

  // Renderiza o decodificador
  const renderizarDecodificador = () => {
    const letrasCodificadas = Object.keys(codigo).sort()

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🔤 Decodificador</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
          {letrasCodificadas.map((letraCodificada) => {
            const estaCorreto =
              codigoUsuario[letraCodificada] && codigo[letraCodificada] === codigoUsuario[letraCodificada]
            const estaIncorreto =
              codigoUsuario[letraCodificada] && codigo[letraCodificada] !== codigoUsuario[letraCodificada]
            const foiRevelada = letrasReveladas.includes(letraCodificada)

            return (
              <div key={letraCodificada} className="flex flex-col items-center">
                <div className="text-lg font-bold mb-2 text-gray-700">{letraCodificada}</div>
                <input
                  type="text"
                  value={codigoUsuario[letraCodificada] || ""}
                  onChange={(e) => atualizarCodigoUsuario(letraCodificada, e.target.value)}
                  className={`w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase transition-all duration-200 ${
                    estaCorreto
                      ? foiRevelada
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-green-500 bg-green-50 text-green-700"
                      : estaIncorreto
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 bg-white hover:border-blue-400"
                  }`}
                  maxLength={1}
                  disabled={concluido}
                />
                {foiRevelada && <div className="text-xs text-yellow-600 mt-1 font-semibold">Revelada</div>}
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
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  letrasReveladas.length >= LIMITE_LETRAS_REVELADAS
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                }`}
              >
                <span>💡</span>
                Revelar letra ({LIMITE_LETRAS_REVELADAS - letrasReveladas.length} restantes)
              </button>

              <button
                onClick={() => setCodigoUsuario({})}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>🔄</span>
                Limpar tudo
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Letras reveladas: {letrasReveladas.length}/{LIMITE_LETRAS_REVELADAS}
              </p>
              <p>
                Dicas reveladas: {dicasReveladas.length}/{LIMITE_DICAS}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
   <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    <div className="border-b border-gray-200">
      <nav className="flex">
        {[
          { id: "jogo", nome: "Jogo", desc: "Grade principal" },
          { id: "decodificador", nome: "Decodificador", desc: "Substitua as letras" },
          { id: "dicas", nome: "Dicas", desc: "Pistas das palavras" },
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaSelecionada(aba.id)}
            className={`flex-1 px-6 py-4 text-center transition-all duration-200 ${
              abaSelecionada === aba.id
                ? "border-b-4 border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <div className="font-medium">{aba.nome}</div>
            <div className="text-xs opacity-70">{aba.desc}</div>
          </button>
        ))}
      </nav>
    </div>

    <div className="p-8">
      {abaSelecionada === "jogo" && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Grade de Palavras Cruzadas</h3>
            <p className="text-gray-600">
              Cada letra foi substituída por outra. Use o decodificador para revelar as palavras!
            </p>
          </div>
          {renderizarGrade()}
        </div>
      )}

      {abaSelecionada === "decodificador" && renderizarDecodificador()}

      {abaSelecionada === "dicas" && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">💡 Dicas das Palavras</h3>
            <p className="text-gray-600">
              Revele dicas para ajudar a decifrar o código (máximo {LIMITE_DICAS} dicas)
            </p>
          </div>

          <div className="grid gap-4">
            {palavrasPosicionadas.map((palavra, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold px-3 py-2 rounded-lg shadow-lg">
                        {palavra.numero}
                      </span>
                      <span className="text-2xl">{palavra.direcao === "horizontal" ? "→" : "↓"}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {dicasReveladas.includes(index) ? palavra.dica : "Dica oculta"}
                      </div>
                      {dicasReveladas.includes(index) && (
                        <div className="text-sm text-gray-600 mt-1">
                          Categoria: {palavra.categoria} | Dificuldade:{" "}
                          <span
                            className={`font-semibold ${
                              palavra.dificuldade === "facil"
                                ? "text-green-600"
                                : palavra.dificuldade === "medio"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {palavra.dificuldade}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!dicasReveladas.includes(index) && !concluido && (
                      <button
                        onClick={() => revelarDica(index)}
                        disabled={dicasReveladas.length >= LIMITE_DICAS}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                          dicasReveladas.length >= LIMITE_DICAS
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        }`}
                      >
                        Revelar Dica
                      </button>
                    )}

                    {dicasReveladas.includes(index) && palavra.curiosidade && (
                      <button
                        onClick={() => setMostrarCuriosidade(mostrarCuriosidade === index ? null : index)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {mostrarCuriosidade === index ? "Ocultar" : "Curiosidade"}
                      </button>
                    )}
                  </div>
                </div>

                {mostrarCuriosidade === index && palavra.curiosidade && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤔</span>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-1">Você sabia?</h4>
                        <p className="text-purple-700">{palavra.curiosidade}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {dicasReveladas.length >= LIMITE_DICAS && !concluido && (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-semibold">Você usou todas as {LIMITE_DICAS} dicas disponíveis!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Continue tentando decifrar o código com as informações que você tem.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  )
}

export default GameTab
