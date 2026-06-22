import { supabase } from "@/src/lib/supabase";
import { Auth } from "@/src/types/auth";

export async function signIn({ email, password }: Auth) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp({ email, password }: Auth) {
  const { data: { session, user }, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (user) {
    await supabase.from("profiles").upsert({ id: user.id });
  }

  return { session };
}
