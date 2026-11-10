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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-cyan-400/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>

      <div className="relative z-10 w-11/12 max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wider">INBEC</h1>
          <p className="text-blue-100/70 mt-2 text-sm">Portal Acadêmico</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm ml-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all focus:border-white/50 focus:bg-white/10"
              placeholder="aluno@inbec.edu.br"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm ml-1" htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all focus:border-white/50 focus:bg-white/10"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-500/20">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-white/20 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 border border-white/30 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}