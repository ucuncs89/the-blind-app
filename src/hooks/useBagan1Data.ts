'use client';

import { useMemo } from 'react';
import { Position, type Node, type Edge } from 'reactflow';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type NodeAssignmentRecord } from '@/lib/db';
import type { Peserta } from '@/types/peserta';

// Spacing configuration
const PERSON_GAP = 120;
const GROUP_GAP = 450;
const ROUND_2_X = 400;
const BAGAN_ID = 'bagan-1';

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

const getGroupStartY = (groupIndex: number): number => groupIndex * GROUP_GAP;

const getPersonY = (groupIndex: number, personIndex: number): number => 
  getGroupStartY(groupIndex) + personIndex * PERSON_GAP;

const getRound2Y = (groupIndex: number): number => 
  getGroupStartY(groupIndex) + PERSON_GAP;

// Calculate wildcard Y position (between two groups)
const getWildcardY = (groupIndex1: number, groupIndex2: number): number => 
  (getRound2Y(groupIndex1) + getRound2Y(groupIndex2)) / 2;

type UseBagan1DataResult = {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  assignments: Map<string, NodeAssignmentRecord>;
};

export const useBagan1Data = (): UseBagan1DataResult => {
  const peserta = useLiveQuery(() => db.peserta.toArray(), [], []);
  
  // Fetch node assignments for bagan-1
  const nodeAssignments = useLiveQuery(
    () => db.nodeAssignments.where('baganId').equals(BAGAN_ID).toArray(),
    [],
    []
  );

  // Create a map of nodeId -> assignment for quick lookup
  const assignmentsMap = useMemo(() => {
    const map = new Map<string, NodeAssignmentRecord>();
    nodeAssignments?.forEach((assignment) => {
      map.set(assignment.id, assignment);
    });
    return map;
  }, [nodeAssignments]);

  // Create a map of pesertaId -> peserta for quick lookup
  const pesertaMap = useMemo(() => {
    const map = new Map<string, Peserta>();
    peserta?.forEach((p) => {
      map.set(p.id, p);
    });
    return map;
  }, [peserta]);

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
      const nodeId = `round_2_person_${groupIndex + 1}`;
      
      // Check if there's an assignment for this node
      const assignment = assignmentsMap.get(nodeId);
      const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;
      
      // Fallback to winner from group if no assignment
      const groupPeserta = pesertaByGroup[group] || [];
      const winner = groupPeserta.find((p) => p.status === 'winner');
      
      // Priority: assigned peserta > winner from group > placeholder
      const displayPeserta = assignedPeserta || winner;
      
      return {
        id: nodeId,
        type: 'bracket',
        position: { x: ROUND_2_X, y: getRound2Y(groupIndex) },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: displayPeserta ? displayPeserta.name : `Winner Group ${group}`,
          role: 'Round 2',
          photo: displayPeserta?.photo || '',
          pesertaId: displayPeserta?.id || '',
          isPlaceholder: !displayPeserta,
        },
      };
    });

    // Generate 9 Wildcard nodes (distributed between groups)
    // Wildcard placement: between consecutive group pairs
    const wildcardConfigs = [
      { id: 1, between: [0, 1] },   // between A and B
      { id: 2, between: [2, 3] },   // between C and D
      { id: 3, between: [4, 5] },   // between E and F
      { id: 4, between: [6, 7] },   // between G and H
      { id: 5, between: [8, 9] },   // between I and J
      { id: 6, between: [10, 11] },   // between K and L
      { id: 7, between: [12, 13] },   // between M and N
      { id: 8, between: [14, 15] },   // between O and P
    ];

    const wildcardNodes: Node[] = wildcardConfigs.map((config) => {
      const nodeId = `round_2_wildcard_${config.id}`;
      const assignment = assignmentsMap.get(nodeId);
      const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

      return {
        id: nodeId,
        type: 'bracket',
        position: { x: ROUND_2_X, y: getWildcardY(config.between[0], config.between[1]) },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: assignedPeserta ? assignedPeserta.name : `Wildcard ${config.id}`,
          role: 'Round 2 - Wildcard',
          photo: assignedPeserta?.photo || '',
          pesertaId: assignedPeserta?.id || '',
          isPlaceholder: !assignedPeserta,
          isWildcard: true,
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
      nodes: [...round1Nodes, ...round2Nodes, ...wildcardNodes],
      edges: round1ToRound2Edges,
    };
  }, [peserta, assignmentsMap, pesertaMap]);

  return {
    nodes,
    edges,
    isLoading: peserta === undefined,
    assignments: assignmentsMap,
  };
};

