import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";

export function useSignOut() {
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Sign out error", error.message);
        }
    };

    return { signOut };
}