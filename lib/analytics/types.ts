/**
 * Analytics Type Definitions
 */

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface PageViewEvent {
  page_path: string;
  page_title: string;
  page_location: string;
}

export interface ConfiguratorEvent {
  event_name:
    | 'configurator_start'
    | 'component_added'
    | 'component_removed'
    | 'design_saved'
    | 'quote_requested'
    | 'view_mode_changed';
  component_type?: string;
  component_count?: number;
  design_id?: string;
  view_mode?: '2D' | '3D';
  total_price?: number;
}

export interface ProductEvent {
  event_name:
    | 'product_view'
    | 'product_quick_view'
    | 'product_customize'
    | 'tier_comparison_view';
  product_id?: string;
  product_name?: string;
  product_tier?: string;
  product_price?: number;
}

export interface UserEvent {
  event_name:
    | 'user_register'
    | 'user_login'
    | 'user_logout'
    | 'design_load'
    | 'design_duplicate'
    | 'design_delete';
  user_id?: string;
  design_id?: string;
}

export interface ContactEvent {
  event_name: 'contact_form_submit' | 'quote_form_submit' | 'newsletter_signup';
  form_location?: string;
  success?: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

export type CustomEvent =
  | ConfiguratorEvent
  | ProductEvent
  | UserEvent
  | ContactEvent;
