import { useCallback, useState } from "react";
import { createProject } from "./puter.actions";

export const useProjects = () => {
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const addProject = useCallback(
        async (uid: string, file: File): Promise<DesignItem | null> => {
            const blobUrl = URL.createObjectURL(file);

            try {
                const saved = await createProject({
                    item: {
                        id: uid,
                        name: `Residence ${uid}`,
                        sourceImage: blobUrl,
                        timestamp: Date.now(),
                    },
                    visability: "private",
                });

                if (!saved) return null;

                setProjects((prev) => [saved, ...prev]);

                return saved;
            } finally {
                URL.revokeObjectURL(blobUrl);
            }
        },
        [],
    );

    return { projects, addProject };
};
