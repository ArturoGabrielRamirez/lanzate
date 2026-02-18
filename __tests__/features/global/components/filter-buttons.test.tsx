/**
 * FilterButtons Component Tests
 *
 * Tests the FilterButtons component for:
 * - Rendering all filter options
 * - URL state updates when clicking options
 * - "All" option clearing the filter
 * - Active state styling
 *
 * Priority: HIGH - Core reusable component for billing feature
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, mock, afterEach } from 'bun:test';

import { FilterButtons } from '@/features/global/components/filter-buttons/filter-buttons';

// Cleanup after each test to prevent element leakage
afterEach(() => {
  cleanup();
});

describe('FilterButtons Component', () => {
  const defaultOptions = [
    { label: 'All', value: '' },
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
  ];

  describe('Filter Options Rendering', () => {
    it('should render all filter options as buttons', () => {
      const { getByRole } = render(
        <FilterButtons
          options={defaultOptions}
          paramName="status"
          value=""
        />
      );

      // Verify all options are rendered as buttons
      expect(getByRole('button', { name: 'All' })).toBeDefined();
      expect(getByRole('button', { name: 'Approved' })).toBeDefined();
      expect(getByRole('button', { name: 'Pending' })).toBeDefined();
      expect(getByRole('button', { name: 'Rejected' })).toBeDefined();
    });
  });

  describe('URL State Updates', () => {
    it('should call onChange with correct value when option clicked', () => {
      const mockOnChange = mock(() => {});

      const { getByRole } = render(
        <FilterButtons
          options={defaultOptions}
          paramName="status"
          value=""
          onChange={mockOnChange}
        />
      );

      // Click on "Approved" option
      const approvedButton = getByRole('button', { name: 'Approved' });
      fireEvent.click(approvedButton);

      // Should call onChange with 'approved' value
      expect(mockOnChange).toHaveBeenCalledWith('approved');
    });
  });

  describe('All Option Behavior', () => {
    it('should call onChange with empty string when "All" option clicked', () => {
      const mockOnChange = mock(() => {});

      const { getByRole } = render(
        <FilterButtons
          options={defaultOptions}
          paramName="status"
          value="approved"
          onChange={mockOnChange}
        />
      );

      // Click on "All" option to clear filter
      const allButton = getByRole('button', { name: 'All' });
      fireEvent.click(allButton);

      // Should call onChange with empty string to clear the filter
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('Active State Styling', () => {
    it('should apply active styling to the selected option', () => {
      const { getByRole } = render(
        <FilterButtons
          options={defaultOptions}
          paramName="status"
          value="pending"
        />
      );

      // Get the "Pending" button (which should be active)
      const pendingButton = getByRole('button', { name: 'Pending' });
      const allButton = getByRole('button', { name: 'All' });

      // Active button should have aria-pressed="true" or data-state="active"
      // The implementation may use either approach - we check both
      const isActive =
        pendingButton.getAttribute('aria-pressed') === 'true' ||
        pendingButton.getAttribute('data-state') === 'active' ||
        pendingButton.classList.contains('bg-primary') ||
        pendingButton.classList.contains('data-[state=active]:bg-primary');

      const isInactive =
        allButton.getAttribute('aria-pressed') === 'false' ||
        allButton.getAttribute('data-state') === 'inactive' ||
        !allButton.classList.contains('bg-primary');

      expect(isActive).toBe(true);
      expect(isInactive).toBe(true);
    });
  });
});
