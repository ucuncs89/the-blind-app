import { Position } from "reactflow";

// Spacing configuration
const PERSON_GAP = 120; // gap between persons in same group
const GROUP_GAP = 450; // gap between groups
const ROUND_2_X = 400; // x position for round 2

// Helper function to calculate Y position for Round 1
const getGroupStartY = (groupIndex: number) => {
  return groupIndex * GROUP_GAP;
};

const getPersonY = (groupIndex: number, personIndex: number) => {
  return getGroupStartY(groupIndex) + personIndex * PERSON_GAP;
};

// Round 2 Y position (center of each group)
const getRound2Y = (groupIndex: number) => {
  return getGroupStartY(groupIndex) + PERSON_GAP; // center (middle person position)
};

// Calculate wildcard Y position (between two groups)
const getWildcardY = (groupIndex1: number, groupIndex2: number) => {
  return (getRound2Y(groupIndex1) + getRound2Y(groupIndex2)) / 2;
};

// ============= Round 2 (15 Winners from each group) ==============

const round_2_nodes = Array.from({ length: 15 }, (_, i) => ({
  id: `round_2_person_${i + 1}`,
  type: "bracket",
  position: { x: ROUND_2_X, y: getRound2Y(i) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Winner Group ${String.fromCharCode(65 + i)}`,
    role: "Round 2",
    photo: i % 2 === 0 ? "/avatar/ilham.jpg" : "/avatar/diki.jpg",
  },
}));

// ============= Wildcard Nodes (9 wildcards distributed between groups) ==============
const wildcardConfigs = [
  { id: 1, between: [0, 1] },   // between A and B
  { id: 2, between: [1, 2] },   // between B and C
  { id: 3, between: [2, 3] },   // between C and D
  { id: 4, between: [3, 4] },   // between D and E
  { id: 5, between: [4, 5] },   // between E and F
  { id: 6, between: [5, 6] },   // between F and G
  { id: 7, between: [6, 7] },   // between G and H
  { id: 8, between: [7, 8] },   // between H and I
  { id: 9, between: [8, 9] },   // between I and J
];

const wildcard_nodes = wildcardConfigs.map((config) => ({
  id: `round_2_wildcard_${config.id}`,
  type: "bracket",
  position: { x: ROUND_2_X, y: getWildcardY(config.between[0], config.between[1]) },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: `Wildcard ${config.id}`,
    role: "Round 2 - Wildcard",
    photo: "",
  },
}));

// ============= Round 1 (45 persons - 15 groups x 3 persons each) =============

const groupLabels = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
];

const round_1_nodes = groupLabels.flatMap((group, groupIndex) =>
  Array.from({ length: 3 }, (_, personIndex) => ({
    id: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}`,
    type: "bracket",
    position: { x: 0, y: getPersonY(groupIndex, personIndex) },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      name: `Person ${group}${personIndex + 1}`,
      role: `Round 1 - Group ${group}`,
      photo: personIndex % 2 === 0 ? "/avatar/ilham.jpg" : "/avatar/diki.jpg",
    },
  })),
);

// ============= Export Nodes ==============

export const nodes = [...round_1_nodes, ...round_2_nodes, ...wildcard_nodes];

// ============= Edges (Round 1 → Round 2) ==============

const round_1_to_round_2_edges = groupLabels.flatMap((group, groupIndex) =>
  Array.from({ length: 3 }, (_, personIndex) => ({
    id: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}_to_round_2_person_${groupIndex + 1}`,
    source: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}`,
    target: `round_2_person_${groupIndex + 1}`,
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  })),
);

export const edges = [...round_1_to_round_2_edges];
