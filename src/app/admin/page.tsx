'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllUsers } from './actions';

type AdminTab = 'dashboard' | 'users' | 'pwa' | 'mural';
type RoleFilter = 'all' | 'student' | 'professor' | 'admin';

interface AdminUser {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  user_metadata?: {
    name?: string;
    full_name?: string;
    role?: string;
  };
}

const CHART_DATA = {
  week: [
    { label: 'Seg', total: 68, pwa: 54 },
    { label: 'Ter', total: 82, pwa: 69 },
    { label: 'Qua', total: 74, pwa: 61 },
    { label: 'Qui', total: 96, pwa: 84 },
    { label: 'Sex', total: 88, pwa: 75 },
    { label: 'Sáb', total: 52, pwa: 44 },
    { label: 'Dom', total: 38, pwa: 33 },
  ],
  month: [
    { label: 'Sem 1', total: 64, pwa: 48 },
    { label: 'Sem 2', total: 78, pwa: 62 },
    { label: 'Sem 3', total: 89, pwa: 74 },
    { label: 'Sem 4', total: 97, pwa: 85 },
  ],
};

const PWA_SUPPORT_QUEUE = [
  {
    id: 'sup-1',
    student: 'Marcos Vinícius Silva',
    email: 'marcos.silva@inbec.edu.br',
    device: 'iOS • Safari',
    course: 'Eng. de Software • 4º Sem',
    time: 'Há 35 min',
    status: 'Aguardando suporte',
  },
  {
    id: 'sup-2',
    student: 'Beatriz Oliveira Costa',
    email: 'beatriz.costa@inbec.edu.br',
    device: 'Android • Chrome',
    course: 'Eng. de Software • 2º Sem',
    time: 'Há 2 horas',
    status: 'Tutorial reenviado',
  },
  {
    id: 'sup-3',
    student: 'Lucas Gabriel Rocha',
    email: 'lucas.rocha@inbec.edu.br',
    device: 'iOS • Safari',
    course: 'Sistemas de Informação • 3º Sem',
    time: 'Ontem',
    status: 'Resolvido',
  },
];

