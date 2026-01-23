# Admin Dashboard

The admin dashboard provides tools for managing customer quote requests and other administrative tasks.

## Setup

### 1. Configure Admin Access

Add admin email addresses to your environment variables:

```env
# .env.local
ADMIN_EMAILS="admin@extremev.co.za,owner@extremev.co.za"
NEXT_PUBLIC_ADMIN_EMAILS="admin@extremev.co.za,owner@extremev.co.za"
```

**Important**:

- `ADMIN_EMAILS` is used for server-side authentication checks
- `NEXT_PUBLIC_ADMIN_EMAILS` is optional and used for client-side menu visibility
- Separate multiple emails with commas (no spaces)

### 2. Access the Dashboard

1. Sign in with an email address listed in `ADMIN_EMAILS`
2. Click on your user menu in the header
3. Select "Admin Dashboard"
4. Or navigate directly to `/admin/quotes`

## Features

### Quote Management

- **View All Quotes**: See all customer quote requests in one place
- **Filter by Status**: Filter quotes by pending, reviewed, quoted, or converted
- **Sort Options**: Sort by date or status
- **Expand Details**: Click to see full customer information, pricing breakdown, and design details
- **Update Status**: Move quotes through the workflow stages
- **Add Notes**: Add internal notes for team collaboration

### Quote Status Workflow

1. **Pending** - New quote request from customer
2. **Reviewed** - Admin has reviewed the request
3. **Quoted** - Formal quote sent to customer
4. **Converted** - Customer has purchased

## Security

- Only users with email addresses in `ADMIN_EMAILS` can access admin routes
- Server-side authentication checks on all admin API endpoints
- Automatic redirect to sign-in page for unauthorized users

## API Endpoints

### GET /api/admin/quotes

Fetch all quote requests (admin only)

**Query Parameters:**

- `status` - Filter by status (pending, reviewed, quoted, converted, all)
- `limit` - Number of results per page (default: 50)
- `offset` - Pagination offset (default: 0)
- `sortBy` - Sort field (createdAt, status)
- `sortOrder` - Sort direction (asc, desc)

### GET /api/admin/quotes/[id]

Get a specific quote request (admin only)

### PATCH /api/admin/quotes/[id]

Update quote status and notes (admin only)

**Request Body:**

```json
{
  "status": "reviewed",
  "notes": "Customer requested installation quote"
}
```

## Future Enhancements

- [ ] Component management interface
- [ ] Product catalog management
- [ ] User management
- [ ] Analytics dashboard
- [ ] Email template editor
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Advanced search and filtering
