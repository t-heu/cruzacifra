import React, { ReactNode } from 'react';
import Link from "next/link"

import { ArrowLeft } from "lucide-react"

interface CardProps {
  children: ReactNode;
  className?: string;
}
function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[#111] border border-white rounded-md p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}
function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <header
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 ${className}`}
    >
      {children}
    </header>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}
function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h2
      className={`text-xl font-semibold text-white flex items-center gap-2 ${className}`}
    >
      {children}
    </h2>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}
function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}
function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`pt-2 ${className}`}>
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
}
function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full text-white select-none
      ${className}`}
    >
      {children}
    </span>
  );
}

export default function ChangelogPage() {
  const changelog = [
    {
      version: "v1.1.0",
      date: "20 de Maio, 2025",
      description: "Pequenos Lançamento",
      changes: [
        { type: "new", text: "Adicionado novos temas" },
      ],
    },
    {
      version: "v1.0.0",
      date: "19 de Maio, 2025",
      description: "Lançamento inicial",
      changes: [
        { type: "new", text: "Primeira versão pública do aplicativo" },
        { type: "new", text: "Funcionalidades básicas implementadas" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#ebc260] text-black p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Link href="/">
          <button className="flex items-center text-black hover:text-black hover:bg-white rounded-md px-4 py-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </button>
        </Link>

        <div className="space-y-2 text-center mb-10">
          <h1 className="text-4xl font-bold mt-6 mb-2 text-center">Changelogs</h1>
          <p className="text-black">Histórico de atualizações e melhorias do nosso produto</p>
        </div>

        <div className="space-y-8">
          {changelog.map((release, index) => (
            <Card key={release.version} className="border-l-4 border-l-white-300">
              <CardHeader>
                <div>
                  <CardTitle>
                    {release.version}
                    {index === 0 && (
                      <Badge className="ml-2 bg-green-600 hover:bg-green-700">Mais recente</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{release.date}</CardDescription>
                </div>
                <p className="text-sm text-gray-400">{release.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {change.type === 'new' && (
                        <Badge className="mt-0.5 bg-blue-600 hover:bg-blue-700">Novo</Badge>
                      )}
                      {change.type === 'improvement' && (
                        <Badge className="mt-0.5 bg-purple-600 hover:bg-purple-700">Melhoria</Badge>
                      )}
                      {change.type === 'fix' && (
                        <Badge className="mt-0.5 bg-red-600 hover:bg-red-700">Correção</Badge>
                      )}
                      {change.type === 'remove' && (
                        <Badge className="mt-0.5 bg-red-400 hover:bg-red-500 text-red-900 font-bold">Removido</Badge>
                      )}
                      {change.type === 'update' && (
                        <Badge className="mt-0.5 bg-indigo-500 hover:bg-indigo-600 text-indigo-900 font-semibold">Ajuste</Badge>
                      )}
                      <span className="text-gray-200">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
