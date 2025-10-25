import { db } from './db';
import { postLikeCounters } from './schema/post-like';
import { eq, sql } from 'drizzle-orm';

/**
 * DAO functions for post like operations
 * All operations use service role and are idempotent
 */

export interface PostLikeResult {
  success: boolean;
  count: number;
  error?: string;
}

/**
 * Increment post like count
 * Uses upsert to handle concurrent requests safely
 */
export async function incrementPostLike(postId: string): Promise<PostLikeResult> {
  try {
    const result = await db
      .insert(postLikeCounters)
      .values({
        postId,
        likeCount: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: postLikeCounters.postId,
        set: {
          likeCount: sql`${postLikeCounters.likeCount} + 1`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ count: postLikeCounters.likeCount });

    return {
      success: true,
      count: result[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error incrementing post like:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Decrement post like count with floor at 0
 * Ensures count never goes negative
 */
export async function decrementPostLike(postId: string): Promise<PostLikeResult> {
  try {
    // First ensure the row exists
    await db
      .insert(postLikeCounters)
      .values({
        postId,
        likeCount: 0,
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // Then decrement with floor at 0
    const result = await db
      .update(postLikeCounters)
      .set({
        likeCount: sql`GREATEST(${postLikeCounters.likeCount} - 1, 0)`,
        updatedAt: sql`now()`,
      })
      .where(eq(postLikeCounters.postId, postId))
      .returning({ count: postLikeCounters.likeCount });

    return {
      success: true,
      count: result[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error decrementing post like:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current like count for a post
 */
export async function getPostLikeCount(postId: string): Promise<PostLikeResult> {
  try {
    const result = await db
      .select({ count: postLikeCounters.likeCount })
      .from(postLikeCounters)
      .where(eq(postLikeCounters.postId, postId))
      .limit(1);

    return {
      success: true,
      count: result[0]?.count || 0,
    };
  } catch (error) {
    console.error('Error getting post like count:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get like counts for multiple posts
 */
export async function getPostLikeCounts(postIds: string[]): Promise<Record<string, number>> {
  try {
    const result = await db
      .select({
        postId: postLikeCounters.postId,
        count: postLikeCounters.likeCount,
      })
      .from(postLikeCounters)
      .where(sql`${postLikeCounters.postId} = ANY(${postIds})`);

    const counts: Record<string, number> = {};
    result.forEach(row => {
      counts[row.postId] = row.count;
    });

    // Ensure all requested postIds have a count (default to 0)
    postIds.forEach(id => {
      if (!(id in counts)) {
        counts[id] = 0;
      }
    });

    return counts;
  } catch (error) {
    console.error('Error getting post like counts:', error);
    // Return zeros for all posts on error
    const counts: Record<string, number> = {};
    postIds.forEach(id => {
      counts[id] = 0;
    });
    return counts;
  }
}
