/**
 * Custom Event Tracking
 *
 * High-level functions for tracking specific user actions and behaviors
 */

import { event } from './google-analytics';
import type {
  ConfiguratorEvent,
  ProductEvent,
  UserEvent,
  ContactEvent,
} from './types';

/**
 * Configurator Events
 */
export const trackConfiguratorStart = (): void => {
  event({
    action: 'configurator_start',
    category: 'Configurator',
    label: 'User started configurator',
  });
};

export const trackComponentAdded = (
  componentType: string,
  componentCount: number
): void => {
  event({
    action: 'component_added',
    category: 'Configurator',
    label: componentType,
    value: componentCount,
  });
};

export const trackComponentRemoved = (
  componentType: string,
  componentCount: number
): void => {
  event({
    action: 'component_removed',
    category: 'Configurator',
    label: componentType,
    value: componentCount,
  });
};

export const trackDesignSaved = (
  designId: string,
  componentCount: number
): void => {
  event({
    action: 'design_saved',
    category: 'Configurator',
    label: designId,
    value: componentCount,
  });
};

export const trackQuoteRequested = (
  totalPrice: number,
  componentCount: number
): void => {
  event({
    action: 'quote_requested',
    category: 'Conversion',
    label: 'Quote Request Submitted',
    value: Math.round(totalPrice),
  });
};

export const trackViewModeChanged = (viewMode: '2D' | '3D'): void => {
  event({
    action: 'view_mode_changed',
    category: 'Configurator',
    label: viewMode,
  });
};

/**
 * Product Events
 */
export const trackProductView = (
  productId: string,
  productName: string,
  productTier: string
): void => {
  event({
    action: 'product_view',
    category: 'Product',
    label: `${productTier} - ${productName}`,
    value: parseInt(productId.replace(/\D/g, '')) || 0,
  });
};

export const trackProductQuickView = (
  productId: string,
  productName: string
): void => {
  event({
    action: 'product_quick_view',
    category: 'Product',
    label: productName,
  });
};

export const trackProductCustomize = (
  productId: string,
  productName: string
): void => {
  event({
    action: 'product_customize',
    category: 'Product',
    label: productName,
  });
};

export const trackTierComparisonView = (): void => {
  event({
    action: 'tier_comparison_view',
    category: 'Product',
    label: 'User viewed tier comparison',
  });
};

/**
 * User Events
 */
export const trackUserRegister = (userId: string): void => {
  event({
    action: 'user_register',
    category: 'User',
    label: 'New user registration',
  });
};

export const trackUserLogin = (userId: string): void => {
  event({
    action: 'user_login',
    category: 'User',
    label: 'User login',
  });
};

export const trackUserLogout = (): void => {
  event({
    action: 'user_logout',
    category: 'User',
    label: 'User logout',
  });
};

export const trackDesignLoad = (designId: string): void => {
  event({
    action: 'design_load',
    category: 'User',
    label: 'Design loaded from saved',
  });
};

export const trackDesignDuplicate = (designId: string): void => {
  event({
    action: 'design_duplicate',
    category: 'User',
    label: 'Design duplicated',
  });
};

export const trackDesignDelete = (designId: string): void => {
  event({
    action: 'design_delete',
    category: 'User',
    label: 'Design deleted',
  });
};

/**
 * Contact & Conversion Events
 */
export const trackContactFormSubmit = (
  formLocation: string,
  success: boolean
): void => {
  event({
    action: 'contact_form_submit',
    category: 'Conversion',
    label: `${formLocation} - ${success ? 'Success' : 'Failed'}`,
    value: success ? 1 : 0,
  });
};

export const trackNewsletterSignup = (success: boolean): void => {
  event({
    action: 'newsletter_signup',
    category: 'Conversion',
    label: success ? 'Success' : 'Failed',
    value: success ? 1 : 0,
  });
};

/**
 * Navigation Events
 */
export const trackSearch = (searchTerm: string, resultCount: number): void => {
  event({
    action: 'search',
    category: 'Navigation',
    label: searchTerm,
    value: resultCount,
  });
};

export const trackFilterApplied = (
  filterType: string,
  filterValue: string
): void => {
  event({
    action: 'filter_applied',
    category: 'Navigation',
    label: `${filterType}: ${filterValue}`,
  });
};

/**
 * Engagement Events
 */
export const trackVideoPlay = (videoTitle: string): void => {
  event({
    action: 'video_play',
    category: 'Engagement',
    label: videoTitle,
  });
};

export const trackGalleryImageView = (
  imageId: string,
  category: string
): void => {
  event({
    action: 'gallery_image_view',
    category: 'Engagement',
    label: category,
  });
};

export const trackSocialShare = (
  platform: string,
  contentType: string
): void => {
  event({
    action: 'social_share',
    category: 'Engagement',
    label: `${platform} - ${contentType}`,
  });
};

/**
 * Error Events
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  fatal = false
): void => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorType}: ${errorMessage}`,
    value: fatal ? 1 : 0,
  });
};

export const track3DLoadError = (
  modelName: string,
  errorMessage: string
): void => {
  event({
    action: '3d_load_error',
    category: 'Error',
    label: `${modelName}: ${errorMessage}`,
  });
};

export const trackValidationError = (
  errorType: string,
  componentCount: number
): void => {
  event({
    action: 'validation_error',
    category: 'Configurator',
    label: errorType,
    value: componentCount,
  });
};
