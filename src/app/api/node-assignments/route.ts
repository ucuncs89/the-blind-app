import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NodeAssignmentModel from "@/lib/models/NodeAssignment";
import type { NodeAssignmentRecord } from "@/lib/db";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const baganId = searchParams.get("baganId");

        await connectDB();

        const filter = baganId ? { baganId } : {};
        const assignments = await NodeAssignmentModel.find(filter).lean();

        const result: NodeAssignmentRecord[] = assignments.map((a) => ({
            id: a._id,
            pesertaId: a.pesertaId,
            baganId: a.baganId,
            assignedAt: new Date(a.assignedAt),
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching node assignments:", error);
        return NextResponse.json({ error: "Failed to fetch node assignments" }, { status: 500 });
    }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const body = await request.json();
        const assignment: NodeAssignmentRecord = body;

        const newAssignment = new NodeAssignmentModel({
            _id: assignment.id,
            pesertaId: assignment.pesertaId,
            baganId: assignment.baganId,
            assignedAt: assignment.assignedAt,
        });

        await newAssignment.save();

        return NextResponse.json(assignment, { status: 201 });
    } catch (error) {
        console.error("Error creating node assignment:", error);
        return NextResponse.json({ error: "Failed to create node assignment" }, { status: 500 });
    }
};

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
    try {
        await connectDB();
        const body = await request.json();
        const assignment: NodeAssignmentRecord = body;

        const updatedAssignment = await NodeAssignmentModel.findByIdAndUpdate(
            assignment.id,
            {
                pesertaId: assignment.pesertaId,
                baganId: assignment.baganId,
                assignedAt: assignment.assignedAt,
            },
            { new: true, upsert: true, lean: true }
        );

        const result: NodeAssignmentRecord = {
            id: updatedAssignment._id,
            pesertaId: updatedAssignment.pesertaId,
            baganId: updatedAssignment.baganId,
            assignedAt: new Date(updatedAssignment.assignedAt),
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating node assignment:", error);
        return NextResponse.json({ error: "Failed to update node assignment" }, { status: 500 });
    }
};
