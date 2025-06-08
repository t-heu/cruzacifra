import type { Metadata } from 'next'
import './globals.css'

import AdSense from "../components/ad-sense";

export const metadata: Metadata = {
  title: 'Cruzacifra - Desafio Diário de Quebra-Cabeças',
  generator: 'theu',
  description:
    "Jogue o melhor jogo de palavras cruzadas codificadas online. Desafios diários, múltiplos níveis de dificuldade, estatísticas detalhadas e muito mais. Exercite seu cérebro com nossos quebra-cabeças únicos.",
  keywords:
    "palavras cruzadas, quebra-cabeça, jogo de palavras, desafio diário, código, decodificação, puzzle, brain training",
  authors: [{ name: "Cruzacifra" }],
  openGraph: {
    title: "Palavras Cruzadas Codificadas - Desafio Diário",
    description: "O melhor jogo de palavras cruzadas codificadas com desafios diários únicos",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta property="og:image" content="https://cruzacifra.onrender.com/assets/web-app-manifest-192x192.png" />
        <meta property="og:url" content="https://cruzacifra.onrender.com/" />
        <link rel="apple-touch-icon" href="/assets/apple-icon.png" sizes="180x180" />
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/assets/web-app-manifest-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ebc260" />
        <AdSense pId="ca-pub-7158647172444246"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
