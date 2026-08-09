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

interface DesignItem {
    id: string;
    name?: string | null;
    sourceImage: string;
    sourcePath?: string | null;
    renderedImage?: string | null;
    renderedPath?: string | null;
    publicPath?: string | null;
    timestamp: number;
    ownerId?: string | null;
    sharedBy?: string | null;
    sharedAt?: string | null;
    isPublic?: boolean;
}

interface CreateProjectParams {
    item: DesignItem;
    visability?: "public" | "private" 
}

interface DesignConfig {
    floor: string;
    walls: string;
    style: string;
}

