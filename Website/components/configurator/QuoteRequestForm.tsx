'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export interface QuoteRequestFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

interface QuoteRequestFormProps {
  onSubmit: (data: QuoteRequestFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function QuoteRequestForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuoteRequestFormProps) {
  const [formData, setFormData] = useState<QuoteRequestFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof QuoteRequestFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof QuoteRequestFormData, boolean>>
  >({});

  const validateField = (
    name: keyof QuoteRequestFormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2)
          return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\d\s\-\+\(\)]+$/.test(value))
          return 'Invalid phone number format';
        break;
      case 'city':
        if (!value.trim()) return 'City is required';
        break;
      case 'state':
        if (!value.trim()) return 'State/Province is required';
        break;
      case 'postalCode':
        if (!value.trim()) return 'Postal code is required';
        break;
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof QuoteRequestFormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validate on change if field has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof QuoteRequestFormData;

    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteRequestFormData, string>> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof QuoteRequestFormData>).forEach(
      (key) => {
        if (key !== 'notes') {
          const error = validateField(key, formData[key] || '');
          if (error) {
            newErrors[key] = error;
            isValid = false;
          }
        }
      }
    );

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      postalCode: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Contact Information
        </h3>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.name && touched.name
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.email && touched.email
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.phone && touched.phone
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="+27 12 345 6789"
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Installation Location
        </h3>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.city && touched.city
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="Johannesburg"
          />
          {errors.city && touched.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        {/* State/Province */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            State/Province <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.state && touched.state
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="Gauteng"
          />
          {errors.state && touched.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
              errors.postalCode && touched.postalCode
                ? 'border-red-500'
                : 'border-neutral-300'
            }`}
            placeholder="2000"
          />
          {errors.postalCode && touched.postalCode && (
            <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={4}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed resize-none"
          placeholder="Any special requirements or questions..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Request Quote'
          )}
        </Button>
      </div>
    </form>
  );
}
