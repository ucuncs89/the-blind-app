import { Position } from 'reactflow';

// Spacing configuration for Bagan 2
const PERSON_GAP = 150;
const ROUND_GAP = 400;

// Round 2 has 15 winners, Round 3 has 8, Round 4 has 4, Semi-final has 2, Final has 1
const ROUND_2_START_Y = 0;
const ROUND_3_START_Y = 200;
const ROUND_4_START_Y = 400;
const SEMI_FINAL_START_Y = 600;
const FINAL_START_Y = 800;

// Helper to center nodes vertically based on their count
const getYPosition = (index: number, total: number, baseY: number): number => {
  const totalHeight = (total - 1) * PERSON_GAP;
  const startY = baseY - totalHeight / 2;
  return startY + index * PERSON_GAP;
};

// ============= Round 2 Winners (15 persons) ==============
const round_2_nodes = Array.from({ length: 15 }, (_, i) => ({
  id: `bagan2_round_2_person_${i + 1}`,
  type: 'bracket',
  position: { x: 0, y: getYPosition(i, 15, ROUND_2_START_Y + 7 * PERSON_GAP) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Winner Group ${String.fromCharCode(65 + i)}`,
    role: 'Round 2',
    photo: i % 2 === 0 ? '/avatar/ilham.jpg' : '/avatar/diki.jpg',
  },
}));

// ============= Round 3 (8 persons - from 15 → 8) ==============
const round_3_nodes = Array.from({ length: 8 }, (_, i) => ({
  id: `bagan2_round_3_person_${i + 1}`,
  type: 'bracket',
  position: { x: ROUND_GAP, y: getYPosition(i, 8, ROUND_3_START_Y + 4 * PERSON_GAP) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Peserta ${i + 1}`,
    role: 'Round 3',
    photo: i % 2 === 0 ? '/avatar/ilham.jpg' : '/avatar/diki.jpg',
  },
}));

// ============= Round 4 (4 persons - from 8 → 4) ==============
const round_4_nodes = Array.from({ length: 4 }, (_, i) => ({
  id: `bagan2_round_4_person_${i + 1}`,
  type: 'bracket',
  position: { x: ROUND_GAP * 2, y: getYPosition(i, 4, ROUND_4_START_Y + 2 * PERSON_GAP) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Quarter Final ${i + 1}`,
    role: 'Round 4',
    photo: i % 2 === 0 ? '/avatar/ilham.jpg' : '/avatar/diki.jpg',
  },
}));

// ============= Semi Final (2 persons) ==============
const semi_final_nodes = Array.from({ length: 2 }, (_, i) => ({
  id: `bagan2_semi_final_person_${i + 1}`,
  type: 'bracket',
  position: { x: ROUND_GAP * 3, y: getYPosition(i, 2, SEMI_FINAL_START_Y + PERSON_GAP) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Semi Final ${i + 1}`,
    role: 'Semi Final',
    photo: i % 2 === 0 ? '/avatar/ilham.jpg' : '/avatar/diki.jpg',
  },
}));

// ============= Final (1 person - Winner) ==============
const final_node = {
  id: 'bagan2_final_winner',
  type: 'bracket',
  position: { x: ROUND_GAP * 4, y: FINAL_START_Y + PERSON_GAP / 2 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: 'Champion',
    role: 'Final Winner',
    photo: '/avatar/ilham.jpg',
  },
};

// ============= Export Nodes ==============
export const nodes = [
  ...round_2_nodes,
  ...round_3_nodes,
  ...round_4_nodes,
  ...semi_final_nodes,
  final_node,
];

// ============= Edges ==============

