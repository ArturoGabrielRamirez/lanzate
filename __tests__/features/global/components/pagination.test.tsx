/**
 * Pagination Component Tests
 *
 * Tests the Pagination component for:
 * - Correct page range and total display
 * - Page size selector functionality
 * - Navigation buttons functionality
 * - Disabled state at boundaries
 *
 * Priority: HIGH - Core reusable component for billing feature
 */

import { describe, it, expect, mock, afterEach } from 'bun:test';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Pagination } from '@/features/global/components/pagination/pagination';

// Cleanup after each test to prevent element leakage
afterEach(() => {
  cleanup();
});

describe('Pagination Component', () => {
  describe('Page Range Display', () => {
    it('should display correct page range and total items when showRange is enabled', () => {
      const { getByText } = render(
        <Pagination
          currentPage={2}
          pageSize={10}
          totalItems={45}
          showRange={true}
        />
      );

      // Verify range display: "Showing 11-20 of 45"
      // Page 2 with pageSize 10 means items 11-20
      expect(getByText('Showing 11-20 of 45')).toBeDefined();
    });

    it('should calculate correct range for last page with partial items', () => {
      const { getByText } = render(
        <Pagination
          currentPage={5}
          pageSize={10}
          totalItems={45}
          showRange={true}
        />
      );

      // Verify range display: "Showing 41-45 of 45" (last page has only 5 items)
      expect(getByText('Showing 41-45 of 45')).toBeDefined();
    });
  });

  describe('Page Size Selector', () => {
    it('should call onPageSizeChange when page size is changed', () => {
      const mockOnPageSizeChange = mock(() => {});

      const { container } = render(
        <Pagination
          currentPage={1}
          pageSize={10}
          totalItems={100}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      // Find the select element and change its value
      const selectElement = container.querySelector('select');
      expect(selectElement).toBeDefined();

      if (selectElement) {
        fireEvent.change(selectElement, { target: { value: '25' } });
        expect(mockOnPageSizeChange).toHaveBeenCalledWith(25);
      }
    });

    it('should display current page size as selected value', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          pageSize={25}
          totalItems={100}
        />
      );

      const selectElement = container.querySelector('select') as HTMLSelectElement;
      expect(selectElement).toBeDefined();
      expect(selectElement?.value).toBe('25');
    });
  });

  describe('Navigation Buttons', () => {
    it('should call onPageChange with correct page when Previous button clicked', () => {
      const mockOnPageChange = mock(() => {});

      const { getByLabelText } = render(
        <Pagination
          currentPage={3}
          pageSize={10}
          totalItems={100}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = getByLabelText('Previous page');
      fireEvent.click(prevButton);

      // Should navigate to page 2 (current - 1)
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with correct page when Next button clicked', () => {
      const mockOnPageChange = mock(() => {});

      const { getByLabelText } = render(
        <Pagination
          currentPage={3}
          pageSize={10}
          totalItems={100}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = getByLabelText('Next page');
      fireEvent.click(nextButton);

      // Should navigate to page 4 (current + 1)
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange when page number button clicked', () => {
      const mockOnPageChange = mock(() => {});

      const { getByLabelText } = render(
        <Pagination
          currentPage={1}
          pageSize={10}
          totalItems={50}
          onPageChange={mockOnPageChange}
        />
      );

      // Click on page 3 button
      const page3Button = getByLabelText('Go to page 3');
      fireEvent.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Disabled State at Boundaries', () => {
    it('should disable Previous button on first page', () => {
      const { getByLabelText } = render(
        <Pagination
          currentPage={1}
          pageSize={10}
          totalItems={100}
        />
      );

      const prevButton = getByLabelText('Previous page') as HTMLButtonElement;
      expect(prevButton.disabled).toBe(true);
    });

    it('should disable Next button on last page', () => {
      const { getByLabelText } = render(
        <Pagination
          currentPage={10}
          pageSize={10}
          totalItems={100}
        />
      );

      const nextButton = getByLabelText('Next page') as HTMLButtonElement;
      expect(nextButton.disabled).toBe(true);
    });

    it('should enable both buttons when not at boundaries', () => {
      const { getByLabelText } = render(
        <Pagination
          currentPage={5}
          pageSize={10}
          totalItems={100}
        />
      );

      const prevButton = getByLabelText('Previous page') as HTMLButtonElement;
      const nextButton = getByLabelText('Next page') as HTMLButtonElement;

      expect(prevButton.disabled).toBe(false);
      expect(nextButton.disabled).toBe(false);
    });
  });
});
