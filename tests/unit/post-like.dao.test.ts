import { describe, it, expect, beforeEach, vi } from 'vitest';
import { incrementPostLike, decrementPostLike, getPostLikeCount } from '@/lib/post-like.dao';

// Mock the database
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  },
}));

describe('PostLikeDAO', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('incrementPostLike', () => {
    it('should increment like count successfully', async () => {
      const mockDb = await import('@/db');
      const mockResult = [{ count: 5 }];
      
      vi.mocked(mockDb.db.insert().values().onConflictDoUpdate().returning).mockResolvedValue(mockResult);

      const result = await incrementPostLike('test-post-id');

      expect(result).toEqual({
        success: true,
        count: 5,
      });
    });

    it('should handle database errors', async () => {
      const mockDb = await import('@/db');
      const mockError = new Error('Database connection failed');
      
      vi.mocked(mockDb.db.insert().values().onConflictDoUpdate().returning).mockRejectedValue(mockError);

      const result = await incrementPostLike('test-post-id');

      expect(result).toEqual({
        success: false,
        count: 0,
        error: 'Database connection failed',
      });
    });
  });

  describe('decrementPostLike', () => {
    it('should decrement like count successfully', async () => {
      const mockDb = await import('@/db');
      const mockResult = [{ count: 3 }];
      
      vi.mocked(mockDb.db.insert().values().onConflictDoNothing).mockResolvedValue(undefined);
      vi.mocked(mockDb.db.update().set().where().returning).mockResolvedValue(mockResult);

      const result = await decrementPostLike('test-post-id');

      expect(result).toEqual({
        success: true,
        count: 3,
      });
    });

    it('should floor count at 0', async () => {
      const mockDb = await import('@/db');
      const mockResult = [{ count: 0 }];
      
      vi.mocked(mockDb.db.insert().values().onConflictDoNothing).mockResolvedValue(undefined);
      vi.mocked(mockDb.db.update().set().where().returning).mockResolvedValue(mockResult);

      const result = await decrementPostLike('test-post-id');

      expect(result).toEqual({
        success: true,
        count: 0,
      });
    });
  });

  describe('getPostLikeCount', () => {
    it('should return like count successfully', async () => {
      const mockDb = await import('@/db');
      const mockResult = [{ count: 10 }];
      
      vi.mocked(mockDb.db.select().from().where().limit).mockResolvedValue(mockResult);

      const result = await getPostLikeCount('test-post-id');

      expect(result).toEqual({
        success: true,
        count: 10,
      });
    });

    it('should return 0 for non-existent post', async () => {
      const mockDb = await import('@/db');
      
      vi.mocked(mockDb.db.select().from().where().limit).mockResolvedValue([]);

      const result = await getPostLikeCount('non-existent-post');

      expect(result).toEqual({
        success: true,
        count: 0,
      });
    });
  });
});
