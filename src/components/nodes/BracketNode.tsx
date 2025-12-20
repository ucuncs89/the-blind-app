"use client";

import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type BracketNodeProps = {
  data: {
    name: string;
    role?: string;
    photo?: string;
  };
};

export default function BracketNode({ data }: BracketNodeProps) {
  return (
    <div className="flex items-center gap-0">
      <Handle position={Position.Left} type="target" />

      <Card className="w-48 p-3 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={data.photo} />
            <AvatarFallback>{data.name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="text-sm">
            <div className="font-semibold">{data.name}</div>
            {data.role && (
              <div className="text-muted-foreground text-xs">{data.role}</div>
            )}
          </div>
        </div>
      </Card>

      <Handle position={Position.Right} type="source" />
    </div>
  );
}
