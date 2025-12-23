"use client";

import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import { useBagan1Data } from "./useBagan1Data";

// Compact spacing configuration for view-only
const PERSON_GAP = 100;
const GROUP_GAP = 320;
const ROUND_1_X = 0;
const ROUND_2_X = 300;
const QUARTER_FINAL_X = 600;

const GROUP_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

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

const getGroupStartY = (groupIndex: number): number => groupIndex * GROUP_GAP;

const getPersonY = (groupIndex: number, personIndex: number): number => getGroupStartY(groupIndex) + personIndex * PERSON_GAP;

const getRound2Y = (groupIndex: number): number => getGroupStartY(groupIndex) + PERSON_GAP;

const getWildcardY = (groupIndex1: number, groupIndex2: number): number => (getRound2Y(groupIndex1) + getRound2Y(groupIndex2)) / 2;

const getWildcardYForQF = (wildcardId: number, groupIndices: number[]): number => {
    if (wildcardId === 8) {
        return getRound2Y(14) - PERSON_GAP;
    }
    if (wildcardId === 9) {
        return getRound2Y(14) + PERSON_GAP;
    }
    return getWildcardY(groupIndices[0], groupIndices.length > 1 ? groupIndices[1] : groupIndices[0] + 1);
};

const getQuarterFinalY = (battleIndex: number): number => {
    const battle = QUARTER_FINAL_BATTLES[battleIndex];
    const groupIndices = battle.groupWinners.map((gw) => gw - 1);
    const groupYPositions = groupIndices.map((gi) => getRound2Y(gi));
    const wildcardYPositions = battle.wildcards.map((wcId) => getWildcardYForQF(wcId, groupIndices));
    const allYPositions = [...groupYPositions, ...wildcardYPositions];
    return allYPositions.reduce((a, b) => a + b, 0) / allYPositions.length;
};

type UseBagan1Round1ToQFResult = {
    nodes: Node[];
    edges: Edge[];
    isLoading: boolean;
};

export const useBagan1Round1ToQF = (): UseBagan1Round1ToQFResult => {
    const { nodes: allNodes, edges: allEdges, isLoading } = useBagan1Data();

    const { nodes, edges } = useMemo(() => {
        // Filter nodes: Round 1, Round 2 (person + wildcard), Quarter Final
        const filteredNodes = allNodes.filter(
            (node) => node.id.startsWith("round_1_group_") || node.id.startsWith("round_2_person_") || node.id.startsWith("round_2_wildcard_") || node.id.startsWith("quarter_final_")
        );

        // Filter edges: Round 1 → Round 2, Round 2 → Quarter Final
        const filteredEdges = allEdges.filter(
            (edge) => (edge.source.startsWith("round_1_group_") && edge.target.startsWith("round_2_")) || (edge.source.startsWith("round_2_") && edge.target.startsWith("quarter_final_"))
        );

        // Reposition nodes with compact spacing
        const repositionedNodes = filteredNodes.map((node) => {
            const newNode = { ...node };

            // Round 1 nodes
            if (node.id.startsWith("round_1_group_")) {
                const match = node.id.match(/round_1_group_([a-o])_person_(\d+)/);
                if (match) {
                    const groupLetter = match[1];
                    const personIndex = parseInt(match[2]) - 1;
                    const groupIndex = GROUP_LABELS.indexOf(groupLetter.toUpperCase());
                    newNode.position = {
                        x: ROUND_1_X,
                        y: getPersonY(groupIndex, personIndex),
                    };
                }
            }
            // Round 2 person nodes
            else if (node.id.startsWith("round_2_person_")) {
                const personNumber = parseInt(node.id.replace("round_2_person_", ""));
                const groupIndex = personNumber - 1;
                newNode.position = {
                    x: ROUND_2_X,
                    y: getRound2Y(groupIndex),
                };
            }
            // Round 2 wildcard nodes
            else if (node.id.startsWith("round_2_wildcard_")) {
                const wildcardId = parseInt(node.id.replace("round_2_wildcard_", ""));
                const battle = QUARTER_FINAL_BATTLES.find((b) => b.wildcards.includes(wildcardId));
                if (battle) {
                    const groupIndices = battle.groupWinners.map((gw) => gw - 1);
                    newNode.position = {
                        x: ROUND_2_X,
                        y: getWildcardYForQF(wildcardId, groupIndices),
                    };
                }
            }
            // Quarter Final nodes
            else if (node.id.startsWith("quarter_final_")) {
                const qfNumber = parseInt(node.id.replace("quarter_final_", ""));
                const battleIndex = QUARTER_FINAL_BATTLES.findIndex((b) => b.id === qfNumber);
                if (battleIndex !== -1) {
                    newNode.position = {
                        x: QUARTER_FINAL_X,
                        y: getQuarterFinalY(battleIndex),
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
