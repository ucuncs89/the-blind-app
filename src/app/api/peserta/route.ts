import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PesertaModel from '@/lib/models/Peserta';
import type { Peserta } from '@/types/peserta';

export const GET = async (): Promise<NextResponse> => {
  try {
    await connectDB();
    const peserta = await PesertaModel.find({}).lean();

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
    console.error('Error fetching peserta:', error);
    return NextResponse.json({ error: 'Failed to fetch peserta' }, { status: 500 });
  }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectDB();
    const body = await request.json();
    const peserta: Peserta = body;

    const newPeserta = new PesertaModel({
      _id: peserta.id,
      name: peserta.name,
      group: peserta.group,
      photo: peserta.photo,
      status: peserta.status,
      createdAt: peserta.createdAt,
    });

    await newPeserta.save();

    return NextResponse.json(peserta, { status: 201 });
  } catch (error) {
    console.error('Error creating peserta:', error);
    return NextResponse.json({ error: 'Failed to create peserta' }, { status: 500 });
  }
};

