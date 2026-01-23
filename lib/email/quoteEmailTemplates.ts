/**
 * Email Templates for Quote Requests
 */

import { formatPrice } from '@/lib/pricing';

interface QuoteEmailData {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  location: {
    city: string;
    state: string;
    postalCode: string;
  };
  design: {
    name?: string;
    componentCount: number;
    dimensions: {
      width: number;
      depth: number;
      height: number;
      unit: string;
    };
    capacity: number;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    installation?: number;
    total: number;
  };
  notes?: string;
  createdAt: Date;
}

/**
 * Email template for business notification
 */
export function generateBusinessNotificationEmail(data: QuoteEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New Quote Request #${data.quoteId.slice(0, 8)} from ${data.customerName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e5e5;
      border-top: none;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h2 {
      font-size: 18px;
      color: #10b981;
      margin-bottom: 10px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: 600;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .pricing-table td {
      padding: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .pricing-table .label {
      font-weight: 500;
      color: #666;
    }
    .pricing-table .value {
      text-align: right;
      font-weight: 600;
    }
    .pricing-table .total {
      font-size: 18px;
      color: #10b981;
      border-top: 2px solid #10b981;
      padding-top: 12px;
    }
    .notes {
      background: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #10b981;
      margin-top: 10px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      border-radius: 0 0 8px 8px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 15px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 New Quote Request</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Quote #${data.quoteId.slice(0, 8)}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>Customer Information</h2>
      <div class="info-grid">
        <div class="info-label">Name:</div>
        <div class="info-value">${data.customerName}</div>
        
        <div class="info-label">Email:</div>
        <div class="info-value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></div>
        
        <div class="info-label">Phone:</div>
        <div class="info-value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></div>
        
        <div class="info-label">Location:</div>
        <div class="info-value">${data.location.city}, ${data.location.state} ${data.location.postalCode}</div>
      </div>
    </div>

    <div class="section">
      <h2>Design Details</h2>
      <div class="info-grid">
        ${
          data.design.name
            ? `
        <div class="info-label">Design Name:</div>
        <div class="info-value">${data.design.name}</div>
        `
            : ''
        }
        
        <div class="info-label">Components:</div>
        <div class="info-value">${data.design.componentCount} pieces</div>
        
        <div class="info-label">Dimensions:</div>
        <div class="info-value">${data.design.dimensions.width} × ${data.design.dimensions.depth} × ${data.design.dimensions.height} ${data.design.dimensions.unit}</div>
        
        <div class="info-label">Capacity:</div>
        <div class="info-value">${data.design.capacity} children</div>
      </div>
    </div>

    <div class="section">
      <h2>Pricing Estimate</h2>
      <table class="pricing-table">
        <tr>
          <td class="label">Components Subtotal:</td>
          <td class="value">${formatPrice(data.pricing.subtotal)}</td>
        </tr>
        <tr>
          <td class="label">Shipping Estimate:</td>
          <td class="value">${formatPrice(data.pricing.shipping)}</td>
        </tr>
        ${
          data.pricing.installation
            ? `
        <tr>
          <td class="label">Installation Estimate:</td>
          <td class="value">${formatPrice(data.pricing.installation)}</td>
        </tr>
        `
            : ''
        }
        <tr class="total">
          <td class="label">Total Estimate:</td>
          <td class="value">${formatPrice(data.pricing.total)}</td>
        </tr>
      </table>
    </div>

    ${
      data.notes
        ? `
    <div class="section">
      <h2>Customer Notes</h2>
      <div class="notes">
        ${data.notes.replace(/\n/g, '<br>')}
      </div>
    </div>
    `
        : ''
    }

    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #666; margin-bottom: 10px;">Review this quote request in your admin dashboard</p>
      <a href="${process.env.NEXTAUTH_URL}/admin/quotes/${data.quoteId}" class="cta-button">
        View Quote Request
      </a>
    </div>
  </div>

  <div class="footer">
    <p>Submitted on ${data.createdAt.toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short' })}</p>
    <p style="margin-top: 10px;">This is an automated notification from your Extreme V website.</p>
  </div>
</body>
</html>
  `;

  const text = `
New Quote Request #${data.quoteId.slice(0, 8)}

CUSTOMER INFORMATION
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone}
Location: ${data.location.city}, ${data.location.state} ${data.location.postalCode}

DESIGN DETAILS
${data.design.name ? `Design Name: ${data.design.name}\n` : ''}Components: ${data.design.componentCount} pieces
Dimensions: ${data.design.dimensions.width} × ${data.design.dimensions.depth} × ${data.design.dimensions.height} ${data.design.dimensions.unit}
Capacity: ${data.design.capacity} children

PRICING ESTIMATE
Components Subtotal: ${formatPrice(data.pricing.subtotal)}
Shipping Estimate: ${formatPrice(data.pricing.shipping)}
${data.pricing.installation ? `Installation Estimate: ${formatPrice(data.pricing.installation)}\n` : ''}Total Estimate: ${formatPrice(data.pricing.total)}

${data.notes ? `CUSTOMER NOTES\n${data.notes}\n\n` : ''}
Submitted on ${data.createdAt.toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short' })}

View full details: ${process.env.NEXTAUTH_URL}/admin/quotes/${data.quoteId}
  `;

  return { subject, html, text };
}

/**
 * Email template for customer confirmation
 */
export function generateCustomerConfirmationEmail(data: QuoteEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Your Extreme V Quote Request Confirmation';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Request Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e5e5;
      border-top: none;
    }
    .highlight-box {
      background: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .reference-number {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
      margin: 10px 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h2 {
      font-size: 18px;
      color: #10b981;
      margin-bottom: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: 600;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .pricing-table td {
      padding: 8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .pricing-table .label {
      font-weight: 500;
      color: #666;
    }
    .pricing-table .value {
      text-align: right;
      font-weight: 600;
    }
    .pricing-table .total {
      font-size: 18px;
      color: #10b981;
      border-top: 2px solid #10b981;
      padding-top: 12px;
    }
    .next-steps {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .next-steps h3 {
      margin-top: 0;
      color: #10b981;
    }
    .next-steps ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 8px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      border-radius: 0 0 8px 8px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .contact-info {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e5e5;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Quote Request Received!</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Extreme V</p>
  </div>
  
  <div class="content">
    <p>Hi ${data.customerName},</p>
    
    <p>Thank you for your interest in our custom jungle gym designs! We've received your quote request and our team is reviewing it.</p>

    <div class="highlight-box">
      <p style="margin: 0; font-size: 14px; color: #666;">Your Reference Number</p>
      <div class="reference-number">#${data.quoteId.slice(0, 8).toUpperCase()}</div>
      <p style="margin: 0; font-size: 12px; color: #666;">Please save this for your records</p>
    </div>

    <div class="section">
      <h2>Your Design Summary</h2>
      <div class="info-grid">
        ${
          data.design.name
            ? `
        <div class="info-label">Design Name:</div>
        <div class="info-value">${data.design.name}</div>
        `
            : ''
        }
        
        <div class="info-label">Components:</div>
        <div class="info-value">${data.design.componentCount} pieces</div>
        
        <div class="info-label">Dimensions:</div>
        <div class="info-value">${data.design.dimensions.width} × ${data.design.dimensions.depth} × ${data.design.dimensions.height} ${data.design.dimensions.unit}</div>
        
        <div class="info-label">Capacity:</div>
        <div class="info-value">${data.design.capacity} children</div>
      </div>
    </div>

    <div class="section">
      <h2>Estimated Pricing</h2>
      <table class="pricing-table">
        <tr>
          <td class="label">Components:</td>
          <td class="value">${formatPrice(data.pricing.subtotal)}</td>
        </tr>
        <tr>
          <td class="label">Shipping:</td>
          <td class="value">${formatPrice(data.pricing.shipping)}</td>
        </tr>
        ${
          data.pricing.installation
            ? `
        <tr>
          <td class="label">Installation:</td>
          <td class="value">${formatPrice(data.pricing.installation)}</td>
        </tr>
        `
            : ''
        }
        <tr class="total">
          <td class="label">Total Estimate:</td>
          <td class="value">${formatPrice(data.pricing.total)}</td>
        </tr>
      </table>
      <p style="font-size: 12px; color: #666; margin-top: 10px; font-style: italic;">
        * This is an initial estimate. Final pricing will be provided in your formal quote.
      </p>
    </div>

    <div class="next-steps">
      <h3>What Happens Next?</h3>
      <ol>
        <li><strong>Review:</strong> Our team will review your design and requirements (within 24 hours)</li>
        <li><strong>Quote:</strong> We'll prepare a detailed quote with exact pricing and specifications</li>
        <li><strong>Contact:</strong> We'll reach out via email or phone to discuss your project</li>
        <li><strong>Customization:</strong> We can make any adjustments to your design as needed</li>
      </ol>
      <p style="margin-bottom: 0;"><strong>Expected Response Time:</strong> Within 24 business hours</p>
    </div>

    <div class="contact-info">
      <p style="margin: 0; font-weight: 600;">Questions? We're here to help!</p>
      <p style="margin: 5px 0;">📧 Email: <a href="mailto:info@extremev.co.za">info@extremev.co.za</a></p>
      <p style="margin: 5px 0;">📞 Phone: +27 12 345 6789</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>Extreme V</strong> - Creating Beautiful Play Spaces</p>
    <p style="margin-top: 10px;">This email was sent because you requested a quote on our website.</p>
    <p style="margin-top: 5px;">If you didn't make this request, please ignore this email.</p>
  </div>
</body>
</html>
  `;

  const text = `
Thank you for your quote request!

Hi ${data.customerName},

Thank you for your interest in our custom jungle gym designs! We've received your quote request and our team is reviewing it.

YOUR REFERENCE NUMBER: #${data.quoteId.slice(0, 8).toUpperCase()}
Please save this for your records.

YOUR DESIGN SUMMARY
${data.design.name ? `Design Name: ${data.design.name}\n` : ''}Components: ${data.design.componentCount} pieces
Dimensions: ${data.design.dimensions.width} × ${data.design.dimensions.depth} × ${data.design.dimensions.height} ${data.design.dimensions.unit}
Capacity: ${data.design.capacity} children

ESTIMATED PRICING
Components: ${formatPrice(data.pricing.subtotal)}
Shipping: ${formatPrice(data.pricing.shipping)}
${data.pricing.installation ? `Installation: ${formatPrice(data.pricing.installation)}\n` : ''}Total Estimate: ${formatPrice(data.pricing.total)}

* This is an initial estimate. Final pricing will be provided in your formal quote.

WHAT HAPPENS NEXT?
1. Review: Our team will review your design and requirements (within 24 hours)
2. Quote: We'll prepare a detailed quote with exact pricing and specifications
3. Contact: We'll reach out via email or phone to discuss your project
4. Customization: We can make any adjustments to your design as needed

Expected Response Time: Within 24 business hours

QUESTIONS? WE'RE HERE TO HELP!
Email: info@extremev.co.za
Phone: +27 12 345 6789

---
Extreme V - Creating Beautiful Play Spaces
This email was sent because you requested a quote on our website.
If you didn't make this request, please ignore this email.
  `;

  return { subject, html, text };
}
