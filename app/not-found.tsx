// pages/404.js
export default function Custom404() {
  return (
    <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 h-screen flex flex-col justify-center items-center text-center px-6 font-sans text-yellow-900">
      <h1 className="text-[8rem] font-extrabold drop-shadow-md select-none">404</h1>
      <p className="text-xl md:text-2xl max-w-md font-semibold mb-12">
        Ops! A página que você procura não foi encontrada.
      </p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-8 py-3 rounded-full shadow-lg"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
