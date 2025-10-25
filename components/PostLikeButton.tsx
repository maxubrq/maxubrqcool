'use client';

import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useAnonPostLike } from '@/hooks/use-anon-post-like';
import { PostId } from '@/lib/validations/post-like';
import { cn } from '@/lib/utils';

interface PostLikeButtonProps {
  postId: PostId;
  variant?: 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  initialCount?: number;
  className?: string;
  showCount?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: {
    button: 'h-8 px-2 text-sm',
    icon: 'h-3 w-3',
    text: 'text-sm',
  },
  md: {
    button: 'h-10 px-3 text-base',
    icon: 'h-4 w-4',
    text: 'text-base',
  },
  lg: {
    button: 'h-12 px-4 text-lg',
    icon: 'h-5 w-5',
    text: 'text-lg',
  },
};

export function PostLikeButton({
  postId,
  variant = 'icon',
  size = 'md',
  initialCount,
  className,
  showCount = true,
  disabled = false,
}: PostLikeButtonProps) {
  const { liked, count, toggle, isMutating, error } = useAnonPostLike(postId, initialCount);

  const handleClick = async () => {
    if (disabled || isMutating) return;
    await toggle();
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || isMutating}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeConfig.button,
          className,
          {
            'text-red-500 hover:text-red-600': liked,
            'text-gray-500 hover:text-gray-600': !liked,
          }
        )}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this post' : 'Like this post'}
        title={error || (liked ? 'Unlike this post' : 'Like this post')}
      >
        {isMutating ? (
          <Loader2 className={cn(sizeConfig.icon, 'animate-spin')} />
        ) : (
          <Heart 
            className={cn(
              sizeConfig.icon,
              liked && 'fill-current'
            )} 
          />
        )}
        
        {variant === 'text' && (
          <span className={sizeConfig.text}>
            {liked ? 'Unlike' : 'Like'}
          </span>
        )}
      </button>

      {showCount && (
        <span 
          className={cn(
            'text-gray-600 dark:text-gray-400',
            sizeConfig.text,
            error && 'text-red-500'
          )}
          title={error || `${count} likes`}
        >
          {count}
        </span>
      )}

      {error && (
        <span 
          className="text-red-500 text-xs"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
}

// SSR-safe version that doesn't use localStorage
export function PostLikeButtonSSR({
  postId,
  variant = 'icon',
  size = 'md',
  initialCount,
  className,
  showCount = true,
  disabled = false,
}: Omit<PostLikeButtonProps, 'initialCount'> & { initialCount?: number }) {
  return (
    <PostLikeButton
      postId={postId}
      variant={variant}
      size={size}
      initialCount={initialCount}
      className={className}
      showCount={showCount}
      disabled={disabled}
    />
  );
}
