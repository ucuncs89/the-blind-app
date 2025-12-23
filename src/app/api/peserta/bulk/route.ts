import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PesertaModel from "@/models/Peserta";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const body = await req.json();
        const pesertaList = Array.isArray(body) ? body : [body];

        // Use insertMany with ordered: false to handle duplicates
        const result = await PesertaModel.insertMany(pesertaList, {
            ordered: false,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error bulk creating peserta:", error);
        return NextResponse.json({ error: "Failed to bulk create peserta" }, { status: 500 });
    }
};
