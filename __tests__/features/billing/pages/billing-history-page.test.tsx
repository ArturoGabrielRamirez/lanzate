/**
 * BillingHistoryPage Component Tests
 *
 * Tests the BillingHistoryPage for:
 * - Page renders with payment data in table
 * - Status filter updates displayed payments
 * - Pagination navigates between pages
 * - Download button triggers invoice download
 *
 * Priority: HIGH - Core billing feature page
 */

import { describe, it, expect, afterEach, mock, beforeEach, spyOn } from 'bun:test';
import { render, fireEvent, cleanup, waitFor, screen } from '@testing-library/react';
import type { Payment, PaymentStatus } from '@/features/billing/types/billing';

// Mock window.open for invoice download tests
const mockWindowOpen = mock(() => {});

// Store original window.open
let originalWindowOpen: typeof window.open;

beforeEach(() => {
  originalWindowOpen = window.open;
  (window as any).open = mockWindowOpen;
  mockWindowOpen.mockClear();
});

afterEach(() => {
  cleanup();
  (window as any).open = originalWindowOpen;
});

// Mock next-intl translations
mock.module('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock nuqs for URL state
const mockSetStatus = mock(() => {});
mock.module('nuqs', () => ({
  useQueryState: (_key: string, _options?: any) => ['', mockSetStatus],
}));

// Mock next-intl navigation Link
mock.module('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Import components after mocking
import { BillingHistoryTable } from '@/features/billing/components/billing-history-table';
import { BillingFilters } from '@/features/billing/components/billing-filters';
import { Pagination } from '@/features/global/components/pagination/pagination';

// Sample payment data for testing
const createMockPayment = (overrides: Partial<Payment> = {}): Payment => ({
  id: `payment-${Math.random().toString(36).substr(2, 9)}`,
  subscriptionId: 'sub-123',
  mercadopagoPaymentId: `mp-${Math.random().toString(36).substr(2, 9)}`,
  amount: 10000,
  currency: 'ARS',
  status: 'APPROVED' as PaymentStatus,
  paidAt: new Date('2026-01-15'),
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-15'),
  cuit: null,
  ivaAmount: null,
  netAmount: null,
  caeCode: null,
  ...overrides,
});

const mockPayments: Payment[] = [
  createMockPayment({
    id: 'payment-1',
    mercadopagoPaymentId: 'mp-001',
    amount: 10000,
    status: 'APPROVED',
    paidAt: new Date('2026-01-15'),
  }),
  createMockPayment({
    id: 'payment-2',
    mercadopagoPaymentId: 'mp-002',
    amount: 10000,
    status: 'PENDING',
    paidAt: new Date('2026-01-10'),
  }),
  createMockPayment({
    id: 'payment-3',
    mercadopagoPaymentId: 'mp-003',
    amount: 10000,
    status: 'REFUNDED',
    paidAt: new Date('2026-01-05'),
  }),
];

describe('BillingHistoryPage', () => {
  describe('Payment Data Table Rendering', () => {
    it('should render payment data in the table', () => {
      const { getByText, getAllByRole } = render(
        <BillingHistoryTable
          payments={mockPayments}
          emptyMessage="No hay pagos registrados"
        />
      );

      // Verify table headers are rendered
      expect(getByText('Fecha')).toBeDefined();
      expect(getByText('ID Pago')).toBeDefined();
      expect(getByText('Monto')).toBeDefined();
      expect(getByText('Estado')).toBeDefined();
      expect(getByText('Acciones')).toBeDefined();

      // Verify payment status badges are rendered
      expect(getByText('Aprobado')).toBeDefined();
      expect(getByText('Pendiente')).toBeDefined();
      expect(getByText('Reembolsado')).toBeDefined();

      // Verify table rows are present (header + 3 data rows)
      const rows = getAllByRole('row');
      expect(rows.length).toBe(4); // 1 header + 3 data rows
    });

    it('should display empty message when no payments', () => {
      const { getByText } = render(
        <BillingHistoryTable
          payments={[]}
          emptyMessage="No hay pagos registrados"
        />
      );

      expect(getByText('No hay pagos registrados')).toBeDefined();
    });
  });

  describe('Status Filter Behavior', () => {
    it('should render all filter options', () => {
      const { getByRole } = render(<BillingFilters />);

      // Verify all status filter buttons are rendered
      expect(getByRole('button', { name: 'Todos' })).toBeDefined();
      expect(getByRole('button', { name: 'Aprobados' })).toBeDefined();
      expect(getByRole('button', { name: 'Pendientes' })).toBeDefined();
      expect(getByRole('button', { name: 'Reembolsados' })).toBeDefined();
    });

    it('should call setStatus when filter option is clicked', () => {
      mockSetStatus.mockClear();

      const { getByRole } = render(<BillingFilters />);

      // Click on "Aprobados" filter
      const approvedButton = getByRole('button', { name: 'Aprobados' });
      fireEvent.click(approvedButton);

      // Verify setStatus was called with 'APPROVED'
      expect(mockSetStatus).toHaveBeenCalledWith('APPROVED');
    });
  });

  describe('Pagination Navigation', () => {
    it('should navigate to next page when Next button is clicked', () => {
      const mockOnPageChange = mock(() => {});

      const { getByLabelText } = render(
        <Pagination
          currentPage={1}
          pageSize={10}
          totalItems={30}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should navigate to previous page when Previous button is clicked', () => {
      const mockOnPageChange = mock(() => {});

      const { getByLabelText } = render(
        <Pagination
          currentPage={2}
          pageSize={10}
          totalItems={30}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = getByLabelText('Previous page');
      fireEvent.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should disable Previous button on first page', () => {
      const { getByLabelText } = render(
        <Pagination
          currentPage={1}
          pageSize={10}
          totalItems={30}
        />
      );

      const prevButton = getByLabelText('Previous page') as HTMLButtonElement;
      expect(prevButton.disabled).toBe(true);
    });

    it('should disable Next button on last page', () => {
      const { getByLabelText } = render(
        <Pagination
          currentPage={3}
          pageSize={10}
          totalItems={30}
        />
      );

      const nextButton = getByLabelText('Next page') as HTMLButtonElement;
      expect(nextButton.disabled).toBe(true);
    });
  });

  describe('Invoice Download', () => {
    it('should trigger invoice download when download button is clicked', async () => {
      mockWindowOpen.mockClear();

      const { getAllByTitle } = render(
        <BillingHistoryTable
          payments={mockPayments}
          emptyMessage="No hay pagos registrados"
        />
      );

      // Find download buttons (one per row)
      const downloadButtons = getAllByTitle('Descargar factura');
      expect(downloadButtons.length).toBe(3);

      // Click first download button
      fireEvent.click(downloadButtons[0]);

      // Verify window.open was called with correct URL
      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith(
          `/api/billing/invoice/${mockPayments[0].id}`,
          '_blank'
        );
      });
    });
  });
});
