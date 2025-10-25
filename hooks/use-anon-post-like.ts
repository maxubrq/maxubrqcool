import { useState, useEffect, useCallback } from 'react';
import { PostId, LikeOp } from '@/lib/validations/post-like';

interface PostLikeState {
  liked: boolean;
  count: number;
  isMutating: boolean;
  error: string | null;
}

interface PostLikeActions {
  toggle: () => Promise<void>;
  like: () => Promise<void>;
  unlike: () => Promise<void>;
}

type UseAnonPostLikeReturn = PostLikeState & PostLikeActions;

const LIKED_POSTS_KEY = 'liked_posts';

/**
 * Get liked posts from localStorage
 */
function getLikedPosts(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = localStorage.getItem(LIKED_POSTS_KEY);
    if (!stored) return new Set();
    
    const parsed = JSON.parse(stored);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.warn('Failed to parse liked posts from localStorage:', error);
    return new Set();
  }
}

/**
 * Save liked posts to localStorage
 */
function saveLikedPosts(likedPosts: Set<string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(Array.from(likedPosts)));
  } catch (error) {
    console.warn('Failed to save liked posts to localStorage:', error);
  }
}

/**
 * Add post to liked posts
 */
function addLikedPost(postId: string): void {
  const likedPosts = getLikedPosts();
  likedPosts.add(postId);
  saveLikedPosts(likedPosts);
}

/**
 * Remove post from liked posts
 */
function removeLikedPost(postId: string): void {
  const likedPosts = getLikedPosts();
  likedPosts.delete(postId);
  saveLikedPosts(likedPosts);
}

/**
 * Check if post is liked
 */
function isPostLiked(postId: string): boolean {
  const likedPosts = getLikedPosts();
  return likedPosts.has(postId);
}

/**
 * Hook for anonymous post like functionality with localStorage dedupe
 */
export function useAnonPostLike(postId: PostId, initialCount?: number): UseAnonPostLikeReturn {
  const [state, setState] = useState<PostLikeState>(() => ({
    liked: isPostLiked(postId),
    count: initialCount || 0,
    isMutating: false,
    error: null,
  }));

  // Load initial state from localStorage on mount
  useEffect(() => {
    setState(prev => ({
      ...prev,
      liked: isPostLiked(postId),
    }));
  }, [postId]);

  // Fetch current count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`/api/posts/like/count?postId=${encodeURIComponent(postId)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch count: ${response.status}`);
        }
        
        const data = await response.json();
        setState(prev => ({
          ...prev,
          count: data.count,
          error: null,
        }));
      } catch (error) {
        console.error('Failed to fetch like count:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch count',
        }));
      }
    };

    fetchCount();
  }, [postId]);

  const performLikeOperation = useCallback(async (operation: LikeOp) => {
    setState(prev => ({ ...prev, isMutating: true, error: null }));

    // Optimistic update
    const previousState = { ...state };
    setState(prev => ({
      ...prev,
      liked: operation === 'like',
      count: operation === 'like' ? prev.count + 1 : Math.max(0, prev.count - 1),
    }));

    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          op: operation,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new Error(`Rate limit exceeded. Please try again in ${retryAfter || '60'} seconds.`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Operation failed');
      }

      // Update localStorage based on operation
      if (operation === 'like') {
        addLikedPost(postId);
      } else {
        removeLikedPost(postId);
      }

      // Update state with server response
      setState(prev => ({
        ...prev,
        liked: operation === 'like',
        count: data.count,
        isMutating: false,
        error: null,
      }));

    } catch (error) {
      // Rollback optimistic update
      setState(prev => ({
        ...prev,
        ...previousState,
        isMutating: false,
        error: error instanceof Error ? error.message : 'Operation failed',
      }));
    }
  }, [postId, state]);

  const toggle = useCallback(() => {
    const currentLiked = isPostLiked(postId);
    return performLikeOperation(currentLiked ? 'unlike' : 'like');
  }, [postId, performLikeOperation]);

  const like = useCallback(() => {
    return performLikeOperation('like');
  }, [performLikeOperation]);

  const unlike = useCallback(() => {
    return performLikeOperation('unlike');
  }, [performLikeOperation]);

  return {
    ...state,
    toggle,
    like,
    unlike,
  };
}
