'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  accent: 'blue' | 'red' | 'indigo';
}

const NEWS_LIST: NewsItem[] = [
  {
    id: 'news-1',
    tag: 'Evento',
    date: 'Hoje, 10:00',
    title: 'Hackathon INBEC 2026: Inscrições Abertas',
    summary: 'Maratona de 48h de inovação e desenvolvimento para todos os cursos de tecnologia.',
    content:
      'As inscrições para o Hackathon INBEC 2026 estão oficialmente abertas! Monte uma equipe de até 4 integrantes e desenvolva soluções reais com mentoria de professores e empresas parceiras. Os 3 primeiros lugares receberão bolsas de extensão, certificados de 30h complementares e premiações exclusivas.',
    accent: 'blue',
  },
  {
    id: 'news-2',
    tag: 'Acadêmico',
    date: 'Ontem, 15:30',
    title: 'Calendário de Provas Finais (AV2) Divulgado',
    summary: 'Confira as datas oficiais das avaliações do segundo bimestre de 2026.2.',
    content:
      'A coordenação acadêmica publicou o cronograma completo das avaliações AV2 referentes ao semestre 2026.2. As provas acontecem entre os dias 07 e 14 de dezembro nos respectivos horários de aula. Verifique a sala da sua turma na aba Disciplinas com antecedência.',
    accent: 'red',
  },
  {
    id: 'news-3',
    tag: 'Biblioteca',
    date: 'Há 3 dias',
    title: 'Novo Acervo Digital de Engenharia de Software',
    summary: 'Mais de 180 novos e-books sobre Next.js, Cloud, DevOps e Arquitetura disponíveis.',
    content:
      'Os alunos regularmente matriculados já podem acessar a nova coleção digital da biblioteca INBEC diretamente pelo portal. O empréstimo digital tem duração de 14 dias com renovação automática pelo aplicativo.',
    accent: 'indigo',
  },
];

const NOTIFICATIONS = [
  {
    id: 'not-1',
    title: 'Prazo próximo em Full-Stack',
    desc: 'A atividade "API REST com JWT" vence nesta sexta-feira às 23:59.',
    time: 'Há 18 min',
    unread: true,
    href: '/homework',
  },
  {
    id: 'not-2',
    title: 'Mudança de Laboratório',
    desc: 'Aula prática de quinta transferida excepcionalmente para o Lab 2.',
    time: 'Ontem',
    unread: true,
    href: '/courses/sala',
  },
  {
    id: 'not-3',
    title: 'Nota lançada na AV2',
    desc: 'Prof. Marcos lançou sua nota (9.0) em Desenv. Web Full-Stack.',
    time: 'Há 2 dias',
    unread: false,
    href: '/courses/sala',
  },
];

