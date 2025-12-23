import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PesertaModel from "@/models/Peserta";

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> => {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const peserta = await PesertaModel.findOneAndUpdate({ id }, body, {
            new: true,
        });
        if (!peserta) {
            return NextResponse.json({ error: "Peserta not found" }, { status: 404 });
        }
        return NextResponse.json(peserta);
    } catch (error) {
        console.error("Error updating peserta:", error);
        return NextResponse.json({ error: "Failed to update peserta" }, { status: 500 });
    }
};

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> => {
    try {
        await connectDB();
        const { id } = await params;
        await PesertaModel.findOneAndDelete({ id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting peserta:", error);
        return NextResponse.json({ error: "Failed to delete peserta" }, { status: 500 });
    }
};
