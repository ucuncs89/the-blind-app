"use client";

import React, { useRef, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  type NodeChange,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "@/components/flow/nodeTypes";
import { nodes as initialNodes, edges } from "./data";

export default function FlowPage() {
  const reactFlowInstance = useRef<any>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes as Node[]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onNodeDragStop = useCallback((_event: any, node: Node) => {
    console.log(`Node "${node.id}" moved to position:`, {
      x: node.position.x,
      y: node.position.y,
    });
  }, []);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onInit={(instance) => (reactFlowInstance.current = instance)}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => {
          console.log("clicked", node.id);
          // center the view on the clicked node and zoom in
          reactFlowInstance.current?.setCenter(
            node.position.x,
            node.position.y,
            {
              zoom: 1.5,
              duration: 800,
            }
          );
        }}
        onNodeDragStop={onNodeDragStop}
      >
        <Background />
        {/* <Controls /> */}
      </ReactFlow>
    </div>
  );
}
