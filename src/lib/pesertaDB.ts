import { db, type PesertaRecord } from './db';
import type { Peserta } from '@/types/peserta';

// Convert between Peserta type and DB record
const toRecord = (peserta: Peserta): PesertaRecord => ({
  ...peserta,
});

const fromRecord = (record: PesertaRecord): Peserta => ({
  ...record,
});

export const getAllPeserta = async (): Promise<Peserta[]> => {
  const records = await db.peserta.toArray();
  return records.map(fromRecord);
};

export const getPesertaById = async (id: string): Promise<Peserta | undefined> => {
  const record = await db.peserta.get(id);
  return record ? fromRecord(record) : undefined;
};

export const getPesertaByGroup = async (group: string): Promise<Peserta[]> => {
  const records = await db.peserta.where('group').equals(group).toArray();
  return records.map(fromRecord);
};

export const getPesertaByStatus = async (status: Peserta['status']): Promise<Peserta[]> => {
  const records = await db.peserta.where('status').equals(status).toArray();
  return records.map(fromRecord);
};

export const addPeserta = async (peserta: Peserta): Promise<Peserta> => {
  await db.peserta.add(toRecord(peserta));
  return peserta;
};

export const updatePeserta = async (peserta: Peserta): Promise<Peserta> => {
  await db.peserta.put(toRecord(peserta));
  return peserta;
};

export const deletePeserta = async (id: string): Promise<void> => {
  await db.peserta.delete(id);
};

export const bulkAddPeserta = async (pesertaList: Peserta[]): Promise<void> => {
  await db.peserta.bulkPut(pesertaList.map(toRecord));
};

export const clearAllPeserta = async (): Promise<void> => {
  await db.peserta.clear();
};

export const countPeserta = async (): Promise<number> => {
  return await db.peserta.count();
};

export const searchPeserta = async (query: string): Promise<Peserta[]> => {
  const lowerQuery = query.toLowerCase();
  const records = await db.peserta
    .filter((p) => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.group.toLowerCase().includes(lowerQuery)
    )
    .toArray();
  return records.map(fromRecord);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
