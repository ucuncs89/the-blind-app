"use client";

import { useMemo } from "react";
import { Position, type Node, type Edge } from "reactflow";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type NodeAssignmentRecord } from "@/lib/db";
import type { Peserta } from "@/types/peserta";

// Spacing configuration
const PERSON_GAP = 120;
const GROUP_GAP = 450;
const ROUND_2_X = 400;
const QUARTER_FINAL_X = 800;
const SEMI_FINAL_X = 1200;
const FINAL_X = 1600;
const THIRD_PLACE_MATCH_X = 1800; // X position for 3rd place contestants
const CHAMPION_X = 2000;
const BAGAN_ID = "bagan-1";

// Semi Final battle configuration (QF → SF, Battle of 2 / Duel)
const SEMI_FINAL_BATTLES = [
    { id: 1, quarterFinals: [1, 2] }, // QF1 vs QF2 → SF1
    { id: 2, quarterFinals: [3, 4] }, // QF3 vs QF4 → SF2
    { id: 3, quarterFinals: [5, 6] }, // QF5 vs QF6 → SF3
    { id: 4, quarterFinals: [7, 8] }, // QF7 vs QF8 → SF4
];

// Final battle configuration (SF → Final, Battle of 2 / Duel)
const FINAL_BATTLES = [
    { id: 1, semiFinals: [1, 2] }, // SF1 vs SF2 → Final 1
    { id: 2, semiFinals: [3, 4] }, // SF3 vs SF4 → Final 2
];

const GROUP_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

const getGroupStartY = (groupIndex: number): number => groupIndex * GROUP_GAP;

const getPersonY = (groupIndex: number, personIndex: number): number => getGroupStartY(groupIndex) + personIndex * PERSON_GAP;

const getRound2Y = (groupIndex: number): number => getGroupStartY(groupIndex) + PERSON_GAP;

// Calculate wildcard Y position (between two groups)
const getWildcardY = (groupIndex1: number, groupIndex2: number): number => (getRound2Y(groupIndex1) + getRound2Y(groupIndex2)) / 2;

// Quarter Final battle configuration
// Each QF slot has participants from Round 2 (2 group winners + wildcards) - Battle of 3
const QUARTER_FINAL_BATTLES = [
    { id: 1, groupWinners: [1, 2], wildcards: [1] }, // A, B, W1 → QF1
    { id: 2, groupWinners: [3, 4], wildcards: [2] }, // C, D, W2 → QF2
    { id: 3, groupWinners: [5, 6], wildcards: [3] }, // E, F, W3 → QF3
    { id: 4, groupWinners: [7, 8], wildcards: [4] }, // G, H, W4 → QF4
    { id: 5, groupWinners: [9, 10], wildcards: [5] }, // I, J, W5 → QF5
    { id: 6, groupWinners: [11, 12], wildcards: [6] }, // K, L, W6 → QF6
    { id: 7, groupWinners: [13, 14], wildcards: [7] }, // M, N, W7 → QF7
    { id: 8, groupWinners: [15], wildcards: [8, 9] }, // O, W8, W9 → QF8
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
    return getWildcardY(groupIndices[0], groupIndices.length > 1 ? groupIndices[1] : groupIndices[0] + 1);
};

// Calculate QF Y position (center of the battle participants)
const getQuarterFinalY = (battleIndex: number): number => {
    const battle = QUARTER_FINAL_BATTLES[battleIndex];
    const groupIndices = battle.groupWinners.map((gw) => gw - 1);
    const groupYPositions = groupIndices.map((gi) => getRound2Y(gi));

    // Calculate wildcard positions
    const wildcardYPositions = battle.wildcards.map((wcId) => getWildcardYForQF(wcId, groupIndices));

    const allYPositions = [...groupYPositions, ...wildcardYPositions];
    const avgY = allYPositions.reduce((a, b) => a + b, 0) / allYPositions.length;
    return avgY;
};

// Calculate Semi Final Y position (center of 2 QF participants)
const getSemiFinalY = (battleIndex: number): number => {
    const battle = SEMI_FINAL_BATTLES[battleIndex];
    const qfYPositions = battle.quarterFinals.map((qf) => getQuarterFinalY(qf - 1));
    return (qfYPositions[0] + qfYPositions[1]) / 2;
};

// Calculate Final Y position (center of 2 SF participants)
const getFinalY = (battleIndex: number): number => {
    const battle = FINAL_BATTLES[battleIndex];
    const sfYPositions = battle.semiFinals.map((sf) => getSemiFinalY(sf - 1));
    return (sfYPositions[0] + sfYPositions[1]) / 2;
};

// Calculate Champion Y position (center of 2 Finals)
const getChampionY = (): number => {
    return (getFinalY(0) + getFinalY(1)) / 2;
};

