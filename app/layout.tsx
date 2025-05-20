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
        <meta property="og:title" content="Cruzacifra - Desvende a Palavra-Código!" />
        <meta property="og:description" content="Resolva o desafio de palavras cruzadas criptografadas do dia!" />
        <meta property="og:image" content="https://cruzacifra.onrender.com/assets/web-app-manifest-192x192.png" />
        <meta property="og:url" content="https://cruzacifra.onrender.com/" />
        <meta property="og:type" content="website" />
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
