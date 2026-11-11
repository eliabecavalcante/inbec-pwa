'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CoursesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Guarda de Rota
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
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-28 font-sans selection:bg-blue-200 text-slate-800 overflow-x-hidden">
      
      {/* Efeitos Liquid Glass Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>

      {/* Cabeçalho Estilo App Nativo */}
      <header className="px-5 pt-14 pb-6 bg-white/70 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center shadow-sm rounded-b-3xl border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-bold text-sm tracking-widest">IN</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Disciplinas</h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">4º Semestre • INBEC 2026.2</p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 flex flex-col gap-4 relative z-10 max-w-md mx-auto w-full">
        
        {/* Item Lista 1 */}
        <Link href="/courses/sala" className="flex items-center gap-4 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border border-slate-200/60 hover:border-blue-200 group">
          <div className="w-14 h-14 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">Quintas • 18:30</span>
            <h2 className="text-slate-800 font-bold text-[15px] truncate group-hover:text-blue-700 transition-colors">Desenv. Web Full-Stack</h2>
            <p className="text-slate-500 text-xs mt-1 truncate font-medium">Prof. Marcos • Lab 4</p>
          </div>
          <div className="text-slate-300 shrink-0 group-hover:text-blue-500 transition-colors group-hover:translate-x-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>

        {/* Item Lista 2 */}
        <Link href="/courses/sala" className="flex items-center gap-4 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border border-slate-200/60 hover:border-red-200 group">
          <div className="w-14 h-14 shrink-0 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-0.5">Quintas • 20:20</span>
            <h2 className="text-slate-800 font-bold text-[15px] truncate group-hover:text-red-700 transition-colors">Arquitetura de Software</h2>
            <p className="text-slate-500 text-xs mt-1 truncate font-medium">Profa. Ana Clara • Sala 205</p>
          </div>
          <div className="text-slate-300 shrink-0 group-hover:text-red-500 transition-colors group-hover:translate-x-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>

        {/* Item Lista 3 */}
        <Link href="/courses/sala" className="flex items-center gap-4 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border border-slate-200/60 hover:border-slate-300 group">
          <div className="w-14 h-14 shrink-0 bg-slate-100 text-blue-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Terças • 18:30</span>
            <h2 className="text-slate-800 font-bold text-[15px] truncate group-hover:text-blue-900 transition-colors">Banco de Dados Avançado</h2>
            <p className="text-slate-500 text-xs mt-1 truncate font-medium">Prof. Renato • Lab 2</p>
          </div>
          <div className="text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors group-hover:translate-x-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
      </main>
    </div>
  );
}