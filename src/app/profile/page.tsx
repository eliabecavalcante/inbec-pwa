'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('Aluno INBEC');
  const [initials, setInitials] = useState('AL');

  // Estados interativos da interface
  const [showCardModal, setShowCardModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  // Feedbacks interativos (copiar PIX / emitir documento)
  const [pixCopied, setPixCopied] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  // Preferências simuladas
  const [notifyGrades, setNotifyGrades] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [offlineCache, setOfflineCache] = useState(false);

  // Guarda de rota + dados da sessão
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

      // Tenta puxar o nome do metadata; se não existir, formata a partir do email
      const metaName =
        session.user.user_metadata?.name || session.user.user_metadata?.full_name;

      if (metaName && typeof metaName === 'string') {
        setDisplayName(metaName);
        const parts = metaName.trim().split(' ');
        const init =
          parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`
            : metaName.substring(0, 2);
        setInitials(init.toUpperCase());
      } else if (email) {
        const prefix = email.split('@')[0].replace(/[._-]/g, ' ');
        const formatted = prefix
          .split(' ')
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setDisplayName(formatted || 'Aluno INBEC');
        setInitials((formatted.substring(0, 2) || 'AL').toUpperCase());
      }

      setIsAuthorized(true);
    };

    checkAuth();

    // Detecta se está rodando como PWA instalado
    if (typeof window !== 'undefined') {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
    }
  }, [router]);

  // Relógio ao vivo para validação antifraude da carteirinha
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCopyPix = () => {
    const mockPix =
      '00020126580014BR.GOV.BCB.PIX0136inbec-financeiro-2026-mensalidade5204000053039865802BR5915FACULDADE INBEC6009FORTALEZA62070503***6304ABCD';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mockPix).catch(() => {});
    }
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleGenerateDoc = (docName: string) => {
    setGeneratedDoc(docName);
    setTimeout(() => setGeneratedDoc(null), 2600);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-32 font-sans text-slate-800 selection:bg-blue-200 overflow-x-hidden">
      {/* Efeitos Liquid Glass Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[35%] left-[55%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* ================= HEADER DO PERFIL ================= */}
      <header className="px-5 pt-14 pb-6 bg-white/75 backdrop-blur-xl sticky top-0 z-30 shadow-sm rounded-b-3xl border-b border-slate-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/25 ring-2 ring-white">
                <span className="text-white font-black text-lg tracking-wider">{initials}</span>
              </div>
              <span
                title="Matrícula Ativa"
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
              ></span>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-800 tracking-tight truncate">
                {displayName}
              </h1>
              <p className="text-slate-500 text-xs font-medium truncate">{userEmail}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  RA 202504189
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  Ativo
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCardModal(true)}
            aria-label="Abrir QR Code da Carteirinha"
            className="w-11 h-11 shrink-0 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 flex items-center justify-center active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto px-5 pt-6 flex flex-col gap-6">
        {/* ============================================================
            CARTEIRINHA ESTUDANTIL DIGITAL (ESTILO APPLE WALLET)
           ============================================================ */}
        <section>
          <button
            type="button"
            onClick={() => setShowCardModal(true)}
            className="w-full text-left rounded-[28px] p-5 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-700 text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] relative overflow-hidden active:scale-[0.98] transition-all group border border-white/20"
          >
            {/* Brilho holográfico de fundo */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-12 w-36 h-36 bg-red-500/25 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_55%)] pointer-events-none"></div>

            <div className="relative z-10">
              {/* Topo do Cartão */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <span className="text-[11px] font-black tracking-widest">IN</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      INBEC ID
                    </p>
                    <p className="text-[9px] text-blue-200 font-semibold">
                      Identidade Estudantil Digital
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Válida
                </span>
              </div>

              {/* Dados centrais */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-widest text-blue-200/80 font-bold">
                  Bacharelado em Engenharia de Software
                </p>
                <h2 className="text-lg font-black tracking-tight mt-0.5 truncate">
                  {displayName}
                </h2>
              </div>

              {/* Rodapé do Cartão */}
              <div className="mt-5 pt-3.5 border-t border-white/15 flex items-end justify-between gap-2">
                <div className="flex gap-5">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-200/75 font-bold block">
                      Matrícula
                    </span>
                    <span className="text-xs font-mono font-bold">202504189</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-200/75 font-bold block">
                      Semestre
                    </span>
                    <span className="text-xs font-bold">4º • 2026.2</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-200/75 font-bold block">
                      Validade
                    </span>
                    <span className="text-xs font-bold">07/2027</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-2.5 py-1.5 rounded-xl backdrop-blur-md shrink-0">
                  <span>QR Code</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </section>

        {/* ============================================================
            EVOLUÇÃO ACADÊMICA (PROGRESSO DO CURSO + HORAS)
           ============================================================ */}
        <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Jornada Acadêmica</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              50% concluído
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">CR Geral</span>
              <span className="text-xl font-black text-blue-700 mt-0.5 block">8.9</span>
            </div>
            <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Período</span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">
                4º<span className="text-xs font-bold text-slate-400">/8</span>
              </span>
            </div>
            <div className="bg-slate-50/90 border border-slate-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Horas AAC</span>
              <span className="text-xl font-black text-emerald-600 mt-0.5 block">
                64<span className="text-[11px] font-bold text-slate-400">h</span>
              </span>
            </div>
          </div>

          {/* Barra de Progresso do Curso */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-500">Progresso da Graduação</span>
              <span className="text-slate-700 font-bold">1.600h / 3.200h</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CENTRAL DO ALUNO (SERVIÇOS RÁPIDOS)
           ============================================================ */}
        <section>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="text-sm font-bold text-slate-800">Serviços & Secretaria</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Autoatendimento
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Financeiro */}
            <button
              type="button"
              onClick={() => setShowFinanceModal(true)}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/70 hover:border-emerald-200 p-4 rounded-3xl shadow-sm active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Em dia
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Financeiro</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Boletos e PIX</p>
            </button>

            {/* Documentos */}
            <button
              type="button"
              onClick={() => setShowDocsModal(true)}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/70 hover:border-blue-200 p-4 rounded-3xl shadow-sm active:scale-[0.98] transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  PDF
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Documentos</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Declaração e Histórico</p>
            </button>

            {/* Biblioteca Digital */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-4 rounded-3xl shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  0 livros
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Biblioteca</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Acervo & Empréstimos</p>
            </div>

            {/* Protocolos / Suporte */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-4 rounded-3xl shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Secretaria</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Abrir requerimento</p>
            </div>
          </div>
        </section>

        {/* ============================================================
            PREFERÊNCIAS DO APLICATIVO & STATUS PWA
           ============================================================ */}
        <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Preferências do App</h3>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isStandalone
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}
            >
              {isStandalone ? 'App Instalado' : 'Modo Navegador'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Toggle 1 */}
            <div className="py-3 first:pt-0 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Alertas de Notas e Faltas</p>
                <p className="text-[11px] text-slate-400">Avisar quando o docente lançar nota</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifyGrades}
                onClick={() => setNotifyGrades((v) => !v)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 shrink-0 ${
                  notifyGrades ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    notifyGrades ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Lembretes de Exercícios</p>
                <p className="text-[11px] text-slate-400">Notificar 24h antes do prazo final</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifyDeadlines}
                onClick={() => setNotifyDeadlines((v) => !v)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 shrink-0 ${
                  notifyDeadlines ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    notifyDeadlines ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="py-3 last:pb-0 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Leitura Offline de PDFs</p>
                <p className="text-[11px] text-slate-400">Salvar apostilas no cache do celular</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={offlineCache}
                onClick={() => setOfflineCache((v) => !v)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 shrink-0 ${
                  offlineCache ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    offlineCache ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTÃO ENCERRAR SESSÃO (REAL)
           ============================================================ */}
        <section className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Encerrar Sessão
          </button>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Portal INBEC PWA • Versão 2.4
          </p>
        </section>
      </main>

      {/* ============================================================
          MODAL 1: QR CODE DA CARTEIRINHA (VALIDAÇÃO AO VIVO)
         ============================================================ */}
      {showCardModal && (
        <div
          onClick={() => setShowCardModal(false)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-5 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Acesso ao Campus</h3>
                <p className="text-xs text-slate-500">Aproxime o QR Code na catraca ou biblioteca</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* QR Code Vetorial Estilizado */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <svg
                  className="w-44 h-44 text-slate-900"
                  viewBox="0 0 21 21"
                  fill="currentColor"
                  aria-label="QR Code Estudantil"
                >
                  {/* Cantos de posicionamento */}
                  <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm1 1h3v3H2V2z" />
                  <path d="M14 0h7v7h-7V0zm1 1v5h5V1h-5zm1 1h3v3h-3V2z" />
                  <path d="M0 14h7v7H0v-7zm1 1v5h5v-5H1zm1 1h3v3H2v-3z" />
                  {/* Padrão central */}
                  <rect x="9" y="1" width="1" height="2" />
                  <rect x="11" y="0" width="2" height="1" />
                  <rect x="8" y="4" width="3" height="1" />
                  <rect x="12" y="3" width="1" height="3" />
                  <rect x="1" y="8" width="2" height="1" />
                  <rect x="4" y="9" width="2" height="2" />
                  <rect x="0" y="11" width="3" height="1" />
                  <rect x="8" y="8" width="5" height="5" fill="#2563eb" rx="1" />
                  <rect x="9.5" y="9.5" width="2" height="2" fill="#ffffff" />
                  <rect x="14" y="8" width="2" height="2" />
                  <rect x="18" y="8" width="3" height="1" />
                  <rect x="15" y="11" width="4" height="1" />
                  <rect x="19" y="10" width="2" height="3" />
                  <rect x="8" y="15" width="2" height="2" />
                  <rect x="11" y="14" width="2" height="3" />
                  <rect x="9" y="19" width="3" height="2" />
                  <rect x="14" y="14" width="3" height="2" />
                  <rect x="18" y="15" width="3" height="2" />
                  <rect x="15" y="18" width="2" height="3" />
                  <rect x="18" y="19" width="3" height="2" />
                </svg>
              </div>

              {/* Selo antifraude com hora ao vivo */}
              <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[11px] font-bold text-emerald-700 font-mono">
                  Ativo agora • {currentTime}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-800 mt-3">{displayName}</p>
              <p className="text-[11px] text-slate-500">RA 202504189 • Engenharia de Software</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: FINANCEIRO & BOLETOS
         ============================================================ */}
      {showFinanceModal && (
        <div
          onClick={() => setShowFinanceModal(false)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-black text-slate-800">Financeiro INBEC</h3>
                <p className="text-xs text-slate-500">Mensalidades do semestre 2026.2</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFinanceModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* Parcela em aberto (próximo mês) */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700">Dezembro / 2026</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Vence 10/12
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-1">R$ 850,00</p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    pixCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                  }`}
                >
                  {pixCopied ? 'Código PIX copiado!' : 'Copiar PIX Copia e Cola'}
                </button>
              </div>

              {/* Parcelas pagas */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Novembro / 2026</p>
                  <p className="text-[11px] text-slate-400">Pago em 08/11 via PIX</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Quitada
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">Outubro / 2026</p>
                  <p className="text-[11px] text-slate-400">Pago em 09/10 via PIX</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Quitada
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: DOCUMENTOS & DECLARAÇÕES DIGITAIS
         ============================================================ */}
      {showDocsModal && (
        <div
          onClick={() => setShowDocsModal(false)}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Documentos Digitais</h3>
                <p className="text-xs text-slate-500">Emissão instantânea com validação QR</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDocsModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {generatedDoc && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {generatedDoc} emitido com sucesso!
              </div>
            )}

            <div className="space-y-2.5">
              {[
                {
                  title: 'Declaração de Matrícula',
                  desc: 'Comprova vínculo ativo em 2026.2',
                },
                {
                  title: 'Histórico Escolar Parcial',
                  desc: 'Notas e carga horária cursada até hoje',
                },
                {
                  title: 'Comprovante de Horários',
                  desc: 'Grade semanal das disciplinas matriculadas',
                },
              ].map((doc) => (
                <button
                  key={doc.title}
                  type="button"
                  onClick={() => handleGenerateDoc(doc.title)}
                  className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 transition-all active:scale-[0.98] text-left group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                      {doc.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                    Emitir
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}