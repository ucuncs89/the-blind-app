"use client";

import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, { Background, applyNodeChanges, type NodeChange, type Node, type ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import { UserPlus, X } from "lucide-react";
import { nodeTypes, edgeTypes } from "@/components/flow/nodeTypes";
import { useBagan1Data } from "@/hooks/useBagan1Data";
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { AssignPesertaModal } from "@/components/bagan/AssignPesertaModal";

type ContextMenuState = {
    open: boolean;
    position: { x: number; y: number };
    nodeId: string;
    nodeName: string;
    currentPesertaId?: string;
};

const Bagan1Page = (): React.ReactElement => {
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
    const { nodes: initialNodes, edges, isLoading, assignments, refetch } = useBagan1Data();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());

    // Context menu state
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        open: false,
        position: { x: 0, y: 0 },
        nodeId: "",
        nodeName: "",
    });

    // Assign modal state
    const [assignModal, setAssignModal] = useState({
        open: false,
        nodeId: "",
        nodeName: "",
        currentPesertaId: "",
    });

    // Sync nodes when data changes
    useEffect(() => {
        if (initialNodes.length > 0) {
            setNodes(initialNodes);
        }
    }, [initialNodes]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const getRelatedNodeIds = useCallback(
        (nodeId: string): string[] => {
            const relatedIds: string[] = [nodeId];

            // Battle configurations
            const quarterFinalBattles = [
                { id: 1, groupWinners: [1, 2], wildcards: [1] },
                { id: 2, groupWinners: [3, 4], wildcards: [2] },
                { id: 3, groupWinners: [5, 6], wildcards: [3] },
                { id: 4, groupWinners: [7, 8], wildcards: [4] },
                { id: 5, groupWinners: [9, 10], wildcards: [5] },
                { id: 6, groupWinners: [11, 12], wildcards: [6] },
                { id: 7, groupWinners: [13, 14], wildcards: [7] },
                { id: 8, groupWinners: [15], wildcards: [8, 9] },
            ];

            const semiFinalBattles = [
                { id: 1, quarterFinals: [1, 2] },
                { id: 2, quarterFinals: [3, 4] },
                { id: 3, quarterFinals: [5, 6] },
                { id: 4, quarterFinals: [7, 8] },
            ];

            const finalBattles = [
                { id: 1, semiFinals: [1, 2] },
                { id: 2, semiFinals: [3, 4] },
            ];

            // Handle Champion click - highlight finals
            if (nodeId === "champion") {
                relatedIds.push("final_1", "final_2");
            }

            // Handle 3rd Place click - highlight contestants
            if (nodeId === "third_place") {
                relatedIds.push("third_place_contestant_1", "third_place_contestant_2");
            }

            // Handle 3rd Place Contestant click - highlight other contestant and 3rd place
            if (nodeId.startsWith("third_place_contestant_")) {
                relatedIds.push("third_place_contestant_1", "third_place_contestant_2", "third_place");
            }

            // Handle Final node click - highlight semi finals and champion
            if (nodeId.startsWith("final_") && !nodeId.startsWith("final_to")) {
                const finalNumber = parseInt(nodeId.replace("final_", ""));
                const battle = finalBattles.find((b) => b.id === finalNumber);
                if (battle) {
                    battle.semiFinals.forEach((sf) => {
                        relatedIds.push(`semi_final_${sf}`);
                    });
                }
                relatedIds.push("champion");
            }

            // Handle Semi Final node click - highlight quarter finals and final
            if (nodeId.startsWith("semi_final_")) {
                const sfNumber = parseInt(nodeId.replace("semi_final_", ""));
                const sfBattle = semiFinalBattles.find((b) => b.id === sfNumber);
                if (sfBattle) {
                    sfBattle.quarterFinals.forEach((qf) => {
                        relatedIds.push(`quarter_final_${qf}`);
                    });
                }
                // Find which final this SF leads to
                const finalBattle = finalBattles.find((b) => b.semiFinals.includes(sfNumber));
                if (finalBattle) {
                    relatedIds.push(`final_${finalBattle.id}`);
                }
            }

            // Handle Quarter Final node click - highlight round 2 participants and semi final
            if (nodeId.startsWith("quarter_final_")) {
                const qfNumber = parseInt(nodeId.replace("quarter_final_", ""));
                const battle = quarterFinalBattles.find((b) => b.id === qfNumber);
                if (battle) {
                    battle.groupWinners.forEach((gw) => {
                        relatedIds.push(`round_2_person_${gw}`);
                    });
                    battle.wildcards.forEach((wc) => {
                        relatedIds.push(`round_2_wildcard_${wc}`);
                    });
                }
                // Find which semi final this QF leads to
                const sfBattle = semiFinalBattles.find((b) => b.quarterFinals.includes(qfNumber));
                if (sfBattle) {
                    relatedIds.push(`semi_final_${sfBattle.id}`);
                }
            }

            // Handle Round 2 winner node click
            if (nodeId.startsWith("round_2_person_")) {
                const personNumber = parseInt(nodeId.replace("round_2_person_", ""));
                const groupLetter = String.fromCharCode(64 + personNumber).toLowerCase();

                // Add Round 1 group nodes
                const groupNodes = nodes.filter((node) => node.id.startsWith(`round_1_group_${groupLetter}_`));
                groupNodes.forEach((node) => relatedIds.push(node.id));

                // Add related Quarter Final node
                const battle = quarterFinalBattles.find((b) => b.groupWinners.includes(personNumber));
                if (battle) {
                    relatedIds.push(`quarter_final_${battle.id}`);
                }
            }

            // Handle Round 2 wildcard node click
            if (nodeId.startsWith("round_2_wildcard_")) {
                const wildcardNumber = parseInt(nodeId.replace("round_2_wildcard_", ""));
                const battle = quarterFinalBattles.find((b) => b.wildcards.includes(wildcardNumber));
                if (battle) {
                    relatedIds.push(`quarter_final_${battle.id}`);
                }
            }

            // Handle Round 1 group node click
            if (nodeId.startsWith("round_1_group_")) {
                const match = nodeId.match(/round_1_group_([a-o])_person_/);
                if (match) {
                    const groupLetter = match[1];
                    const groupIndex = groupLetter.charCodeAt(0) - "a".charCodeAt(0) + 1;

                    relatedIds.push(`round_2_person_${groupIndex}`);

                    const groupNodes = nodes.filter((node) => node.id.startsWith(`round_1_group_${groupLetter}_`) && node.id !== nodeId);
                    groupNodes.forEach((node) => relatedIds.push(node.id));

                    // Add related Quarter Final node
                    const battle = quarterFinalBattles.find((b) => b.groupWinners.includes(groupIndex));
                    if (battle) {
                        relatedIds.push(`quarter_final_${battle.id}`);
                    }
                }
            }

            return relatedIds;
        },
        [nodes]
    );

    const handleNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            const relatedIds = getRelatedNodeIds(node.id);

            setSelectedNodeIds((prev) => {
                const newSet = new Set(prev);

                if (newSet.has(node.id)) {
                    relatedIds.forEach((id) => newSet.delete(id));
                } else {
                    relatedIds.forEach((id) => newSet.add(id));
                }

                return newSet;
            });
        },
        [getRelatedNodeIds]
    );

    // Handle right-click on node to show context menu
    const handleNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();

            // Show context menu for assignable nodes (Round 2+)
            const assignableNodePrefixes = ["round_2_", "quarter_final_", "semi_final_", "final_", "champion", "third_place"];

            const isAssignable = assignableNodePrefixes.some((prefix) => node.id.startsWith(prefix) || node.id === prefix);

            if (!isAssignable) return;

            const assignment = assignments.get(node.id);

            setContextMenu({
                open: true,
                position: { x: event.clientX, y: event.clientY },
                nodeId: node.id,
                nodeName: node.data.name,
                currentPesertaId: assignment?.pesertaId || node.data.pesertaId,
            });
        },
        [assignments]
    );

    // Close context menu
    const handleCloseContextMenu = useCallback(() => {
        setContextMenu((prev) => ({ ...prev, open: false }));
    }, []);

    // Open assign modal from context menu
    const handleOpenAssignModal = useCallback(() => {
        setAssignModal({
            open: true,
            nodeId: contextMenu.nodeId,
            nodeName: contextMenu.nodeName,
            currentPesertaId: contextMenu.currentPesertaId || "",
        });
        handleCloseContextMenu();
    }, [contextMenu, handleCloseContextMenu]);

    const nodesWithSelection = useMemo(() => {
        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                isSelected: selectedNodeIds.has(node.id),
            },
        }));
    }, [nodes, selectedNodeIds]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-500" />
                    <p className="text-muted-foreground">Memuat data bagan...</p>
                </div>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-muted-foreground">Belum ada data peserta</h2>
                    <p className="text-sm text-muted-foreground">Silakan tambahkan peserta terlebih dahulu di halaman Kelola Peserta</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <h1 className="text-2xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Bagan 1</span>
                </h1>
                <p className="text-sm text-muted-foreground">Round 1 → Round 2 → Quarter Final → Semi Final → Final → Champion</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 border-b bg-muted/30 px-4 py-2 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                    <span className="text-muted-foreground">R1→R2</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground">R2→QF</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <span className="text-muted-foreground">QF→SF</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">SF→Final</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">Final→Champion</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">3rd Place</span>
                </div>
            </div>

            {/* Flow Canvas */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodesWithSelection}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    onInit={(instance) => {
                        reactFlowInstance.current = instance;
                    }}
                    onNodesChange={onNodesChange}
                    onNodeClick={handleNodeClick}
                    onNodeContextMenu={handleNodeContextMenu}
                >
                    <Background />
                </ReactFlow>
            </div>

            {/* Context Menu */}
            <ContextMenu open={contextMenu.open} position={contextMenu.position} onClose={handleCloseContextMenu}>
                <ContextMenuItem icon={<UserPlus className="h-4 w-4" />} onClick={handleOpenAssignModal}>
                    {contextMenu.currentPesertaId ? "Edit Assignment" : "Assign Peserta"}
                </ContextMenuItem>
                {contextMenu.currentPesertaId && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            icon={<X className="h-4 w-4" />}
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                                // Clear assignment will be handled in modal
                                setAssignModal({
                                    open: true,
                                    nodeId: contextMenu.nodeId,
                                    nodeName: contextMenu.nodeName,
                                    currentPesertaId: contextMenu.currentPesertaId || "",
                                });
                                handleCloseContextMenu();
                            }}
                        >
                            Hapus Assignment
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenu>

            {/* Assign Peserta Modal */}
            <AssignPesertaModal
                open={assignModal.open}
                onOpenChange={(open) => setAssignModal((prev) => ({ ...prev, open }))}
                nodeId={assignModal.nodeId}
                nodeName={assignModal.nodeName}
                baganId="bagan-1"
                currentPesertaId={assignModal.currentPesertaId}
                onAssignmentChange={refetch}
            />
        </div>
    );
};

export default Bagan1Page;
