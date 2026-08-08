import { STORAGE_PATHS } from "./consstants";
import { getOrCreateHosting, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

// puter.js is browser-only, so it is imported lazily to keep it out of the SSR pass.
const puter = async () => (await import("@heyputer/puter.js")).default;

export const signIn = async () => await (await puter()).auth.signIn();

export const signOut = async () => (await puter()).auth.signOut();

export const isSignedIn = async () => (await puter()).auth.isSignedIn();

export const getUser = async () => await (await puter()).auth.getUser();

export const createProject = async ( {item }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
     const projectId = item.id;

     const hosting = await getOrCreateHosting();

     const hostedSource = projectId ?
        await uploadImageToHosting({
            hosting, url: item.sourceImage, projectId, label: 'source'
        }) : null
    
    const hostedRender = projectId && item.renderedImage ?
        await uploadImageToHosting({
            hosting, url: item.renderedImage, projectId, label: 'rendered'
        }) : null

    const resolvedSource =  hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage
        : ''
    );

    if (!resolvedSource) {
        console.warn("Failed to upload image, skipping save")
        return null;
    }

    const resolvedRender = hostedRender?.url
        ? hostedRender?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
            ? item.renderedImage
            : undefined;
    
    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    }

    try {
        // call puter worker to sroe in kv
        return payload
    } catch (error) {
        
    }
};

/** Fires on sign-in, sign-out, and API origin changes. Returns an unsubscribe. */
export const onAuthStateChanged = async (listener: () => void) =>
    (await puter()).onAuthStateChanged(listener);

/**
 * Writes a floor plan into the signed-in user's storage.
 * Resolves to the written item, whose `uid` is the server-assigned project id.
 */
export const uploadFloorPlan = async (
    file: File,
    onProgress?: (percent: number) => void,
) => {
    const path = `${STORAGE_PATHS.SOURCES}/${Date.now()}-${file.name}`;

    return await (await puter()).fs.write(path, file, {
        createMissingParents: true,
        // puter reports 0-100, but runs it through toFixed(2) so it arrives as a string
        progress: (_operationId, percent) => onProgress?.(Number(percent)),
    });
};