// Round 2 → Round 3 (15 → 8)
// Pair mapping: 1+2→1, 3+4→2, 5+6→3, 7+8→4, 9+10→5, 11+12→6, 13+14→7, 15→8
const round_2_to_round_3_edges = [
  // Pairs
  { id: 'r2_1_to_r3_1', source: 'bagan2_round_2_person_1', target: 'bagan2_round_3_person_1', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_2_to_r3_1', source: 'bagan2_round_2_person_2', target: 'bagan2_round_3_person_1', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_3_to_r3_2', source: 'bagan2_round_2_person_3', target: 'bagan2_round_3_person_2', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_4_to_r3_2', source: 'bagan2_round_2_person_4', target: 'bagan2_round_3_person_2', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_5_to_r3_3', source: 'bagan2_round_2_person_5', target: 'bagan2_round_3_person_3', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_6_to_r3_3', source: 'bagan2_round_2_person_6', target: 'bagan2_round_3_person_3', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_7_to_r3_4', source: 'bagan2_round_2_person_7', target: 'bagan2_round_3_person_4', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_8_to_r3_4', source: 'bagan2_round_2_person_8', target: 'bagan2_round_3_person_4', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_9_to_r3_5', source: 'bagan2_round_2_person_9', target: 'bagan2_round_3_person_5', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_10_to_r3_5', source: 'bagan2_round_2_person_10', target: 'bagan2_round_3_person_5', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_11_to_r3_6', source: 'bagan2_round_2_person_11', target: 'bagan2_round_3_person_6', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_12_to_r3_6', source: 'bagan2_round_2_person_12', target: 'bagan2_round_3_person_6', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_13_to_r3_7', source: 'bagan2_round_2_person_13', target: 'bagan2_round_3_person_7', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_14_to_r3_7', source: 'bagan2_round_2_person_14', target: 'bagan2_round_3_person_7', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'r2_15_to_r3_8', source: 'bagan2_round_2_person_15', target: 'bagan2_round_3_person_8', type: 'step', style: { stroke: '#8b5cf6', strokeWidth: 2 } },
];

// Round 3 → Round 4 (8 → 4)
const round_3_to_round_4_edges = [
  { id: 'r3_1_to_r4_1', source: 'bagan2_round_3_person_1', target: 'bagan2_round_4_person_1', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_2_to_r4_1', source: 'bagan2_round_3_person_2', target: 'bagan2_round_4_person_1', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_3_to_r4_2', source: 'bagan2_round_3_person_3', target: 'bagan2_round_4_person_2', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_4_to_r4_2', source: 'bagan2_round_3_person_4', target: 'bagan2_round_4_person_2', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_5_to_r4_3', source: 'bagan2_round_3_person_5', target: 'bagan2_round_4_person_3', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_6_to_r4_3', source: 'bagan2_round_3_person_6', target: 'bagan2_round_4_person_3', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_7_to_r4_4', source: 'bagan2_round_3_person_7', target: 'bagan2_round_4_person_4', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'r3_8_to_r4_4', source: 'bagan2_round_3_person_8', target: 'bagan2_round_4_person_4', type: 'step', style: { stroke: '#06b6d4', strokeWidth: 2 } },
];

// Round 4 → Semi Final (4 → 2)
const round_4_to_semi_edges = [
  { id: 'r4_1_to_sf_1', source: 'bagan2_round_4_person_1', target: 'bagan2_semi_final_person_1', type: 'step', style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'r4_2_to_sf_1', source: 'bagan2_round_4_person_2', target: 'bagan2_semi_final_person_1', type: 'step', style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'r4_3_to_sf_2', source: 'bagan2_round_4_person_3', target: 'bagan2_semi_final_person_2', type: 'step', style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'r4_4_to_sf_2', source: 'bagan2_round_4_person_4', target: 'bagan2_semi_final_person_2', type: 'step', style: { stroke: '#10b981', strokeWidth: 2 } },
];

// Semi Final → Final (2 → 1)
const semi_to_final_edges = [
  { id: 'sf_1_to_final', source: 'bagan2_semi_final_person_1', target: 'bagan2_final_winner', type: 'step', style: { stroke: '#f59e0b', strokeWidth: 3 } },
  { id: 'sf_2_to_final', source: 'bagan2_semi_final_person_2', target: 'bagan2_final_winner', type: 'step', style: { stroke: '#f59e0b', strokeWidth: 3 } },
];

export const edges = [
  ...round_2_to_round_3_edges,
  ...round_3_to_round_4_edges,
  ...round_4_to_semi_edges,
  ...semi_to_final_edges,
];

