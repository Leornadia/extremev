# Quote Email Service

This module handles email notifications for quote requests.

## Features

- **Business Notifications**: Sends detailed quote information to the business
- **Customer Confirmations**: Sends confirmation emails to customers
- **Professional Templates**: HTML and plain text email templates
- **Quote Updates**: Notify customers of quote status changes

## Configuration

Set the following environment variables:

```bash
EMAIL_FROM="noreply@extremev.co.za"
EMAIL_API_KEY="your-resend-api-key"
```

## Usage

### Send Quote Request Emails

```typescript
import { sendQuoteRequestEmails } from '@/lib/email';

const result = await sendQuoteRequestEmails({
  quoteId: 'quote-id',
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+27 12 345 6789',
    city: 'Johannesburg',
    state: 'Gauteng',
    postalCode: '2000',
    notes: 'Optional notes',
  },
  design: designObject,
  pricing: pricingBreakdown,
  createdAt: new Date(),
});

if (result.success) {
  console.log('Emails sent successfully');
} else {
  console.error('Email errors:', result.errors);
}
```

### Send Quote Update

```typescript
import { sendQuoteUpdateEmail } from '@/lib/email';

await sendQuoteUpdateEmail(
  quoteId,
  customerEmail,
  customerName,
  'reviewed',
  'Your quote has been reviewed and will be sent shortly.'
);
```

## Email Templates

### Business Notification

Sent to: `info@extremev.co.za`

Contains:

- Customer contact information
- Design details and specifications
- Pricing breakdown
- Customer notes
- Link to admin dashboard

### Customer Confirmation

Sent to: Customer's email

Contains:

- Reference number
- Design summary
- Estimated pricing
- Next steps
- Expected response time
- Contact information

## Template Customization

Email templates are defined in `quoteEmailTemplates.ts`:

- `generateBusinessNotificationEmail()`: Business notification template
- `generateCustomerConfirmationEmail()`: Customer confirmation template

Both functions return:

```typescript
{
  subject: string;
  html: string; // HTML version
  text: string; // Plain text version
}
```

## Error Handling

The email service handles errors gracefully:

- Logs errors to console
- Returns success/failure status
- Continues execution even if emails fail
- Does not block quote request creation

## Notes

- Emails are sent asynchronously after quote creation
- Uses Resend API for email delivery
- Supports both HTML and plain text formats
- Includes professional styling and branding
- All prices formatted in South African Rand (ZAR)
