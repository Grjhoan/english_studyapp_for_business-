import { NextRequest, NextResponse } from 'next/server';
import { getPhrases, deletePhrase, addPhrase } from '@/lib/db';
import { PhraseItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const phrases = await getPhrases();
    return NextResponse.json({ success: true, phrases });
  } catch (error: any) {
    console.error('Error fetching phrases:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch phrases' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Phrase ID is required' },
        { status: 400 }
      );
    }

    const updated = await deletePhrase(id);
    return NextResponse.json({ success: true, phrases: updated });
  } catch (error: any) {
    console.error('Error deleting phrase:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete phrase' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.item) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }
    const updated = await addPhrase(body.item as PhraseItem);
    return NextResponse.json({ success: true, phrases: updated });
  } catch (error: any) {
    console.error('Error adding phrase:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add phrase' },
      { status: 500 }
    );
  }
}
