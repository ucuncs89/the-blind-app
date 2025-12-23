'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  type NodeChange,
  type Node,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, edgeTypes } from '@/components/flow/nodeTypes';
import { nodes as initialNodes, edges } from './data';

const Bagan2Page = (): React.ReactElement => {
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes as Node[]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeIds((prev) => {
        const newSet = new Set(prev);

        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }

        return newSet;
      });
    },
    []
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Bagan 2
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualisasi bracket tournament Round 2 → Semi Final → Final
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 border-b bg-muted/30 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-violet-500" />
          <span className="text-muted-foreground">Round 2 → 3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-cyan-500" />
          <span className="text-muted-foreground">Round 3 → 4</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Quarter → Semi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Semi → Final</span>
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
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              if (node.id.includes('final')) return '#f59e0b';
              if (node.id.includes('semi')) return '#10b981';
              if (node.id.includes('round_4')) return '#06b6d4';
              if (node.id.includes('round_3')) return '#8b5cf6';
              return '#64748b';
            }}
            className="!bottom-4 !right-4"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Bagan2Page;

