"use client";

import { Handle, Position } from "reactflow";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type BracketNodeProps = {
  data: {
    name: string;
    role?: string;
    photo?: string;
    isSelected?: boolean;
  };
};

export default function BracketNode({ data }: BracketNodeProps) {
  const isSelected = data.isSelected ?? false;

  return (
    <div className="flex items-center gap-0">
      <Handle position={Position.Left} type="target" />

      <div
        className={`cursor-pointer transition-all duration-300 ${
          isSelected ? "gradient-border-wrapper" : ""
        }`}
      >
        <Card
          className={`w-48 p-3 rounded-xl shadow-md ${
            isSelected ? "gradient-border-inner" : ""
          }`}
        >
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
      </div>

      <Handle position={Position.Right} type="source" />
    </div>
  );
}
