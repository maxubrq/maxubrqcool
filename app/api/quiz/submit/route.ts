import { NextRequest, NextResponse } from 'next/server';
import { submitQuizResult } from '@/lib/quiz/server-actions';
import { ZQuizSubmission } from '@/lib/quiz/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the submission
    const validatedSubmission = ZQuizSubmission.parse(body);
    
    // Submit the result
    const result = await submitQuizResult(validatedSubmission);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        result: result.result 
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid submission data' },
      { status: 400 }
    );
  }
}
