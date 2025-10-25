# Anonymous Post Like System

A production-grade anonymous post like system for Next.js applications with Drizzle and Supabase.

## Features

- 🔒 **Privacy-first**: No PII collection, anonymous by design
- 🚀 **High performance**: Edge-optimized with caching
- 🛡️ **Secure**: RLS, rate limiting, input validation
- 📊 **Observable**: Structured logging and metrics
- 🧪 **Tested**: Comprehensive unit and integration tests
- 🎨 **UI ready**: React components with SSR support

## Architecture

```
Client (localStorage) → Next.js API → Drizzle → Supabase Postgres
                     ↓
                 Rate Limiting
                     ↓
                 Observability
```

## Quick Start

### 1. Install Dependencies

```bash
npm install drizzle-orm @supabase/supabase-js zod lucide-react
npm install -D drizzle-kit vitest @playwright/test
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### 3. Database Setup

```bash
# Apply migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 4. Usage

```tsx
import { PostLikeButton } from '@/components/PostLikeButton';

function PostPage({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <PostLikeButton 
        postId={post.id} 
        initialCount={post.likeCount}
        variant="text"
        size="md"
      />
    </div>
  );
}
```

## API Endpoints

### POST /api/posts/like
Like or unlike a post.

**Request:**
```json
{
  "postId": "uuid",
  "op": "like" | "unlike"
}
```

**Response:**
```json
{
  "success": true,
  "count": 42
}
```

### GET /api/posts/like/count
Get like count for a post.

**Query Parameters:**
- `postId`: Post UUID

**Response:**
```json
{
  "count": 42
}
```

## Components

### PostLikeButton

```tsx
<PostLikeButton
  postId="post-uuid"
  variant="icon" | "text"
  size="sm" | "md" | "lg"
  initialCount={0}
  showCount={true}
  disabled={false}
/>
```

### SSR-Safe Version

```tsx
<PostLikeButtonSSR
  postId="post-uuid"
  initialCount={0}
  // ... other props
/>
```

## Hooks

### useAnonPostLike

```tsx
import { useAnonPostLike } from '@/hooks/use-anon-post-like';

function MyComponent({ postId }) {
  const { liked, count, toggle, isMutating, error } = useAnonPostLike(postId);
  
  return (
    <button onClick={toggle} disabled={isMutating}>
      {liked ? 'Unlike' : 'Like'} ({count})
    </button>
  );
}
```

## Database Schema

### Tables

- `eng_post_like_counters`: Like counts per post
- `eng_post_like_events_daily`: Daily aggregation (optional)

### Functions

- `increment_post_like(post_id)`: Increment like count
- `decrement_post_like(post_id)`: Decrement like count (floor at 0)
- `get_post_like_count(post_id)`: Get current count

## Security

- **RLS enabled**: Public read, service role write only
- **Rate limiting**: 60 requests/minute per IP
- **Input validation**: Zod schemas for all inputs
- **No PII**: No user data stored or logged

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Monitoring

### Metrics
- `like_attempts`: Total like/unlike requests
- `like_success`: Successful like operations
- `unlike_success`: Successful unlike operations
- `rate_limited`: Rate limit violations
- `db_errors`: Database errors

### Logs
Structured JSON logs with:
- IP hash (not actual IP)
- Post ID
- Operation type
- Duration
- Error details

## Deployment

### Vercel
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Rate limit errors**: Check rate limit configuration
2. **Database errors**: Verify Supabase connection
3. **Count inconsistencies**: Check for race conditions

### Debug Commands

```bash
# Check database
psql $DATABASE_URL -c "SELECT * FROM eng_post_like_counters;"

# Check rate limits
grep "rate_limited" logs/app.log

# Test API
curl -X POST /api/posts/like -d '{"postId":"test","op":"like"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Security**: security@company.com
