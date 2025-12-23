import Dexie, { type EntityTable } from 'dexie';

export type PesertaRecord = {
  id: string;
  name: string;
  group: string;
  photo: string;
  status: 'active' | 'eliminated' | 'winner';
  createdAt: Date;
};

class TheBlindAppDB extends Dexie {
  peserta!: EntityTable<PesertaRecord, 'id'>;

  constructor() {
    super('the-blind-app');

    this.version(1).stores({
      peserta: 'id, name, group, status, createdAt',
    });
  }
}

export const db = new TheBlindAppDB();

