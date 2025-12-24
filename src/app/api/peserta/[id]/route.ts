import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PesertaModel from '@/lib/models/Peserta';
import type { Peserta } from '@/types/peserta';

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    await connectDB();
    const peserta = await PesertaModel.findById(id).lean();

    if (!peserta) {
      return NextResponse.json({ error: 'Peserta not found' }, { status: 404 });
    }

    const result: Peserta = {
      id: peserta._id,
      name: peserta.name,
      group: peserta.group,
      photo: peserta.photo,
      status: peserta.status,
      createdAt: new Date(peserta.createdAt),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching peserta:', error);
    return NextResponse.json({ error: 'Failed to fetch peserta' }, { status: 500 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const pesertaData: Peserta = body;

    const updatedPeserta = await PesertaModel.findByIdAndUpdate(
      id,
      {
        name: pesertaData.name,
        group: pesertaData.group,
        photo: pesertaData.photo,
        status: pesertaData.status,
      },
      { new: true, lean: true }
    );

    if (!updatedPeserta) {
      return NextResponse.json({ error: 'Peserta not found' }, { status: 404 });
    }

    const result: Peserta = {
      id: updatedPeserta._id,
      name: updatedPeserta.name,
      group: updatedPeserta.group,
      photo: updatedPeserta.photo,
      status: updatedPeserta.status,
      createdAt: new Date(updatedPeserta.createdAt),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating peserta:', error);
    return NextResponse.json({ error: 'Failed to update peserta' }, { status: 500 });
  }
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await params;
    await connectDB();
    await PesertaModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting peserta:', error);
    return NextResponse.json({ error: 'Failed to delete peserta' }, { status: 500 });
  }
};

