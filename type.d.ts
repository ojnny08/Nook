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
type HostingConfig = { subDomain: string; };
type HostedAsset = { url: string; };

interface StoreHostedImageParams {
    hosting: HostingConfig | null;
    url: string;
    projectId: string;
    label: "source" | "rendered";
}



