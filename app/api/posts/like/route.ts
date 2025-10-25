import { NextRequest, NextResponse } from 'next/server';
import { PostLikeRequestSchema, PostLikeResponseSchema } from '@/lib/validations/post-like';
import { incrementPostLike, decrementPostLike } from '@/lib/post-like.dao';
import { checkRateLimit, getRateLimitHeaders, hashIP } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = hashIP(clientIP);
  
  try {
    // Check rate limit
    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      console.warn('Rate limit exceeded', {
        ip_hash: ipHash,
        retry_after: rateLimit.retryAfter,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: getRateLimitHeaders(
            rateLimit.allowed,
            rateLimit.remaining,
            rateLimit.resetTime,
            rateLimit.retryAfter
          ),
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = PostLikeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.warn('Invalid request body', {
        ip_hash: ipHash,
        errors: validationResult.error.errors,
      });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
        { status: 422 }
      );
    }

    const { postId, op } = validationResult.data;

    // Perform like/unlike operation
    const result = op === 'like' 
      ? await incrementPostLike(postId)
      : await decrementPostLike(postId);

    if (!result.success) {
      console.error('Database operation failed', {
        ip_hash: ipHash,
        post_id: postId,
        operation: op,
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
    console.info('Post like operation successful', {
      ip_hash: ipHash,
      post_id: postId,
      operation: op,
      count: result.count,
      duration_ms: Date.now() - startTime,
    });

    // Validate response
    const responseValidation = PostLikeResponseSchema.safeParse(result);
    if (!responseValidation.success) {
      console.error('Invalid response format', {
        ip_hash: ipHash,
        post_id: postId,
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
          ...getRateLimitHeaders(
            rateLimit.allowed,
            rateLimit.remaining,
            rateLimit.resetTime
          ),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    console.error('Unexpected error in POST /api/posts/like', {
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
