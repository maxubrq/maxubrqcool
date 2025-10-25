import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the API routes
vi.mock('@/app/api/posts/like/route', () => ({
  POST: vi.fn(),
}));

vi.mock('@/app/api/posts/like/count/route', () => ({
  GET: vi.fn(),
}));

describe('API Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/posts/like', () => {
    it('should handle like operation successfully', async () => {
      const { POST } = await import('@/app/api/posts/like/route');
      const mockRequest = new NextRequest('http://localhost:3000/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          postId: 'test-post-id',
          op: 'like',
        }),
      });

      const mockResponse = {
        success: true,
        count: 5,
      };

      vi.mocked(POST).mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });

    it('should handle rate limit exceeded', async () => {
      const { POST } = await import('@/app/api/posts/like/route');
      const mockRequest = new NextRequest('http://localhost:3000/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          postId: 'test-post-id',
          op: 'like',
        }),
      });

      const mockResponse = {
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
      };

      vi.mocked(POST).mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        })
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data).toEqual(mockResponse);
      expect(response.headers.get('Retry-After')).toBe('60');
    });

    it('should handle validation errors', async () => {
      const { POST } = await import('@/app/api/posts/like/route');
      const mockRequest = new NextRequest('http://localhost:3000/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          postId: 'invalid-id',
          op: 'invalid-op',
        }),
      });

      const mockResponse = {
        success: false,
        error: 'Invalid request body',
        code: 'VALIDATION_ERROR',
      };

      vi.mocked(POST).mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data).toEqual(mockResponse);
    });
  });

  describe('GET /api/posts/like/count', () => {
    it('should return like count successfully', async () => {
      const { GET } = await import('@/app/api/posts/like/count/route');
      const mockRequest = new NextRequest('http://localhost:3000/api/posts/like/count?postId=test-post-id', {
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const mockResponse = {
        count: 10,
      };

      vi.mocked(GET).mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          },
        })
      );

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
      expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=10, stale-while-revalidate=30');
    });

    it('should handle missing postId parameter', async () => {
      const { GET } = await import('@/app/api/posts/like/count/route');
      const mockRequest = new NextRequest('http://localhost:3000/api/posts/like/count', {
        method: 'GET',
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const mockResponse = {
        success: false,
        error: 'Missing postId parameter',
        code: 'MISSING_PARAMETER',
      };

      vi.mocked(GET).mockResolvedValue(
        new Response(JSON.stringify(mockResponse), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual(mockResponse);
    });
  });
});
