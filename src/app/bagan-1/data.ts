import { Position } from "reactflow";

// ============= Round 2 (24) ==============

const round_2_person_1 = {
  id: "round_2_person_1",
  type: "bracket",
  position: { x: 300, y: -200 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Winner Group A",
    role: "Round 2",
    photo: "/avatar/ilham.jpg",
  },
};

const round_2_person_2 = {
  id: "round_2_person_2",
  type: "bracket",
  position: { x: 300, y: 0 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "Winner Group B",
    role: "Round 2",
    photo: "/avatar/diki.jpg",
  },
};

const round_2_person_3 = {
  id: "round_2_person_3",
  type: "bracket",
  position: { x: 300, y: 200 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "WildCard 1",
    role: "Round 2",
    photo: "/avatar/ilham.jpg",
  },
};

// ============= Round 1 (45) =============
const round_1_group_a_person_1 = {
  id: "round_1_group_a_person_1",
  type: "bracket",
  position: { x: 0, y: -280 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_a_person_1",
    role: "Round 1",
    photo: "/avatar/ilham.jpg",
  },
};

const round_1_group_a_person_2 = {
  id: "round_1_group_a_person_2",
  type: "bracket",
  position: { x: 0, y: -200 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_a_person_2",
    role: "Round 1",
    photo: "/avatar/diki.jpg",
  },
};

const round_1_group_a_person_3 = {
  id: "round_1_group_a_person_3",
  type: "bracket",
  position: { x: 0, y: -120 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_a_person_3",
    role: "Round 1",
    photo: "/avatar/ilham.jpg",
  },
};

const round_1_group_b_person_4 = {
  id: "round_1_group_b_person_4",
  type: "bracket",
  position: { x: 0, y: -40 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_b_person_4",
    role: "Round 1",
    photo: "/avatar/diki.jpg",
  },
};

const round_1_group_b_person_5 = {
  id: "round_1_group_b_person_5",
  type: "bracket",
  position: { x: 0, y: 40 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_b_person_5",
    role: "Round 1",
    photo: "/avatar/ilham.jpg",
  },
};

const round_1_group_b_person_6 = {
  id: "round_1_group_b_person_6",
  type: "bracket",
  position: { x: 0, y: 120 },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  data: {
    name: "round_1_group_b_person_6",
    role: "Round 1",
    photo: "/avatar/diki.jpg",
  },
};

export const nodes = [
  // Round 1 Group A
  round_1_group_a_person_1,
  round_1_group_a_person_2,
  round_1_group_a_person_3,
  // Round 1 Group B
  round_1_group_b_person_4,
  round_1_group_b_person_5,
  round_1_group_b_person_6,

  // Round 2
  round_2_person_1,
  round_2_person_2,
  round_2_person_3,
];

export const edges = [
  // Round 1 Group A → Round 2 Person 1
  {
    id: "round_1_group_a_person_1_to_round_2_person_1",
    source: "round_1_group_a_person_1",
    target: "round_2_person_1",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "round_1_group_a_person_2_to_round_2_person_1",
    source: "round_1_group_a_person_2",
    target: "round_2_person_1",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "round_1_group_a_person_3_to_round_2_person_1",
    source: "round_1_group_a_person_3",
    target: "round_2_person_1",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  // Round 1 Group B → Round 2 Person 2
  {
    id: "round_1_group_b_person_4_to_round_2_person_2",
    source: "round_1_group_b_person_4",
    target: "round_2_person_2",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "round_1_group_b_person_5_to_round_2_person_2",
    source: "round_1_group_b_person_5",
    target: "round_2_person_2",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "round_1_group_b_person_6_to_round_2_person_2",
    source: "round_1_group_b_person_6",
    target: "round_2_person_2",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
];
