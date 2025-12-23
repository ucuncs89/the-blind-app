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
const QUARTER_FINAL_X = 800;
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

// Quarter Final battle configuration
// Each QF slot has participants from Round 2 (2 group winners + wildcards) - Battle of 3
const QUARTER_FINAL_BATTLES = [
  { id: 1, groupWinners: [1, 2], wildcards: [1] },   // A, B, W1 → QF1
  { id: 2, groupWinners: [3, 4], wildcards: [2] },   // C, D, W2 → QF2
  { id: 3, groupWinners: [5, 6], wildcards: [3] },   // E, F, W3 → QF3
  { id: 4, groupWinners: [7, 8], wildcards: [4] },   // G, H, W4 → QF4
  { id: 5, groupWinners: [9, 10], wildcards: [5] },  // I, J, W5 → QF5
  { id: 6, groupWinners: [11, 12], wildcards: [6] }, // K, L, W6 → QF6
  { id: 7, groupWinners: [13, 14], wildcards: [7] }, // M, N, W7 → QF7
  { id: 8, groupWinners: [15], wildcards: [8, 9] },  // O, W8, W9 → QF8
];

// Wildcard position configs for QF Y calculation
const getWildcardYForQF = (wildcardId: number, groupIndices: number[]): number => {
  // For wildcards 8 and 9 (QF8), use positions relative to group O
  if (wildcardId === 8) {
    return getRound2Y(14) - PERSON_GAP; // above O
  }
  if (wildcardId === 9) {
    return getRound2Y(14) + PERSON_GAP; // below O
  }
  // For other wildcards, calculate between two groups
  return getWildcardY(
    groupIndices[0],
    groupIndices.length > 1 ? groupIndices[1] : groupIndices[0] + 1
  );
};

// Calculate QF Y position (center of the battle participants)
const getQuarterFinalY = (battleIndex: number): number => {
  const battle = QUARTER_FINAL_BATTLES[battleIndex];
  const groupIndices = battle.groupWinners.map((gw) => gw - 1);
  const groupYPositions = groupIndices.map((gi) => getRound2Y(gi));
  
  // Calculate wildcard positions
  const wildcardYPositions = battle.wildcards.map((wcId) => 
    getWildcardYForQF(wcId, groupIndices)
  );
  
  const allYPositions = [...groupYPositions, ...wildcardYPositions];
  const avgY = allYPositions.reduce((a, b) => a + b, 0) / allYPositions.length;
  return avgY;
};

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
    // Wildcard placement: between consecutive group pairs, or relative to group O for QF8
    const wildcardConfigs: Array<{ id: number; yPosition: number }> = [
      { id: 1, yPosition: getWildcardY(0, 1) },   // between A and B
      { id: 2, yPosition: getWildcardY(2, 3) },   // between C and D
      { id: 3, yPosition: getWildcardY(4, 5) },   // between E and F
      { id: 4, yPosition: getWildcardY(6, 7) },   // between G and H
      { id: 5, yPosition: getWildcardY(8, 9) },   // between I and J
      { id: 6, yPosition: getWildcardY(10, 11) }, // between K and L
      { id: 7, yPosition: getWildcardY(12, 13) }, // between M and N
      // W8 dan W9 diposisikan di atas dan bawah grup O untuk QF8
      { id: 8, yPosition: getRound2Y(14) - PERSON_GAP }, // di atas O
      { id: 9, yPosition: getRound2Y(14) + PERSON_GAP }, // di bawah O
    ];

    const wildcardNodes: Node[] = wildcardConfigs.map((config) => {
      const nodeId = `round_2_wildcard_${config.id}`;
      const assignment = assignmentsMap.get(nodeId);
      const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

      return {
        id: nodeId,
        type: 'bracket',
        position: { 
          x: ROUND_2_X, 
          y: config.yPosition,
        },
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

    // Generate Quarter Final nodes (8 besar)
    const quarterFinalNodes: Node[] = QUARTER_FINAL_BATTLES.map((battle, index) => {
      const nodeId = `quarter_final_${battle.id}`;
      const assignment = assignmentsMap.get(nodeId);
      const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

      // Get group labels for display
      const groupLabels = battle.groupWinners.map((gw) => GROUP_LABELS[gw - 1]).join(', ');
      const wildcardLabels = battle.wildcards.map((w) => `W${w}`).join(', ');
      const battleLabel = `Battle: ${groupLabels}, ${wildcardLabels}`;

      return {
        id: nodeId,
        type: 'bracket',
        position: { x: QUARTER_FINAL_X, y: getQuarterFinalY(index) },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          name: assignedPeserta ? assignedPeserta.name : `QF ${battle.id}`,
          role: `Quarter Final - ${battleLabel}`,
          photo: assignedPeserta?.photo || '',
          pesertaId: assignedPeserta?.id || '',
          isPlaceholder: !assignedPeserta,
          isQuarterFinal: true,
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

    // Generate edges from Round 2 to Quarter Final (Battle of 3)
    const round2ToQuarterFinalEdges: Edge[] = QUARTER_FINAL_BATTLES.flatMap((battle) => {
      const battleEdges: Edge[] = [];
      const targetId = `quarter_final_${battle.id}`;

      // Add edges from group winners
      battle.groupWinners.forEach((gw) => {
        battleEdges.push({
          id: `round_2_person_${gw}_to_qf_${battle.id}`,
          source: `round_2_person_${gw}`,
          target: targetId,
          type: 'step',
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
        });
      });

      // Add edges from wildcards
      battle.wildcards.forEach((wc) => {
        battleEdges.push({
          id: `round_2_wildcard_${wc}_to_qf_${battle.id}`,
          source: `round_2_wildcard_${wc}`,
          target: targetId,
          type: 'step',
          style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5,5' },
        });
      });

      return battleEdges;
    });

    return {
      nodes: [...round1Nodes, ...round2Nodes, ...wildcardNodes, ...quarterFinalNodes],
      edges: [...round1ToRound2Edges, ...round2ToQuarterFinalEdges],
    };
  }, [peserta, assignmentsMap, pesertaMap]);

  return {
    nodes,
    edges,
    isLoading: peserta === undefined,
    assignments: assignmentsMap,
  };
};

