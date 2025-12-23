'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Peserta, PesertaFormData } from '@/types/peserta';
import {
  addPeserta as addPesertaDB,
  updatePeserta as updatePesertaDB,
  deletePeserta as deletePesertaDB,
  bulkAddPeserta,
  countPeserta,
} from '@/lib/pesertaDB';

const INITIAL_PESERTA: Peserta[] = [
  { id: '1', name: 'Ilham Firdaus', group: 'A', photo: '', status: 'active', createdAt: new Date() },
  { id: '2', name: 'Diki Pratama', group: 'A', photo: '', status: 'active', createdAt: new Date() },
  { id: '3', name: 'Ahmad Rizki', group: 'A', photo: '', status: 'active', createdAt: new Date() },
  { id: '4', name: 'Budi Santoso', group: 'B', photo: '', status: 'active', createdAt: new Date() },
  { id: '5', name: 'Citra Dewi', group: 'B', photo: '', status: 'active', createdAt: new Date() },
  { id: '6', name: 'Diana Putri', group: 'B', photo: '', status: 'active', createdAt: new Date() },
];

type UsePesertaDBResult = {
  peserta: Peserta[];
  isLoading: boolean;
  error: Error | null;
  addPeserta: (data: PesertaFormData) => Promise<Peserta>;
  updatePeserta: (id: string, data: PesertaFormData) => Promise<Peserta>;
  deletePeserta: (id: string) => Promise<void>;
};

export const usePesertaDB = (): UsePesertaDBResult => {
  const [isSeeding, setIsSeeding] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Seed initial data if database is empty
  useEffect(() => {
    const seedData = async (): Promise<void> => {
      try {
        const count = await countPeserta();

        if (count === 0) {
          await bulkAddPeserta(INITIAL_PESERTA);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to seed data'));
      } finally {
        setIsSeeding(false);
      }
    };

    seedData();
  }, []);

  // Live query - automatically updates when data changes
  const peserta = useLiveQuery(
    () => db.peserta.toArray(),
    [],
    []
  );

  const addPeserta = useCallback(async (data: PesertaFormData): Promise<Peserta> => {
    const newPeserta: Peserta = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
    };

    await addPesertaDB(newPeserta);
    return newPeserta;
  }, []);

  const updatePeserta = useCallback(async (id: string, data: PesertaFormData): Promise<Peserta> => {
    const existing = peserta?.find((p) => p.id === id);

    if (!existing) {
      throw new Error('Peserta not found');
    }

    const updated: Peserta = {
      ...existing,
      ...data,
    };

    await updatePesertaDB(updated);
    return updated;
  }, [peserta]);

  const deletePeserta = useCallback(async (id: string): Promise<void> => {
    await deletePesertaDB(id);
  }, []);

  return {
    peserta: peserta ?? [],
    isLoading: isSeeding || peserta === undefined,
    error,
    addPeserta,
    updatePeserta,
    deletePeserta,
  };
};

// Hook for searching peserta with live query
export const useSearchPeserta = (query: string): Peserta[] => {
  const lowerQuery = query.toLowerCase();

  const results = useLiveQuery(
    () => {
      if (!query.trim()) {
        return db.peserta.toArray();
      }

      return db.peserta
        .filter((p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.group.toLowerCase().includes(lowerQuery)
        )
        .toArray();
    },
    [query],
    []
  );

  return results ?? [];
};

// Hook for getting peserta by group
export const usePesertaByGroup = (group: string): Peserta[] => {
  const results = useLiveQuery(
    () => db.peserta.where('group').equals(group).toArray(),
    [group],
    []
  );

  return results ?? [];
};

// Hook for getting peserta by status
export const usePesertaByStatus = (status: Peserta['status']): Peserta[] => {
  const results = useLiveQuery(
    () => db.peserta.where('status').equals(status).toArray(),
    [status],
    []
  );

  return results ?? [];
};
