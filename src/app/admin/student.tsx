import React from 'react';
import { createClient } from '@supabase/supabase-js';

export default async function Student() {
  // Inicializa o Supabase com a Chave Mestra para ignorar bloqueios de segurança do frontend
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Busca todos os alunos cadastrados na aba Auth
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
        Erro ao carregar alunos: {error.message}
      </div>
    );
  }

  const users = data?.users || [];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm w-full">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 text-sm font-semibold text-slate-600">ID / Email</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Data de Cadastro</th>
            <th className="p-4 text-sm font-semibold text-slate-600">Último Acesso</th>
            <th className="p-4 text-sm font-semibold text-slate-600 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="p-4">
                <div className="font-semibold text-slate-800">{user.email}</div>
                <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={user.id}>
                  {user.id}
                </div>
              </td>
              <td className="p-4 text-sm text-slate-600">
                {new Date(user.created_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', month: '2-digit', year: 'numeric' 
                })}
              </td>
              <td className="p-4 text-sm text-slate-600">
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR', { 
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
                    }) 
                  : <span className="text-slate-400 italic">Nunca acessou</span>}
              </td>
              <td className="p-4 text-center">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  Ativo
                </span>
              </td>
            </tr>
          ))}
          
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                Nenhum aluno cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}