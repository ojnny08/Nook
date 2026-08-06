// puter.js is browser-only, so it is imported lazily to keep it out of the SSR pass.
const puter = async () => (await import("@heyputer/puter.js")).default;

export const signIn = async () => await (await puter()).auth.signIn();

export const signOut = async () => (await puter()).auth.signOut();

export const isSignedIn = async () => (await puter()).auth.isSignedIn();

export const getUser = async () => await (await puter()).auth.getUser();

/** Fires on sign-in, sign-out, and API origin changes. Returns an unsubscribe. */
export const onAuthStateChanged = async (listener: () => void) =>
    (await puter()).onAuthStateChanged(listener);
