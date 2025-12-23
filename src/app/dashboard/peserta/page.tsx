'use client';

import { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Peserta, PesertaFormData } from '@/types/peserta';

const INITIAL_PESERTA: Peserta[] = [
  { id: '1', name: 'Ilham Firdaus', group: 'A', photo: '/avatar/ilham.jpg', status: 'active', createdAt: new Date() },
  { id: '2', name: 'Diki Pratama', group: 'A', photo: '/avatar/diki.jpg', status: 'active', createdAt: new Date() },
  { id: '3', name: 'Ahmad Rizki', group: 'A', photo: '/avatar/ilham.jpg', status: 'active', createdAt: new Date() },
  { id: '4', name: 'Budi Santoso', group: 'B', photo: '/avatar/diki.jpg', status: 'active', createdAt: new Date() },
  { id: '5', name: 'Citra Dewi', group: 'B', photo: '/avatar/ilham.jpg', status: 'active', createdAt: new Date() },
  { id: '6', name: 'Diana Putri', group: 'B', photo: '/avatar/diki.jpg', status: 'active', createdAt: new Date() },
];

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

const PesertaPage = (): React.ReactElement => {
  const [peserta, setPeserta] = useState<Peserta[]>(INITIAL_PESERTA);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  const [formData, setFormData] = useState<PesertaFormData>({
    name: '',
    group: 'A',
    photo: '/avatar/ilham.jpg',
    status: 'active',
  });

  const filteredPeserta = peserta.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = useCallback((): void => {
    setFormData({
      name: '',
      group: 'A',
      photo: '/avatar/ilham.jpg',
      status: 'active',
    });
  }, []);

  const handleAdd = useCallback((): void => {
    const newPeserta: Peserta = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };
    setPeserta((prev) => [...prev, newPeserta]);
    setIsAddDialogOpen(false);
    resetForm();
  }, [formData, resetForm]);

  const handleEdit = useCallback((): void => {
    if (!selectedPeserta) return;
    
    setPeserta((prev) =>
      prev.map((p) =>
        p.id === selectedPeserta.id
          ? { ...p, ...formData }
          : p
      )
    );
    setIsEditDialogOpen(false);
    setSelectedPeserta(null);
    resetForm();
  }, [selectedPeserta, formData, resetForm]);

  const handleDelete = useCallback((): void => {
    if (!selectedPeserta) return;
    
    setPeserta((prev) => prev.filter((p) => p.id !== selectedPeserta.id));
    setIsDeleteDialogOpen(false);
    setSelectedPeserta(null);
  }, [selectedPeserta]);

  const openEditDialog = useCallback((p: Peserta): void => {
    setSelectedPeserta(p);
    setFormData({
      name: p.name,
      group: p.group,
      photo: p.photo,
      status: p.status,
    });
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((p: Peserta): void => {
    setSelectedPeserta(p);
    setIsDeleteDialogOpen(true);
  }, []);

  const getStatusBadge = (status: Peserta['status']): React.ReactElement => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      eliminated: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      winner: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    };

    const labels = {
      active: 'Aktif',
      eliminated: 'Tersingkir',
      winner: 'Pemenang',
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Kelola Peserta
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tambah, edit, dan hapus data peserta
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-lg font-semibold">Daftar Peserta</CardTitle>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari peserta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            {/* Add Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Peserta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Peserta Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan data peserta baru di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama peserta"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="group">Group</Label>
                    <select
                      id="group"
                      value={formData.group}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {GROUPS.map((g) => (
                        <option key={g} value={g}>
                          Group {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Peserta['status'] })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="active">Aktif</option>
                      <option value="eliminated">Tersingkir</option>
                      <option value="winner">Pemenang</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    disabled={!formData.name.trim()}
                  >
                    Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Peserta</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeserta.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Tidak ada peserta ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPeserta.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                          <UserCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Group {p.group}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(p)}
                          className="text-muted-foreground hover:text-violet-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteDialog(p)}
                          className="text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Peserta</DialogTitle>
            <DialogDescription>
              Ubah data peserta di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama peserta"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-group">Group</Label>
              <select
                id="edit-group"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    Group {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Peserta['status'] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Aktif</option>
                <option value="eliminated">Tersingkir</option>
                <option value="winner">Pemenang</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
              disabled={!formData.name.trim()}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Peserta</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus peserta &quot;{selectedPeserta?.name}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PesertaPage;

