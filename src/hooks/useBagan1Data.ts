'use client';

import { useMemo } from 'react';
import { Position, type Node, type Edge } from 'reactflow';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Peserta } from '@/types/peserta';

// Spacing configuration
const PERSON_GAP = 120;
const GROUP_GAP = 450;
const ROUND_2_X = 400;

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

const getGroupStartY = (groupIndex: number): number => groupIndex * GROUP_GAP;

const getPersonY = (groupIndex: number, personIndex: number): number => 
  getGroupStartY(groupIndex) + personIndex * PERSON_GAP;

const getRound2Y = (groupIndex: number): number => 
  getGroupStartY(groupIndex) + PERSON_GAP;

type UseBagan1DataResult = {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
};

export const useBagan1Data = (): UseBagan1DataResult => {
  const peserta = useLiveQuery(() => db.peserta.toArray(), [], []);

  const { nodes, edges } = useMemo(() => {
    if (!peserta || peserta.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Group peserta by their group
    const pesertaByGroup = GROUP_LABELS.reduce<Record<string, Peserta[]>>((acc, group) => {
      acc[group] = peserta.filter((p) => p.group === group);
      return acc;
    }, {});

    // Generate Round 1 nodes (peserta in each group)
    const round1Nodes: Node[] = GROUP_LABELS.flatMap((group, groupIndex) => {
      const groupPeserta = pesertaByGroup[group] || [];
      
      return groupPeserta.map((p, personIndex) => ({
        id: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}`,
        type: 'bracket',
        position: { x: 0, y: getPersonY(groupIndex, personIndex) },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: p.name,
          role: `Round 1 - Group ${group}`,
          photo: p.photo || '',
          pesertaId: p.id,
        },
      }));
    });

    // Generate Round 2 nodes (winner placeholder for each group)
    const round2Nodes: Node[] = GROUP_LABELS.map((group, groupIndex) => {
      const groupPeserta = pesertaByGroup[group] || [];
      const winner = groupPeserta.find((p) => p.status === 'winner');
      
      return {
        id: `round_2_person_${groupIndex + 1}`,
        type: 'bracket',
        position: { x: ROUND_2_X, y: getRound2Y(groupIndex) },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: winner ? winner.name : `Winner Group ${group}`,
          role: 'Round 2',
          photo: winner?.photo || '',
          pesertaId: winner?.id || '',
          isPlaceholder: !winner,
        },
      };
    });

    // Generate edges from Round 1 to Round 2
    const round1ToRound2Edges: Edge[] = GROUP_LABELS.flatMap((group, groupIndex) => {
      const groupPeserta = pesertaByGroup[group] || [];
      
      return groupPeserta.map((_, personIndex) => ({
        id: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}_to_round_2_person_${groupIndex + 1}`,
        source: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}`,
        target: `round_2_person_${groupIndex + 1}`,
        type: 'step',
        style: { stroke: '#64748b', strokeWidth: 2 },
      }));
    });

    return {
      nodes: [...round1Nodes, ...round2Nodes],
      edges: round1ToRound2Edges,
    };
  }, [peserta]);

  return {
    nodes,
    edges,
    isLoading: peserta === undefined,
  };
};

