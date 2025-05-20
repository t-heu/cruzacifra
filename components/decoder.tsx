import {Challenge} from "../app/interfaces";

// Renderiza o decodificador
export const renderDecoder = (currentChallenge: Challenge | null, code: Record<string, string>, codeUser: Record<string, string>, atualizarCodigoUsuario: (letraCodificada: string, letraDecodificada: string) => void, completed: boolean) => {
  if (!currentChallenge) return null

  // Obtém todas as letras codificadas únicas
  const letrasCodificadas = Object.keys(code).sort()

  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {letrasCodificadas.map((letraCodificada) => (
        <div key={letraCodificada} className="flex flex-col items-center">
          <div className="text-lg font-bold">{letraCodificada}</div>
          <input
            type="text"
            value={codeUser[letraCodificada] || ""}
            onChange={(e) => atualizarCodigoUsuario(letraCodificada, e.target.value)}
            className="w-10 h-10 text-center uppercase border-2 border-[#eee] rounded"
            maxLength={1}
            disabled={completed}
          />
        </div>
      ))}
    </div>
  )
}