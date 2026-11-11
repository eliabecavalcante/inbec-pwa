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

  // Estados do Formulário
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
      
      // Carrega os alunos da Server Action
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
      
      // Atualiza a lista de utilizadores automaticamente
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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Efeitos Liquid Glass de Fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-red-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Sidebar Lateral */}
      <aside className="relative z-20 w-72 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl shadow-slate-200/20">
        <div className="p-8 border-b border-slate-200/50">
          <h1 className="text-2xl font-black tracking-tight text-blue-900">INBEC<span className="text-red-600">.</span></h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Portal da Reitoria</p>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-700'}`}
          >
            Gestão de Alunos
          </button>
        </nav>

        <div className="p-5 border-t border-slate-200/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-colors font-semibold text-sm">
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-y-auto">
        <header className="px-10 py-8 flex justify-between items-center bg-white/30 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/40">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? 'Visão Geral' : 'Gestão de Utilizadores'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Bem-vindo ao painel administrativo.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
              AD
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl w-full mx-auto">
          
          {/* ================= DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 p-6 rounded-3xl shadow-sm">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Total de Registos</p>
                  <p className="text-4xl font-black text-blue-900">{users.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 p-6 rounded-3xl shadow-sm">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Status do PWA</p>
                  <p className="text-4xl font-black text-emerald-600">Online</p>
                </div>
                <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 p-6 rounded-3xl shadow-sm">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Semestre Atual</p>
                  <p className="text-4xl font-black text-red-600">2026.2</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= GESTÃO DE UTILIZADORES ================= */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
              
              {/* Formulário de Registo */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-blue-950">Nova Matrícula</h3>
                  <p className="text-sm text-slate-500">Adicione novos alunos ou professores à plataforma.</p>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">Nome Completo</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">E-mail Institucional</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">Senha Provisória</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 ml-1 block mb-2">Tipo de Conta</label>
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none">
                        <option value="student">Aluno</option>
                        <option value="professor">Professor</option>
                        <option value="admin">Administração</option>
                      </select>
                    </div>
                  </div>

                  {feedback.msg && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {feedback.msg}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30">
                      {loading ? 'A processar...' : 'Confirmar Registo'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabela de Alunos Integrada */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-blue-950 mb-6">Utilizadores Registados ({users.length})</h3>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Conta</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Registo</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Último Acesso</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-50 hover:bg-white transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{user.email}</div>
                            <div className="text-xs text-slate-400 mt-1 font-mono">{user.id.substring(0, 12)}...</div>
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {new Date(user.created_at).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString('pt-PT') 
                              : <span className="italic text-slate-400">Pendente</span>}
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Ativo</span>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">A carregar utilizadores...</td>
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