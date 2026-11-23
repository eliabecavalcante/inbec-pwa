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

  const navItems = [
    {
      label: 'Início',
      href: '/menu',
      isActive: pathname === '/menu',
      hasNotification: false,
      icon: (active: boolean) => (
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-105' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.3 : 1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: 'Disciplinas',
      href: '/courses',
      isActive: pathname.startsWith('/course'),
      hasNotification: false,
      icon: (active: boolean) => (
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-105' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.3 : 1.8}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      label: 'Atividades',
      href: '/homework',
      isActive: pathname.startsWith('/homework'),
      hasNotification: true,
      icon: (active: boolean) => (
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-105' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.3 : 1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      label: 'Perfil',
      href: '/profile',
      isActive: pathname.startsWith('/profile'),
      hasNotification: false,
      icon: (active: boolean) => (
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-105' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 2.3 : 1.8}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 pointer-events-auto">
      <nav
        aria-label="Navegação principal"
        className="w-full bg-white/85 backdrop-blur-2xl border border-white ring-1 ring-slate-200/70 shadow-[0_12px_36px_rgba(15,23,42,0.12)] rounded-[28px] p-1.5 flex items-center justify-between gap-1"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[22px] gap-1 transition-all duration-300 active:scale-95 ${
              item.isActive
                ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/70'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {item.icon(item.isActive)}

              {/* Bolinha de notificação sutil quando há pendências */}
              {item.hasNotification && !item.isActive && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </div>

            <span
              className={`text-[10px] leading-none tracking-tight transition-colors ${
                item.isActive ? 'font-bold text-white' : 'font-semibold'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}