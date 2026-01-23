# Accessibility Guidelines

This document outlines the accessibility features and best practices implemented in the Extreme V website to ensure WCAG 2.1 AA compliance.

## Overview

The website implements comprehensive accessibility features to ensure all users, including those using assistive technologies, can effectively navigate and use the site.

## Key Features

### 1. Skip Navigation Links

Skip navigation links allow keyboard users to bypass repetitive navigation and jump directly to main content.

**Implementation:**
- Located at the top of every page
- Visible only when focused (keyboard navigation)
- Links to main content and navigation areas

**Usage:**
```tsx
import { SkipNavigation } from '@/components/ui/SkipNavigation';

// In layout
<SkipNavigation />
```

### 2. Keyboard Navigation

All interactive elements are fully keyboard accessible.

**Features:**
- Tab navigation through all interactive elements
- Arrow key navigation in menus and lists
- Escape key to close modals and dropdowns
- Enter/Space to activate buttons and links
- Focus trap in modals and slide-out menus

**Keyboard Shortcuts:**
- `Tab` - Move to next focusable element
- `Shift + Tab` - Move to previous focusable element
- `Enter` or `Space` - Activate buttons and links
- `Escape` - Close modals, dropdowns, and menus
- `Arrow Keys` - Navigate within menus and lists

### 3. ARIA Labels and Attributes

All interactive elements have appropriate ARIA labels and attributes.

**Common Patterns:**
```tsx
// Button with icon
<button aria-label="Close menu">
  <X aria-hidden="true" />
</button>

// Expandable section
<button
  aria-expanded={isOpen}
  aria-controls="content-id"
>
  Toggle Content
</button>

// Navigation
<nav role="navigation" aria-label="Main navigation">
  {/* navigation items */}
</nav>

// Search
<div role="search">
  <label htmlFor="search-input" className="sr-only">
    Search products
  </label>
  <input id="search-input" type="search" />
</div>
```

### 4. Focus Management

Focus is properly managed throughout the application.

**Hooks:**

#### useFocusTrap
Traps focus within a container (useful for modals):
```tsx
import { useFocusTrap } from '@/lib/hooks/useFocusManagement';

function Modal({ isOpen }) {
  const modalRef = useFocusTrap(isOpen);
  
  return (
    <div ref={modalRef}>
      {/* modal content */}
    </div>
  );
}
```

#### useFocusRestore
Restores focus to the previously focused element:
```tsx
import { useFocusRestore } from '@/lib/hooks/useFocusManagement';

function Modal() {
  useFocusRestore(); // Automatically restores focus on unmount
  
  return <div>{/* modal content */}</div>;
}
```

#### useAriaLive
Announces content changes to screen readers:
```tsx
import { useAriaLive } from '@/lib/hooks/useFocusManagement';

function Component() {
  const announce = useAriaLive();
  
  const handleAction = () => {
    // Perform action
    announce('Action completed successfully', 'polite');
  };
  
  return <button onClick={handleAction}>Do Action</button>;
}
```

#### useKeyboardNavigation
Handles common keyboard navigation patterns:
```tsx
import { useKeyboardNavigation } from '@/lib/hooks/useFocusManagement';

function Component() {
  useKeyboardNavigation({
    onEscape: () => closeModal(),
    onEnter: () => submitForm(),
    onArrowUp: () => selectPrevious(),
    onArrowDown: () => selectNext(),
  });
  
  return <div>{/* content */}</div>;
}
```

### 5. Color Contrast

All text and interactive elements meet WCAG AA contrast requirements:
- Normal text: 4.5:1 minimum
- Large text (18pt+ or 14pt+ bold): 3:1 minimum
- Interactive elements: 3:1 minimum

**Utility Functions:**
```tsx
import { 
  getContrastRatio, 
  meetsContrastRequirement 
} from '@/lib/utils/accessibility';

// Check contrast ratio
const ratio = getContrastRatio('#059669', '#ffffff'); // Returns 4.52

// Validate contrast
const isValid = meetsContrastRequirement('#059669', '#ffffff', false);
// Returns true for normal text
```

### 6. Screen Reader Support

Content is properly structured for screen readers.

**Best Practices:**
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- Provide descriptive labels for all form inputs
- Use `aria-label` for icon-only buttons
- Hide decorative images with `aria-hidden="true"`
- Use `role` attributes when semantic HTML isn't sufficient

**Screen Reader Only Content:**
```tsx
// Hide visually but keep accessible
<span className="sr-only">Additional context for screen readers</span>

// Show only when focused
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 7. Form Accessibility

All forms are fully accessible with proper labels and error handling.

**Features:**
- Labels associated with inputs via `htmlFor` and `id`
- Error messages announced to screen readers
- Required fields clearly marked
- Validation feedback provided in real-time
- Submit buttons disabled during submission with loading state

**Example:**
```tsx
<div>
  <label htmlFor="email" className="block mb-2">
    Email Address
    <span className="text-red-600" aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && (
    <p id="email-error" role="alert" className="text-red-600 mt-1">
      Please enter a valid email address
    </p>
  )}
</div>
```

### 8. Responsive Touch Targets

All interactive elements meet minimum touch target sizes:
- Minimum 44x44 pixels for touch targets
- Adequate spacing between interactive elements
- Buttons use `min-h-[44px]` class

### 9. Reduced Motion

Respects user's motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical and follows visual flow
- [ ] Focus indicators are clearly visible
- [ ] Escape key closes modals and dropdowns
- [ ] Arrow keys work in menus and lists

### Screen Reader
- [ ] All images have appropriate alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Headings create a logical document outline

### Visual
- [ ] Text contrast meets WCAG AA standards (4.5:1)
- [ ] Focus indicators are visible
- [ ] Content is readable at 200% zoom
- [ ] No information conveyed by color alone

### Mobile
- [ ] Touch targets are at least 44x44 pixels
- [ ] Content is accessible on small screens
- [ ] Pinch-to-zoom is not disabled

## Tools for Testing

### Automated Testing
- **axe DevTools**: Browser extension for accessibility testing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool

### Manual Testing
- **Keyboard Only**: Navigate site using only keyboard
- **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
- **Zoom**: Test at 200% browser zoom
- **Color Blindness**: Use color blindness simulators

### Screen Readers
- **NVDA** (Windows): Free, open-source
- **JAWS** (Windows): Industry standard (paid)
- **VoiceOver** (Mac/iOS): Built-in
- **TalkBack** (Android): Built-in

## Common Patterns

### Modal Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
  {/* modal content */}
</div>
```

### Loading State
```tsx
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <span className="sr-only">Loading...</span>
      <Spinner aria-hidden="true" />
    </>
  ) : (
    'Submit'
  )}
</button>
```

### Alert/Notification
```tsx
<div role="alert" aria-live="assertive">
  Your changes have been saved
</div>
```

### Tabs
```tsx
<div role="tablist" aria-label="Product information">
  <button
    role="tab"
    aria-selected={activeTab === 'specs'}
    aria-controls="specs-panel"
    id="specs-tab"
  >
    Specifications
  </button>
  <div
    role="tabpanel"
    id="specs-panel"
    aria-labelledby="specs-tab"
    hidden={activeTab !== 'specs'}
  >
    {/* panel content */}
  </div>
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## Maintenance

Accessibility is an ongoing process. Regular testing and updates are required:

1. **Test with real users**: Include users with disabilities in testing
2. **Automated testing**: Run accessibility tests in CI/CD pipeline
3. **Manual audits**: Conduct quarterly accessibility audits
4. **Stay updated**: Follow WCAG updates and best practices
5. **Training**: Ensure team members understand accessibility principles
