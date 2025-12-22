import { Position } from "reactflow";

// ============= Round 2 (24) ==============

const round_2_person_1 = {
  id: "round_2_person_1",
  type: "bracket",
  position: { x: 0, y: -280 },
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
  position: { x: 0, y: -280 },
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
  position: { x: 0, y: -280 },
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
  // Round 1 → Round 2
  {
    id: "round_2_person_1_to_round_2_person_2",
    source: "round_1_group_a_person_1",
    target: "round_2_person_1",
    type: "step",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_2_to_semi_final_1",
    source: "quarter_final_2",
    target: "semi_final_1",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_3_to_semi_final_2",
    source: "quarter_final_3",
    target: "semi_final_2",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_4_to_semi_final_2",
    source: "quarter_final_4",
    target: "semi_final_2",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_5_to_semi_final_3",
    source: "quarter_final_5",
    target: "semi_final_3",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_6_to_semi_final_3",
    source: "quarter_final_6",
    target: "semi_final_3",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_7_to_semi_final_4",
    source: "quarter_final_7",
    target: "semi_final_4",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  {
    id: "edge_quarter_final_8_to_semi_final_4",
    source: "quarter_final_8",
    target: "semi_final_4",
    type: "animated",
    style: { stroke: "#64748b", strokeWidth: 2 },
  },
  // Semi Final → Final
  {
    id: "edge_semi_final_1_to_final_1",
    source: "semi_final_1",
    target: "final_1",
    type: "animatedDark",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_2_to_final_1",
    source: "semi_final_2",
    target: "final_1",
    type: "animatedDark",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_3_to_final_2",
    source: "semi_final_3",
    target: "final_2",
    type: "animatedDark",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  {
    id: "edge_semi_final_4_to_final_2",
    source: "semi_final_4",
    target: "final_2",
    type: "animatedDark",
    style: { stroke: "#475569", strokeWidth: 2.5 },
  },
  // Final → Winner
  {
    id: "edge_final_1_to_tournament_winner",
    source: "final_1",
    target: "tournament_winner",
    type: "animatedDark",
    style: { stroke: "#1e293b", strokeWidth: 3 },
  },
  {
    id: "edge_final_2_to_tournament_winner",
    source: "final_2",
    target: "tournament_winner",
    type: "animatedDark",
    style: { stroke: "#1e293b", strokeWidth: 3 },
  },
];
