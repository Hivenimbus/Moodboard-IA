import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
        Moodboard de Arquitetura com IA
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Dê vida à sua visão arquitetônica. Descreva uma ideia para gerar uma imagem ou envie uma imagem base para criar variações.
      </p>
    </header>
  );
};