'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SupportLesson {
  title: string;
  duration: string;
  professor: string;
  topic: string;
  accent: 'blue' | 'red' | 'indigo';
}

interface Attachment {
  name: string;
  size: string;
  type: 'PDF' | 'ZIP' | 'DOC';
}

interface Activity {
  id: string;
  title: string;
  postedAt: string;
  dueDate: string;
  status: 'pendente' | 'entregue' | 'corrigida';
  maxPoints: string;
  grade?: string;
  feedback?: string;
  submittedFile?: string;
  submittedAt?: string;
  description: string;
  requirements: string[];
  attachments: Attachment[];
  supportLesson?: SupportLesson; // Opcional por atividade
}

interface Subject {
  id: string;
  name: string;
  professor: string;
  schedule: string;
  room: string;
  accent: 'blue' | 'red' | 'indigo' | 'emerald';
  activities: Activity[];
}

const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'web-fullstack',
    name: 'Desenv. Web Full-Stack',
    professor: 'Prof. Dr. Marcos',
    schedule: 'Quintas • 18:30',
    room: 'Lab 4',
    accent: 'blue',
    activities: [
      {
        id: 'act-1',
        title: 'API REST com Autenticação JWT e Next.js',
        postedAt: 'Postado há 2 dias',
        dueDate: 'Sexta, 27 Nov • 23:59',
        status: 'pendente',
        maxPoints: '2,5 pts',
        description:
          'Desenvolva um conjunto de rotas no App Router do Next.js realizando CRUD completo integrado ao banco de dados, aplicando validação de sessão e tratamento adequado de status HTTP.',
        requirements: [
          'Criar endpoints GET, POST, PUT e DELETE em /api/tasks.',
          'Proteger rotas privadas validando o token da sessão do usuário.',
          'Retornar códigos HTTP corretos (200, 201, 400, 401 e 500).',
          'Enviar o link do repositório GitHub ou arquivo .ZIP com o README detalhado.',
        ],
        attachments: [
          { name: 'Roteiro_Pratica_04_API.pdf', size: '1.4 MB', type: 'PDF' },
          { name: 'Template_Collection_Insomnia.zip', size: '320 KB', type: 'ZIP' },
        ],
        supportLesson: {
          title: 'Revisão: Route Handlers e Middleware no Next.js',
          duration: '14:25',
          professor: 'Prof. Dr. Marcos',
          topic: 'Aula Gravada • Laboratório 4',
          accent: 'blue',
        },
      },
      {
        id: 'act-2',
        title: 'Responsividade Mobile-First para PWAs',
        postedAt: 'Postado há 5 dias',
        dueDate: 'Segunda, 30 Nov • 23:59',
        status: 'pendente',
        maxPoints: '1,5 pts',
        description:
          'Adapte o layout de um dashboard acadêmico garantindo fluidez em telas de 360px até desktops ultrawide, sem quebra de scroll horizontal e com áreas de toque confortáveis.',
        requirements: [
          'Aplicar breakpoints do Tailwind CSS (sm, md, lg) de forma progressiva.',
          'Garantir que modais e inputs funcionem sem bloqueio em Safari iOS.',
          'Anexar prints de teste no modo mobile e desktop em um único PDF.',
        ],
        attachments: [
          { name: 'Checklist_UX_Mobile_INBEC.pdf', size: '890 KB', type: 'PDF' },
        ],
      },
      {
        id: 'act-3',
        title: 'Componentização e Hooks Personalizados',
        postedAt: 'Postado em 08 Nov',
        dueDate: 'Entregue em 14 Nov',
        status: 'corrigida',
        maxPoints: '2,0 pts',
        grade: '2,0 / 2,0',
        feedback: 'Excelente organização de código e ótima separação de responsabilidades nos componentes.',
        submittedFile: 'hooks_personalizados_v2.zip',
        submittedAt: '14 Nov às 21:12',
        description:
          'Construa dois custom hooks reutilizáveis para gerenciamento de formulários e persistência local, aplicando tipagem estrita com TypeScript.',
        requirements: [
          'Tipar todas as props e retornos com interfaces TypeScript.',
          'Evitar re-renderizações desnecessárias.',
        ],
        attachments: [
          { name: 'Enunciado_Hooks_TS.pdf', size: '640 KB', type: 'PDF' },
        ],
        supportLesson: {
          title: 'Boas práticas com useEffect e Custom Hooks',
          duration: '11:08',
          professor: 'Prof. Dr. Marcos',
          topic: 'Resumo Rápido',
          accent: 'blue',
        },
      },
    ],
  },
  {
    id: 'arq-software',
    name: 'Arquitetura de Software',
    professor: 'Profa. Dra. Ana Clara',
    schedule: 'Quintas • 20:20',
    room: 'Sala 205',
    accent: 'red',
    activities: [
      {
        id: 'act-4',
        title: 'Diagrama C4 Model: Sistema Acadêmico',
        postedAt: 'Postado ontem',
        dueDate: 'Quinta, 03 Dez • 20:20',
        status: 'pendente',
        maxPoints: '3,0 pts',
        description:
          'Elabore os níveis 1 (Contexto) e 2 (Containers) do C4 Model representando a arquitetura de um portal universitário com autenticação externa, banco relacional e cliente PWA.',
        requirements: [
          'Identificar claramente atores (Aluno, Professor, Reitoria) no nível de Contexto.',
          'Detalhar protocolos de comunicação (HTTPS, REST/RPC) entre containers.',
          'Exportar os diagramas em alta resolução (PDF ou PNG agrupado).',
        ],
        attachments: [
          { name: 'Guia_C4_Model_INBEC.pdf', size: '2.1 MB', type: 'PDF' },
        ],
        supportLesson: {
          title: 'Como estruturar Contexto e Containers no C4',
          duration: '18:40',
          professor: 'Profa. Dra. Ana Clara',
          topic: 'Aula de Apoio • Slides Comentados',
          accent: 'red',
        },
      },
      {
        id: 'act-5',
        title: 'Estudo de Caso: Monólito Modular vs Microsserviços',
        postedAt: 'Postado em 02 Nov',
        dueDate: 'Entregue em 12 Nov',
        status: 'entregue',
        maxPoints: '2,0 pts',
        submittedFile: 'analise_arquitetura_comparativa.pdf',
        submittedAt: '12 Nov às 19:45',
        description:
          'Apresente um relatório técnico comparando trade-offs de escalabilidade, custo operacional e complexidade de deploy entre as duas abordagens.',
        requirements: [
          'Mínimo de 3 páginas formatadas conforme padrão ABNT simplificado.',
          'Citar ao menos 2 cenários práticos de migração.',
        ],
        attachments: [
          { name: 'Estudo_Caso_Referencia.pdf', size: '1.1 MB', type: 'PDF' },
        ],
      },
    ],
  },
  {
    id: 'banco-dados',
    name: 'Banco de Dados Avançado',
    professor: 'Prof. Renato',
    schedule: 'Terças • 18:30',
    room: 'Lab 2',
    accent: 'indigo',
    activities: [
      {
        id: 'act-6',
        title: 'Políticas de Row Level Security (RLS) no PostgreSQL',
        postedAt: 'Postado há 3 dias',
        dueDate: 'Terça, 01 Dez • 18:30',
        status: 'pendente',
        maxPoints: '2,5 pts',
        description:
          'Escreva scripts SQL para criar tabelas relacionais de matrículas e configure políticas RLS garantindo que cada aluno visualize exclusivamente seus próprios registros.',
        requirements: [
          'Ativar RLS em todas as tabelas sensíveis do esquema.',
          'Criar políticas distintas para SELECT, INSERT e UPDATE usando auth.uid().',
          'Enviar o arquivo .sql comentado ou relatório de testes em PDF.',
        ],
        attachments: [
          { name: 'Schema_Base_Laboratorio.doc', size: '410 KB', type: 'DOC' },
        ],
        supportLesson: {
          title: 'Prática guiada: Criando Policies seguras no Postgres',
          duration: '16:12',
          professor: 'Prof. Renato',
          topic: 'Demonstração no Terminal SQL',
          accent: 'indigo',
        },
      },
    ],
  },
  {
    id: 'eng-requisitos',
    name: 'Engenharia de Requisitos',
    professor: 'Profa. Juliana',
    schedule: 'Segundas • 20:20',
    room: 'Sala 108',
    accent: 'emerald',
    activities: [
      {
        id: 'act-7',
        title: 'Histórias de Usuário e Critérios de Aceite',
        postedAt: 'Postado em 01 Nov',
        dueDate: 'Entregue em 10 Nov',
        status: 'corrigida',
        maxPoints: '2,0 pts',
        grade: '1,9 / 2,0',
        feedback: 'Muito bem detalhado no formato Gherkin. Apenas atenção aos fluxos de exceção.',
        submittedFile: 'backlog_historias_inbec.pdf',
        submittedAt: '10 Nov às 17:30',
        description:
          'Documente 8 histórias de usuário prioritárias com critérios de aceite claros no padrão Dado/Quando/Então.',
        requirements: [
          'Incluir estimativa em Story Points.',
          'Separar requisitos funcionais de não funcionais.',
        ],
        attachments: [
          { name: 'Modelo_Backlog_Scrum.pdf', size: '520 KB', type: 'PDF' },
        ],
      },
    ],
  },
];

