'use client';

import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    // 1. Se já instalou nativamente, não mostra nada
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // 2. Simulação de Banco de Dados: Verifica o status final do aluno
    const statusFinal = localStorage.getItem('pwa_status');
    if (statusFinal === 'consegui' || statusFinal === 'nao_consegui') {
      return; // Se ele já respondeu na 3ª vez, nunca mais mostra
    }

    // 3. Lê quantas vezes o aviso já apareceu
    const contagemAtual = parseInt(localStorage.getItem('pwa_view_count') || '0');
    
    // Se já passou de 3 vezes, aborta
    if (contagemAtual >= 3) return;

    const proximaContagem = contagemAtual + 1;
    setViewCount(proximaContagem);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);

    // Lógica para iOS (iPhone/iPad)
    if (isAppleDevice) {
      setIsIOS(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('pwa_view_count', proximaContagem.toString());
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Lógica para Android/Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      localStorage.setItem('pwa_view_count', proximaContagem.toString());
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // --- Ações dos Botões ---

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      // Se instalou direto, já marca como sucesso no banco
      localStorage.setItem('pwa_status', 'consegui');
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleCiente = () => {
    setIsVisible(false); // Apenas fecha. A contagem já foi salva no useEffect.
  };

  const handleConsegui = () => {
    // FUTURO: Aqui entrará a chamada API para o Supabase: await supabase.from('users').update({ pwa_installed: true })
    console.log('Métrica ADM: Aluno conseguiu instalar');
    localStorage.setItem('pwa_status', 'consegui');
    setIsVisible(false);
  };

  const handleNaoConsegui = () => {
    // FUTURO: Aqui entrará a chamada API para alertar o ADM
    console.log('Métrica ADM: Aluno NÃO conseguiu instalar');
    localStorage.setItem('pwa_status', 'nao_consegui');
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
            {!isIOS && (
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