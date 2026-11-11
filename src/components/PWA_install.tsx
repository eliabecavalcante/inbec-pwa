'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWA_install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [viewCount, setViewCount] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Se já instalou nativamente, não mostra nada
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // 2. Previne que um simples 'F5' conte como um novo login na sessão
    if (sessionStorage.getItem('pwa_checked')) return;

    // Handler nativo do Android
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Lógica do Supabase
    const initDB = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const uid = session.user.id;
      setUserId(uid);

      // Verifica o status do aluno no banco
      const { data, error } = await supabase
        .from('pwa_status')
        .select('*')
        .eq('user_id', uid)
        .single();

      // Se já resolveu na 3ª vez (conseguiu ou não), nunca mais mostra
      if (data && (data.status === 'consegui' || data.status === 'nao_consegui')) {
        return; 
      }

      let proximaContagem = 1;

      if (error && error.code === 'PGRST116') {
        // Primeiro acesso do aluno: Cria registro
        await supabase.from('pwa_status').insert({ user_id: uid, login_count: 1, status: 'pending' });
      } else if (data) {
        // Acessos seguintes: Atualiza contador
        proximaContagem = data.login_count + 1;
        if (proximaContagem <= 3) {
          await supabase.from('pwa_status').update({ login_count: proximaContagem }).eq('user_id', uid);
        }
      }

      // Se passou de 3 vezes e ainda está pendente, aborta (para não irritar o aluno eternamente)
      if (proximaContagem > 3) return;
      
      setViewCount(proximaContagem);
      sessionStorage.setItem('pwa_checked', 'true');

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);

      // Lógica de exibição para iOS (iPhone/iPad)
      if (isAppleDevice) {
        setIsIOS(true);
        setTimeout(() => setIsVisible(true), 2000);
      } 
      // Lógica de exibição para Android na 3ª vez
      // (Força a exibição para garantir que os botões de feedback apareçam, mesmo se o evento nativo falhar)
      else if (proximaContagem === 3) {
        setTimeout(() => setIsVisible(true), 1500);
      }
    };

    initDB();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // --- Ações dos Botões ---

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      if (userId) {
        await supabase.from('pwa_status').update({ status: 'consegui' }).eq('user_id', userId);
      }
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleCiente = () => {
    setIsVisible(false); 
  };

  const handleConsegui = async () => {
    if (userId) {
      await supabase.from('pwa_status').update({ status: 'consegui' }).eq('user_id', userId);
    }
    setIsVisible(false);
  };

  const handleNaoConsegui = async () => {
    if (userId) {
      await supabase.from('pwa_status').update({ status: 'nao_consegui' }).eq('user_id', userId);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[999] p-4 rounded-2xl border border-blue-500/30 bg-slate-800/90 backdrop-blur-md shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-5">
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            Instalar App INBEC {viewCount === 3 && <span className="text-xs text-blue-400 ml-1">(Último aviso)</span>}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {isIOS 
              ? "Para instalar, toque no ícone de Compartilhar do navegador e selecione 'Adicionar à Tela de Início'." 
              : "Adicione o portal à sua tela inicial para um acesso mais rápido às suas disciplinas."}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-1">
        {/* Renderiza na 1ª e 2ª vez */}
        {viewCount < 3 && (
          <>
            {!isIOS && deferredPrompt && (
              <button 
                onClick={handleInstallAndroid} 
                className="w-full py-2.5 rounded-xl bg-blue-600/90 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/50"
              >
                Instalar Agora
              </button>
            )}
            <button 
              onClick={handleCiente} 
              className="w-full py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Estou ciente
            </button>
          </>
        )}

        {/* Renderiza SOMENTE na 3ª vez */}
        {viewCount === 3 && (
          <div className="flex gap-3 pt-2 border-t border-slate-700/50">
            <button 
              onClick={handleNaoConsegui} 
              className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Não consegui
            </button>
            <button 
              onClick={handleConsegui} 
              className="flex-1 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              Consegui
            </button>
          </div>
        )}
      </div>

    </div>
  );
}