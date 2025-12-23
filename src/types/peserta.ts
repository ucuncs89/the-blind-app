export type Peserta = {
  id: string;
  name: string;
  group: string;
  photo: string;
  status: 'active' | 'eliminated' | 'winner';
  createdAt: Date;
};

export type PesertaFormData = Omit<Peserta, 'id' | 'createdAt'>;

