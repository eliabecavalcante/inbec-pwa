'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllUsers } from './actions';

export default function AdminDashboard() {
  const router = useRouter();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);

  // Estados do Formulário Real
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    const initAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== 'admin@inbec.edu.br') {
        router.push('/login');
        return;
      }
      setIsAuthorized(true);
      
      const usersData = await fetchAllUsers();
      setUsers(usersData);
    };
    initAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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
      
      const updatedUsers = await fetchAllUsers();
      setUsers(updatedUsers);
    } catch (error: any) {
      setFeedback({ type: 'error', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Efeitos Background Liquid Glass */}
      <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-blue-400/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-red-400/10 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className="relative z-20 w-72 bg-white/70 backdrop-blur-2xl border-r border-slate-200/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-slate-200/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-950">INBEC<span className="text-red-500">.</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal Reitoria</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* Seção Principal */}
          <div>
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visão Geral</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-700'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>
                Dashboard
              </button>
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-700'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Corpo Discente
              </button>
            </div>
          </div>

          {/* Seção Fictícia */}
          <div>
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Acadêmico</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-all font-medium text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Matrizes Curriculares
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-all font-medium text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Turmas & Diários
              </button>
            </div>
          </div>

          {/* Seção Fictícia */}
          <div>
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sistema</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-blue-700 transition-all font-medium text-sm flex justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Avisos PWA
                </div>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-5 border-t border-slate-200/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-colors font-bold text-sm">
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-y-auto">
        
        {/* Topbar */}
        <header className="px-10 py-6 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/40">
          <div className="relative w-96 hidden md:block">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar aluno, RA ou turma..." className="w-full bg-white/60 border border-slate-200 rounded-full pl-12 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" />
          </div>
          
          <div className="flex items-center gap-5 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Diretoria INBEC</p>
              <p className="text-xs text-emerald-600 font-semibold">Online agora</p>
            </div>
            <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md">
              DI
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          
          {/* ================= DASHBOARD VIEW (COMPLETAMENTE FICTÍCIO E RICO) ================= */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-blue-950">Resumo Universitário</h2>
                  <p className="text-sm text-slate-500 mt-1">Métricas atualizadas em tempo real referentes a 2026.2</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Exportar PDF
                </button>
              </div>

              {/* Cards de Topo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                  <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-bold mb-2">Alunos Ativos</p>
                    <p className="text-4xl font-black text-blue-950">3.492</p>
                    <p className="text-xs font-semibold text-emerald-500 mt-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> +124 neste mês</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                  <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-bold mb-2">Instalações do PWA</p>
                    <p className="text-4xl font-black text-blue-950">84%</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[84%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                  <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-bold mb-2">Alunos com Dificuldade</p>
                    <p className="text-4xl font-black text-red-600">12</p>
                    <p className="text-xs font-semibold text-slate-500 mt-2">Relataram erro ao instalar</p>
                  </div>
                </div>

                <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-600/30 relative overflow-hidden group text-white">
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                  <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-bold mb-2">Receita Prevista (Mês)</p>
                    <p className="text-4xl font-black">R$ 1.2M</p>
                    <p className="text-xs font-semibold text-blue-100 mt-2 flex items-center gap-1">94% de adimplência</p>
                  </div>
                </div>
              </div>

              {/* Grid Secundário */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Gráfico Fictício de Acessos ao PWA */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Acessos Diários ao PWA</h3>
                      <p className="text-xs text-slate-500">Volume de alunos logados nos últimos 7 dias</p>
                    </div>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 outline-none">
                      <option>Esta semana</option>
                      <option>Este mês</option>
                    </select>
                  </div>
                  
                  {/* Faux Chart usando Flexbox */}
                  <div className="h-48 flex items-end gap-2 md:gap-4 w-full pt-4">
                    {[40, 65, 45, 80, 55, 95, 75].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors" style={{ height: `${height}%` }}>
                          <div className={`absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-blue-700`} style={{ height: `${height - 15}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feed de Atividades Recentes */}
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Live Feed</h3>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                    
                    <div className="relative flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-emerald-600 z-10 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Ana Beatriz instalou o PWA</p>
                        <p className="text-xs text-slate-500 mt-0.5">Engenharia de Software • iOS</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Agora mesmo</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 z-10 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Mensalidade Paga</p>
                        <p className="text-xs text-slate-500 mt-0.5">Carlos Eduardo via PIX (R$ 850,00)</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Há 12 min</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-red-600 z-10 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Erro na Instalação PWA</p>
                        <p className="text-xs text-slate-500 mt-0.5">Marcos Silva solicitou ajuda</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">Há 1h</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW: GESTÃO DE UTILIZADORES (FUNCIONAL) ================= */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-3xl font-black text-blue-950">Gestão do Corpo Discente</h2>
                  <p className="text-sm text-slate-500 mt-1">Controle de acessos e matrículas do portal acadêmico.</p>
                </div>
              </div>

              {/* Formulário de Registo Real */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                
                <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Nova Matrícula no PWA</h3>
                    <p className="text-sm text-slate-500">Gere as credenciais para libertar o acesso do aluno ao sistema.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Nome Completo</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Maria Fernandes" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">E-mail Institucional</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="maria@inbec.edu.br" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Senha Provisória</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Vínculo</label>
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none font-medium">
                        <option value="student">🎓 Aluno (Corpo Discente)</option>
                        <option value="professor">👨‍🏫 Professor (Corpo Docente)</option>
                        <option value="admin">⚙️ Administração</option>
                      </select>
                    </div>
                  </div>

                  {feedback.msg && (
                    <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30 flex items-center gap-2">
                      {loading ? 'A processar matrícula...' : 'Finalizar Matrícula'}
                      {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabela de Alunos Integrada */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold text-slate-800">Contas Registadas ({users.length})</h3>
                  
                  {/* Faux Filters */}
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer">Todos</div>
                    <div className="px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-lg cursor-pointer">Professores</div>
                    <div className="px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-lg cursor-pointer">Bloqueados</div>
                  </div>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Membro</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Ingresso</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Último Login PWA</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{user.email}</div>
                            <div className="text-[10px] text-slate-400 mt-1 font-mono bg-slate-100 inline-block px-1.5 rounded">ID: {user.id.substring(0, 8)}</div>
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">
                            {new Date(user.created_at).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString('pt-PT', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}) 
                              : <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs font-bold">Pendente</span>}
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black rounded-full tracking-wider">Ativo</span>
                          </td>
                          <td className="p-4 text-center flex justify-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Bloquear">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Buscando base de alunos...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}