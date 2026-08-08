import { HOSTING_KEY, createHostingSlug, fetchBlobFromUrl, getHostedUrl, getImageExtension, imageUrlToPngBlob, isHostedUrl } from "./utils";
import puter from "@heyputer/puter.js";

export const getOrCreateHosting = async (): Promise<HostingConfig | null> => {
    const existing = await puter.kv.get<HostingConfig>(HOSTING_KEY);

    if (existing?.subDomain) return { subDomain: existing.subDomain };

    const subDomain = createHostingSlug();

    try {
        const created = await puter.hosting.create(subDomain, '.');
        const config: HostingConfig = { subDomain: created.subdomain };

        await puter.kv.set(HOSTING_KEY, config);

        return config;
    } catch (error) {
        console.error("Couldn't create subdomain", error);
        return null;
    }
}

export const uploadImageToHosting = async ({ hosting, url, projectId, label }: StoreHostedImageParams): Promise<HostedAsset | null> => {
    if (!hosting || !url) return null;
    if (isHostedUrl(url)) return { url: url };

    try {
        const resolved = label === "rendered" 
        ? await imageUrlToPngBlob(url)
            .then((blob) => blob ? { blob, contentType: 'image/png'} : null)
        : await fetchBlobFromUrl(url)

        if (!resolved) return null;

        const contentType = resolved.contentType || resolved.blob.type || '';
        const ext = getImageExtension(contentType, url);
        const dir = `projects/${projectId}`;
        const filePath = `${dir}/${label}.${ext}`;

        const uploadFile = new File([resolved.blob], `${label}.${ext}`, {
            type: contentType
        })

        await puter.fs.mkdir(dir, { createMissingParents: true});
        await puter.fs.write(filePath, uploadFile);

        const hostedUrl = getHostedUrl({ subdomain: hosting.subDomain }, filePath);

        return hostedUrl ? { url: hostedUrl } : null

    } catch (error) {
        console.log("Failed to load url")
        return null
    }
}