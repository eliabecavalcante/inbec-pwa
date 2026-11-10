'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SalaDeAulaPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'avisos' | 'desempenho' | 'materiais'>('avisos');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] relative pb-28 font-sans text-slate-800 selection:bg-blue-200">
      
      {/* Cabeçalho Voltar + Título */}
      <header className="px-5 pt-12 pb-4 bg-white sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-b-3xl">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight truncate">Desenv. Web Full-Stack</h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5 truncate">Prof. Marcos • Lab 4</p>
          </div>
        </div>
      </header>

      {/* Segmented Control (Abas Estilo iOS) */}
      <div className="px-5 py-4 sticky top-[80px] z-20 bg-[#F5F7FA]/90 backdrop-blur-md">
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('avisos')}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-xl transition-all duration-300 ${activeTab === 'avisos' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Avisos
          </button>
          <button
            onClick={() => setActiveTab('desempenho')}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-xl transition-all duration-300 ${activeTab === 'desempenho' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Notas/Faltas
          </button>
          <button
            onClick={() => setActiveTab('materiais')}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-xl transition-all duration-300 ${activeTab === 'materiais' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Materiais
          </button>
        </div>
      </div>

      <main className="px-5 flex flex-col gap-4">
        
        {/* ABA 1: AVISOS (Quadro de recados do professor) */}
        {activeTab === 'avisos' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="flex items-center justify-between mb-2 pl-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">M</div>
                  <span className="text-xs font-bold text-slate-700">Prof. Marcos</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Hoje, 09:30</span>
              </div>
              <h3 className="font-bold text-slate-800 text-[15px] pl-2 mt-2">Trabalho da AV2 Liberado</h3>
              <p className="text-sm text-slate-600 pl-2 mt-1 leading-relaxed">
                Pessoal, o escopo do projeto final já está na aba de materiais. Lembrem-se que a entrega é até o dia 25. Façam os grupos e me enviem os nomes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
              <div className="flex items-center justify-between mb-2 pl-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold">C</div>
                  <span className="text-xs font-bold text-slate-700">Coordenação</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Ontem, 14:00</span>
              </div>
              <h3 className="font-bold text-slate-800 text-[15px] pl-2 mt-2">Mudança de Laboratório</h3>
              <p className="text-sm text-slate-600 pl-2 mt-1 leading-relaxed">
                Atenção alunos: Excepcionalmente nesta quinta-feira a aula prática será realizada no Laboratório 2 (Térreo).
              </p>
            </div>
          </div>
        )}

        {/* ABA 2: DESEMPENHO (Notas e Faltas) */}
        {activeTab === 'desempenho' && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Quadro de Notas */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-slate-50">
              <h3 className="text-slate-800 font-bold text-base mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Quadro de Notas
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV1</span>
                  <span className="text-slate-800 font-bold text-lg">8.0</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV2</span>
                  <span className="text-slate-800 font-bold text-lg">9.0</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center opacity-50">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AV3</span>
                  <span className="text-slate-400 font-bold text-lg">-</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center">
                  <span className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Média</span>
                  <span className="text-blue-700 font-black text-lg">8.5</span>
                </div>
              </div>
            </div>

            {/* Controle de Faltas */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-slate-50">
              <h3 className="text-slate-800 font-bold text-base mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Controle de Presença
              </h3>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-black text-slate-800">2</span>
                  <span className="text-sm font-medium text-slate-500 ml-1">faltas</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">Situação Regular</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-blue-500 rounded-full w-[11%]"></div>
              </div>
              <p className="text-[10px] font-medium text-slate-400 text-right mt-2">Limite máximo: 18 faltas (25%)</p>
            </div>

          </div>
        )}

        {/* ABA 3: MATERIAIS */}
        {activeTab === 'materiais' && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-800 font-bold text-[13px] truncate">Aula_01_React.pdf</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">2.4 MB • Modificado há 2 dias</p>
              </div>
              <button className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-800 font-bold text-[13px] truncate">Projeto_Final_Escopo.docx</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">1.1 MB • Modificado hoje</p>
              </div>
              <button className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}