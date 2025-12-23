import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NodeAssignmentModel from "@/models/NodeAssignment";

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> => {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const assignment = await NodeAssignmentModel.findOneAndUpdate({ id }, body, {
            new: true,
        });
        if (!assignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        }
        return NextResponse.json(assignment);
    } catch (error) {
        console.error("Error updating assignment:", error);
        return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
    }
};

export const DELETE = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> => {
    try {
        await connectDB();
        const { id } = await params;
        await NodeAssignmentModel.findOneAndDelete({ id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
    }
};
