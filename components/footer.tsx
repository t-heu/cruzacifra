"use client"

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Cruzacifra</h3>
          <p className="text-gray-300 mb-4">
            O melhor jogo de palavras cruzadas codificadas. Desafie sua mente com nossos quebra-cabeças
            únicos e melhore suas habilidades de dedução e vocabulário.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Recursos</h4>
          <ul className="space-y-2 text-gray-300">
            <li>• Desafios diários únicos</li>
            <li>• Sistema de pontuação</li>
            <li>• Estatísticas detalhadas</li>
            <li>• Múltiplos temas</li>
            <li>• Tutorial interativo</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Benefícios</h4>
          <ul className="space-y-2 text-gray-300">
            <li>• Exercita o cérebro</li>
            <li>• Melhora vocabulário</li>
            <li>• Desenvolve lógica</li>
            <li>• Reduz estresse</li>
            <li>• Diversão garantida</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Cruzacifra. Todos os direitos reservados.</p>
        <p className="mt-2">Desenvolvido com ❤️ para amantes de quebra-cabeças</p>
      </div>
    </div>
  </footer>
);

export default Footer;
