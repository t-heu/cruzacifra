"use client"

type FooterProps = {
  dicasReveladas: number[];
};

const Footer = ({dicasReveladas}: FooterProps) => (
  <footer className="bg-white rounded-lg shadow-md p-4">
    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>{dicasReveladas.length} dicas reveladas</span>
      <span>{new Date().toLocaleDateString("pt-BR")}</span>
    </div>
  </footer>
)

export default Footer
