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
    const { nodes: initialNodes, edges, isLoading, assignments } = useBagan1Data();
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

    // Sync nodes when data from IndexedDB changes
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

            // Quarter Final battle configurations
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

            // Handle Quarter Final node click - highlight all battle participants
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

            // Show context menu for Round 2 nodes (winner and wildcard) and Quarter Final nodes
            const isRound2Node = node.id.startsWith("round_2_");
            const isQuarterFinalNode = node.id.startsWith("quarter_final_");

            if (!isRound2Node && !isQuarterFinalNode) return;

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
                <p className="text-sm text-muted-foreground">Visualisasi bracket tournament Round 1 → Round 2 → Quarter Final (8 Besar)</p>
            </div>

            {/* Legend */}
            <div className="flex gap-6 border-b bg-muted/30 px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-500" />
                    <span className="text-muted-foreground">Round 1 → 2</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground">Round 2 → QF (Battle of 3)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 border-t-2 border-dashed border-violet-500" />
                    <span className="text-muted-foreground">Wildcard</span>
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
            />
        </div>
    );
};

export default Bagan1Page;
