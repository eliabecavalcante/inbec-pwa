'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface MaterialItem {
  id: string;
  name: string;
  size: string;
  updatedAt: string;
  type: 'PDF' | 'DOCX' | 'SLIDES';
  category: string;
}

const MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    name: 'Aula_01_React.pdf',
    size: '2.4 MB',
    updatedAt: 'Modificado há 2 dias',
    type: 'PDF',
    category: 'Apostila',
  },
  {
    id: 'mat-2',
    name: 'Projeto_Final_Escopo.docx',
    size: '1.1 MB',
    updatedAt: 'Modificado hoje',
    type: 'DOCX',
    category: 'AV2 • Projeto',
  },
  {
    id: 'mat-3',
    name: 'Slides_NextJS_AppRouter.pdf',
    size: '3.8 MB',
    updatedAt: 'Modificado há 5 dias',
    type: 'SLIDES',
    category: 'Apresentação',
  },
];

export default function SalaDeAulaPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'avisos' | 'desempenho' | 'materiais'>('avisos');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      if (session.user.email === 'admin@inbec.edu.br') {
        router.push('/admin');
        return;
      }
      setIsAuthorized(true);
    };
    checkAuth();
  }, [router]);

  const handleMockDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => {
      setDownloadedId((current) => (current === id ? null : current));
    }, 2000);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-32 font-sans text-slate-800 selection:bg-blue-200 overflow-x-hidden">
      {/* Efeitos Liquid Glass Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[35%] left-[55%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* Cabeçalho Voltar + Título */}
      <header className="px-5 pt-14 pb-5 bg-white/75 backdrop-blur-xl sticky top-0 z-30 shadow-sm rounded-b-3xl border-b border-slate-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/courses"
              aria-label="Voltar para disciplinas"
              className="w-10 h-10 shrink-0 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-[17px] font-bold text-slate-800 tracking-tight truncate">
                Desenv. Web Full-Stack
              </h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5 truncate">
                Prof. Marcos • Lab 4
              </p>
            </div>
          </div>

          <Link
            href="/homework"
            className="shrink-0 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2 rounded-xl transition-colors active:scale-95"
          >
            Exercícios
          </Link>
        </div>
      </header>

      <main className="px-5 pt-5 flex flex-col gap-5 relative z-10 max-w-md mx-auto w-full">
        {/* Card Hero da Disciplina */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-8 w-24 h-24 bg-black/10 rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Quintas • 18:30 • Lab 4
              </span>
              <span className="text-[10px] font-bold text-emerald-200 bg-emerald-500/20 border border-emerald-300/30 px-2 py-0.5 rounded-lg">
                Presencial
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/15">
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  Média Atual
                </span>
                <span className="text-2xl font-black">8.5</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  Faltas
                </span>
                <span className="text-2xl font-black">
                  2<span className="text-xs font-semibold text-blue-200">/18</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  Materiais
                </span>
                <span className="text-2xl font-black">{MATERIALS.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Segmented Control (Abas Liquid Glass) */}
        <div className="sticky top-[92px] z-20 pt-1">
          <div className="flex bg-white/85 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/70 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('avisos')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === 'avisos'
                  ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Avisos</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none ${
                  activeTab === 'avisos' ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600'
                }`}
              >
                2
              </span>
            </button>

            <button
              onClick={() => setActiveTab('desempenho')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'desempenho'
                  ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Notas/Faltas
            </button>

            <button
              onClick={() => setActiveTab('materiais')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeTab === 'materiais'
                  ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Materiais
            </button>
          </div>
        </div>

        {/* ============================================================
            ABA 1: AVISOS (Quadro de recados do professor)
           ============================================================ */}
        {activeTab === 'avisos' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Aviso 1 */}
            <article className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-slate-200/70 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-black">
                      M
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Prof. Marcos</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Hoje, 09:30</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                    AV2
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-[15px]">Trabalho da AV2 Liberado</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Pessoal, o escopo do projeto final já está na aba de materiais. Lembrem-se que a entrega é até o dia 25. Façam os grupos e me enviem os nomes.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('materiais')}
                    className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Abrir materiais
                  </button>
                  <Link
                    href="/homework"
                    className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Ir para entregas
                  </Link>
                </div>
              </div>
            </article>

            {/* Aviso 2 */}
            <article className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-slate-200/70 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 text-xs font-black">
                      C
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Coordenação</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Ontem, 14:00</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                    Importante
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-[15px]">Mudança de Laboratório</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Atenção alunos: Excepcionalmente nesta quinta-feira a aula prática será realizada no Laboratório 2 (Térreo).
                </p>
              </div>
            </article>
          </div>
        )}

        {/* ============================================================
            ABA 2: DESEMPENHO (Notas e Faltas)
           ============================================================ */}
        {activeTab === 'desempenho' && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Quadro de Notas */}
            <section className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-slate-200/70">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Quadro de Notas
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Acima da média
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/60 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV1</span>
                  <span className="text-slate-800 font-black text-lg">8.0</span>
                </div>
                <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/60 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV2</span>
                  <span className="text-slate-800 font-black text-lg">9.0</span>
                </div>
                <div className="bg-slate-50/60 p-3 rounded-2xl border border-dashed border-slate-200 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV3</span>
                  <span className="text-slate-400 font-bold text-lg">—</span>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-3 rounded-2xl text-center shadow-md shadow-blue-600/20">
                  <span className="block text-[10px] font-bold text-blue-100 uppercase mb-1">Média</span>
                  <span className="text-white font-black text-lg">8.5</span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-semibold mb-1.5">
                  <span className="text-slate-500">Aproveitamento na disciplina</span>
                  <span className="text-blue-600 font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full w-[85%]"></div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-2">
                  Média mínima para aprovação direta: 7.0
                </p>
              </div>
            </section>

            {/* Controle de Faltas */}
            <section className="bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-sm border border-slate-200/70">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Controle de Presença
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Situação Regular
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-black text-slate-800">2</span>
                  <span className="text-xs font-bold text-slate-500 ml-1.5">faltas registradas</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-blue-600 block">89% de presença</span>
                  <span className="text-[10px] text-slate-400 font-semibold">16 faltas restantes</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-[11%]"></div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-semibold text-slate-400">11% do limite utilizado</span>
                <span className="text-[10px] font-semibold text-slate-400">Limite máximo: 18 faltas (25%)</span>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            ABA 3: MATERIAIS
           ============================================================ */}
        {activeTab === 'materiais' && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500">Arquivos da Disciplina</span>
              <span className="text-[11px] font-semibold text-slate-400">
                {MATERIALS.length} arquivos
              </span>
            </div>

            {MATERIALS.map((item) => {
              const isDownloaded = downloadedId === item.id;
              const isPdf = item.type === 'PDF';
              const isSlides = item.type === 'SLIDES';

              return (
                <div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-slate-200/70 flex items-center gap-3.5 hover:border-blue-200 transition-all"
                >
                  <div
                    className={`w-12 h-12 shrink-0 rounded-2xl flex flex-col items-center justify-center border ${
                      isPdf
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : isSlides
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[8px] font-black tracking-wider mt-0.5">{item.type}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-slate-800 font-bold text-[13px] truncate mt-0.5">
                      {item.name}
                    </h4>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-medium">
                      {item.size} • {item.updatedAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMockDownload(item.id)}
                    aria-label={`Baixar ${item.name}`}
                    className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl active:scale-95 transition-all ${
                      isDownloaded
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100'
                    }`}
                  >
                    {isDownloaded ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}