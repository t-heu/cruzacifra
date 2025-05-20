import type { Metadata } from 'next'
import './globals.css'

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
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body>{children}</body>
    </html>
  )
}
