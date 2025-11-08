import { vi } from 'vitest';

// Mock Next.js
vi.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    constructor(public url: string, public init?: RequestInit) {}
    headers = new Map();
    ip = '127.0.0.1';
  },
  NextResponse: {
    json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), init),
  },
}));

// Mock environment variables
