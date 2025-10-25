# Security & Privacy - Anonymous Post Like System

## Privacy-First Design

### No PII Collection
- **No user identifiers stored**: The system never persists user IDs, emails, or any personally identifiable information
- **No tracking across sites**: Each site maintains its own localStorage, no cross-site tracking
- **Anonymous by design**: Users are completely anonymous to the server

### Data Minimization
- **Counts only**: Only like counts are stored, no individual like records
- **No user profiles**: No user accounts or profiles are created
- **No behavioral tracking**: No analytics on individual user behavior

## Security Controls

### Row Level Security (RLS)
- **Public read access**: Anyone can read like counts
- **Service role writes only**: Only the server with service role can modify data
- **No user writes**: Anonymous users cannot directly write to the database

### Rate Limiting
- **Per-IP limits**: 60 requests per minute per IP address
- **Sliding window**: Rate limits reset every minute
- **No user identification**: Rate limiting is based on IP only, no user tracking

### Input Validation
- **Zod schemas**: All inputs validated with strict TypeScript schemas
- **UUID validation**: Post IDs must be valid UUIDs
- **Operation validation**: Only 'like' and 'unlike' operations allowed

### Abuse Prevention
- **Server authority**: Server maintains authoritative counts
- **Client dedupe only**: localStorage is for UX only, not security
- **Floor at zero**: Counts cannot go negative
- **Idempotent operations**: Multiple requests don't cause issues

## Data Protection

### Database Security
- **RLS enabled**: Row Level Security prevents unauthorized access
- **Service role only**: Writes only through service role, not user roles
- **No direct user access**: Users cannot directly query the database

### Network Security
- **HTTPS required**: All API calls must be over HTTPS
- **CORS configured**: Proper CORS headers for security
- **Rate limiting**: Prevents abuse and DoS attacks

### Client Security
- **localStorage only**: No cookies or other persistent storage
- **No sensitive data**: Only post IDs stored in localStorage
- **Same-origin policy**: localStorage is site-specific

## Monitoring & Observability

### Logging
- **IP hashing**: IP addresses are hashed for logging, not stored
- **No PII in logs**: No personally identifiable information in logs
- **Structured logging**: All logs are structured for analysis

### Metrics
- **Aggregate only**: Metrics are aggregated, no individual tracking
- **Performance monitoring**: Track response times and error rates
- **Abuse detection**: Monitor for unusual patterns

## Compliance

### GDPR Compliance
- **No personal data**: No personal data is collected or processed
- **No consent required**: No user consent needed as no personal data
- **Right to deletion**: No personal data to delete

### CCPA Compliance
- **No personal information**: No personal information is collected
- **No opt-out needed**: No personal information to opt out of

## Threat Model

### Potential Threats
1. **Rate limit bypass**: Mitigated by server-side rate limiting
2. **Count manipulation**: Mitigated by service role only writes
3. **DoS attacks**: Mitigated by rate limiting and caching
4. **Data exfiltration**: Mitigated by RLS and no user data

### Mitigation Strategies
- **Defense in depth**: Multiple layers of security
- **Principle of least privilege**: Minimal permissions required
- **Fail secure**: System fails to secure state
- **Regular audits**: Regular security reviews

## Best Practices

### Development
- **Type safety**: Use TypeScript for all code
- **Input validation**: Validate all inputs
- **Error handling**: Proper error handling without information leakage
- **Testing**: Comprehensive security testing

### Deployment
- **Environment variables**: Use environment variables for secrets
- **Regular updates**: Keep dependencies updated
- **Monitoring**: Monitor for security issues
- **Backups**: Regular backups of data

### Operations
- **Access control**: Limit access to production systems
- **Audit logs**: Maintain audit logs
- **Incident response**: Have incident response procedures
- **Regular reviews**: Regular security reviews
