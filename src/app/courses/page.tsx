'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface CourseItem {
  id: string;
  name: string;
  code: string;
  schedule: string;
  professor: string;
  room: string;
  modality: 'Presencial' | 'Híbrido';
  average: string;
  attendance: number;
  progress: number;
  unreadNotices: number;
  accent: 'blue' | 'red' | 'indigo' | 'emerald';
}

const COURSES: CourseItem[] = [
  {
    id: 'web-fullstack',
    name: 'Desenv. Web Full-Stack',
    code: 'ENG-401',
    schedule: 'Quintas • 18:30',
    professor: 'Prof. Marcos',
    room: 'Lab 4',
    modality: 'Presencial',
    average: '8.5',
    attendance: 89,
    progress: 72,
    unreadNotices: 2,
    accent: 'blue',
  },
  {
    id: 'arq-software',
    name: 'Arquitetura de Software',
    code: 'ENG-402',
    schedule: 'Quintas • 20:20',
    professor: 'Profa. Ana Clara',
    room: 'Sala 205',
    modality: 'Presencial',
    average: '8.8',
    attendance: 94,
    progress: 68,
    unreadNotices: 1,
    accent: 'red',
  },
  {
    id: 'banco-dados',
    name: 'Banco de Dados Avançado',
    code: 'ENG-403',
    schedule: 'Terças • 18:30',
    professor: 'Prof. Renato',
    room: 'Lab 2',
    modality: 'Presencial',
    average: '9.1',
    attendance: 96,
    progress: 75,
    unreadNotices: 0,
    accent: 'indigo',
  },
  {
    id: 'eng-requisitos',
    name: 'Engenharia de Requisitos',
    code: 'ENG-404',
    schedule: 'Segundas • 20:20',
    professor: 'Profa. Juliana',
    room: 'Sala 108',
    modality: 'Presencial',
    average: '9.4',
    attendance: 100,
    progress: 80,
    unreadNotices: 0,
    accent: 'emerald',
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Guarda de Rota
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

  const accentStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      label: 'text-blue-600',
      hoverBorder: 'hover:border-blue-200',
      bar: 'bg-blue-600',
      strip: 'bg-blue-500',
      arrowHover: 'group-hover:text-blue-600',
    },
    red: {
      iconBg: 'bg-red-50 text-red-600 border-red-100',
      label: 'text-red-600',
      hoverBorder: 'hover:border-red-200',
      bar: 'bg-red-500',
      strip: 'bg-red-500',
      arrowHover: 'group-hover:text-red-600',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      label: 'text-indigo-600',
      hoverBorder: 'hover:border-indigo-200',
      bar: 'bg-indigo-600',
      strip: 'bg-indigo-500',
      arrowHover: 'group-hover:text-indigo-600',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      label: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-200',
      bar: 'bg-emerald-500',
      strip: 'bg-emerald-500',
      arrowHover: 'group-hover:text-emerald-600',
    },
  };

  const renderCourseIcon = (id: string) => {
    if (id === 'web-fullstack') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    if (id === 'arq-software') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
    if (id === 'banco-dados') {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const filteredCourses = COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 relative pb-32 font-sans selection:bg-blue-200 text-slate-800 overflow-x-hidden">
      {/* Efeitos Liquid Glass Atmosféricos */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-blue-400/20 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-80 h-80 bg-red-400/10 rounded-full filter blur-[90px] pointer-events-none"></div>
      <div className="fixed top-[35%] left-[55%] w-64 h-64 bg-indigo-400/10 rounded-full filter blur-[80px] pointer-events-none"></div>

      {/* Cabeçalho Estilo App Nativo */}
      <header className="px-5 pt-14 pb-5 bg-white/75 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center shadow-sm rounded-b-3xl border-b border-slate-200/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-black text-sm tracking-widest">IN</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Disciplinas</h1>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">4º Semestre • INBEC 2026.2</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
          Eng. Software
        </span>
      </header>

      <main className="px-5 pt-6 flex flex-col gap-6 relative z-10 max-w-md mx-auto w-full">
        {/* Card Resumo do Semestre */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-10 w-28 h-28 bg-red-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Desempenho 2026.2
              </span>
              <span className="text-[11px] font-semibold text-blue-100">Situação Regular</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/15">
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  CR Geral
                </span>
                <span className="text-2xl font-black tracking-tight">8.9</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  Frequência
                </span>
                <span className="text-2xl font-black tracking-tight">95%</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-100/80 font-semibold uppercase block">
                  Matérias
                </span>
                <span className="text-2xl font-black tracking-tight">{COURSES.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Busca Rápida */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar disciplina, professor ou sala..."
            className="w-full bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
          />
        </div>

        {/* Lista de Disciplinas */}
        <section className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-slate-800 font-bold text-base tracking-tight">Grade Matriculada</h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Toque para abrir a sala
            </span>
          </div>

          {filteredCourses.map((course) => {
            const theme = accentStyles[course.accent];
            return (
              <Link
                key={course.id}
                href="/courses/sala"
                className={`block bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer border border-slate-200/70 ${theme.hoverBorder} group relative overflow-hidden`}
              >
                {/* Faixa lateral colorida */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.strip}`}></div>

                <div className="pl-1.5 flex items-center gap-3.5">
                  <div
                    className={`w-13 h-13 w-14 h-14 shrink-0 ${theme.iconBg} border rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    {renderCourseIcon(course.id)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest truncate ${theme.label}`}
                      >
                        {course.schedule}
                      </span>
                      {course.unreadNotices > 0 && (
                        <span className="shrink-0 text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                          {course.unreadNotices} {course.unreadNotices === 1 ? 'aviso' : 'avisos'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-slate-800 font-bold text-[15px] mt-0.5 truncate group-hover:text-blue-700 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5 truncate font-medium">
                      {course.professor} • {course.room}
                    </p>
                  </div>

                  <div
                    className={`text-slate-300 shrink-0 transition-all group-hover:translate-x-0.5 ${theme.arrowHover}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Rodapé com Métricas + Progresso */}
                <div className="pl-1.5 mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Média {course.average}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {course.attendance}% pres.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 max-w-[110px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${theme.bar} rounded-full`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{course.progress}%</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredCourses.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-8 text-center">
              <p className="text-sm font-bold text-slate-700">Nenhuma disciplina encontrada</p>
              <p className="text-xs text-slate-400 mt-1">
                Tente buscar por outro nome ou professor.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}