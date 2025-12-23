import Dexie, { type EntityTable } from 'dexie';

export type PesertaRecord = {
  id: string;
  name: string;
  group: string;
  photo: string;
  status: 'active' | 'eliminated' | 'winner';
  createdAt: Date;
};

export type NodeAssignmentRecord = {
  id: string; // nodeId (e.g., 'round_2_wildcard_1', 'round_2_person_1')
  pesertaId: string;
  baganId: string; // 'bagan-1', 'bagan-2', etc.
  assignedAt: Date;
};

class TheBlindAppDB extends Dexie {
  peserta!: EntityTable<PesertaRecord, 'id'>;
  nodeAssignments!: EntityTable<NodeAssignmentRecord, 'id'>;

  constructor() {
    super('the-blind-app');

    this.version(1).stores({
      peserta: 'id, name, group, status, createdAt',
    });

    this.version(2).stores({
      peserta: 'id, name, group, status, createdAt',
      nodeAssignments: 'id, pesertaId, baganId, assignedAt',
    });
  }
}

export const db = new TheBlindAppDB();

