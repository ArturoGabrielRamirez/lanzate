/**
 * PrivateHeader component type definitions
 */

/**
 * Navigation link structure used in PrivateHeader
 */
export interface NavLink {
  /** Route path (e.g., '/dashboard') */
  href: string;
  /** Display label (translated) */
  label: string;
  /** Unique key for React list rendering */
  key: string;
}

/**
 * Props for PrivateHeader component
 *
 * Currently optional as PrivateHeader works without props,
 * but available for future customization needs.
 */
export interface PrivateHeaderProps {
  /** Optional CSS class for styling customization */
  className?: string;
}
