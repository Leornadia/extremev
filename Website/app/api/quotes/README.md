# Quote Request API

API endpoints for managing quote requests from the product configurator.

## Endpoints

### POST /api/quotes

Create a new quote request.

**Authentication**: Optional (can be submitted without login)

**Rate Limiting**: 3 requests per hour per IP

**Request Body**:

```json
{
  "design": {
    "name": "My Custom Design",
    "components": [...],
    "metadata": {...}
  },
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+27 12 345 6789",
    "city": "Johannesburg",
    "state": "Gauteng",
    "postalCode": "2000",
    "notes": "Optional notes"
  },
  "includeInstallation": false
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "quoteRequest": {
    "id": "quote-id",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "pricing": {
    "components": [...],
    "subtotal": 15000,
    "shipping": {...},
    "installation": {...},
    "total": 18500
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid data or design validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### GET /api/quotes

Get quote requests for the authenticated user.

**Authentication**: Required

**Query Parameters**:

- `status` (optional): Filter by status (pending, reviewed, quoted, converted)
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):

```json
{
  "quoteRequests": [
    {
      "id": "quote-id",
      "designSnapshot": {...},
      "customerInfo": {...},
      "pricing": {...},
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### GET /api/quotes/[id]

Get a specific quote request.

**Authentication**: Required

**Response** (200 OK):

```json
{
  "quoteRequest": {
    "id": "quote-id",
    "designSnapshot": {...},
    "customerInfo": {...},
    "pricing": {...},
    "status": "pending",
    "notes": "Customer notes",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:

- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the owner of the quote
- `404 Not Found`: Quote not found

### PATCH /api/quotes/[id]

Update quote request notes.

**Authentication**: Required

**Request Body**:

```json
{
  "notes": "Updated notes"
}
```

**Response** (200 OK):

```json
{
  "quoteRequest": {
    "id": "quote-id",
    "notes": "Updated notes",
    ...
  }
}
```

## Validation

### Design Validation

Before accepting a quote request, the design is validated using the validation engine:

- All components must be connected
- Design must meet safety requirements
- No structural integrity issues
- All validation errors must be resolved

### Customer Info Validation

Required fields:

- `name`: Minimum 2 characters
- `email`: Valid email format
- `phone`: Valid phone number format
- `city`: Required
- `state`: Required
- `postalCode`: Required

Optional fields:

- `notes`: Any additional information

## Pricing Calculation

Pricing is automatically calculated based on:

1. **Component Costs**: Sum of all component prices
2. **Shipping**: Based on location and weight
3. **Installation** (optional): Based on complexity

See [Pricing Calculator README](../../lib/pricing/README.md) for details.

## Email Notifications

After successful quote submission:

1. **Business Email**: Sent to `info@extremev.co.za` with full quote details
2. **Customer Email**: Confirmation email with reference number and next steps

Emails are sent asynchronously and do not block the response.

See [Email Service README](../../lib/email/README.md) for details.

## Rate Limiting

To prevent abuse, quote requests are rate limited:

- **Window**: 1 hour
- **Limit**: 3 requests per IP address
- **Response**: 429 Too Many Requests when exceeded

## Database Schema

Quote requests are stored in the `QuoteRequest` table:

```prisma
model QuoteRequest {
  id             String   @id @default(cuid())
  userId         String?
  user           User?    @relation(fields: [userId], references: [id])
  designSnapshot Json
  customerInfo   Json
  pricing        Json
  status         String   @default("pending")
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## Status Flow

1. **pending**: Initial status after submission
2. **reviewed**: Business has reviewed the quote
3. **quoted**: Formal quote has been sent to customer
4. **converted**: Customer has accepted and placed order

## Integration

### Frontend Integration

```typescript
import { QuoteRequestModal } from '@/components/configurator';

// In your component
const [showQuoteModal, setShowQuoteModal] = useState(false);

<QuoteRequestModal
  isOpen={showQuoteModal}
  onClose={() => setShowQuoteModal(false)}
/>
```

The modal handles:

- Form validation
- Design validation
- API submission
- Success confirmation
- Error handling

## Testing

Test the API endpoints:

```bash
# Create a quote request
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "design": {...},
    "customerInfo": {...}
  }'

# Get user's quote requests (requires auth)
curl http://localhost:3000/api/quotes \
  -H "Cookie: next-auth.session-token=..."

# Get specific quote
curl http://localhost:3000/api/quotes/[id] \
  -H "Cookie: next-auth.session-token=..."
```

## Notes

- Quote requests can be submitted without authentication
- Authenticated users can view their quote history
- All prices are in South African Rand (ZAR)
- Email notifications are sent asynchronously
- Rate limiting prevents spam submissions
