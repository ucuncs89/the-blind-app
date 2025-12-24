import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NodeAssignmentModel from '@/lib/models/NodeAssignment';

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    await connectDB();
    await NodeAssignmentModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting node assignment:', error);
    return NextResponse.json({ error: 'Failed to delete node assignment' }, { status: 500 });
  }
};

