import mongoose, { Schema, type Document, type Model } from "mongoose";

export type PesertaDocument = Document & {
    id: string;
    name: string;
    group: string;
    photo: string;
    status: "active" | "eliminated" | "winner";
    createdAt: Date;
};

const PesertaSchema = new Schema<PesertaDocument>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        group: { type: String, required: true },
        photo: { type: String, default: "" },
        status: {
            type: String,
            enum: ["active", "eliminated", "winner"],
            default: "active",
        },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: "peserta" }
);

const PesertaModel: Model<PesertaDocument> = mongoose.models.Peserta || mongoose.model<PesertaDocument>("Peserta", PesertaSchema);

export default PesertaModel;
