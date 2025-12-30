# Security Setup Guide

This portfolio uses secure authentication with password hashing, JWT tokens, and Redis session management.

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Sessions stored in Redis with expiration
- **Rate Limiting**: 5 failed login attempts = 15 minute lockout
- **HTTP-Only Cookies**: Tokens stored in secure, HTTP-only cookies
- **Protected API Routes**: All write operations require authentication
- **Security Headers**: XSS protection, frame options, content type protection

## 🚀 Initial Setup

### 1. Set Environment Variables

Add these to your Vercel project settings (or `.env.local` for local development):

```bash
# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Or use NextAuth secret (if you have it)
NEXTAUTH_SECRET=your-nextauth-secret

# Redis credentials (already set if you added Upstash Redis)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Important**: Generate a strong JWT_SECRET:
```bash
# Generate a secure random string
openssl rand -base64 32
```

### 2. Initialize Admin Credentials

After setting up Redis, initialize your admin account:

**Option A: Using the API endpoint (after deployment)**
```
POST https://your-site.vercel.app/api/auth/init-admin
```

**Option B: Using the local script**
```bash
# Set environment variables
export UPSTASH_REDIS_REST_URL="your-url"
export UPSTASH_REDIS_REST_TOKEN="your-token"

# Run initialization
npm run init-admin
```

**Default credentials** (change immediately after first login):
- Email: `admin@portfolio.com`
- Password: `ChangeThisPassword123!`

### 3. Change Default Password

1. Log in with default credentials
2. Go to Admin Dashboard → Admin tab
3. Click "Change Admin Credentials"
4. Enter current password and set new credentials

## 🔒 How It Works

### Authentication Flow

1. **Login**: User submits email/password → Server hashes password and compares → JWT token generated → Token stored in HTTP-only cookie
2. **Verification**: Each request checks JWT token → Validates session in Redis → Grants access
3. **Logout**: Session deleted from Redis → Cookie cleared

### Password Security

- Passwords are hashed using bcrypt (12 salt rounds)
- Never stored in plain text
- Stored securely in Redis
- Minimum 8 characters required

### Session Security

- JWT tokens expire after 7 days
- Sessions stored in Redis with expiration
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production

### Rate Limiting

- Maximum 5 failed login attempts
- 15-minute lockout after max attempts
- IP-based tracking (uses X-Forwarded-For header)

## 🛡️ Protected Routes

The following API routes require authentication:

- `POST /api/content` - Update content
- `POST /api/projects` - Update projects
- `POST /api/auth/update-credentials` - Change admin password

Public routes (no authentication required):

- `GET /api/content` - Read content
- `GET /api/projects` - Read projects
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify authentication

## 🔧 API Endpoints

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@portfolio.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```
Sets HTTP-only cookie with JWT token.

### POST /api/auth/logout
Logout and clear session.

### GET /api/auth/verify
Verify current authentication status.

**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "email": "admin@portfolio.com"
  }
}
```

### POST /api/auth/update-credentials
Update admin email and password.

**Request:**
```json
{
  "email": "new-email@example.com",
  "currentPassword": "old-password",
  "newPassword": "new-secure-password"
}
```

## ⚠️ Security Best Practices

1. **Change Default Password**: Immediately after first login
2. **Use Strong JWT_SECRET**: Generate a random 32+ character string
3. **Enable HTTPS**: Always use HTTPS in production (Vercel does this automatically)
4. **Regular Updates**: Keep dependencies updated
5. **Monitor Logs**: Check Vercel logs for suspicious activity
6. **Backup Credentials**: Store recovery information securely

## 🐛 Troubleshooting

### "Admin credentials not configured"
- Run the initialization script or API endpoint
- Ensure Redis is properly configured

### "Session expired"
- Token expired (7 days) or session deleted
- Log in again

### "Too many failed login attempts"
- Wait 15 minutes or clear rate limit (requires Redis access)

### Login not working
- Check JWT_SECRET is set in environment variables
- Verify Redis connection
- Check browser console for errors

## 📝 Notes

- Passwords are hashed with bcrypt (12 rounds)
- Sessions expire after 7 days
- Rate limiting resets after 15 minutes
- All sensitive operations require authentication
- Security headers are automatically added to API routes