export default function HomeworkPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Navegação interna da capa: Hall de Matérias -> Painel da Matéria -> Escopo da Atividade
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pendentes' | 'concluidas'>('todas');

  // Estados fictícios da Área de Envio
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [submissionNote, setSubmissionNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);

  // Estado do Mini-Picture (Picture-in-Picture fictício da Aula de Apoio)
  const [pipLesson, setPipLesson] = useState<SupportLesson | null>(null);
  const [isPipPlaying, setIsPipPlaying] = useState(true);
  const [isPipExpanded, setIsPipExpanded] = useState(false);

  // Guarda de Rota padrão do portal
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
      setIsAuthorized(true);
    };
    checkAuth();
  }, [router]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || null;
  const selectedActivity =
    selectedSubject?.activities.find((a) => a.id === selectedActivityId) || null;

  // Contadores globais para o Hall
  const totalPending = subjects.reduce(
    (acc, s) => acc + s.activities.filter((a) => a.status === 'pendente').length,
    0
  );
  const totalDone = subjects.reduce(
    (acc, s) => acc + s.activities.filter((a) => a.status !== 'pendente').length,
    0
  );

  // Estilos por cor da matéria
  const accentMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
      badge: 'text-blue-600 bg-blue-50 border-blue-100',
      borderHover: 'hover:border-blue-200',
      bar: 'bg-blue-600',
      strip: 'bg-blue-500',
      grad: 'from-blue-600 to-indigo-600',
    },
    red: {
      iconBg: 'bg-red-50 text-red-600',
      badge: 'text-red-600 bg-red-50 border-red-100',
      borderHover: 'hover:border-red-200',
      bar: 'bg-red-600',
      strip: 'bg-red-500',
      grad: 'from-red-600 to-rose-600',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      badge: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      borderHover: 'hover:border-indigo-200',
      bar: 'bg-indigo-600',
      strip: 'bg-indigo-500',
      grad: 'from-indigo-600 to-blue-700',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      borderHover: 'hover:border-emerald-200',
      bar: 'bg-emerald-500',
      strip: 'bg-emerald-500',
      grad: 'from-emerald-600 to-teal-600',
    },
  };

  // Navegação Voltar
  const handleBack = () => {
    if (selectedActivityId) {
      setSelectedActivityId(null);
      setSelectedFileName('');
      setSubmissionNote('');
      setSubmitSuccessToast(false);
    } else if (selectedSubjectId) {
      setSelectedSubjectId(null);
      setStatusFilter('todas');
    } else {
      router.push('/menu');
    }
  };

  // Seleção de arquivo na área de envio (somente front/capa)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  // Simulação visual de envio da atividade (apenas estado local)
  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !selectedActivity) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const fileToDisplay = selectedFileName || 'entrega_atividade_inbec.pdf';
      setSubjects((prev) =>
        prev.map((subj) => {
          if (subj.id !== selectedSubject.id) return subj;
          return {
            ...subj,
            activities: subj.activities.map((act) =>
              act.id === selectedActivity.id
                ? {
                    ...act,
                    status: 'entregue',
                    submittedFile: fileToDisplay,
                    submittedAt: 'Enviado agora mesmo',
                  }
                : act
            ),
          };
        })
      );
      setIsSubmitting(false);
      setSubmitSuccessToast(true);
      setSelectedFileName('');
      setSubmissionNote('');
    }, 800);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Atividades filtradas no painel da matéria
  const filteredActivities = selectedSubject
    ? selectedSubject.activities.filter((act) => {
        if (statusFilter === 'pendentes') return act.status === 'pendente';
        if (statusFilter === 'concluidas') return act.status !== 'pendente';
        return true;
      })
    : [];

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-32 font-sans selection:bg-blue-200 text-slate-800 overflow-x-hidden">
      {/* Efeitos Liquid Glass Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[35%] left-[55%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* ================= CABEÇALHO DINÂMICO ================= */}
      <header className="px-5 pt-14 pb-5 bg-white/75 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between shadow-sm rounded-b-3xl border-b border-slate-200/50">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBack}
            aria-label="Voltar"
            className="w-10 h-10 shrink-0 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight truncate">
              {selectedActivity
                ? 'Escopo da Atividade'
                : selectedSubject
                ? selectedSubject.name
                : 'Central de Exercícios'}
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5 truncate">
              {selectedActivity
                ? `${selectedSubject?.name} • ${selectedActivity.maxPoints}`
                : selectedSubject
                ? `${selectedSubject.professor} • ${selectedSubject.schedule}`
                : '4º Semestre • INBEC 2026.2'}
            </p>
          </div>
        </div>

        {/* Badge de etapa no canto direito */}
        {!selectedSubject && (
          <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
        )}
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto px-5 pt-6 flex flex-col gap-6">
        {/* ============================================================
            TELA 1: HALL DE MATÉRIAS
           ============================================================ */}
        {!selectedSubject && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Resumo Rápido */}
            <section className="grid grid-cols-2 gap-3">
              <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-4 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-red-50 rounded-full pointer-events-none"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
                  Pendentes
                </span>
                <div className="flex items-baseline gap-2 mt-1 relative z-10">
                  <span className="text-3xl font-black text-red-600">{totalPending}</span>
                  <span className="text-xs font-semibold text-slate-500">para entregar</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-4 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-emerald-50 rounded-full pointer-events-none"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
                  Concluídas
                </span>
                <div className="flex items-baseline gap-2 mt-1 relative z-10">
                  <span className="text-3xl font-black text-emerald-600">{totalDone}</span>
                  <span className="text-xs font-semibold text-slate-500">enviadas</span>
                </div>
              </div>
            </section>

            {/* Lista de Matérias */}
            <section>
              <div className="flex justify-between items-end mb-3 px-1">
                <div>
                  <h2 className="text-slate-800 font-bold text-base tracking-tight">Hall de Matérias</h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Escolha uma disciplina para ver as atividades
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                  {subjects.length} matérias
                </span>
              </div>

              <div className="flex flex-col gap-3.5">
                {subjects.map((subj) => {
                  const theme = accentMap[subj.accent];
                  const pendingCount = subj.activities.filter((a) => a.status === 'pendente').length;
                  const doneCount = subj.activities.length - pendingCount;
                  const progress = Math.round((doneCount / subj.activities.length) * 100);

                  return (
                    <button
                      key={subj.id}
                      onClick={() => setSelectedSubjectId(subj.id)}
                      className={`w-full text-left bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all border border-slate-200/60 ${theme.borderHover} group relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 shrink-0 ${theme.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}
                        >
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.6}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                              {subj.schedule}
                            </span>
                            {pendingCount > 0 ? (
                              <span className="shrink-0 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                {pendingCount} {pendingCount === 1 ? 'pendente' : 'pendentes'}
                              </span>
                            ) : (
                              <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                Em dia
                              </span>
                            )}
                          </div>

                          <h3 className="text-slate-800 font-bold text-[15px] mt-1 truncate">
                            {subj.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-0.5 truncate font-medium">
                            {subj.professor} • {subj.room}
                          </p>
                        </div>

                        <div className="text-slate-300 shrink-0 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Barra de Progresso da Disciplina */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${theme.bar} rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 shrink-0">
                          {doneCount}/{subj.activities.length} feitas
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ============================================================
            TELA 2: PAINEL DE ATIVIDADES DA MATÉRIA
           ============================================================ */}
        {selectedSubject && !selectedActivity && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Banner da Matéria */}
            <section
              className={`bg-gradient-to-br ${accentMap[selectedSubject.accent].grad} p-5 rounded-3xl text-white shadow-lg relative overflow-hidden`}
            >
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none"></div>
              <div className="absolute -left-6 -bottom-8 w-24 h-24 bg-black/10 rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {selectedSubject.room} • {selectedSubject.schedule}
                </span>
                <h2 className="text-xl font-black mt-3 leading-tight">{selectedSubject.name}</h2>
                <p className="text-white/80 text-xs font-medium mt-1">
                  Docente responsável: {selectedSubject.professor}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/15 text-xs font-semibold">
                  <span>{selectedSubject.activities.length} atividades postadas</span>
                  <span>•</span>
                  <span>
                    {selectedSubject.activities.filter((a) => a.status === 'pendente').length}{' '}
                    em aberto
                  </span>
                </div>
              </div>
            </section>

            {/* Filtros */}
            <div className="flex gap-2">
              {(
                [
                  { key: 'todas', label: 'Todas' },
                  { key: 'pendentes', label: 'Pendentes' },
                  { key: 'concluidas', label: 'Concluídas' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    statusFilter === tab.key
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white/80 text-slate-500 border border-slate-200/70 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista de Atividades Postadas pelo Professor */}
            <div className="flex flex-col gap-3.5">
              {filteredActivities.map((act) => {
                const isPending = act.status === 'pendente';
                const isGraded = act.status === 'corrigida';

                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActivityId(act.id)}
                    className="w-full text-left bg-white/90 backdrop-blur-xl border border-slate-200/70 p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all relative overflow-hidden group"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        isPending
                          ? 'bg-amber-500'
                          : isGraded
                          ? 'bg-emerald-500'
                          : 'bg-blue-500'
                      }`}
                    ></div>

                    <div className="pl-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isPending
                              ? 'bg-amber-50 text-amber-600 border-amber-200/70'
                              : isGraded
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200/70'
                              : 'bg-blue-50 text-blue-600 border-blue-200/70'
                          }`}
                        >
                          {isPending ? 'Pendente' : isGraded ? `Nota: ${act.grade}` : 'Entregue'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {act.maxPoints}
                        </span>
                      </div>

                      <h3 className="text-slate-800 font-bold text-[15px] leading-snug group-hover:text-blue-700 transition-colors">
                        {act.title}
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                          <svg
                            className="w-3.5 h-3.5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {act.dueDate}
                        </div>

                        {act.supportLesson && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Aula de apoio
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredActivities.length === 0 && (
                <div className="bg-white/80 border border-slate-200/60 rounded-3xl p-8 text-center">
                  <p className="text-sm font-bold text-slate-600">
                    Nenhuma atividade neste filtro.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tudo tranquilo por aqui!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TELA 3: ESCOPO DA ATIVIDADE + MINI-PICTURE + ÁREA DE ENVIO
           ============================================================ */}
        {selectedSubject && selectedActivity && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Cabeçalho do Escopo */}
            <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    selectedActivity.status === 'pendente'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : selectedActivity.status === 'corrigida'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}
                >
                  {selectedActivity.status === 'pendente'
                    ? 'Aguardando envio'
                    : selectedActivity.status === 'corrigida'
                    ? `Corrigida • ${selectedActivity.grade}`
                    : 'Entregue para correção'}
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Vale {selectedActivity.maxPoints}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-800 leading-snug">
                {selectedActivity.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {selectedSubject.professor}
                </span>
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedActivity.dueDate}
                </span>
              </div>

              {/* Descrição do Professor */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Orientações do Professor
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Requisitos / Checklist */}
              <div className="mt-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  O que deve ser entregue
                </h3>
                <ul className="space-y-2.5">
                  {selectedActivity.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/90 border border-slate-100 p-3 rounded-2xl leading-relaxed"
                    >
                      <span className="w-5 h-5 shrink-0 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arquivos Anexos do Professor */}
              {selectedActivity.attachments.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Materiais de Referência
                  </h3>
                  <div className="flex flex-col gap-2">
                    {selectedActivity.attachments.map((file, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/70 p-3 rounded-2xl transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-red-50 text-red-600 font-black text-[10px] flex items-center justify-center border border-red-100">
                            {file.type}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">{file.size}</p>
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ================= MINI-PICTURE AULA DE APOIO (OPCIONAL) ================= */}
            {selectedActivity.supportLesson && (
              <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Aula de Apoio
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Opcional • Mini-Player</span>
                </div>

                {/* Card Miniatura clicável que abre o PiP */}
                <button
                  type="button"
                  onClick={() => {
                    setPipLesson(selectedActivity.supportLesson!);
                    setIsPipPlaying(true);
                    setIsPipExpanded(false);
                  }}
                  className="w-full flex items-center gap-3.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 transition-all active:scale-[0.98] text-left group"
                >
                  {/* Mini-Picture Thumbnail */}
                  <div
                    className={`w-28 h-20 shrink-0 rounded-xl bg-gradient-to-br ${
                      accentMap[selectedActivity.supportLesson.accent].grad
                    } relative overflow-hidden flex items-center justify-center shadow-md`}
                  >
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors"></div>
                    {/* Ícone Play */}
                    <div className="w-9 h-9 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    {/* Duração */}
                    <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      {selectedActivity.supportLesson.duration}
                    </span>
                  </div>

                  {/* Info da Aula */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {selectedActivity.supportLesson.topic}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug line-clamp-2">
                      {selectedActivity.supportLesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1">
                      <span>Abrir em mini-janela</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </p>
                  </div>
                </button>
              </section>
            )}

            {/* ================= ÁREA DE ENVIO ================= */}
            <section className="bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Sua Entrega</h3>
                {selectedActivity.status === 'pendente' && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    PDF, ZIP ou Link
                  </span>
                )}
              </div>

              {submitSuccessToast && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Atividade enviada com sucesso! (Demonstração visual)
                </div>
              )}

              {selectedActivity.status === 'pendente' ? (
                <form onSubmit={handleMockSubmit} className="flex flex-col gap-4">
                  {/* Área de Upload */}
                  <label className="cursor-pointer block border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-6 text-center transition-all">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    {selectedFileName ? (
                      <div>
                        <p className="text-xs font-bold text-blue-700 break-all">{selectedFileName}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Toque para trocar o arquivo</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          Toque para anexar seu arquivo
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Suporta PDF, ZIP, DOCX ou imagens até 25MB
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Campo de Link / Observação */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 block mb-1.5">
                      Link do GitHub ou Comentário (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={submissionNote}
                      onChange={(e) => setSubmissionNote(e.target.value)}
                      placeholder="Ex: https://github.com/aluno/projeto ou alguma observação para o professor..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando entrega...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar Atividade
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Estado já entregue ou corrigido */
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {selectedActivity.submittedFile}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {selectedActivity.submittedAt}
                      </p>
                    </div>
                  </div>

                  {selectedActivity.feedback && (
                    <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          Feedback do Docente
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {selectedActivity.grade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedActivity.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* ============================================================
          MINI-PICTURE FLUTUANTE (PLAYER DE AULA DE APOIO FICTÍCIO)
         ============================================================ */}
      {pipLesson && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl border border-white/20 backdrop-blur-2xl overflow-hidden ${
            isPipExpanded
              ? 'inset-x-4 bottom-24 max-w-md mx-auto rounded-3xl bg-slate-900/95'
              : 'right-4 bottom-24 w-64 rounded-2xl bg-slate-900/95'
          }`}
        >
          {/* Área de Vídeo Fictícia */}
          <div
            className={`relative bg-gradient-to-br ${accentMap[pipLesson.accent].grad} ${
              isPipExpanded ? 'h-48' : 'h-32'
            } flex flex-col justify-between p-3`}
          >
            {/* Controles superiores do PiP */}
            <div className="flex items-center justify-between relative z-10">
              <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Aula de Apoio
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPipExpanded((prev) => !prev)}
                  title={isPipExpanded ? 'Minimizar' : 'Expandir'}
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isPipExpanded ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setPipLesson(null)}
                  title="Fechar player"
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Botão Central Play/Pause */}
            <button
              type="button"
              onClick={() => setIsPipPlaying((prev) => !prev)}
              className="w-11 h-11 mx-auto rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
              {isPipPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Barra de Progresso Simulada */}
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white rounded-full transition-all duration-1000 ${
                    isPipPlaying ? 'w-2/5 animate-pulse' : 'w-2/5'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-white/90">
                <span>{isPipPlaying ? '05:42' : 'Pausado'}</span>
                <span>{pipLesson.duration}</span>
              </div>
            </div>
          </div>

          {/* Rodapé do Mini-Player */}
          <div className="px-3 py-2.5 text-white">
            <p className="text-[11px] font-bold truncate">{pipLesson.title}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{pipLesson.professor}</p>
          </div>
        </div>
      )}
    </div>
  );
}