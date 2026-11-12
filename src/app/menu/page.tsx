'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MenuPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState('');

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
      
      setUserEmail(session.user.email || '');
      setIsAuthorized(true);
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 bg-white border border-red-200 p-8 rounded-3xl shadow-xl">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <span className="text-slate-800 font-bold text-lg uppercase tracking-wider">Acesso Restrito</span>
          <span className="text-red-500 font-medium animate-pulse">Faça o login!</span>
          <span className="text-slate-500 text-xs mt-2">Redirecionando de volta...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden pb-28 font-sans selection:bg-blue-500/30">
      {/* Efeitos Liquid Glass Claros e Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[30%] left-[50%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* Header do Aluno */}
      <header className="relative z-10 w-full px-6 pt-14 pb-6 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-slate-200/50 rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 shadow-lg shadow-blue-600/20 flex items-center justify-center">
             <span className="text-white font-bold text-lg">AL</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-wide">Olá, Aluno</h1>
            <p className="text-slate-500 text-xs mt-0.5">{userEmail}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-slate-400 hover:text-red-500 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto p-6 flex flex-col gap-8">
        
        {/* ================= INFORMATIVO DE ATIVIDADES ================= */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/90 backdrop-blur-xl border border-amber-200/50 p-5 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1">
              <h2 className="text-amber-600 font-bold text-sm">Atenção aos Prazos</h2>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">Você possui <strong className="text-slate-800">2 atividades</strong> da disciplina de Engenharia de Software vencendo nesta sexta-feira.</p>
            </div>
            <button className="shrink-0 w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* ================= GRADE DO DIA ================= */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <div>
              <h2 className="text-slate-800 font-bold text-lg tracking-wide">Aulas de Hoje</h2>
              <p className="text-slate-500 text-xs mt-0.5">Quinta-feira, 5 de Novembro</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">2026.2</span>
          </div>

          <div className="space-y-4">
            {/* Aula 1 */}
            <div className="bg-white/80 border border-slate-200/60 p-4 rounded-3xl backdrop-blur-xl shadow-sm flex gap-4 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-3xl"></div>
              <div className="flex flex-col items-center justify-center shrink-0 w-14">
                <span className="text-slate-800 font-black text-lg">18:30</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Início</span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex-1 py-1">
                <h3 className="text-slate-800 font-bold text-sm">Desenvolvimento Web Full-Stack</h3>
                <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Prof. Dr. Marcos
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Laboratório 4</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Presencial</span>
                </div>
              </div>
            </div>

            {/* Aula 2 */}
            <div className="bg-white/80 border border-slate-200/60 p-4 rounded-3xl backdrop-blur-xl shadow-sm flex gap-4 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-3xl"></div>
              <div className="flex flex-col items-center justify-center shrink-0 w-14">
                <span className="text-slate-800 font-black text-lg">20:20</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Início</span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex-1 py-1">
                <h3 className="text-slate-800 font-bold text-sm">Arquitetura de Software</h3>
                <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profa. Dra. Ana Clara
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">Sala 205</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PORTAL DE NOTÍCIAS ================= */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-slate-800 font-bold text-lg tracking-wide">Mural INBEC</h2>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">Ver todas</button>
          </div>
          
          {/* Carrossel de Notícias (Scroll Horizontal) */}
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory hide-scroll-bar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Card Notícia 1 */}
            <div className="shrink-0 w-[280px] snap-center bg-white/90 border border-slate-200/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-32 bg-slate-100 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
                 {/* Fundo Decorativo */}
                 <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-100 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                 
                <svg className="w-10 h-10 text-blue-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm z-10">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Evento</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hoje, 10:00</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2 leading-snug">Hackathon INBEC 2026: Inscrições Abertas</h3>
                </div>
                <button className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1.5 group/btn">
                  Ler notícia <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

            {/* Card Notícia 2 */}
            <div className="shrink-0 w-[280px] snap-center bg-white/90 border border-slate-200/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-32 bg-slate-100 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
                 {/* Fundo Decorativo */}
                 <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors"></div>
                 <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-100 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

                <svg className="w-10 h-10 text-red-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm z-10">
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Acadêmico</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ontem, 15:30</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2 leading-snug">Calendário de Provas Finais (AV2) Divulgado</h3>
                </div>
                <button className="mt-4 text-xs font-bold text-red-600 flex items-center gap-1.5 group/btn">
                  Ler notícia <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}