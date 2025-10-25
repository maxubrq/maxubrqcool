# Operational Runbook - Anonymous Post Like System

## Overview

This runbook provides operational procedures for the anonymous post like system, including deployment, monitoring, troubleshooting, and maintenance.

## Architecture

```
Client (localStorage) → Next.js API → Drizzle → Supabase Postgres
                     ↓
                 Rate Limiting
                     ↓
                 Observability
```

## Prerequisites

### Required Services
- **Supabase**: Database and authentication
- **Next.js**: Application framework
- **Drizzle**: Database ORM
- **Vercel/Deployment**: Hosting platform

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
CACHE_TTL_SECONDS=10
```

## Deployment

### 1. Database Setup
```bash
# Apply migrations
npm run db:migrate

# Verify RLS is enabled
psql $DATABASE_URL -c "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename LIKE 'eng_%';"

# Verify functions exist
psql $DATABASE_URL -c "SELECT proname FROM pg_proc WHERE proname LIKE '%post_like%';"
```

### 2. Application Deployment
```bash
# Build application
npm run build

# Deploy to production
npm run deploy

# Verify deployment
curl -f https://your-domain.com/api/posts/like/count?postId=test-post-id
```

### 3. Post-Deployment Verification
```bash
# Test like functionality
curl -X POST https://your-domain.com/api/posts/like \
  -H "Content-Type: application/json" \
  -d '{"postId":"test-post-id","op":"like"}'

# Test rate limiting
for i in {1..65}; do
  curl -X POST https://your-domain.com/api/posts/like \
    -H "Content-Type: application/json" \
    -d '{"postId":"test-post-id","op":"like"}'
done
```

## Monitoring

### Key Metrics
- **Like attempts**: Total like/unlike requests
- **Success rate**: Percentage of successful operations
- **Rate limit hits**: Number of rate limit violations
- **Database errors**: Database operation failures
- **Response times**: API response times

### Health Checks
```bash
# API health
curl -f https://your-domain.com/api/posts/like/count?postId=health-check

# Database health
psql $DATABASE_URL -c "SELECT COUNT(*) FROM eng_post_like_counters;"

# Rate limit health
curl -I https://your-domain.com/api/posts/like/count?postId=test
```

### Alerts
- **High error rate**: >5% error rate for 5 minutes
- **Rate limit abuse**: >100 rate limit hits per minute
- **Database errors**: >10 database errors per minute
- **Response time**: >2 second response time

## Troubleshooting

### Common Issues

#### 1. Rate Limit Errors (429)
**Symptoms**: Users see "Rate limit exceeded" errors
**Causes**: 
- Legitimate high traffic
- Bot/abuse attempts
- Misconfigured rate limits

**Solutions**:
```bash
# Check current rate limit config
grep -r "RATE_LIMIT" .env*

# Adjust rate limits if needed
export RATE_LIMIT_MAX_REQUESTS=120

# Monitor rate limit hits
grep "rate_limited" logs/app.log | tail -20
```

#### 2. Database Connection Errors
**Symptoms**: 500 errors, database timeouts
**Causes**:
- Database overload
- Connection pool exhaustion
- Network issues

**Solutions**:
```bash
# Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Check connection pool
grep "connection" logs/app.log | tail -20

# Restart database if needed
# (Supabase handles this automatically)
```

#### 3. Count Inconsistencies
**Symptoms**: Like counts don't match expected values
**Causes**:
- Race conditions
- Failed transactions
- Manual database changes

**Solutions**:
```bash
# Check for negative counts
psql $DATABASE_URL -c "SELECT * FROM eng_post_like_counters WHERE like_count < 0;"

# Fix negative counts
psql $DATABASE_URL -c "UPDATE eng_post_like_counters SET like_count = 0 WHERE like_count < 0;"

# Verify counts
psql $DATABASE_URL -c "SELECT post_id, like_count FROM eng_post_like_counters ORDER BY like_count DESC LIMIT 10;"
```

### Debugging Commands

#### Check System Status
```bash
# API status
curl -s https://your-domain.com/api/posts/like/count?postId=test | jq

# Database status
psql $DATABASE_URL -c "SELECT COUNT(*) as total_posts, SUM(like_count) as total_likes FROM eng_post_like_counters;"

# Rate limit status
grep "rate_limited" logs/app.log | wc -l
```

#### Performance Analysis
```bash
# Response times
grep "duration_ms" logs/app.log | jq '.duration_ms' | sort -n | tail -10

# Database performance
psql $DATABASE_URL -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;"
```

## Maintenance

### Daily Tasks
- [ ] Check error rates
- [ ] Monitor rate limit hits
- [ ] Verify database health
- [ ] Review logs for anomalies

### Weekly Tasks
- [ ] Analyze usage patterns
- [ ] Review rate limit effectiveness
- [ ] Check for abuse patterns
- [ ] Update dependencies

### Monthly Tasks
- [ ] Security review
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] Backup verification

### Database Maintenance
```bash
# Clean up old data (if using events table)
psql $DATABASE_URL -c "DELETE FROM eng_post_like_events_daily WHERE day < NOW() - INTERVAL '90 days';"

# Update statistics
psql $DATABASE_URL -c "ANALYZE eng_post_like_counters;"

# Check for orphaned records
psql $DATABASE_URL -c "SELECT * FROM eng_post_like_counters WHERE post_id NOT IN (SELECT id FROM posts);"
```

## Scaling

### Horizontal Scaling
- **API servers**: Scale Next.js API routes
- **Database**: Use Supabase's built-in scaling
- **CDN**: Use Vercel's edge network

### Vertical Scaling
- **Database**: Upgrade Supabase plan
- **API**: Increase Vercel limits
- **Caching**: Implement Redis for rate limiting

### Performance Optimization
```bash
# Add database indexes
psql $DATABASE_URL -c "CREATE INDEX CONCURRENTLY idx_eng_post_like_counters_updated_at ON eng_post_like_counters (updated_at);"

# Optimize queries
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM eng_post_like_counters WHERE post_id = 'test-post-id';"
```

## Security

### Regular Security Checks
- [ ] Review access logs
- [ ] Check for abuse patterns
- [ ] Verify RLS policies
- [ ] Update dependencies

### Incident Response
1. **Identify**: Determine scope of issue
2. **Contain**: Stop the attack/abuse
3. **Eradicate**: Remove the threat
4. **Recover**: Restore normal operations
5. **Learn**: Update procedures

### Backup and Recovery
```bash
# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql $DATABASE_URL < backup_20240101_120000.sql

# Verify backup
psql $DATABASE_URL -c "SELECT COUNT(*) FROM eng_post_like_counters;"
```

## Support

### Escalation Path
1. **Level 1**: Application logs and basic troubleshooting
2. **Level 2**: Database and infrastructure issues
3. **Level 3**: Security and compliance issues

### Contact Information
- **Development Team**: dev@company.com
- **Infrastructure Team**: infra@company.com
- **Security Team**: security@company.com

### Documentation
- **API Documentation**: `/docs/api`
- **Database Schema**: `/docs/database`
- **Security Policies**: `/docs/security`
