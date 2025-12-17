# LifeUndo API Documentation

## Base URL
- **Production:** `https://www.getlifeundo.com`
- **Demo:** `https://lifeundo.ru`

## Authentication
Все API запросы требуют API ключ в заголовке:
```
Authorization: Bearer YOUR_API_KEY
```

## Rate Limits
- **PRO Plan:** 1000 запросов/месяц
- **VIP Plan:** Безлимитно
- **Per Minute:** 100 запросов/минуту

## Endpoints

### System

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-27T00:00:00.000Z"
}
```

### Payments

#### Create Payment
```http
POST /api/fk/create
Content-Type: application/json

{
  "email": "user@example.com",
  "plan": "pro_monthly",
  "amount": 99.00,
  "currency": "RUB",
  "locale": "ru"
}
```

**Response:**
```json
{
  "url": "https://pay.freekassa.net/?m=123&oa=99.00&o=ORDER123&s=SIGNATURE",
  "order_id": "ORDER123"
}
```

#### FreeKassa Webhook
```http
GET /api/fk/notify?MERCHANT_ORDER_ID=123&AMOUNT=99.00&SIGN=signature&intid=txn123
```
**Response:** `YES` | `DUPLICATE` | `ALREADY_PAID`

### Licenses

#### Validate License
```http
POST /api/license/validate
Content-Type: application/json

{
  "license_key": "LICENSE_KEY_HERE",
  "product_id": "lifeundo_pro",
  "hardware_id": "HW123456789"
}
```

**Response:**
```json
{
  "valid": true,
  "license_type": "pro_monthly",
  "expires_at": "2025-12-31T23:59:59.000Z",
  "features": ["email_pause", "analytics", "priority_support"]
}
```

#### Activate License
```http
POST /api/license/activate
Content-Type: application/json

{
  "license_key": "LICENSE_KEY_HERE",
  "hardware_id": "HW123456789",
  "device_name": "My Computer"
}
```

**Response:**
```json
{
  "activated": true,
  "activation_id": "ACT123456789",
  "expires_at": "2025-12-31T23:59:59.000Z"
}
```

### Email

#### Pause Email Sending
```http
POST /api/email/pause
Content-Type: application/json

{
  "duration_minutes": 60,
  "reason": "maintenance"
}
```

**Response:**
```json
{
  "paused": true,
  "until": "2025-09-27T01:00:00.000Z"
}
```

#### Resume Email Sending
```http
POST /api/email/resume
```

**Response:**
```json
{
  "resumed": true,
  "resumed_at": "2025-09-27T00:30:00.000Z"
}
```

#### Email Status
```http
GET /api/email/status
```

**Response:**
```json
{
  "status": "active",
  "queue_size": 42,
  "processed_today": 156,
  "paused_until": null
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-09-27T00:00:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing API key",
  "code": "UNAUTHORIZED",
  "timestamp": "2025-09-27T00:00:00.000Z"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "timestamp": "2025-09-27T00:00:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "timestamp": "2025-09-27T00:00:00.000Z"
}
```

## SDK

### JavaScript
```bash
npm install @lifeundo/sdk
```

```javascript
import { LifeUndoClient } from '@lifeundo/sdk';

const client = new LifeUndoClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://www.getlifeundo.com'
});

// Validate license
const result = await client.license.validate({
  licenseKey: 'LICENSE_KEY',
  productId: 'lifeundo_pro'
});
```

### Python
```bash
pip install lifeundo-sdk
```

```python
from lifeundo import LifeUndoClient

client = LifeUndoClient(
    api_key='YOUR_API_KEY',
    base_url='https://www.getlifeundo.com'
)

# Validate license
result = client.license.validate(
    license_key='LICENSE_KEY',
    product_id='lifeundo_pro'
)
```

## Support

- **Email:** support@lifeundo.ru
- **Website:** https://www.getlifeundo.com/contacts
- **Documentation:** https://www.getlifeundo.com/docs
- **Interactive API:** https://www.getlifeundo.com/api-docs
