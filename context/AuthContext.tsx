import { createContext, useContext, useCallback, useMemo, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    getUser,
    isSignedIn as puterIsSignedIn,
    onAuthStateChanged,
    signIn as puterSignIn,
    signOut as puterSignOut,
} from "../lib/puter.actions";

const DEFAULT_AUTH_STATE: AuthState = {
    isSignedIn: false,
    username: null,
    userId: null,
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode}) {
    const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);

    const refreshAuth = useCallback(async () => {
        try {
            if (!(await puterIsSignedIn())) {
                setAuthState(DEFAULT_AUTH_STATE);
                return false;
            }
            const user = await getUser();
            setAuthState({ isSignedIn: true, username: user.username, userId: user.uuid});
            return true;
        } catch (error) {
            setAuthState(DEFAULT_AUTH_STATE);
            return false;
        }
    }, [])

    const signIn = useCallback(async () => {
        await puterSignIn();
        return refreshAuth();
    }, [refreshAuth])

    const signOut = useCallback(async () => {
        await puterSignOut();
        setAuthState(DEFAULT_AUTH_STATE);
        return true;
    }, [])

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;

        refreshAuth();
        onAuthStateChanged(() => {
            refreshAuth();
        }).then((unsub) => {
            // the provider can unmount while the lazy puter import is still resolving
            if (cancelled) unsub();
            else unsubscribe = unsub;
        });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [refreshAuth])

    const value = useMemo(
        () => ({ ...authState, refreshAuth, signIn, signOut }),
        [authState, refreshAuth, signIn, signOut],
    );
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}
