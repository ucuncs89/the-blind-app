import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PesertaModel from '@/lib/models/Peserta';
import type { Peserta } from '@/types/peserta';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    await connectDB();

    const peserta = await PesertaModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { group: { $regex: query, $options: 'i' } },
      ],
    }).lean();

    const result: Peserta[] = peserta.map((p) => ({
      id: p._id,
      name: p.name,
      group: p.group,
      photo: p.photo,
      status: p.status,
      createdAt: new Date(p.createdAt),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching peserta:', error);
    return NextResponse.json({ error: 'Failed to search peserta' }, { status: 500 });
  }
};

