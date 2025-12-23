import type { NodeAssignmentRecord } from "./db";

const API_BASE = "/api/node-assignments";

export const getNodeAssignments = async (baganId?: string): Promise<NodeAssignmentRecord[]> => {
    const url = baganId ? `${API_BASE}?baganId=${baganId}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch node assignments");
    }
    return res.json();
};

export const createNodeAssignment = async (assignment: NodeAssignmentRecord): Promise<NodeAssignmentRecord> => {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment),
    });
    if (!res.ok) {
        throw new Error("Failed to create node assignment");
    }
    return res.json();
};

export const updateNodeAssignment = async (assignment: NodeAssignmentRecord): Promise<NodeAssignmentRecord> => {
    const res = await fetch(`${API_BASE}/${assignment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment),
    });
    if (!res.ok) {
        throw new Error("Failed to update node assignment");
    }
    return res.json();
};

export const deleteNodeAssignment = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Failed to delete node assignment");
    }
};
