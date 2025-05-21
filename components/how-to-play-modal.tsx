type HowToPlayModalProps = {
  setShowHowToPlay: (show: boolean) => void;
};

const HowToPlayModal = ({ setShowHowToPlay }: HowToPlayModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Como jogar</h2>
      <p className="mb-2">
        Neste jogo, você precisa decifrar um código para revelar as words cruzadas.
      </p>
      <ol className="list-decimal pl-5 space-y-1 mb-4 text-sm text-gray-700">
        <li>Cada letra foi substituída por outra letra do alfabeto</li>
        <li>Use as dicas para tentar descobrir quais words estão escondidas</li>
        <li>Digite suas suposições no decodificador abaixo da grade</li>
        <li>Você pode revelar dicas ou letras se precisar de ajuda</li>
      </ol>
      <div className="text-right">
        <button
          onClick={() => setShowHowToPlay(false)}
          className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)

export default HowToPlayModal
