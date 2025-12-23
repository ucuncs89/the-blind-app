import PersonNode from "../nodes/PersonNode";
import SimpleNode from "../nodes/SimpleNode";
import BracketNode from "../nodes/BracketNode";
import { AnimatedEdge, AnimatedEdgeDark } from "./AnimatedEdge";

export const nodeTypes = {
  person: PersonNode,
  simple: SimpleNode,
  bracket: BracketNode,
};

export const edgeTypes = {
  animated: AnimatedEdge,
  animatedDark: AnimatedEdgeDark,
};
