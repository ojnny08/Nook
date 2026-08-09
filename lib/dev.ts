/**
 * TEMPORARY dev utilities. Delete before merging.
 *
 * These destroy real data in the signed-in user's Puter account.
 */
import { STORAGE_PATHS } from "./consstants";
import { HOSTING_KEY } from "./utils";

const puter = async () => (await import("@heyputer/puter.js")).default;

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** Logs current storage usage without changing anything. */
export const reportSpace = async () => {
    const { used, capacity } = await (await puter()).fs.space();
    console.log(`[dev] storage: ${mb(used)} / ${mb(capacity)}`);
    return { used, capacity };
};

/**
 * Deletes the app's uploaded floor plans and hosted images, then clears the
 * hosting config so the next upload starts clean.
 *
 * Leaves the subdomain itself in place — reusing it avoids accumulating
 * orphaned subdomains. Pass `dropSubdomain: true` to remove it too.
 */
export const wipeAppData = async ({ dropSubdomain = false } = {}) => {
    const p = await puter();

    await reportSpace();

    // fs.delete rejects when the path doesn't exist, which is fine on a clean account
    for (const path of ["projects", STORAGE_PATHS.ROOT]) {
        try {
            await p.fs.delete(path, { recursive: true });
            console.log(`[dev] deleted ${path}`);
        } catch {
            console.log(`[dev] ${path} not present, skipping`);
        }
    }

    if (dropSubdomain) {
        const config = await p.kv.get<HostingConfig>(HOSTING_KEY);
        if (config?.subDomain) {
            try {
                await p.hosting.delete(config.subDomain);
                console.log(`[dev] deleted subdomain ${config.subDomain}`);
            } catch {
                console.log(`[dev] could not delete subdomain ${config.subDomain}`);
            }
        }
        await p.kv.del(HOSTING_KEY);
    }

    console.log("[dev] wipe complete");
    return await reportSpace();
};

/** Lists every subdomain on the account, so orphans from earlier runs are visible. */
export const listSubdomains = async () => {
    const subs = await (await puter()).hosting.list();
    console.table(subs.map((s) => ({ subdomain: s.subdomain, uid: s.uid })));
    return subs;
};

/** Removes every nook-* subdomain. Destructive; run only when you mean it. */
export const deleteNookSubdomains = async () => {
    const p = await puter();
    const subs = await p.hosting.list();
    const mine = subs.filter((s) => s.subdomain.startsWith("nook-"));

    for (const s of mine) {
        try {
            await p.hosting.delete(s.subdomain);
            console.log(`[dev] deleted ${s.subdomain}`);
        } catch {
            console.log(`[dev] could not delete ${s.subdomain}`);
        }
    }

    await p.kv.del(HOSTING_KEY);
    console.log(`[dev] removed ${mine.length} subdomain(s)`);
};
