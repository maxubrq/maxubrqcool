import { z } from 'zod';

// Post ID validation - accept any non-empty string
export const PostIdSchema = z.string().min(1, 'Post ID is required');

// Like operation validation
export const LikeOpSchema = z.enum(['like', 'unlike'], {
  errorMap: () => ({ message: 'Operation must be either "like" or "unlike"' }),
});

// Request schemas
export const PostLikeRequestSchema = z.object({
  postId: PostIdSchema,
  op: LikeOpSchema,
});

export const GetLikeCountRequestSchema = z.object({
  postId: PostIdSchema,
});

// Response schemas
export const PostLikeResponseSchema = z.object({
  success: z.boolean(),
  count: z.number().int().min(0),
  error: z.string().optional(),
});

export const GetLikeCountResponseSchema = z.object({
  count: z.number().int().min(0),
});

// Type exports
export type PostId = z.infer<typeof PostIdSchema>;
export type LikeOp = z.infer<typeof LikeOpSchema>;
export type PostLikeRequest = z.infer<typeof PostLikeRequestSchema>;
export type GetLikeCountRequest = z.infer<typeof GetLikeCountRequestSchema>;
export type PostLikeResponse = z.infer<typeof PostLikeResponseSchema>;
export type GetLikeCountResponse = z.infer<typeof GetLikeCountResponseSchema>;

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
