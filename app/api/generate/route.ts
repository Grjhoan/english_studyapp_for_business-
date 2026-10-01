import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessSentences, buildPhraseItem } from '@/lib/ai';
import { addPhrase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phrase = body?.phrase?.trim();

    if (!phrase) {
      return NextResponse.json(
        { success: false, error: 'Please enter a phrase or word.' },
        { status: 400 }
      );
    }

    if (phrase.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Phrase is too long. Please enter a concise word or phrase.' },
        { status: 400 }
      );
    }

    // Call backend AI generator (keys remain safe on server)
    const generated = await generateBusinessSentences(phrase);
    const newItem = buildPhraseItem(phrase, generated);

    // Save into database
    const updatedPhrases = await addPhrase(newItem);

    return NextResponse.json({
      success: true,
      item: newItem,
      phrases: updatedPhrases,
    });
  } catch (error: any) {
    console.error('Error generating phrase sentences:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while generating examples. Please try again.',
      },
      { status: 500 }
    );
  }
}
