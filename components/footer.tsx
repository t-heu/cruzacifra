"use client"

import Link from "next/link"

type FooterProps = {
  dicasReveladas: number[];
};

const Footer = ({ dicasReveladas }: FooterProps) => (
  <footer className="bg-white rounded-lg shadow-md p-4 mt-6">
    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
      <div>
        <span>{dicasReveladas.length} dicas reveladas</span>
      </div>
      <div className="flex gap-4">
        <Link
          href="/about"
          className="hover:underline text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Sobre o projeto"
        >
          Sobre
        </Link>
        <Link
          href="/changelog"
          className="hover:underline text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Changelog do projeto"
        >
          Changelog
        </Link>
      </div>
      <div>
        <span>{new Date().toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  </footer>
);

export default Footer;
