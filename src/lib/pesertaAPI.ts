import type { Peserta } from "@/types/peserta";

const API_BASE = "/api/peserta";

export const getAllPeserta = async (): Promise<Peserta[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) {
        throw new Error("Failed to fetch peserta");
    }
    return res.json();
};

export const getPesertaById = async (id: string): Promise<Peserta | undefined> => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
        if (res.status === 404) return undefined;
        throw new Error("Failed to fetch peserta");
    }
    return res.json();
};

export const addPeserta = async (peserta: Peserta): Promise<Peserta> => {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(peserta),
    });
    if (!res.ok) {
        throw new Error("Failed to create peserta");
    }
    return res.json();
};

export const updatePeserta = async (peserta: Peserta): Promise<Peserta> => {
    const res = await fetch(`${API_BASE}/${peserta.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(peserta),
    });
    if (!res.ok) {
        throw new Error("Failed to update peserta");
    }
    return res.json();
};

export const deletePeserta = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Failed to delete peserta");
    }
};

export const bulkAddPeserta = async (pesertaList: Peserta[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pesertaList),
    });
    if (!res.ok) {
        throw new Error("Failed to bulk create peserta");
    }
};

export const countPeserta = async (): Promise<number> => {
    const res = await fetch(`${API_BASE}/count`);
    if (!res.ok) {
        throw new Error("Failed to count peserta");
    }
    const data = await res.json();
    return data.count;
};

export const searchPeserta = async (query: string): Promise<Peserta[]> => {
    const allPeserta = await getAllPeserta();
    const lowerQuery = query.toLowerCase();
    return allPeserta.filter((p) => p.name.toLowerCase().includes(lowerQuery) || p.group.toLowerCase().includes(lowerQuery));
};
