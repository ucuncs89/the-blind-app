import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PesertaModel from "@/models/Peserta";

export const GET = async (): Promise<NextResponse> => {
    try {
        await connectDB();
        const peserta = await PesertaModel.find({}).lean();
        return NextResponse.json(peserta);
    } catch (error) {
        console.error("Error fetching peserta:", error);
        return NextResponse.json({ error: "Failed to fetch peserta" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const body = await req.json();
        const peserta = await PesertaModel.create(body);
        return NextResponse.json(peserta, { status: 201 });
    } catch (error) {
        console.error("Error creating peserta:", error);
        return NextResponse.json({ error: "Failed to create peserta" }, { status: 500 });
    }
};
