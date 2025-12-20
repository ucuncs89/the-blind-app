import { Position } from "reactflow";

// ============= Winner (1) =============
const winner = {
  id: "tournament_winner",
  type: "bracket",
  position: { x: 600, y: 0 },
  sourcePosition: Position.Left,
  targetPosition: Position.Right,
  data: {
    name: "Champion",
    role: "Winner 🏆",
    photo: "/avatar/ilham.jpg",
  },
};

// ============= Final (2) =============
const final1 = {
  id: "final_1",
  type: "bracket",
  position: { x: 400, y: -160 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Final 1",
    role: "Final",
    photo: "/avatar/ilham.jpg",
  },
};

const final2 = {
  id: "final_2",
  type: "bracket",
  position: { x: 400, y: 160 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Final 2",
    role: "Final",
    photo: "/avatar/diki.jpg",
  },
};

// ============= Semi Final (4) =============
const semiFinal1 = {
  id: "semi_final_1",
  type: "bracket",
  position: { x: 200, y: -240 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Semi Final 1",
    role: "SF",
    photo: "/avatar/ilham.jpg",
  },
};

const semiFinal2 = {
  id: "semi_final_2",
  type: "bracket",
  position: { x: 200, y: -80 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Semi Final 2",
    role: "SF",
    photo: "/avatar/diki.jpg",
  },
};

const semiFinal3 = {
  id: "semi_final_3",
  type: "bracket",
  position: { x: 200, y: 80 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Semi Final 3",
    role: "SF",
    photo: "/avatar/ilham.jpg",
  },
};

const semiFinal4 = {
  id: "semi_final_4",
  type: "bracket",
  position: { x: 200, y: 240 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Semi Final 4",
    role: "SF",
    photo: "/avatar/diki.jpg",
  },
};

// ============= Quarter Final (8) =============
const quarterFinal1 = {
  id: "quarter_final_1",
  type: "bracket",
  position: { x: 0, y: -280 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 1",
    role: "QF",
    photo: "/avatar/ilham.jpg",
  },
};

const quarterFinal2 = {
  id: "quarter_final_2",
  type: "bracket",
  position: { x: 0, y: -200 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 2",
    role: "QF",
    photo: "/avatar/diki.jpg",
  },
};

const quarterFinal3 = {
  id: "quarter_final_3",
  type: "bracket",
  position: { x: 0, y: -120 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 3",
    role: "QF",
    photo: "/avatar/ilham.jpg",
  },
};

const quarterFinal4 = {
  id: "quarter_final_4",
  type: "bracket",
  position: { x: 0, y: -40 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 4",
    role: "QF",
    photo: "/avatar/diki.jpg",
  },
};

const quarterFinal5 = {
  id: "quarter_final_5",
  type: "bracket",
  position: { x: 0, y: 40 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 5",
    role: "QF",
    photo: "/avatar/ilham.jpg",
  },
};

const quarterFinal6 = {
  id: "quarter_final_6",
  type: "bracket",
  position: { x: 0, y: 120 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 6",
    role: "QF",
    photo: "/avatar/diki.jpg",
  },
};

const quarterFinal7 = {
  id: "quarter_final_7",
  type: "bracket",
  position: { x: 0, y: 200 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 7",
    role: "QF",
    photo: "/avatar/ilham.jpg",
  },
};

const quarterFinal8 = {
  id: "quarter_final_8",
  type: "bracket",
  position: { x: 0, y: 280 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "QF 8",
    role: "QF",
    photo: "/avatar/diki.jpg",
  },
};

export const nodes = [
  // Quarter Final
  quarterFinal1,
  quarterFinal2,
  quarterFinal3,
  quarterFinal4,
  quarterFinal5,
  quarterFinal6,
  quarterFinal7,
  quarterFinal8,
  // Semi Final
  semiFinal1,
  semiFinal2,
  semiFinal3,
  semiFinal4,
  // Final
  final1,
  final2,
  // Winner
  winner,
];

export const edges = [
  // Quarter Final → Semi Final
  {
    id: "edge_quarter_final_1_to_semi_final_1",
    source: "quarter_final_1",
    target: "semi_final_1",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_2_to_semi_final_1",
    source: "quarter_final_2",
    target: "semi_final_1",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_3_to_semi_final_2",
    source: "quarter_final_3",
    target: "semi_final_2",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_4_to_semi_final_2",
    source: "quarter_final_4",
    target: "semi_final_2",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_5_to_semi_final_3",
    source: "quarter_final_5",
    target: "semi_final_3",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_6_to_semi_final_3",
    source: "quarter_final_6",
    target: "semi_final_3",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_7_to_semi_final_4",
    source: "quarter_final_7",
    target: "semi_final_4",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_8_to_semi_final_4",
    source: "quarter_final_8",
    target: "semi_final_4",
    type: "straight",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  // Semi Final → Final
  {
    id: "edge_semi_final_1_to_final_1",
    source: "semi_final_1",
    target: "final_1",
    type: "straight",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_2_to_final_1",
    source: "semi_final_2",
    target: "final_1",
    type: "straight",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_3_to_final_2",
    source: "semi_final_3",
    target: "final_2",
    type: "straight",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_4_to_final_2",
    source: "semi_final_4",
    target: "final_2",
    type: "straight",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  // Final → Winner
  {
    id: "edge_final_1_to_tournament_winner",
    source: "final_1",
    target: "tournament_winner",
    type: "straight",
    style: { stroke: "#1e293b", strokeWidth: 3 },
  },
  {
    id: "edge_final_2_to_tournament_winner",
    source: "final_2",
    target: "tournament_winner",
    type: "straight",
    style: { stroke: "#1e293b", strokeWidth: 3 },
  },
];