// Calculate 3rd Place Y position (below champion)
const getThirdPlaceY = (): number => {
    return getChampionY() + PERSON_GAP * 2;
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
    const nodeAssignments = useLiveQuery(() => db.nodeAssignments.where("baganId").equals(BAGAN_ID).toArray(), [], []);

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
                type: "bracket",
                position: { x: 0, y: getPersonY(groupIndex, personIndex) },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: p.name,
                    role: `Round 1 - Group ${group}`,
                    photo: p.photo || "",
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
            const winner = groupPeserta.find((p) => p.status === "winner");

            // Priority: assigned peserta > winner from group > placeholder
            const displayPeserta = assignedPeserta || winner;

            return {
                id: nodeId,
                type: "bracket",
                position: { x: ROUND_2_X, y: getRound2Y(groupIndex) },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: displayPeserta ? displayPeserta.name : `Winner Group ${group}`,
                    role: "Round 2",
                    photo: displayPeserta?.photo || "",
                    pesertaId: displayPeserta?.id || "",
                    isPlaceholder: !displayPeserta,
                },
            };
        });

        // Generate 9 Wildcard nodes (distributed between groups)
        // Wildcard placement: between consecutive group pairs, or relative to group O for QF8
        const wildcardConfigs: Array<{ id: number; yPosition: number }> = [
            { id: 1, yPosition: getWildcardY(0, 1) }, // between A and B
            { id: 2, yPosition: getWildcardY(2, 3) }, // between C and D
            { id: 3, yPosition: getWildcardY(4, 5) }, // between E and F
            { id: 4, yPosition: getWildcardY(6, 7) }, // between G and H
            { id: 5, yPosition: getWildcardY(8, 9) }, // between I and J
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
                type: "bracket",
                position: {
                    x: ROUND_2_X,
                    y: config.yPosition,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: assignedPeserta ? assignedPeserta.name : `Wildcard ${config.id}`,
                    role: "Round 2 - Wildcard",
                    photo: assignedPeserta?.photo || "",
                    pesertaId: assignedPeserta?.id || "",
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
            const groupLabels = battle.groupWinners.map((gw) => GROUP_LABELS[gw - 1]).join(", ");
            const wildcardLabels = battle.wildcards.map((w) => `W${w}`).join(", ");
            const battleLabel = `Battle: ${groupLabels}, ${wildcardLabels}`;

            return {
                id: nodeId,
                type: "bracket",
                position: { x: QUARTER_FINAL_X, y: getQuarterFinalY(index) },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: assignedPeserta ? assignedPeserta.name : `QF ${battle.id}`,
                    role: `Quarter Final - ${battleLabel}`,
                    photo: assignedPeserta?.photo || "",
                    pesertaId: assignedPeserta?.id || "",
                    isPlaceholder: !assignedPeserta,
                    isQuarterFinal: true,
                },
            };
        });

        // Generate Semi Final nodes (4 besar)
        const semiFinalNodes: Node[] = SEMI_FINAL_BATTLES.map((battle, index) => {
            const nodeId = `semi_final_${battle.id}`;
            const assignment = assignmentsMap.get(nodeId);
            const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

            const battleLabel = `QF${battle.quarterFinals[0]} vs QF${battle.quarterFinals[1]}`;

            return {
                id: nodeId,
                type: "bracket",
                position: { x: SEMI_FINAL_X, y: getSemiFinalY(index) },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: assignedPeserta ? assignedPeserta.name : `SF ${battle.id}`,
                    role: `Semi Final - ${battleLabel}`,
                    photo: assignedPeserta?.photo || "",
                    pesertaId: assignedPeserta?.id || "",
                    isPlaceholder: !assignedPeserta,
                    isSemiFinal: true,
                },
            };
        });

        // Generate Final nodes (2 finalis)
        const finalNodes: Node[] = FINAL_BATTLES.map((battle, index) => {
            const nodeId = `final_${battle.id}`;
            const assignment = assignmentsMap.get(nodeId);
            const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

            const battleLabel = `SF${battle.semiFinals[0]} vs SF${battle.semiFinals[1]}`;

            return {
                id: nodeId,
                type: "bracket",
                position: { x: FINAL_X, y: getFinalY(index) },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: assignedPeserta ? assignedPeserta.name : `Final ${battle.id}`,
                    role: `Final - ${battleLabel}`,
                    photo: assignedPeserta?.photo || "",
                    pesertaId: assignedPeserta?.id || "",
                    isPlaceholder: !assignedPeserta,
                    isFinal: true,
                },
            };
        });

        // Generate Champion node
        const championAssignment = assignmentsMap.get("champion");
        const championPeserta = championAssignment ? pesertaMap.get(championAssignment.pesertaId) : null;
        const championNode: Node = {
            id: "champion",
            type: "bracket",
            position: { x: CHAMPION_X, y: getChampionY() },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {
                name: championPeserta ? championPeserta.name : "Champion",
                role: "Grand Final - Winner",
                photo: championPeserta?.photo || "",
                pesertaId: championPeserta?.id || "",
                isPlaceholder: !championPeserta,
                isChampion: true,
            },
        };

        // Generate 3rd Place contestant nodes (Loser Final 1 vs Loser Final 2)
        const thirdPlaceContestantNodes: Node[] = FINAL_BATTLES.map((battle, index) => {
            const nodeId = `third_place_contestant_${battle.id}`;
            const assignment = assignmentsMap.get(nodeId);
            const assignedPeserta = assignment ? pesertaMap.get(assignment.pesertaId) : null;

            // Position: spread around the 3rd place Y position
            const yOffset = index === 0 ? -PERSON_GAP / 2 : PERSON_GAP / 2;

            return {
                id: nodeId,
                type: "bracket",
                position: { x: THIRD_PLACE_MATCH_X, y: getThirdPlaceY() + yOffset },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    name: assignedPeserta ? assignedPeserta.name : `Loser Final ${battle.id}`,
                    role: `3rd Place Match - From Final ${battle.id}`,
                    photo: assignedPeserta?.photo || "",
                    pesertaId: assignedPeserta?.id || "",
                    isPlaceholder: !assignedPeserta,
                    isThirdPlaceContestant: true,
                },
            };
        });

        // Generate 3rd Place winner node
        const thirdPlaceAssignment = assignmentsMap.get("third_place");
        const thirdPlacePeserta = thirdPlaceAssignment ? pesertaMap.get(thirdPlaceAssignment.pesertaId) : null;
        const thirdPlaceNode: Node = {
            id: "third_place",
            type: "bracket",
            position: { x: CHAMPION_X, y: getThirdPlaceY() },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {
                name: thirdPlacePeserta ? thirdPlacePeserta.name : "3rd Place",
                role: "3rd Place Winner",
                photo: thirdPlacePeserta?.photo || "",
                pesertaId: thirdPlacePeserta?.id || "",
                isPlaceholder: !thirdPlacePeserta,
                isThirdPlace: true,
            },
        };

        // Generate edges from Round 1 to Round 2
        const round1ToRound2Edges: Edge[] = GROUP_LABELS.flatMap((group, groupIndex) => {
            const groupPeserta = pesertaByGroup[group] || [];

            return groupPeserta.map((_, personIndex) => ({
                id: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}_to_round_2_person_${groupIndex + 1}`,
                source: `round_1_group_${group.toLowerCase()}_person_${personIndex + 1}`,
                target: `round_2_person_${groupIndex + 1}`,
                type: "step",
                style: { stroke: "#64748b", strokeWidth: 2 },
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
                    type: "step",
                    style: { stroke: "#8b5cf6", strokeWidth: 2 },
                });
            });

            // Add edges from wildcards
            battle.wildcards.forEach((wc) => {
                battleEdges.push({
                    id: `round_2_wildcard_${wc}_to_qf_${battle.id}`,
                    source: `round_2_wildcard_${wc}`,
                    target: targetId,
                    type: "step",
                    style: { stroke: "#8b5cf6", strokeWidth: 2, strokeDasharray: "5,5" },
                });
            });

            return battleEdges;
        });

        // Generate edges from Quarter Final to Semi Final (Duel)
        const qfToSfEdges: Edge[] = SEMI_FINAL_BATTLES.flatMap((battle) => {
            return battle.quarterFinals.map((qf) => ({
                id: `qf_${qf}_to_sf_${battle.id}`,
                source: `quarter_final_${qf}`,
                target: `semi_final_${battle.id}`,
                type: "step",
                style: { stroke: "#06b6d4", strokeWidth: 2 },
            }));
        });

        // Generate edges from Semi Final to Final (Duel)
        const sfToFinalEdges: Edge[] = FINAL_BATTLES.flatMap((battle) => {
            return battle.semiFinals.map((sf) => ({
                id: `sf_${sf}_to_final_${battle.id}`,
                source: `semi_final_${sf}`,
                target: `final_${battle.id}`,
                type: "step",
                style: { stroke: "#10b981", strokeWidth: 2 },
            }));
        });

        // Generate edges from Final to Champion
        const finalToChampionEdges: Edge[] = FINAL_BATTLES.map((battle) => ({
            id: `final_${battle.id}_to_champion`,
            source: `final_${battle.id}`,
            target: "champion",
            type: "step",
            style: { stroke: "#f59e0b", strokeWidth: 3 },
        }));

        // Generate edges from 3rd Place Contestants to 3rd Place Winner
        const thirdPlaceContestantEdges: Edge[] = FINAL_BATTLES.map((battle) => ({
            id: `third_place_contestant_${battle.id}_to_third_place`,
            source: `third_place_contestant_${battle.id}`,
            target: "third_place",
            type: "step",
            style: { stroke: "#f97316", strokeWidth: 2 },
        }));

        return {
            nodes: [...round1Nodes, ...round2Nodes, ...wildcardNodes, ...quarterFinalNodes, ...semiFinalNodes, ...finalNodes, championNode, ...thirdPlaceContestantNodes, thirdPlaceNode],
            edges: [...round1ToRound2Edges, ...round2ToQuarterFinalEdges, ...qfToSfEdges, ...sfToFinalEdges, ...finalToChampionEdges, ...thirdPlaceContestantEdges],
        };
    }, [peserta, assignmentsMap, pesertaMap]);

    return {
        nodes,
        edges,
        isLoading: peserta === undefined,
        assignments: assignmentsMap,
    };
};
