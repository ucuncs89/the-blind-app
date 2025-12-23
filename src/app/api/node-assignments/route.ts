import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NodeAssignmentModel from "@/models/NodeAssignment";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const baganId = req.nextUrl.searchParams.get("baganId");
        const query = baganId ? { baganId } : {};
        const assignments = await NodeAssignmentModel.find(query).lean();
        return NextResponse.json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const body = await req.json();

        // Check if assignment already exists
        const existing = await NodeAssignmentModel.findOne({ id: body.id });
        if (existing) {
            // Update existing
            const assignment = await NodeAssignmentModel.findOneAndUpdate({ id: body.id }, body, { new: true });
            return NextResponse.json(assignment);
        }

        // Create new
        const assignment = await NodeAssignmentModel.create(body);
        return NextResponse.json(assignment, { status: 201 });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
    }
};