const MURAL_EVENTS = [
  {
    id: 'ev-1',
    badge: 'Evento Oficial',
    title: 'Semana de Tecnologia & Inovação INBEC',
    period: '28 a 30 Nov • Destaque no App',
    views: '1.842 visualizações',
    active: true,
    accent: 'blue',
  },
  {
    id: 'ev-2',
    badge: 'Comunicado Reitoria',
    title: 'Rematrícula Antecipada 2027.1 com Desconto',
    period: 'Até 15 Dez • Destaque no App',
    views: '2.410 visualizações',
    active: true,
    accent: 'indigo',
  },
  {
    id: 'ev-3',
    badge: 'Carreiras & Estágio',
    title: 'Feira de Estágios Tech no Campus',
    period: '04 Dez • 18:00',
    views: '980 visualizações',
    active: true,
    accent: 'emerald',
  },
  {
    id: 'ev-4',
    badge: 'Acadêmico',
    title: 'Calendário de Provas Finais (AV2) Divulgado',
    period: '07 a 14 Dez • Mural INBEC',
    views: '3.120 visualizações',
    active: true,
    accent: 'red',
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  // Autenticação e Navegação
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@inbec.edu.br');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Dados reais de usuários (Supabase via Server Action)
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  // Busca e filtros da tabela
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  // Filtro visual do gráfico
  const [chartRange, setChartRange] = useState<'week' | 'month'>('week');

  // Estados do Formulário Real de Cadastro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError('');
    try {
      const usersData = await fetchAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Falha ao carregar usuários:', err);
      setUsersError(
        'Não foi possível buscar os usuários. Verifique a SUPABASE_SERVICE_ROLE_KEY na Vercel.'
      );
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Guarda de Rota Exclusiva do Administrador
  useEffect(() => {
    const initAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      if (session.user.email !== 'admin@inbec.edu.br') {
        router.replace('/menu');
        return;
      }

      setAdminEmail(session.user.email);
      setIsAuthorized(true);
      await loadUsers();
    };

    initAdmin();
  }, [router, loadUsers]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', msg: '' });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar usuário.');

      setFeedback({
        type: 'success',
        msg: `Usuário ${name} matriculado com sucesso no portal!`,
      });
      setName('');
      setEmail('');
      setPassword('');
      setRole('student');

      await loadUsers();
    } catch (error: any) {
      setFeedback({
        type: 'error',
        msg: error.message || 'Erro inesperado ao matricular usuário.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper para identificar cargo do usuário
  const getUserRole = (user: AdminUser): 'student' | 'professor' | 'admin' => {
    if (user.email === 'admin@inbec.edu.br') return 'admin';
    const metaRole = user.user_metadata?.role;
    if (metaRole === 'professor' || metaRole === 'admin' || metaRole === 'student') {
      return metaRole;
    }
    return 'student';
  };

  const getUserDisplayName = (user: AdminUser) => {
    const metaName = user.user_metadata?.name || user.user_metadata?.full_name;
    if (metaName) return metaName;
    if (!user.email) return 'Usuário INBEC';
    const prefix = user.email.split('@')[0].replace(/[._-]/g, ' ');
    return prefix
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Filtragem da tabela de usuários
  const filteredUsers = users.filter((u) => {
    const uRole = getUserRole(u);
    const matchesRole = roleFilter === 'all' || uRole === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesRole;

    const uName = getUserDisplayName(u).toLowerCase();
    const uEmail = (u.email || '').toLowerCase();
    const uId = u.id.toLowerCase();

    return matchesRole && (uName.includes(q) || uEmail.includes(q) || uId.includes(q));
  });

  // Contagens reais
  const activeLoggedCount = users.filter((u) => Boolean(u.last_sign_in_at)).length;

  // Tela de Verificação de Segurança
  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-red-400/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center gap-3 bg-white/90 backdrop-blur-xl border border-slate-200/80 p-8 rounded-3xl shadow-xl">
          <div className="w-10 h-10 border-4 border-blue-600/25 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-slate-800 font-bold text-sm tracking-wide">
            Validando credenciais da Reitoria...
          </span>
          <span className="text-slate-400 text-xs">Portal Administrativo INBEC</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-blue-500/20 relative">
      {/* Efeitos Liquid Glass Atmosféricos (Mesmo padrão das telas do aluno) */}
      <div className="fixed top-[-15%] left-[-5%] w-[44rem] h-[44rem] bg-blue-400/15 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[-5%] w-[38rem] h-[38rem] bg-red-400/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[35%] left-[45%] w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full filter blur-[110px] pointer-events-none"></div>

      {/* ============================================================
          SIDEBAR DESKTOP
         ============================================================ */}
      <aside className="relative z-20 w-72 shrink-0 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(15,23,42,0.03)]">
        {/* Logo Institucional */}
        <div className="px-7 py-6 border-b border-slate-200/50 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/25 ring-2 ring-white shrink-0">
            <span className="text-white font-black text-base tracking-widest">IN</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
              INBEC<span className="text-red-500">.</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Portal da Reitoria
            </p>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Principal
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-blue-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.9}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Visão Geral
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-blue-700'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.9}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Usuários & Matrículas
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === 'users'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {users.length}
                </span>
              </button>
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Ecossistema PWA
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('pwa')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeTab === 'pwa'
                    ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-blue-700'
                }`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.9}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Monitoramento PWA
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === 'pwa'
                      ? 'bg-white/20 text-white'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  2
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mural')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-sm font-bold ${
                  activeTab === 'mural'
                    ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-blue-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.9}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
                Mural & Eventos
              </button>
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Acadêmico (Em breve)
            </p>
            <div className="space-y-1 opacity-65">
              <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-slate-500 text-sm font-semibold cursor-not-allowed">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Matrizes & Disciplinas
                </span>
                <span className="text-[9px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                  Fase 2
                </span>
              </div>

              <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-slate-500 text-sm font-semibold cursor-not-allowed">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Turmas & Diários
                </span>
                <span className="text-[9px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                  Fase 2
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-200/50 space-y-3">
          <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Supabase Conectado</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                Ambiente Produção • 2026.2
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/70 rounded-2xl transition-all font-bold text-sm active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* ============================================================
          ÁREA PRINCIPAL (DESKTOP)
         ============================================================ */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        {/* Topbar Fixa */}
        <header className="px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between gap-6 shrink-0 z-30">
          {/* Busca Global (leva direto para aba de usuários ao digitar) */}
          <div className="relative w-full max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'users' && e.target.value.trim().length > 0) {
                  setActiveTab('users');
                }
              }}
              placeholder="Buscar conta por nome, e-mail institucional ou ID..."
              className="w-full bg-white/90 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M12 4v16m8-8H4" />
              </svg>
              Nova Matrícula
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-tight">Reitoria INBEC</p>
                <p className="text-[11px] text-slate-400 font-medium">{adminEmail}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/20 ring-2 ring-white">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* ============================================================
                ABA 1: VISÃO GERAL (DASHBOARD)
               ============================================================ */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Banner Hero Desktop */}
                <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full pointer-events-none"></div>
                  <div className="absolute left-1/3 -bottom-16 w-60 h-60 bg-red-500/20 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                        Semestre Letivo 2026.2 • Operação Online
                      </span>
                      <h2 className="text-3xl font-black tracking-tight mt-3">
                        Painel Administrativo do Portal PWA
                      </h2>
                      <p className="text-blue-100/90 text-sm mt-1.5 max-w-2xl">
                        Gerencie matrículas de alunos e docentes, acompanhe a taxa de instalação do
                        aplicativo no campus e publique avisos no mural acadêmico.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg active:scale-95 transition-all"
                      >
                        Gerenciar Contas ({users.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('pwa')}
                        className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm backdrop-blur-md active:scale-95 transition-all"
                      >
                        Status do PWA
                      </button>
                    </div>
                  </div>
                </section>

                {/* Cards de KPIs */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {/* KPI Real: Contas no Supabase */}
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Contas Registradas
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          Real
                        </span>
                      </div>
                      <p className="text-4xl font-black text-slate-900 mt-3">
                        {loadingUsers ? '—' : users.length}
                      </p>
                      <p className="text-xs font-semibold text-emerald-600 mt-2">
                        {activeLoggedCount} já realizaram login no portal
                      </p>
                    </div>
                  </div>

                  {/* KPI Fictício: Instalações PWA */}
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Adoção do PWA
                      </span>
                      <p className="text-4xl font-black text-slate-900 mt-3">84%</p>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div className="h-full w-[84%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* KPI Fictício: Suporte PWA */}
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Suporte Instalação
                      </span>
                      <p className="text-4xl font-black text-red-600 mt-3">2</p>
                      <p className="text-xs font-semibold text-slate-500 mt-2">
                        Alunos marcaram dificuldade no prompt
                      </p>
                    </div>
                  </div>

                  {/* KPI Fictício: Engajamento */}
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Frequência Média
                      </span>
                      <p className="text-4xl font-black text-indigo-700 mt-3">93.4%</p>
                      <p className="text-xs font-semibold text-emerald-600 mt-2">
                        +3,2% em relação ao semestre 2026.1
                      </p>
                    </div>
                  </div>
                </section>

                {/* Grid Principal Desktop: Gráfico + Live Feed */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Gráfico de Acessos */}
                  <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-7 shadow-sm flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          Acessos ao Portal Acadêmico
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Comparativo entre acessos totais (azul claro) e via App PWA instalado (azul
                          escuro)
                        </p>
                      </div>

                      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => setChartRange('week')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            chartRange === 'week'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          7 dias
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartRange('month')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            chartRange === 'month'
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          Mês atual
                        </button>
                      </div>
                    </div>

                    <div className="h-56 flex items-end gap-4 pt-4">
                      {CHART_DATA[chartRange].map((bar) => (
                        <div
                          key={bar.label}
                          className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group"
                        >
                          <div
                            className="w-full max-w-[54px] bg-blue-100 rounded-t-2xl relative overflow-hidden transition-all duration-500 group-hover:bg-blue-200/80"
                            style={{ height: `${bar.total}%` }}
                          >
                            <div
                              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-2xl transition-all duration-700"
                              style={{ height: `${Math.round((bar.pwa / bar.total) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-slate-500">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Atividades Recentes */}
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-800">Atividade Recente</h3>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        Ao vivo
                      </span>
                    </div>

                    <div className="space-y-5 relative before:absolute before:inset-y-2 before:left-[19px] before:w-0.5 before:bg-slate-100">
                      <div className="relative flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-white text-emerald-600 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">PWA instalado com sucesso</p>
                          <p className="text-xs text-slate-500 mt-0.5">Ana Beatriz • Eng. Software (iOS)</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">Agora mesmo</span>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-white text-blue-600 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Nova entrega registrada</p>
                          <p className="text-xs text-slate-500 mt-0.5">Turma Full-Stack • Atividade AV2</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">Há 14 min</span>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 border-2 border-white text-red-600 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Pedido de ajuda no PWA</p>
                          <p className="text-xs text-slate-500 mt-0.5">Marcos Vinícius • Safari iOS</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 block">Há 35 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ============================================================
                ABA 2: GESTÃO DE USUÁRIOS & MATRÍCULAS (FUNCIONAL)
               ============================================================ */}
            {activeTab === 'users' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Gestão de Usuários & Matrículas
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Crie credenciais oficiais de acesso e acompanhe todas as contas registradas no
                      Supabase.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadUsers}
                    disabled={loadingUsers}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <svg
                      className={`w-4 h-4 ${loadingUsers ? 'animate-spin text-blue-600' : 'text-slate-500'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {loadingUsers ? 'Atualizando...' : 'Atualizar tabela'}
                  </button>
                </div>

                {/* Formulário de Cadastro */}
                <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-7 shadow-sm">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Nova Matrícula no Portal</h3>
                      <p className="text-xs text-slate-500">
                        Preencha os dados para liberar imediatamente o acesso do membro no PWA.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Ex: Maria Fernandes"
                          className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                          E-mail Institucional
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="maria@inbec.edu.br"
                          className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                          Senha Provisória
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">
                          Vínculo / Cargo
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        >
                          <option value="student">Aluno (Corpo Discente)</option>
                          <option value="professor">Professor (Corpo Docente)</option>
                          <option value="admin">Administração (Reitoria)</option>
                        </select>
                      </div>
                    </div>

                    {feedback.msg && (
                      <div
                        className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 border ${
                          feedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {feedback.type === 'success' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                        {feedback.msg}
                      </div>
                    )}

                    <div className="flex justify-end pt-3 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-tr from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm py-3 px-7 rounded-2xl shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting ? 'Processando matrícula...' : 'Confirmar Matrícula'}
                        {!submitting && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </form>
                </section>

                {/* Tabela Geral de Contas Registradas */}
                <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-7 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Contas Registradas ({filteredUsers.length})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Base sincronizada em tempo real com o Supabase Auth.
                      </p>
                    </div>

                    {/* Filtros por Cargo */}
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { key: 'all', label: 'Todos' },
                          { key: 'student', label: 'Alunos' },
                          { key: 'professor', label: 'Professores' },
                          { key: 'admin', label: 'Reitoria' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setRoleFilter(tab.key)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            roleFilter === tab.key
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {usersError && (
                    <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                      {usersError}
                    </div>
                  )}

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200/80">
                          <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Membro / E-mail
                          </th>
                          <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Perfil
                          </th>
                          <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Data de Cadastro
                          </th>
                          <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Último Acesso
                          </th>
                          <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => {
                          const uRole = getUserRole(user);
                          const displayName = getUserDisplayName(user);
                          const avatarInitials = displayName.substring(0, 2).toUpperCase();

                          return (
                            <tr
                              key={user.id}
                              className="hover:bg-blue-50/30 transition-colors"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 font-black text-xs flex items-center justify-center shrink-0">
                                    {avatarInitials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-sm text-slate-800 truncate">
                                      {displayName}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      ID: {user.id.substring(0, 10)}...
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                    uRole === 'admin'
                                      ? 'bg-red-50 text-red-600 border-red-100'
                                      : uRole === 'professor'
                                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                      : 'bg-blue-50 text-blue-600 border-blue-100'
                                  }`}
                                >
                                  {uRole === 'admin'
                                    ? 'Reitoria'
                                    : uRole === 'professor'
                                    ? 'Docente'
                                    : 'Aluno'}
                                </span>
                              </td>

                              <td className="p-4 text-sm font-medium text-slate-600">
                                {new Date(user.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}
                              </td>

                              <td className="p-4 text-sm font-medium text-slate-600">
                                {user.last_sign_in_at ? (
                                  new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                ) : (
                                  <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    Primeiro acesso pendente
                                  </span>
                                )}
                              </td>

                              <td className="p-4 text-center">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full">
                                  Ativo
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {!loadingUsers && filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-slate-500 text-sm">
                              Nenhuma conta encontrada para os filtros selecionados.
                            </td>
                          </tr>
                        )}

                        {loadingUsers && (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">
                              Carregando base de contas do Supabase...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* ============================================================
                ABA 3: MONITORAMENTO PWA (VISÃO EXECUTIVA)
               ============================================================ */}
            {activeTab === 'pwa' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Monitoramento do Aplicativo PWA
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Acompanhe instalações na tela inicial e atendimentos gerados pelo prompt de 3
                    acessos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Confirmaram Instalação
                    </span>
                    <p className="text-4xl font-black text-emerald-600 mt-2">84%</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Responderam &quot;Consegui&quot; no fluxo guiado
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Distribuição Mobile
                    </span>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">Android (Chrome)</span>
                        <span className="text-blue-600">58%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[58%] bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold pt-1">
                        <span className="text-slate-700">iOS (Safari)</span>
                        <span className="text-indigo-600">42%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[42%] bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-6 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Fila de Suporte
                    </span>
                    <p className="text-4xl font-black text-red-600 mt-2">2</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Chamados em aberto na tabela pwa_status
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-5">
                    Alunos que relataram dificuldade na instalação
                  </h3>
                  <div className="space-y-3">
                    {PWA_SUPPORT_QUEUE.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.student}</p>
                          <p className="text-xs text-slate-500">
                            {item.email} • {item.course}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                            {item.device}
                          </span>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              item.status === 'Resolvido'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'Aguardando suporte'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================
                ABA 4: MURAL & EVENTOS DO APP
               ============================================================ */}
            {activeTab === 'mural' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Mural & Destaques do Portal
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Comunicados exibidos no carrossel automático da tela inicial dos alunos.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                  >
                    + Novo Comunicado
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {MURAL_EVENTS.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                            {ev.badge}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600">
                            Publicado no App
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mt-3">{ev.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{ev.period}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span>{ev.views}</span>
                        <span className="text-blue-600 font-bold">Em exibição</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}