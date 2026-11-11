'use server';

import { createClient } from '@supabase/supabase-js';

export async function fetchAllUsers() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
  
  return data.users;
}