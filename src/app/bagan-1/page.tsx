"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  applyNodeChanges,
  type NodeChange,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes, edgeTypes } from "@/components/flow/nodeTypes";
import { nodes as initialNodes, edges } from "./data";

export default function FlowPage() {
  const reactFlowInstance = useRef<any>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes as Node[]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(
    new Set(),
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onNodeDragStop = useCallback((_event: any, node: Node) => {
    console.log(`Node "${node.id}" moved to position:`, {
      x: node.position.x,
      y: node.position.y,
    });
  }, []);

  // Function to get related node IDs when clicking a node
  const getRelatedNodeIds = useCallback(
    (nodeId: string): string[] => {
      const relatedIds: string[] = [nodeId];

      // Check if it's a Round 2 winner node
      if (nodeId.startsWith("round_2_person_")) {
        // Extract the person number to get the group letter
        const personNumber = parseInt(nodeId.replace("round_2_person_", ""));
        const groupLetter = String.fromCharCode(
          64 + personNumber,
        ).toLowerCase(); // 1 -> 'a', 2 -> 'b', etc.

        // Find all Round 1 nodes in that group
        const groupNodes = nodes.filter((node) =>
          node.id.startsWith(`round_1_group_${groupLetter}_`),
        );
        groupNodes.forEach((node) => relatedIds.push(node.id));
      }

      // Check if it's a Round 1 node
      if (nodeId.startsWith("round_1_group_")) {
        // Extract group letter from the node id (e.g., "round_1_group_a_person_1" -> "a")
        const match = nodeId.match(/round_1_group_([a-o])_person_/);
        if (match) {
          const groupLetter = match[1];
          const groupIndex = groupLetter.charCodeAt(0) - "a".charCodeAt(0) + 1;

          // Add the corresponding Round 2 winner
          relatedIds.push(`round_2_person_${groupIndex}`);

          // Add all other members of the same group
          const groupNodes = nodes.filter(
            (node) =>
              node.id.startsWith(`round_1_group_${groupLetter}_`) &&
              node.id !== nodeId,
          );
          groupNodes.forEach((node) => relatedIds.push(node.id));
        }
      }

      return relatedIds;
    },
    [nodes],
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      console.log("clicked", node.id);

      // Get all related node IDs
      const relatedIds = getRelatedNodeIds(node.id);

      // Toggle selection
      setSelectedNodeIds((prev) => {
        const newSet = new Set(prev);

        // Check if this node is already selected
        if (newSet.has(node.id)) {
          // Deselect all related nodes
          relatedIds.forEach((id) => newSet.delete(id));
        } else {
          // Select all related nodes
          relatedIds.forEach((id) => newSet.add(id));
        }

        return newSet;
      });

      // Center the view on the clicked node
      reactFlowInstance.current?.setCenter(node.position.x, node.position.y, {
        zoom: 1.5,
        duration: 800,
      });
    },
    [getRelatedNodeIds],
  );

  // Update nodes with isSelected data
  const nodesWithSelection = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isSelected: selectedNodeIds.has(node.id),
      },
    }));
  }, [nodes, selectedNodeIds]);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onInit={(instance) => (reactFlowInstance.current = instance)}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={onNodeDragStop}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
