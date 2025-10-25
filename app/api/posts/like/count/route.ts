import { NextRequest, NextResponse } from 'next/server';
import { GetLikeCountRequestSchema, GetLikeCountResponseSchema } from '@/lib/validations/post-like';
import { getPostLikeCount } from '@/lib/post-like.dao';
import { hashIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = hashIP(clientIP);
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      console.warn('Missing postId parameter', {
        ip_hash: ipHash,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Missing postId parameter',
          code: 'MISSING_PARAMETER',
        },
        { status: 400 }
      );
    }

    const validationResult = GetLikeCountRequestSchema.safeParse({ postId });
    
    if (!validationResult.success) {
      console.warn('Invalid postId parameter', {
        ip_hash: ipHash,
        post_id: postId,
        errors: validationResult.error.errors,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid postId parameter',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
        { status: 422 }
      );
    }

    const { postId: validatedPostId } = validationResult.data;

    // Get like count
    const result = await getPostLikeCount(validatedPostId);

    if (!result.success) {
      console.error('Database operation failed', {
        ip_hash: ipHash,
        post_id: validatedPostId,
        error: result.error,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Log successful operation
    console.info('Get like count successful', {
      ip_hash: ipHash,
      post_id: validatedPostId,
      count: result.count,
      duration_ms: Date.now() - startTime,
    });

    // Validate response
    const response = { count: result.count };
    const responseValidation = GetLikeCountResponseSchema.safeParse(response);
    
    if (!responseValidation.success) {
      console.error('Invalid response format', {
        ip_hash: ipHash,
        post_id: validatedPostId,
        errors: responseValidation.error.errors,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          code: 'RESPONSE_VALIDATION_ERROR',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      responseValidation.data,
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Unexpected error in GET /api/posts/like/count', {
      ip_hash: ipHash,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
