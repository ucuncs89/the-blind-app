import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type NodeAssignmentDocument = Document & {
  _id: string; // nodeId
  pesertaId: string;
  baganId: string;
  assignedAt: Date;
};

const NodeAssignmentSchema = new Schema<NodeAssignmentDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    pesertaId: {
      type: String,
      required: true,
    },
    baganId: {
      type: String,
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

// Create index for efficient queries
NodeAssignmentSchema.index({ baganId: 1 });
NodeAssignmentSchema.index({ pesertaId: 1 });

const NodeAssignmentModel: Model<NodeAssignmentDocument> =
  mongoose.models.NodeAssignment ||
  mongoose.model<NodeAssignmentDocument>('NodeAssignment', NodeAssignmentSchema);

export default NodeAssignmentModel;

