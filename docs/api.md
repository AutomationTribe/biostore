# BioStore API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via Supabase session cookie. Include session cookie in requests.

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional context */ }
  }
}
```

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| USER_ALREADY_EXISTS | 409 | Email or username already registered |
| USER_NOT_FOUND | 404 | User account not found |
| SESSION_EXPIRED | 401 | Session has expired |
| VALIDATION_ERROR | 400 | Input validation failed |
| PAYMENT_FAILED | 500 | Payment processing failed |
| PRODUCT_NOT_FOUND | 404 | Product not found |
| PROFILE_NOT_FOUND | 404 | User profile not found |
| INTERNAL_SERVER_ERROR | 500 | Server error |

## Authentication Endpoints

### POST /auth/login
Authenticate user and get session token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "session": "access_token_here"
  }
}
```

### POST /auth/signup
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "fullName": "John Doe",
  "creatorCategory": "Music"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

Automatically triggers onboarding pipeline. Onboarding result is processed asynchronously.

## Profile Endpoints

### GET /profile
Get authenticated user's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "uuid",
      "bio": "Digital creator",
      "theme": "professional",
      "avatar": "https://...",
      "coverImage": "https://..."
    }
  }
}
```

### PUT /profile
Update user profile.

**Request:**
```json
{
  "bio": "Updated bio",
  "theme": "vibrant",
  "avatar": "https://...",
  "coverImage": "https://..."
}
```

**Response:** Returns updated profile object

## Links Endpoints

### GET /links
Get all links for authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": "uuid",
        "userId": "uuid",
        "title": "My Website",
        "url": "https://example.com",
        "icon": "globe",
        "order": 0,
        "active": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /links
Create new link.

**Request:**
```json
{
  "title": "My Website",
  "url": "https://example.com",
  "icon": "globe",
  "order": 0,
  "active": true
}
```

**Response:** Returns created link object

### PUT /links/:linkId
Update link.

**Request:** Same as POST

**Response:** Returns updated link object

### DELETE /links/:linkId
Delete link.

**Response:**
```json
{
  "success": true
}
```

### POST /links/reorder
Reorder user's links.

**Request:**
```json
{
  "linkIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "success": true
}
```

## Products Endpoints

### GET /products
Get all products for authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "E-book",
        "description": "Product description",
        "price": 4999,
        "currency": "NGN",
        "downloadUrl": "https://...",
        "thumbnail": "https://...",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /products
Create new product.

**Request:**
```json
{
  "name": "E-book",
  "description": "Product description",
  "price": 4999,
  "currency": "NGN",
  "downloadUrl": "https://...",
  "thumbnail": "https://..."
}
```

**Response:** Returns created product object

### GET /products/:productId
Get product details.

**Response:** Returns single product object

### PUT /products/:productId
Update product.

**Response:** Returns updated product object

### DELETE /products/:productId
Delete product.

**Response:**
```json
{
  "success": true
}
```

## Payment Endpoints

### POST /payments/checkout
Create checkout session (Stripe or Paystack).

**Request:**
```json
{
  "productId": "uuid",
  "amount": 4999,
  "currency": "NGN",
  "buyerEmail": "buyer@example.com",
  "provider": "paystack",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "checkout_session_id",
      "provider": "paystack",
      "redirectUrl": "https://paystack.co/...",
      "publishableKey": "pk_..."
    }
  }
}
```

### POST /payments/webhooks
Handle payment webhooks.

**Headers:**
- Stripe: `stripe-signature`
- Paystack: `x-paystack-signature`, `x-paystack-provider: paystack`

**Response:**
```json
{
  "received": true
}
```

## Analytics Endpoints

### GET /analytics
Get dashboard statistics for authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "profileViews": 1234,
      "totalClicks": 456,
      "revenue": {
        "totalRevenue": 50000,
        "totalSales": 10,
        "averageOrderValue": 5000,
        "topProducts": []
      },
      "topLinks": [
        {
          "linkId": "uuid",
          "title": "Link 1",
          "clicks": 100
        }
      ]
    }
  }
}
```

### POST /analytics
Track page view or link click.

**Request (Page View):**
```json
{
  "type": "pageview",
  "path": "/username",
  "referrer": "https://twitter.com",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

**Request (Link Click):**
```json
{
  "type": "click",
  "linkId": "uuid",
  "referrer": "https://twitter.com",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

**Response:**
```json
{
  "success": true
}
```

## Agent Endpoints

### POST /agents/onboarding
Manually trigger onboarding pipeline for a user.

**Request:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "onboarding": {
      "userId": "uuid",
      "username": "johndoe",
      "generatedBio": "Creative bio text...",
      "selectedTheme": {
        "id": "professional",
        "name": "Professional",
        "colors": {
          "primary": "#2c3e50",
          "secondary": "#3498db",
          "accent": "#ecf0f1"
        }
      },
      "suggestedLinks": [
        {
          "title": "Instagram",
          "url": "https://instagram.com",
          "icon": "instagram",
          "category": "social"
        }
      ],
      "completedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Rate Limiting

No explicit rate limiting implemented. Add based on usage patterns:
```typescript
// Example: 100 requests per minute per user
const rateLimit = 100;
const window = 60000; // 1 minute
```

## Pagination

Future endpoints will use pagination:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "hasMore": true
  }
}
```

## Batch Operations

Support bulk operations where applicable:
```json
// Bulk link reorder
POST /links/batch
{
  "operations": [
    { "id": "uuid1", "order": 0 },
    { "id": "uuid2", "order": 1 }
  ]
}
```

## Examples

### Complete signup and setup flow:
```bash
# 1. Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "username": "johndoe",
    "fullName": "John Doe",
    "creatorCategory": "Music"
  }'

# 2. Check onboarding status (wait a moment for pipeline)
curl -X POST http://localhost:3000/api/agents/onboarding \
  -H "Content-Type: application/json" \
  -d '{"userId": "uuid-from-signup"}'

# 3. Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "name": "My Digital Product",
    "description": "Amazing product",
    "price": 5000,
    "currency": "NGN",
    "downloadUrl": "https://..."
  }'

# 4. Create checkout for product
curl -X POST http://localhost:3000/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "productId": "uuid-from-product",
    "amount": 5000,
    "currency": "NGN",
    "buyerEmail": "buyer@example.com",
    "provider": "paystack",
    "successUrl": "https://example.com/success",
    "cancelUrl": "https://example.com/cancel"
  }'
```
