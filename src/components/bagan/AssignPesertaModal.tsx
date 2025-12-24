'use client';

import React, { useState, useEffect } from 'react';
import { getAllPeserta } from '@/lib/pesertaDB';
import { getNodeAssignments, updateNodeAssignment, deleteNodeAssignment } from '@/lib/nodeAssignmentsDB';
import type { NodeAssignmentRecord } from '@/lib/db';
import type { Peserta } from '@/types/peserta';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AssignPesertaModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  nodeName: string;
  baganId: string;
  currentPesertaId?: string;
  onAssignmentChange?: () => void;
};

export const AssignPesertaModal = ({
  open,
  onOpenChange,
  nodeId,
  nodeName,
  baganId,
  currentPesertaId,
  onAssignmentChange,
}: AssignPesertaModalProps): React.ReactElement => {
  const [selectedPesertaId, setSelectedPesertaId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<NodeAssignmentRecord[]>([]);

  // Fetch peserta and assignments when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async (): Promise<void> => {
        try {
          const [pesertaData, assignmentsData] = await Promise.all([
            getAllPeserta(),
            getNodeAssignments(baganId),
          ]);
          setPesertaList(pesertaData);
          setExistingAssignments(assignmentsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [open, baganId]);

  // Reset selected peserta when modal opens
  useEffect(() => {
    if (open) {
      setSelectedPesertaId(currentPesertaId ?? null);
    }
  }, [open, currentPesertaId]);

  // Get assigned peserta IDs (excluding current node)
  const assignedPesertaIds = new Set(
    existingAssignments
      .filter((a) => a.id !== nodeId)
      .map((a) => a.pesertaId)
  );

  // Filter available peserta (not assigned to other nodes)
  const availablePeserta = pesertaList.filter(
    (p) => !assignedPesertaIds.has(p.id) || p.id === currentPesertaId
  );

  const handleAssign = async (): Promise<void> => {
    if (!selectedPesertaId) return;

    setIsSubmitting(true);
    try {
      const assignment: NodeAssignmentRecord = {
        id: nodeId,
        pesertaId: selectedPesertaId,
        baganId,
        assignedAt: new Date(),
      };

      await updateNodeAssignment(assignment);
      onAssignmentChange?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning peserta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await deleteNodeAssignment(nodeId);
      setSelectedPesertaId(null);
      onAssignmentChange?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error clearing assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Peserta</DialogTitle>
          <DialogDescription>
            Pilih peserta untuk di-assign ke node <strong>{nodeName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="mb-3 block">Pilih Peserta</Label>
          
          {availablePeserta.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Tidak ada peserta tersedia
            </div>
          ) : (
            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
              {availablePeserta.map((peserta) => (
                <button
                  key={peserta.id}
                  type="button"
                  onClick={() => setSelectedPesertaId(peserta.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent',
                    selectedPesertaId === peserta.id
                      ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500'
                      : 'border-border'
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={peserta.photo} />
                    <AvatarFallback>{peserta.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{peserta.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Group {peserta.group} • {peserta.status}
                    </div>
                  </div>
                  {selectedPesertaId === peserta.id && (
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {currentPesertaId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isSubmitting}
              className="text-destructive hover:bg-destructive/10"
            >
              Hapus Assignment
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!selectedPesertaId || isSubmitting}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
          >
            {isSubmitting ? 'Menyimpan...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

