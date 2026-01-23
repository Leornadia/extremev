/**
 * Quote Email Service
 * Handles sending email notifications for quote requests
 */

import { Resend } from 'resend';
import { env } from '@/lib/env';
import {
  generateBusinessNotificationEmail,
  generateCustomerConfirmationEmail,
} from './quoteEmailTemplates';
import { Design } from '@/lib/types/configurator';
import { PricingBreakdown } from '@/lib/pricing';

const resend = env.emailApiKey ? new Resend(env.emailApiKey) : null;

interface QuoteEmailParams {
  quoteId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
    notes?: string;
  };
  design: Design;
  pricing: PricingBreakdown;
  createdAt: Date;
}

/**
 * Send quote request notification emails
 */
export async function sendQuoteRequestEmails(
  params: QuoteEmailParams
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!resend) {
    console.warn('Email service not configured. Skipping email send.');
    return { success: false, errors: ['Email service not configured'] };
  }

  const emailFrom = env.emailFrom || 'noreply@extremev.co.za';
  const businessEmail = 'info@extremev.co.za';

  // Prepare email data
  const emailData = {
    quoteId: params.quoteId,
    customerName: params.customerInfo.name,
    customerEmail: params.customerInfo.email,
    customerPhone: params.customerInfo.phone,
    location: {
      city: params.customerInfo.city,
      state: params.customerInfo.state,
      postalCode: params.customerInfo.postalCode,
    },
    design: {
      name: params.design.name,
      componentCount: params.design.metadata.componentCount,
      dimensions: params.design.metadata.dimensions,
      capacity: params.design.metadata.capacity,
    },
    pricing: {
      subtotal: params.pricing.subtotal,
      shipping: params.pricing.shipping.total,
      installation: params.pricing.installation?.total,
      total: params.pricing.total,
    },
    notes: params.customerInfo.notes,
    createdAt: params.createdAt,
  };

  // Send business notification
  try {
    const businessEmail_template = generateBusinessNotificationEmail(emailData);

    await resend.emails.send({
      from: emailFrom,
      to: businessEmail,
      subject: businessEmail_template.subject,
      html: businessEmail_template.html,
      text: businessEmail_template.text,
    });
  } catch (error) {
    console.error('Failed to send business notification email:', error);
    errors.push('Failed to send business notification');
  }

  // Send customer confirmation
  try {
    const customerEmail = generateCustomerConfirmationEmail(emailData);

    await resend.emails.send({
      from: emailFrom,
      to: params.customerInfo.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
    });
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    errors.push('Failed to send customer confirmation');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Send quote update notification to customer
 */
export async function sendQuoteUpdateEmail(
  quoteId: string,
  customerEmail: string,
  customerName: string,
  status: string,
  message: string
): Promise<boolean> {
  if (!resend) {
    console.warn('Email service not configured. Skipping email send.');
    return false;
  }

  const emailFrom = env.emailFrom || 'noreply@extremev.co.za';

  try {
    await resend.emails.send({
      from: emailFrom,
      to: customerEmail,
      subject: `Update on Your Quote Request #${quoteId.slice(0, 8).toUpperCase()}`,
      html: `
        <h2>Quote Request Update</h2>
        <p>Hi ${customerName},</p>
        <p>We have an update on your quote request #${quoteId.slice(0, 8).toUpperCase()}.</p>
        <p><strong>Status:</strong> ${status}</p>
        <p>${message}</p>
        <hr>
        <p>Best regards,<br>The Extreme V Team</p>
      `,
    });

    return true;
  } catch (error) {
    console.error('Failed to send quote update email:', error);
    return false;
  }
}
