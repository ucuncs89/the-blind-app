"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import ReactFlow, {
  Background,
  applyNodeChanges,
  type NodeChange,
  type Node,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes, edgeTypes } from "@/components/flow/nodeTypes";
import { useBagan1QFToFinal } from "@/hooks/useBagan1QFToFinal";

const ViewQFFinalPage = (): React.ReactElement => {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const { nodes: initialNodes, edges, isLoading } = useBagan1QFToFinal();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(
    new Set(),
  );

  // Sync nodes when data from IndexedDB changes
  React.useEffect(() => {
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
        relatedIds.push(
          "third_place_contestant_1",
          "third_place_contestant_2",
          "third_place",
        );
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
        const finalBattle = finalBattles.find((b) =>
          b.semiFinals.includes(sfNumber),
        );
        if (finalBattle) {
          relatedIds.push(`final_${finalBattle.id}`);
        }
      }

      // Handle Quarter Final node click - highlight semi final
      if (nodeId.startsWith("quarter_final_")) {
        const qfNumber = parseInt(nodeId.replace("quarter_final_", ""));
        // Find which semi final this QF leads to
        const sfBattle = semiFinalBattles.find((b) =>
          b.quarterFinals.includes(qfNumber),
        );
        if (sfBattle) {
          relatedIds.push(`semi_final_${sfBattle.id}`);
        }
      }

      return relatedIds;
    },
    [nodes],
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
    [getRelatedNodeIds],
  );

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
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-500" />
          <p className="text-muted-foreground">Memuat data bagan...</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Belum ada data peserta
          </h2>
          <p className="text-sm text-muted-foreground">
            Silakan tambahkan peserta terlebih dahulu di halaman Kelola Peserta
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative">
      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="opacity-10"
          priority
        />
      </div>
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onInit={(instance) => {
          reactFlowInstance.current = instance;
        }}
        onNodeClick={handleNodeClick}
        nodesDraggable={false}
        zoomOnDoubleClick={true}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ViewQFFinalPage;
