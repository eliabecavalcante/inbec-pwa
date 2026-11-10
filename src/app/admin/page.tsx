'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Estados de Segurança e Navegação
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // Guarda de Rota: Verifica quem está acessando
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      if (session.user.email !== 'admin@inbec.edu.br') {
        router.push('/menu');
        return;
      }
      
      setIsAuthorized(true);
    };
    
    checkAuth();
  }, [router]);

  // Função de Logout Real
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Função de Cadastro Real
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erro ao criar usuário.');

      setFeedback({ type: 'success', msg: `Usuário ${name} matriculado com sucesso!` });
      setName(''); setEmail(''); setPassword(''); setRole('student');
    } catch (error: any) {
      setFeedback({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

// Tela de Carregamento de Segurança
  if (!isAuthorized) {
    return (
      <div className="flex h-screen bg-[#070b14] items-center justify-center">
        <div className="flex flex-col items-center gap-3 bg-white/[0.02] border border-red-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <span className="text-white font-bold tracking-widest text-lg uppercase">Acesso Restrito</span>
          <span className="text-red-400 font-medium animate-pulse">Faça o login!</span>
          <span className="text-slate-500 text-xs mt-2">Redirecionando para autenticação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-300 font-sans overflow-hidden selection:bg-emerald-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-900/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[30rem] h-[30rem] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="relative z-20 w-72 flex flex-col bg-white/[0.02] border-r border-white/5 backdrop-blur-3xl h-full">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#070b14]/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">INBEC ERP</h1>
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-semibold">Gestão Universitária</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          <div>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Geral</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-left ${activeView === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-left border border-transparent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Corpo Discente (Alunos)
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-left border border-transparent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Corpo Docente
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Administração</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => setActiveView('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-left ${activeView === 'users' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  Cadastro de Usuários
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Acadêmico</p>
            <ul className="space-y-1">
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-left border border-transparent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Matrizes e Disciplinas
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Botão de Logout Seguro */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-white/[0.01] backdrop-blur-md flex items-center justify-between px-8">
          <div className="relative w-96">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar aluno por nome, CPF ou matrícula..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <span className="text-sm font-bold text-white">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">Administrador</p>
                <p className="text-xs text-slate-400">Reitoria INBEC</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* ================= VIEW: DASHBOARD ================= */}
          {activeView === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">Visão Geral do Semestre</h2>
                <p className="text-slate-400 mt-1">Dados atualizados em tempo real referente a 2026.2</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Alunos Matriculados</p>
                  <p className="text-3xl font-bold text-white">4.829</p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> +12% este mês</p>
                </div>
                
                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Corpo Docente</p>
                  <p className="text-3xl font-bold text-white">142</p>
                  <p className="text-xs text-slate-500 mt-2">100% de alocação nas turmas</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full group-hover:bg-amber-500/20 transition-colors"></div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Instalações do PWA</p>
                  <p className="text-3xl font-bold text-white">3.105</p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> 64% da base ativa</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-red-500/30 transition-colors">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors"></div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Inadimplência (30d)</p>
                  <p className="text-3xl font-bold text-white">8.4%</p>
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> -2.1% ref. mês passado</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                    <h3 className="text-lg font-medium text-white mb-4">Ações Rápidas</h3>
                    <div className="flex gap-4">
                      <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all w-24 h-24 group">
                        <svg className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-xs font-medium text-slate-300 text-center">Emitir<br/>Histórico</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all w-24 h-24 group">
                        <svg className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-medium text-slate-300 text-center">Abrir<br/>Turma</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all w-24 h-24 group">
                        <svg className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xs font-medium text-slate-300 text-center">Gerar<br/>Boleto</span>
                      </button>
                      <button 
                        onClick={() => setActiveView('users')}
                        className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl transition-all w-24 h-24 group"
                      >
                        <svg className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        <span className="text-xs font-medium text-emerald-400 text-center">Novo<br/>Usuário</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md h-full min-h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-white">Log do Sistema</h3>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Ao vivo</span>
                  </div>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-emerald-500/30 bg-[#070b14] text-emerald-500 shrink-0 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                        <p className="font-semibold text-sm text-slate-200">Boleto Pago</p>
                        <p className="text-xs text-slate-400 mt-1">Matrícula 2026110 - Eng. de Software</p>
                        <span className="text-[10px] text-slate-500 mt-2 block">Há 2 minutos</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full text-center mt-6 text-xs text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider font-semibold">Ver log completo &rarr;</button>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: CADASTRO DE USUÁRIOS ================= */}
          {activeView === 'users' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">Gestão de Usuários</h2>
                <p className="text-slate-400 mt-1">Matricule novos membros e defina os seus níveis de acesso.</p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 filter blur-[50px]"></div>
                
                <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">Central de Matrículas</h3>
                    <p className="text-sm text-slate-400">Preencha os dados oficiais para libertar o acesso ao sistema.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 ml-1">Nome Completo do Afiliado</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Carlos Eduardo" className="w-full bg-[#070b14]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 ml-1">E-mail Institucional</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="carlos@inbec.edu.br" className="w-full bg-[#070b14]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 ml-1">Senha de Primeiro Acesso</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Mínimo 6 dígitos" className="w-full bg-[#070b14]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 ml-1">Nível de Acesso (Cargo)</label>
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#070b14]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none appearance-none">
                        <option value="student">Aluno (Corpo Discente)</option>
                        <option value="professor">Professor (Corpo Docente)</option>
                        <option value="admin">Gestor Acadêmico (Reitoria)</option>
                      </select>
                    </div>
                  </div>

                  {feedback.msg && (
                    <div className={`p-4 rounded-xl text-sm border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feedback.type === 'success' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      {feedback.msg}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-bold py-3.5 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
                      {loading ? 'Processando matrícula...' : 'Confirmar Matrícula no Sistema'}
                      {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}