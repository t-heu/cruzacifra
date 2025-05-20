import type { Metadata } from 'next'
import './globals.css'

import AdSense from "../components/AdSense";

export const metadata: Metadata = {
  title: 'Cruzacifra',
  description: 'Desafie sua mente diariamente! Decifre códigos para revelar palavras cruzadas com temas diferentes a cada dia. Troque letras embaralhadas, use dicas e lógica para completar o tabuleiro.',
  generator: 'theu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ebc260" />
        <AdSense pId="ca-pub-7158647172444246"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
