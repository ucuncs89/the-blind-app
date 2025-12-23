"use client";

import { useCallback, useEffect, useState } from "react";
import type { Peserta, PesertaFormData } from "@/types/peserta";
import { getAllPeserta, addPeserta as addPesertaAPI, updatePeserta as updatePesertaAPI, deletePeserta as deletePesertaAPI, bulkAddPeserta, countPeserta, searchPeserta } from "@/lib/pesertaAPI";

const INITIAL_PESERTA: Peserta[] = [
    // Group A
    { id: "1", name: "Ilham Firdaus", group: "A", photo: "", status: "active", createdAt: new Date() },
    { id: "2", name: "Diki Pratama", group: "A", photo: "", status: "active", createdAt: new Date() },
    { id: "3", name: "Ahmad Rizki", group: "A", photo: "", status: "active", createdAt: new Date() },
    // Group B
    { id: "4", name: "Budi Santoso", group: "B", photo: "", status: "active", createdAt: new Date() },
    { id: "5", name: "Citra Dewi", group: "B", photo: "", status: "active", createdAt: new Date() },
    { id: "6", name: "Diana Putri", group: "B", photo: "", status: "active", createdAt: new Date() },
    // Group C
    { id: "7", name: "Eko Prasetyo", group: "C", photo: "", status: "active", createdAt: new Date() },
    { id: "8", name: "Fajar Nugroho", group: "C", photo: "", status: "active", createdAt: new Date() },
    { id: "9", name: "Gilang Ramadhan", group: "C", photo: "", status: "active", createdAt: new Date() },
    // Group D
    { id: "10", name: "Hendra Wijaya", group: "D", photo: "", status: "active", createdAt: new Date() },
    { id: "11", name: "Indra Kusuma", group: "D", photo: "", status: "active", createdAt: new Date() },
    { id: "12", name: "Joko Widodo", group: "D", photo: "", status: "active", createdAt: new Date() },
    // Group E
    { id: "13", name: "Kevin Sanjaya", group: "E", photo: "", status: "active", createdAt: new Date() },
    { id: "14", name: "Lukman Hakim", group: "E", photo: "", status: "active", createdAt: new Date() },
    { id: "15", name: "Muhammad Arif", group: "E", photo: "", status: "active", createdAt: new Date() },
    // Group F
    { id: "16", name: "Naufal Aziz", group: "F", photo: "", status: "active", createdAt: new Date() },
    { id: "17", name: "Oscar Pratama", group: "F", photo: "", status: "active", createdAt: new Date() },
    { id: "18", name: "Putra Mahendra", group: "F", photo: "", status: "active", createdAt: new Date() },
    // Group G
    { id: "19", name: "Qori Hidayat", group: "G", photo: "", status: "active", createdAt: new Date() },
    { id: "20", name: "Rafi Adriansyah", group: "G", photo: "", status: "active", createdAt: new Date() },
    { id: "21", name: "Surya Darma", group: "G", photo: "", status: "active", createdAt: new Date() },
    // Group H
    { id: "22", name: "Taufik Hidayat", group: "H", photo: "", status: "active", createdAt: new Date() },
    { id: "23", name: "Umar Faruq", group: "H", photo: "", status: "active", createdAt: new Date() },
    { id: "24", name: "Vino Bastian", group: "H", photo: "", status: "active", createdAt: new Date() },
    // Group I
    { id: "25", name: "Wahyu Saputra", group: "I", photo: "", status: "active", createdAt: new Date() },
    { id: "26", name: "Xander Putra", group: "I", photo: "", status: "active", createdAt: new Date() },
    { id: "27", name: "Yoga Pratama", group: "I", photo: "", status: "active", createdAt: new Date() },
    // Group J
    { id: "28", name: "Zaky Mubarak", group: "J", photo: "", status: "active", createdAt: new Date() },
    { id: "29", name: "Adi Nugraha", group: "J", photo: "", status: "active", createdAt: new Date() },
    { id: "30", name: "Bagus Wicaksono", group: "J", photo: "", status: "active", createdAt: new Date() },
    // Group K
    { id: "31", name: "Cahyo Purnomo", group: "K", photo: "", status: "active", createdAt: new Date() },
    { id: "32", name: "Danu Setiawan", group: "K", photo: "", status: "active", createdAt: new Date() },
    { id: "33", name: "Erlangga Putra", group: "K", photo: "", status: "active", createdAt: new Date() },
    // Group L
    { id: "34", name: "Farhan Akbar", group: "L", photo: "", status: "active", createdAt: new Date() },
    { id: "35", name: "Galih Permana", group: "L", photo: "", status: "active", createdAt: new Date() },
    { id: "36", name: "Haris Munandar", group: "L", photo: "", status: "active", createdAt: new Date() },
    // Group M
    { id: "37", name: "Ivan Gunawan", group: "M", photo: "", status: "active", createdAt: new Date() },
    { id: "38", name: "Jefri Nichol", group: "M", photo: "", status: "active", createdAt: new Date() },
    { id: "39", name: "Krisna Adi", group: "M", photo: "", status: "active", createdAt: new Date() },
    // Group N
    { id: "40", name: "Luthfi Rahman", group: "N", photo: "", status: "active", createdAt: new Date() },
    { id: "41", name: "Maulana Ibrahim", group: "N", photo: "", status: "active", createdAt: new Date() },
    { id: "42", name: "Nanda Pratama", group: "N", photo: "", status: "active", createdAt: new Date() },
    // Group O
    { id: "43", name: "Oktavian Dwi", group: "O", photo: "", status: "active", createdAt: new Date() },
    { id: "44", name: "Pranata Wijaya", group: "O", photo: "", status: "active", createdAt: new Date() },
    { id: "45", name: "Rizal Firmansyah", group: "O", photo: "", status: "active", createdAt: new Date() },
];

