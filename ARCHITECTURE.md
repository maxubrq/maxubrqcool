# Anonymous Post Like System - Architecture Overview

## System Design

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Next.js API   │    │   Drizzle ORM  │    │   Supabase      │
│   (Browser)     │    │   Routes        │    │   + Service     │    │   Postgres      │
│                 │    │                 │    │   Role          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ localStorage    │    │ Rate Limiting   │    │ DAO Functions   │    │ RLS Policies    │
│ (Dedupe UX)     │    │ (Abuse Control) │    │ (Business Logic) │    │ (Security)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Client Request**: User clicks like button
2. **localStorage Check**: Check if post is already liked
3. **API Call**: Send like/unlike request to server
4. **Rate Limiting**: Check per-IP rate limits
5. **Validation**: Validate request with Zod schemas
6. **Database Operation**: Execute like/unlike via service role
7. **Response**: Return updated count to client
8. **UI Update**: Update UI with optimistic updates

## Components

### 1. Database Layer

#### Tables
- **`eng_post_like_counters`**: Authoritative like counts
- **`eng_post_like_events_daily`**: Optional operational metrics

#### Functions
- **`increment_post_like(post_id)`**: Atomic increment
- **`decrement_post_like(post_id)`**: Atomic decrement (floor at 0)
- **`get_post_like_count(post_id)`**: Get current count

#### Security
- **RLS enabled**: Public read, service role write only
- **No user data**: Only counts, no individual records
- **Atomic operations**: Prevents race conditions

### 2. API Layer

#### Endpoints
- **POST `/api/posts/like`**: Like/unlike operations
- **GET `/api/posts/like/count`**: Get like counts

#### Features
- **Rate limiting**: 60 requests/minute per IP
- **Input validation**: Zod schemas
- **Error handling**: Structured error responses
- **Caching**: GET endpoints cached for 10 seconds

### 3. Client Layer

#### Hook: `useAnonPostLike`
- **localStorage integration**: Client-side dedupe
- **Optimistic updates**: Immediate UI feedback
- **Error handling**: Rollback on failures
- **SSR support**: Safe server-side rendering

#### Component: `PostLikeButton`
- **Accessible**: ARIA attributes, keyboard support
- **Customizable**: Variants, sizes, styling
- **SSR-safe**: Works without JavaScript
- **Error states**: Shows errors to users

### 4. Observability

#### Logging
- **Structured logs**: JSON format
- **IP hashing**: No PII in logs
- **Operation tracking**: Like attempts, successes, failures
- **Performance metrics**: Response times, durations

#### Metrics
- **Business metrics**: Like attempts, success rates
- **Technical metrics**: Error rates, response times
- **Abuse metrics**: Rate limit hits, suspicious patterns

## Security Model

### Privacy-First Design
- **No PII collection**: No user identifiers stored
- **Anonymous by design**: Users are completely anonymous
- **No cross-site tracking**: Each site maintains its own state
- **Data minimization**: Only like counts, no behavioral data

### Security Controls
- **RLS policies**: Database-level access control
- **Service role only**: Writes only through service role
- **Rate limiting**: Per-IP abuse prevention
- **Input validation**: All inputs validated and sanitized

### Abuse Prevention
- **Server authority**: Server maintains authoritative counts
- **Client dedupe only**: localStorage is for UX, not security
- **Floor at zero**: Counts cannot go negative
- **Idempotent operations**: Multiple requests don't cause issues

## Performance Characteristics

### Scalability
- **Horizontal scaling**: Stateless API servers
- **Database scaling**: Supabase handles database scaling
- **Edge caching**: GET endpoints cached at edge
- **Rate limiting**: Prevents abuse and DoS

### Performance
- **O(1) reads**: Direct count lookups
- **Atomic writes**: Database functions prevent race conditions
- **Edge optimization**: API routes run at edge
- **Caching**: Counts cached for 10 seconds

### Reliability
- **Idempotent operations**: Safe to retry
- **Optimistic updates**: Immediate UI feedback
- **Error recovery**: Automatic rollback on failures
- **Graceful degradation**: Works without JavaScript

