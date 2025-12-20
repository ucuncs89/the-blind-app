"use client";

import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type PersonNodeProps = {
  data: {
    name: string;
    role?: string;
    photo?: string;
  };
};

export default function PersonNode({ data }: PersonNodeProps) {
  return (
    <Card className="w-48 p-3 rounded-xl shadow-md">
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={data.photo} />
          <AvatarFallback>
            {data.name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="text-sm">
          <div className="font-semibold">{data.name}</div>
          {data.role && (
            <div className="text-muted-foreground text-xs">
              {data.role}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
