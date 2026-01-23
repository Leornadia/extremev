# Admin Quote Management

This directory contains components for the admin dashboard that allows administrators to manage customer quote requests.

## Features

- **Quote List View**: Display all quote requests with filtering and sorting
- **Quote Details**: Expand individual quotes to see full customer information, pricing breakdown, and design details
- **Status Management**: Update quote status through workflow stages (pending → reviewed → quoted → converted)
- **Admin Notes**: Add internal notes to quote requests for team collaboration
- **Design Visualization**: View the customer's custom design with component breakdown

## Components

### AdminQuotesList

Main container component that fetches and displays all quote requests. Handles filtering, sorting, and status updates.

### AdminQuoteCard

Individual quote card component with expandable details. Shows customer info, pricing, design visualization, and status management controls.

### AdminQuoteFilters

Filter and sort controls for the quote list. Allows filtering by status and sorting by date or status.

### DesignVisualization

Displays the customer's design with component breakdown, dimensions, and metadata.

## Authentication

Admin access is controlled through environment variables:

```env
# Server-side admin check
ADMIN_EMAILS="admin@extremev.co.za,owner@extremev.co.za"

# Client-side menu visibility (optional)
NEXT_PUBLIC_ADMIN_EMAILS="admin@extremev.co.za,owner@extremev.co.za"
```

Only users with email addresses listed in `ADMIN_EMAILS` can access the admin dashboard.

## Routes

- `/admin/quotes` - Main admin dashboard page
- `/api/admin/quotes` - GET endpoint to fetch all quotes (admin only)
- `/api/admin/quotes/[id]` - GET/PATCH endpoints for individual quote management

## Status Workflow

Quotes progress through the following statuses:

1. **Pending** - New quote request submitted by customer
2. **Reviewed** - Admin has reviewed the quote
3. **Quoted** - Formal quote has been sent to customer
4. **Converted** - Customer has accepted and purchased

## Usage

1. Configure admin emails in environment variables
2. Sign in with an admin email address
3. Access the admin dashboard from the user menu
4. View, filter, and manage quote requests
5. Update status and add notes as quotes progress

## Future Enhancements

- Email notifications when status changes
- Quote PDF generation
- Advanced filtering (date range, price range)
- Bulk status updates
- Quote analytics and reporting
- Customer communication history
