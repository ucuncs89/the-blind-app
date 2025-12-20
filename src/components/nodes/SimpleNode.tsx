"use client";

import { Handle, Position } from "reactflow";

export default function SimpleNode() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Handle position={Position.Left} type="target" />
      <div className="w-4 h-4 bg-slate-400 rounded-full" />
      <Handle position={Position.Right} type="source" />
    </div>
  );
}
