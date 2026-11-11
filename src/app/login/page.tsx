'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Comunicação com o Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg('Email ou senha incorretos. Tente novamente.');
      setLoading(false);
      return;
    }

    if (data.session) {
      // Se for o email da administração, manda pro painel Admin
      if (data.user?.email === 'admin@inbec.edu.br') {
        router.push('/admin');
      } else {
        // Se for qualquer outro aluno, manda pro Menu do PWA
        router.push('/menu');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Efeitos Decorativos "Liquid Glass" de Fundo - Com pointer-events-none para não bloquear o toque */}
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/15 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[25rem] h-[25rem] bg-red-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[20rem] h-[20rem] bg-indigo-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>

      {/* Container Principal do Formulário - Z-index alto e pointer-events-auto garantem a digitação */}
      <div className="relative z-50 pointer-events-auto w-11/12 max-w-sm rounded-[2rem] border border-slate-200/60 bg-white/80 p-8 md:p-10 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Cabeçalho do Login */}
        <div className="text-center mb-10 pointer-events-none flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4">
             <span className="text-white font-black text-2xl tracking-widest">IN</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Portal INBEC</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Acesso Académico</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-50 pointer-events-auto">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="email">
              E-mail Institucional
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="aluno@inbec.edu.br"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="senha">
              Senha de Acesso
            </label>
            <input
              type="password"
              id="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-bold justify-center bg-red-50 py-3 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-300">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-blue-600 py-3.5 font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Autenticar...
              </>
            ) : (
              'Entrar no Portal'
            )}
          </button>
        </form>
        
        {/* Rodapé Fictício */}
        <div className="mt-8 text-center pointer-events-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Esqueceu a senha? Procure a secretaria.
          </p>
        </div>

      </div>
    </div>
  );
}