## Data Model

### Core Tables

```sql
-- Like counters (authoritative)
CREATE TABLE eng_post_like_counters (
    post_id uuid PRIMARY KEY,
    like_count bigint NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Daily events (optional operational data)
CREATE TABLE eng_post_like_events_daily (
    post_id uuid NOT NULL,
    day date NOT NULL,
    count bigint NOT NULL DEFAULT 0,
    PRIMARY KEY (post_id, day)
);
```

### Data Flow

1. **Like Request**: Client sends like request
2. **Rate Check**: Server checks rate limits
3. **Validation**: Request validated with Zod
4. **Database**: Atomic increment via service role
5. **Response**: Updated count returned
6. **Client**: UI updated with new count

## Error Handling

### Client-Side
- **Optimistic updates**: Immediate UI feedback
- **Error rollback**: Revert on failures
- **User feedback**: Clear error messages
- **Retry logic**: Automatic retry on network errors

### Server-Side
- **Input validation**: Zod schema validation
- **Rate limiting**: 429 responses with retry headers
- **Database errors**: 500 responses with error details
- **Structured logging**: All errors logged with context

## Monitoring & Observability

### Metrics
- **Business metrics**: Like attempts, success rates
- **Technical metrics**: Response times, error rates
- **Abuse metrics**: Rate limit hits, suspicious patterns
- **Performance metrics**: Database query times, cache hit rates

### Logging
- **Structured logs**: JSON format for easy parsing
- **IP hashing**: No PII in logs
- **Operation context**: Post ID, operation type, duration
- **Error details**: Stack traces, error codes

### Alerting
- **High error rates**: >5% error rate for 5 minutes
- **Rate limit abuse**: >100 rate limit hits per minute
- **Database errors**: >10 database errors per minute
- **Response time**: >2 second response time

## Deployment Architecture

### Development
- **Local database**: Supabase local development
- **Hot reloading**: Next.js development server
- **Test database**: Separate test environment
- **Mock services**: Rate limiting and external services

### Production
- **Edge deployment**: Vercel edge functions
- **Database**: Supabase managed Postgres
- **CDN**: Vercel edge network
- **Monitoring**: Built-in observability

### Scaling
- **Horizontal scaling**: Multiple API servers
- **Database scaling**: Supabase handles database scaling
- **Edge caching**: Counts cached at edge
- **Rate limiting**: Distributed rate limiting

## Testing Strategy

### Unit Tests
- **DAO functions**: Database operations
- **Validation**: Zod schema validation
- **Utilities**: Helper functions
- **Hooks**: React hook logic

### Integration Tests
- **API endpoints**: Full request/response cycle
- **Database operations**: End-to-end database operations
- **Rate limiting**: Rate limit behavior
- **Error handling**: Error scenarios

### E2E Tests
- **User flows**: Complete like/unlike flows
- **Error scenarios**: Network errors, rate limits
- **localStorage**: Client-side state management
- **SSR**: Server-side rendering behavior

## Maintenance

### Daily
- **Error monitoring**: Check error rates
- **Performance**: Monitor response times
- **Abuse detection**: Check for abuse patterns
- **Logs**: Review logs for anomalies

### Weekly
- **Usage analysis**: Analyze usage patterns
- **Performance optimization**: Identify bottlenecks
- **Security review**: Check for security issues
- **Dependency updates**: Update dependencies

### Monthly
- **Capacity planning**: Plan for growth
- **Security audit**: Comprehensive security review
- **Performance review**: Optimize performance
- **Documentation**: Update documentation

## Future Enhancements

### Potential Features
- **Like reactions**: Different types of reactions
- **Like analytics**: Aggregate analytics
- **Like notifications**: Real-time updates
- **Like moderation**: Content moderation

### Technical Improvements
- **Redis caching**: Distributed caching
- **WebSocket updates**: Real-time updates
- **GraphQL API**: More flexible API
- **Microservices**: Service decomposition

### Scalability Improvements
- **Read replicas**: Database read scaling
- **Sharding**: Database sharding
- **CDN optimization**: Better caching
- **Edge computing**: Edge function optimization
