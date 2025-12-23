import mongoose, { Schema, type Document, type Model } from "mongoose";

export type NodeAssignmentDocument = Document & {
    id: string;
    pesertaId: string;
    baganId: string;
    assignedAt: Date;
};

const NodeAssignmentSchema = new Schema<NodeAssignmentDocument>(
    {
        id: { type: String, required: true, unique: true },
        pesertaId: { type: String, required: true },
        baganId: { type: String, required: true },
        assignedAt: { type: Date, default: Date.now },
    },
    { collection: "nodeAssignments" }
);

const NodeAssignmentModel: Model<NodeAssignmentDocument> = mongoose.models.NodeAssignment || mongoose.model<NodeAssignmentDocument>("NodeAssignment", NodeAssignmentSchema);

export default NodeAssignmentModel;
