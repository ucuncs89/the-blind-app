import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";

export function AnimatedEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...props.style,
          animation: "dash-flow 20s linear infinite",
          strokeDasharray: "5, 5",
          filter: "drop-shadow(0 0 4px rgba(100, 116, 139, 0.6))",
        }}
      />
    </>
  );
}

export function AnimatedEdgeDark(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...props.style,
          animation: "dash-flow 20s linear infinite",
          strokeDasharray: "5, 5",
          filter: "drop-shadow(0 0 6px rgba(30, 41, 59, 0.8))",
        }}
      />
    </>
  );
}
