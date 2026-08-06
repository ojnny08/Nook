interface AuthState {
    isSignedIn: boolean;
    username: string | null,
    userId: string | null
}

interface AuthContext extends AuthState {
    refreshAuth: () => Promise<boolean>;
    signIn: () => Promise<boolean>;
    signOut: () => Promise<boolean>;
}