export default function MenuPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('Aluno');
  const [initials, setInitials] = useState('AL');
  const [greeting, setGreeting] = useState('Olá');
  const [todayLabel, setTodayLabel] = useState('');

  // Modais interativos
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

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

      const email = session.user.email || '';
      setUserEmail(email);

      const metaName =
        session.user.user_metadata?.name || session.user.user_metadata?.full_name;

      if (metaName && typeof metaName === 'string') {
        const parts = metaName.trim().split(' ').filter(Boolean);
        setFirstName(parts[0] || 'Aluno');
        const init =
          parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`
            : metaName.substring(0, 2);
        setInitials(init.toUpperCase());
      } else if (email) {
        const prefix = email.split('@')[0].replace(/[._-]/g, ' ').trim();
        const first = prefix.split(' ')[0] || 'Aluno';
        const capitalized = first.charAt(0).toUpperCase() + first.slice(1);
        setFirstName(capitalized);
        setInitials(capitalized.substring(0, 2).toUpperCase());
      }

      setIsAuthorized(true);
    };

    checkAuth();

    // Saudação e data dinâmicas
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const formattedDate = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    setTodayLabel(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="text-slate-800 font-bold text-lg uppercase tracking-wider">
            Acesso Restrito
          </span>
          <span className="text-red-500 font-medium animate-pulse">Faça o login!</span>
          <span className="text-slate-500 text-xs mt-2">Redirecionando de volta...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden pb-32 font-sans selection:bg-blue-500/30 text-slate-800">
      {/* Efeitos Liquid Glass Claros e Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[30%] left-[50%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* ================= HEADER DO ALUNO ================= */}
      <header className="sticky top-0 z-30 w-full px-5 pt-14 pb-5 bg-white/75 backdrop-blur-xl border-b border-slate-200/50 rounded-b-3xl shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center gap-3">
          <Link href="/profile" className="flex items-center gap-3.5 min-w-0 group">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 shadow-lg shadow-blue-600/20 flex items-center justify-center ring-2 ring-white group-active:scale-95 transition-transform">
                <span className="text-white font-black text-base tracking-wider">{initials}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider leading-none">
                {greeting}
              </p>
              <h1 className="text-lg font-black text-slate-800 tracking-tight truncate mt-0.5">
                {firstName}
              </h1>
              <p className="text-slate-400 text-[11px] font-medium truncate">{userEmail}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              aria-label="Abrir notificações"
              className="relative w-10 h-10 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-2xl flex items-center justify-center transition-all text-slate-500 hover:text-blue-600 shadow-sm active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.9}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sair"
              className="w-10 h-10 bg-white hover:bg-red-50 border border-slate-200/80 rounded-2xl flex items-center justify-center transition-all text-slate-400 hover:text-red-500 shadow-sm active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto px-5 pt-6 flex flex-col gap-7">
        {/* ================= CARD HERO: PRÓXIMA AULA & RESUMO ================= */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-5 rounded-[28px] text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-10 w-28 h-28 bg-red-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Próxima Aula • 18:30
              </span>
              <span className="text-[11px] font-bold text-blue-100">2026.2</span>
            </div>

            <h2 className="text-lg font-black mt-3 leading-snug">
              Desenvolvimento Web Full-Stack
            </h2>
            <p className="text-xs text-blue-100/90 font-medium mt-0.5">
              Prof. Dr. Marcos • Laboratório 4
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/15">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-100/75 font-bold block">
                  CR Geral
                </span>
                <span className="text-base font-black">8.9</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-100/75 font-bold block">
                  Presença
                </span>
                <span className="text-base font-black">95%</span>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href="/courses/sala"
                  className="text-[11px] font-bold bg-white text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all"
                >
                  Abrir sala
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ATALHOS RÁPIDOS ================= */}
        <section className="grid grid-cols-4 gap-2.5">
          <Link
            href="/courses"
            className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:border-blue-200"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700">Matérias</span>
          </Link>

          <Link
            href="/homework"
            className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:border-amber-200"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700">Entregas</span>
          </Link>

          <Link
            href="/profile"
            className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:border-indigo-200"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700">ID Digital</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:border-red-200"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-700">Avisos</span>
          </button>
        </section>

        {/* ================= INFORMATIVO DE ATIVIDADES (CONECTADO AO /HOMEWORK) ================= */}
        <section className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur opacity-20 group-hover:opacity-35 transition duration-500 pointer-events-none"></div>
          <Link
            href="/homework"
            className="relative bg-white/95 backdrop-blur-xl border border-amber-200/70 p-4 rounded-3xl shadow-sm flex items-center gap-3.5 active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 shrink-0 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-amber-600 font-bold text-sm">Atenção aos Prazos</h2>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Você possui <strong className="text-slate-800">2 atividades</strong> de Engenharia
                de Software vencendo nesta sexta-feira.
              </p>
            </div>
            <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-amber-50 rounded-full text-amber-600 group-hover:translate-x-0.5 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </section>

        {/* ================= GRADE DO DIA ================= */}
        <section>
          <div className="flex justify-between items-end mb-3.5 px-1">
            <div>
              <h2 className="text-slate-800 font-bold text-base tracking-tight">Aulas de Hoje</h2>
              <p className="text-slate-500 text-xs mt-0.5">{todayLabel || 'Semestre 2026.2'}</p>
            </div>
            <Link
              href="/courses"
              className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-xl transition-colors"
            >
              Ver grade
            </Link>
          </div>

          <div className="space-y-3.5">
            {/* Aula 1 */}
            <Link
              href="/courses/sala"
              className="bg-white/90 border border-slate-200/70 hover:border-blue-200 p-4 rounded-3xl backdrop-blur-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex gap-4 relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-3xl"></div>
              <div className="flex flex-col items-center justify-center shrink-0 w-14 pl-1">
                <span className="text-slate-800 font-black text-lg">18:30</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  Início
                </span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex-1 py-0.5 min-w-0">
                <h3 className="text-slate-800 font-bold text-sm truncate group-hover:text-blue-700 transition-colors">
                  Desenvolvimento Web Full-Stack
                </h3>
                <p className="text-slate-500 text-xs mt-1 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Prof. Dr. Marcos
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    Laboratório 4
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Presencial
                  </span>
                </div>
              </div>
            </Link>

            {/* Aula 2 */}
            <Link
              href="/courses/sala"
              className="bg-white/90 border border-slate-200/70 hover:border-red-200 p-4 rounded-3xl backdrop-blur-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex gap-4 relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-3xl"></div>
              <div className="flex flex-col items-center justify-center shrink-0 w-14 pl-1">
                <span className="text-slate-800 font-black text-lg">20:20</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                  Início
                </span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex-1 py-0.5 min-w-0">
                <h3 className="text-slate-800 font-bold text-sm truncate group-hover:text-red-700 transition-colors">
                  Arquitetura de Software
                </h3>
                <p className="text-slate-500 text-xs mt-1 flex items-center gap-1 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profa. Dra. Ana Clara
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    Sala 205
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Presencial
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ================= PORTAL DE NOTÍCIAS (MURAL INBEC) ================= */}
        <section className="mb-4">
          <div className="flex justify-between items-center mb-3.5 px-1">
            <div>
              <h2 className="text-slate-800 font-bold text-base tracking-tight">Mural INBEC</h2>
              <p className="text-slate-500 text-xs mt-0.5">Comunicados e eventos do campus</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Deslize →
            </span>
          </div>

          <div
            className="flex gap-3.5 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {NEWS_LIST.map((news) => {
              const isBlue = news.accent === 'blue';
              const isRed = news.accent === 'red';

              return (
                <button
                  key={news.id}
                  type="button"
                  onClick={() => setSelectedNews(news)}
                  className="shrink-0 w-[265px] snap-center text-left bg-white/90 border border-slate-200/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex flex-col group"
                >
                  <div className="h-28 w-full bg-slate-100 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
                    <div
                      className={`absolute inset-0 transition-colors ${
                        isBlue
                          ? 'bg-blue-600/5 group-hover:bg-blue-600/10'
                          : isRed
                          ? 'bg-red-600/5 group-hover:bg-red-600/10'
                          : 'bg-indigo-600/5 group-hover:bg-indigo-600/10'
                      }`}
                    ></div>
                    <div
                      className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 ${
                        isBlue ? 'bg-blue-200/60' : isRed ? 'bg-red-200/60' : 'bg-indigo-200/60'
                      }`}
                    ></div>

                    <svg
                      className={`w-10 h-10 relative z-10 ${
                        isBlue ? 'text-blue-400' : isRed ? 'text-red-400' : 'text-indigo-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {isBlue ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      ) : isRed ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      )}
                    </svg>

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm z-10">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${
                          isBlue ? 'text-blue-600' : isRed ? 'text-red-600' : 'text-indigo-600'
                        }`}
                      >
                        {news.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {news.date}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-1.5 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>
                    <span
                      className={`mt-4 text-xs font-bold flex items-center gap-1.5 ${
                        isBlue ? 'text-blue-600' : isRed ? 'text-red-600' : 'text-indigo-600'
                      }`}
                    >
                      Ler comunicado
                      <svg
                        className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* ============================================================
          MODAL DE LEITURA DE NOTÍCIA
         ============================================================ */}
      {selectedNews && (
        <div
          onClick={() => setSelectedNews(null)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                  selectedNews.accent === 'blue'
                    ? 'text-blue-600 bg-blue-50 border-blue-100'
                    : selectedNews.accent === 'red'
                    ? 'text-red-600 bg-red-50 border-red-100'
                    : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                }`}
              >
                {selectedNews.tag} • {selectedNews.date}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-800 leading-snug">
              {selectedNews.title}
            </h3>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {selectedNews.content}
            </p>

            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="mt-6 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL DE NOTIFICAÇÕES
         ============================================================ */}
      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Notificações</h3>
                <p className="text-xs text-slate-500">Atualizações recentes do seu semestre</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2.5">
              {NOTIFICATIONS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setShowNotifications(false)}
                  className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                      )}
                      <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}