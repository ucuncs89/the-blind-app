import type { Peserta } from "@/types/peserta";

// Convert between Peserta type and API response
const fromRecord = (record: Peserta & { createdAt: string }): Peserta => ({
    ...record,
    createdAt: new Date(record.createdAt),
});

export const getAllPeserta = async (): Promise<Peserta[]> => {
    const response = await fetch("/api/peserta");
    if (!response.ok) {
        throw new Error("Failed to fetch peserta");
    }
    const records = await response.json();
    return records.map((r: Peserta & { createdAt: string }) => fromRecord(r));
};

export const getPesertaById = async (id: string): Promise<Peserta | undefined> => {
    const response = await fetch(`/api/peserta/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return undefined;
        }
        throw new Error("Failed to fetch peserta");
    }
    const record = await response.json();
    return fromRecord(record);
};

export const getPesertaByGroup = async (group: string): Promise<Peserta[]> => {
    const allPeserta = await getAllPeserta();
    return allPeserta.filter((p) => p.group === group);
};

export const getPesertaByStatus = async (status: Peserta["status"]): Promise<Peserta[]> => {
    const allPeserta = await getAllPeserta();
    return allPeserta.filter((p) => p.status === status);
};

export const addPeserta = async (peserta: Peserta): Promise<Peserta> => {
    const response = await fetch("/api/peserta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(peserta),
    });

    if (!response.ok) {
        throw new Error("Failed to add peserta");
    }

    const record = await response.json();
    return fromRecord(record);
};

export const updatePeserta = async (peserta: Peserta): Promise<Peserta> => {
    const response = await fetch(`/api/peserta/${peserta.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(peserta),
    });

    if (!response.ok) {
        throw new Error("Failed to update peserta");
    }

    const record = await response.json();
    return fromRecord(record);
};

export const deletePeserta = async (id: string): Promise<void> => {
    const response = await fetch(`/api/peserta/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete peserta");
    }
};

export const bulkAddPeserta = async (pesertaList: Peserta[]): Promise<void> => {
    const response = await fetch("/api/peserta/bulk", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pesertaList),
    });

    if (!response.ok) {
        throw new Error("Failed to bulk add peserta");
    }
};

export const clearAllPeserta = async (): Promise<void> => {
    // For MongoDB, we need to delete all documents
    const allPeserta = await getAllPeserta();
    await Promise.all(allPeserta.map((p) => deletePeserta(p.id)));
};

export const countPeserta = async (): Promise<number> => {
    const response = await fetch("/api/peserta/count");
    if (!response.ok) {
        throw new Error("Failed to count peserta");
    }
    const data = await response.json();
    return data.count;
};

export const searchPeserta = async (query: string): Promise<Peserta[]> => {
    const response = await fetch(`/api/peserta/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error("Failed to search peserta");
    }
    const records = await response.json();
    return records.map((r: Peserta & { createdAt: string }) => fromRecord(r));
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};