type UsePesertaDBResult = {
    peserta: Peserta[];
    isLoading: boolean;
    error: Error | null;
    addPeserta: (data: PesertaFormData) => Promise<Peserta>;
    updatePeserta: (id: string, data: PesertaFormData) => Promise<Peserta>;
    deletePeserta: (id: string) => Promise<void>;
    refetch: () => Promise<void>;
};

export const usePesertaDB = (): UsePesertaDBResult => {
    const [peserta, setPeserta] = useState<Peserta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPeserta = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            const data = await getAllPeserta();
            setPeserta(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch peserta"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Seed initial data if database is empty
    useEffect(() => {
        const seedData = async (): Promise<void> => {
            try {
                const count = await countPeserta();
                if (count === 0) {
                    await bulkAddPeserta(INITIAL_PESERTA);
                }
                await fetchPeserta();
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to seed data"));
                setIsLoading(false);
            }
        };

        seedData();
    }, [fetchPeserta]);

    const addPeserta = useCallback(async (data: PesertaFormData): Promise<Peserta> => {
        const newPeserta: Peserta = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date(),
        };
        const created = await addPesertaAPI(newPeserta);
        setPeserta((prev) => [...prev, created]);
        return created;
    }, []);

    const updatePeserta = useCallback(
        async (id: string, data: PesertaFormData): Promise<Peserta> => {
            const existing = peserta.find((p) => p.id === id);
            if (!existing) {
                throw new Error("Peserta not found");
            }
            const updated: Peserta = {
                ...existing,
                ...data,
            };
            const result = await updatePesertaAPI(updated);
            setPeserta((prev) => prev.map((p) => (p.id === id ? result : p)));
            return result;
        },
        [peserta]
    );

    const deletePeserta = useCallback(async (id: string): Promise<void> => {
        await deletePesertaAPI(id);
        setPeserta((prev) => prev.filter((p) => p.id !== id));
    }, []);

    return {
        peserta,
        isLoading,
        error,
        addPeserta,
        updatePeserta,
        deletePeserta,
        refetch: fetchPeserta,
    };
};

// Hook for searching peserta
export const useSearchPeserta = (query: string): Peserta[] => {
    const [results, setResults] = useState<Peserta[]>([]);
    const { peserta } = usePesertaDB();

    useEffect(() => {
        if (!query.trim()) {
            setResults(peserta);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = peserta.filter((p) => p.name.toLowerCase().includes(lowerQuery) || p.group.toLowerCase().includes(lowerQuery));
        setResults(filtered);
    }, [query, peserta]);

    return results;
};

// Hook for getting peserta by group
export const usePesertaByGroup = (group: string): Peserta[] => {
    const { peserta } = usePesertaDB();
    return peserta.filter((p) => p.group === group);
};

// Hook for getting peserta by status
export const usePesertaByStatus = (status: Peserta["status"]): Peserta[] => {
    const { peserta } = usePesertaDB();
    return peserta.filter((p) => p.status === status);
};
