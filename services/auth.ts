import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

export async function signUp(email: string, password: string) {
    const { data: { session, user }, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (user) {
        await supabase.from("profiles").upsert({ id: user.id });
    }

    return { session };
}