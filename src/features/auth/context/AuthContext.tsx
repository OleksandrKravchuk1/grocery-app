import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react'
import {Session, User} from '@supabase/supabase-js'
import {supabase} from '@/src/lib/supabase'

type AuthContextValue = {
    session: Session | null;
    user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadSession = async () => {
            const {
                data: {session: currentSession},
            } = await supabase.auth.getSession();

            setSession(currentSession);
            setUser(currentSession?.user ?? null);
        };

        void loadSession();

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setUser(nextSession?.user ?? null);
        })

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const value = useMemo(
        () => ({
            session,
            user,
        }),
        [session, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    };

    return context;
}
