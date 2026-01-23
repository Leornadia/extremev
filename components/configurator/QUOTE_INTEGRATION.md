# Quote Request System Integration Guide

## Overview

This guide explains how to integrate the quote request system into the configurator interface.

## Quick Start

### 1. Import Components

```typescript
import { QuoteRequestModal } from '@/components/configurator';
```

### 2. Add State Management

```typescript
const [showQuoteModal, setShowQuoteModal] = useState(false);
```

### 3. Add Button to Trigger Quote Request

```typescript
<Button
  variant="primary"
  onClick={() => setShowQuoteModal(true)}
  disabled={!validation.isValid}
>
  Request Quote
</Button>
```

### 4. Add Modal Component

```typescript
<QuoteRequestModal
  isOpen={showQuoteModal}
  onClose={() => setShowQuoteModal(false)}
/>
```

## Complete Example

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { QuoteRequestModal } from '@/components/configurator';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';

export default function ConfiguratorToolbar() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const validation = useConfiguratorStore((state) => state.validation);
  const design = useConfiguratorStore((state) => state.design);

  const canRequestQuote =
    validation.isValid &&
    design.components.length > 0;

  return (
    <div className="toolbar">
      {/* Other toolbar buttons */}

      <Button
        variant="primary"
        onClick={() => setShowQuoteModal(true)}
        disabled={!canRequestQuote}
        title={
          !canRequestQuote
            ? 'Fix validation errors before requesting a quote'
            : 'Request a quote for your design'
        }
      >
        Request Quote
      </Button>

      <QuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </div>
  );
}
```

## Features

### Automatic Validation

The modal automatically checks design validation before allowing submission:

- Shows validation errors if design is invalid
- Prevents quote submission until errors are fixed
- Displays clear error messages

### Design Summary

Displays a summary of the current design:

- Component count
- Estimated price
- Dimensions
- Capacity

### Form Validation

Real-time validation of customer information:

- Name (minimum 2 characters)
- Email (valid format)
- Phone (valid format)
- City, State, Postal Code (required)
- Optional notes field

### Success Flow

After successful submission:

1. Shows confirmation screen with reference number
2. Displays "What Happens Next" steps
3. Provides contact information
4. Options to close or create new design

## Customization

### Styling

The modal uses Tailwind CSS classes and can be customized by modifying:

- `QuoteRequestModal.tsx` - Modal wrapper and layout
- `QuoteRequestForm.tsx` - Form fields and validation
- `QuoteConfirmation.tsx` - Success screen

### Validation Rules

Customize validation in `QuoteRequestForm.tsx`:

```typescript
const validateField = (name: keyof QuoteRequestFormData, value: string) => {
  // Add custom validation logic
};
```

### Success Actions

Handle post-submission actions:

```typescript
const handleNewDesign = () => {
  clearDesign(); // Clear current design
  handleClose(); // Close modal
  // Add custom logic (e.g., navigate to new page)
};
```

## API Integration

The modal automatically handles API communication:

- POST request to `/api/quotes`
- Includes design data and customer information
- Handles errors and displays messages
- Shows loading states during submission

## Error Handling

The system handles various error scenarios:

- **Validation Errors**: Shown inline in form
- **Design Errors**: Displayed at top of modal
- **API Errors**: Shown as alert messages
- **Network Errors**: Graceful fallback with retry option

## Testing

### Manual Testing

1. Open configurator
2. Add components to design
3. Click "Request Quote"
4. Fill out form with test data
5. Submit and verify confirmation

### Test Data

```typescript
const testCustomerInfo = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+27 12 345 6789',
  city: 'Johannesburg',
  state: 'Gauteng',
  postalCode: '2000',
  notes: 'This is a test quote request',
};
```

## Troubleshooting

### Modal Not Opening

- Check that `isOpen` prop is set to `true`
- Verify state management is working
- Check for JavaScript errors in console

### Form Validation Errors

- Ensure all required fields are filled
- Check email and phone formats
- Verify postal code is not empty

### API Errors

- Check network tab for failed requests
- Verify API endpoint is accessible
- Check server logs for errors
- Ensure database is connected

### Email Not Sending

- Verify `EMAIL_API_KEY` is set in environment
- Check Resend API status
- Review server logs for email errors
- Confirm email addresses are valid

## Best Practices

1. **Always validate design** before showing quote button
2. **Disable button** when design is invalid
3. **Show helpful tooltips** explaining why button is disabled
4. **Handle errors gracefully** with user-friendly messages
5. **Provide feedback** during submission (loading states)
6. **Clear success indication** after submission
7. **Allow easy retry** if submission fails

## Related Documentation

- [Quote API Documentation](../../../app/api/quotes/README.md)
- [Pricing Calculator](../../../lib/pricing/README.md)
- [Email Service](../../../lib/email/README.md)
- [Validation System](../../../lib/validation/README.md)

## Support

For issues or questions:

- Check console for error messages
- Review API response in network tab
- Consult related documentation
- Check server logs for backend errors
