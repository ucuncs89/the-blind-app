import type { NodeAssignmentRecord } from "./db";

// Convert between NodeAssignmentRecord type and API response
const fromRecord = (record: NodeAssignmentRecord & { assignedAt: string }): NodeAssignmentRecord => ({
    ...record,
    assignedAt: new Date(record.assignedAt),
});

export const getNodeAssignments = async (baganId?: string): Promise<NodeAssignmentRecord[]> => {
    const url = baganId ? `/api/node-assignments?baganId=${encodeURIComponent(baganId)}` : "/api/node-assignments";
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch node assignments");
    }
    const records = await response.json();
    return records.map((r: NodeAssignmentRecord & { assignedAt: string }) => fromRecord(r));
};

export const addNodeAssignment = async (assignment: NodeAssignmentRecord): Promise<NodeAssignmentRecord> => {
    const response = await fetch("/api/node-assignments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
    });

    if (!response.ok) {
        throw new Error("Failed to add node assignment");
    }

    const record = await response.json();
    return fromRecord(record);
};

export const updateNodeAssignment = async (assignment: NodeAssignmentRecord): Promise<NodeAssignmentRecord> => {
    const response = await fetch("/api/node-assignments", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
    });

    if (!response.ok) {
        throw new Error("Failed to update node assignment");
    }

    const record = await response.json();
    return fromRecord(record);
};

export const deleteNodeAssignment = async (id: string): Promise<void> => {
    const response = await fetch(`/api/node-assignments/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete node assignment");
    }
};
