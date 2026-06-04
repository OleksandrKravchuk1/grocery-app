import { supabase } from "@/src/lib/supabase";
import { Alert } from "react-native";

export function useSignOut() {
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert("Sign out error", error.message);
        }
    };

    return signOut;
}
