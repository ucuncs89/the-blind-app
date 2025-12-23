"use client";

import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import { useBagan1Data } from "./useBagan1Data";

// Compact spacing configuration for view-only
const PERSON_GAP = 100;
const QUARTER_FINAL_X = 0;
const SEMI_FINAL_X = 300;
const FINAL_X = 600;
const CHAMPION_X = 900;
const THIRD_PLACE_MATCH_X = 900;

const QUARTER_FINAL_BATTLES = [
  { id: 1, groupWinners: [1, 2], wildcards: [1] },
  { id: 2, groupWinners: [3, 4], wildcards: [2] },
  { id: 3, groupWinners: [5, 6], wildcards: [3] },
  { id: 4, groupWinners: [7, 8], wildcards: [4] },
  { id: 5, groupWinners: [9, 10], wildcards: [5] },
  { id: 6, groupWinners: [11, 12], wildcards: [6] },
  { id: 7, groupWinners: [13, 14], wildcards: [7] },
  { id: 8, groupWinners: [15], wildcards: [8, 9] },
];

const SEMI_FINAL_BATTLES = [
  { id: 1, quarterFinals: [1, 2] },
  { id: 2, quarterFinals: [3, 4] },
  { id: 3, quarterFinals: [5, 6] },
  { id: 4, quarterFinals: [7, 8] },
];

const FINAL_BATTLES = [
  { id: 1, semiFinals: [1, 2] },
  { id: 2, semiFinals: [3, 4] },
];

// Calculate QF Y positions (more compact, centered around middle)
const getQuarterFinalY = (battleIndex: number): number => {
  // Distribute 8 QF nodes evenly with compact spacing
  const QF_GAP = 150;
  const startY = 200;
  return startY + battleIndex * QF_GAP;
};

// Calculate SF Y positions (center of 2 QF participants)
const getSemiFinalY = (battleIndex: number): number => {
  const battle = SEMI_FINAL_BATTLES[battleIndex];
  const qf1Y = getQuarterFinalY(battle.quarterFinals[0] - 1);
  const qf2Y = getQuarterFinalY(battle.quarterFinals[1] - 1);
  return (qf1Y + qf2Y) / 2;
};

// Calculate Final Y positions (center of 2 SF participants)
const getFinalY = (battleIndex: number): number => {
  const battle = FINAL_BATTLES[battleIndex];
  const sf1Y = getSemiFinalY(battle.semiFinals[0] - 1);
  const sf2Y = getSemiFinalY(battle.semiFinals[1] - 1);
  return (sf1Y + sf2Y) / 2;
};

// Calculate Champion Y position (center of 2 Finals)
const getChampionY = (): number => {
  return (getFinalY(0) + getFinalY(1)) / 2;
};

// Calculate 3rd Place Y position (below champion)
const getThirdPlaceY = (): number => {
  return getChampionY() + PERSON_GAP * 2;
};

type UseBagan1QFToFinalResult = {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
};

export const useBagan1QFToFinal = (): UseBagan1QFToFinalResult => {
  const { nodes: allNodes, edges: allEdges, isLoading } = useBagan1Data();

  const { nodes, edges } = useMemo(() => {
    // Filter nodes: Quarter Final, Semi Final, Final, Champion, 3rd Place
    const filteredNodes = allNodes.filter(
      (node) =>
        node.id.startsWith("quarter_final_") ||
        node.id.startsWith("semi_final_") ||
        node.id.startsWith("final_") ||
        node.id === "champion" ||
        node.id.startsWith("third_place"),
    );

    // Filter edges: QF → SF, SF → Final, Final → Champion, 3rd Place edges
    const filteredEdges = allEdges.filter(
      (edge) =>
        (edge.source.startsWith("quarter_final_") &&
          edge.target.startsWith("semi_final_")) ||
        (edge.source.startsWith("semi_final_") &&
          edge.target.startsWith("final_")) ||
        (edge.source.startsWith("final_") && edge.target === "champion") ||
        (edge.source.startsWith("third_place_contestant_") &&
          edge.target === "third_place"),
    );

    // Reposition nodes with compact spacing
    const repositionedNodes = filteredNodes.map((node) => {
      const newNode = { ...node };

      // Quarter Final nodes
      if (node.id.startsWith("quarter_final_")) {
        const qfNumber = parseInt(node.id.replace("quarter_final_", ""));
        const battleIndex = QUARTER_FINAL_BATTLES.findIndex(
          (b) => b.id === qfNumber,
        );
        if (battleIndex !== -1) {
          newNode.position = {
            x: QUARTER_FINAL_X,
            y: getQuarterFinalY(battleIndex),
          };
        }
      }
      // Semi Final nodes
      else if (node.id.startsWith("semi_final_")) {
        const sfNumber = parseInt(node.id.replace("semi_final_", ""));
        const battleIndex = SEMI_FINAL_BATTLES.findIndex(
          (b) => b.id === sfNumber,
        );
        if (battleIndex !== -1) {
          newNode.position = {
            x: SEMI_FINAL_X,
            y: getSemiFinalY(battleIndex),
          };
        }
      }
      // Final nodes
      else if (node.id.startsWith("final_")) {
        const finalNumber = parseInt(node.id.replace("final_", ""));
        const battleIndex = FINAL_BATTLES.findIndex(
          (b) => b.id === finalNumber,
        );
        if (battleIndex !== -1) {
          newNode.position = {
            x: FINAL_X,
            y: getFinalY(battleIndex),
          };
        }
      }
      // Champion node
      else if (node.id === "champion") {
        newNode.position = {
          x: CHAMPION_X,
          y: getChampionY(),
        };
      }
      // 3rd Place nodes
      else if (node.id.startsWith("third_place")) {
        if (node.id === "third_place") {
          newNode.position = {
            x: CHAMPION_X,
            y: getThirdPlaceY(),
          };
        } else if (node.id.startsWith("third_place_contestant_")) {
          const contestantNumber = parseInt(
            node.id.replace("third_place_contestant_", ""),
          );
          const yOffset =
            contestantNumber === 1 ? -PERSON_GAP / 2 : PERSON_GAP / 2;
          newNode.position = {
            x: THIRD_PLACE_MATCH_X,
            y: getThirdPlaceY() + yOffset,
          };
        }
      }

      return newNode;
    });

    return {
      nodes: repositionedNodes,
      edges: filteredEdges,
    };
  }, [allNodes, allEdges]);

  return {
    nodes,
    edges,
    isLoading,
  };
};
