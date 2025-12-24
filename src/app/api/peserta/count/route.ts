import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PesertaModel from '@/lib/models/Peserta';

export const GET = async (): Promise<NextResponse> => {
  try {
    await connectDB();
    const count = await PesertaModel.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting peserta:', error);
    return NextResponse.json({ error: 'Failed to count peserta' }, { status: 500 });
  }
};

