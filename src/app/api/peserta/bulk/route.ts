import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PesertaModel from '@/lib/models/Peserta';
import type { Peserta } from '@/types/peserta';

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectDB();
    const body = await request.json();
    const pesertaList: Peserta[] = body;

    const documents = pesertaList.map((peserta) => ({
      _id: peserta.id,
      name: peserta.name,
      group: peserta.group,
      photo: peserta.photo,
      status: peserta.status,
      createdAt: peserta.createdAt,
    }));

    await PesertaModel.bulkWrite(
      documents.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: doc },
          upsert: true,
        },
      }))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error bulk upserting peserta:', error);
    return NextResponse.json({ error: 'Failed to bulk upsert peserta' }, { status: 500 });
  }
};

