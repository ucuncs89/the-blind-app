// Types migrated from IndexedDB to MongoDB
// Keeping this file for backward compatibility with existing type imports

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
