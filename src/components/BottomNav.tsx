'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Oculta o menu se estiver na tela de login, raiz ou rotas de admin
  if (pathname === '/login' || pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[380px] h-16 z-50 bg-[#070b14]/85 backdrop-blur-md border border-white/10 shadow-2xl rounded-full flex justify-between items-center px-2">
      
      {/* Botão Início */}
      <Link href="/menu" className="flex flex-col items-center justify-center w-full h-full gap-1 group relative">
        <svg 
          className={`w-5 h-5 transition-all duration-300 ${pathname === '/menu' ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/menu' ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className={`text-[10px] font-medium transition-colors ${pathname === '/menu' ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
          Início
        </span>
      </Link>

      {/* Botão Disciplinas */}
      <Link href="/courses" className="flex flex-col items-center justify-center w-full h-full gap-1 group relative">
        <svg 
          className={`w-5 h-5 transition-all duration-300 ${pathname.includes('/course') ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.includes('/course') ? 2.5 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className={`text-[10px] font-medium transition-colors ${pathname.includes('/course') ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
          Disciplinas
        </span>
      </Link>

      {/* Botão Atividades */}
      <Link href="/activities" className="flex flex-col items-center justify-center w-full h-full gap-1 group relative">
        <svg 
          className={`w-5 h-5 transition-all duration-300 ${pathname.includes('/activities') ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.includes('/activities') ? 2.5 : 2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span className={`text-[10px] font-medium transition-colors ${pathname.includes('/activities') ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
          Atividades
        </span>
      </Link>

      {/* Botão Perfil */}
      <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full gap-1 group relative">
        <svg 
          className={`w-5 h-5 transition-all duration-300 ${pathname === '/profile' ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/profile' ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className={`text-[10px] font-medium transition-colors ${pathname === '/profile' ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
          Perfil
        </span>
      </Link>

    </nav>
  );
}