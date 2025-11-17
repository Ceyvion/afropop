/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Events from '../page';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ items: [] }),
  })
) as jest.Mock;

describe('Events Page - Accessibility and Filters', () => {
  async function renderEventsPage() {
    render(<Events />);
    await screen.findByRole('button', { name: /upcoming/i });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Time Preset Buttons', () => {
    it('should have aria-pressed attribute on time preset buttons', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const upcomingBtn = screen.getByRole('button', { name: /upcoming/i });
        const weekBtn = screen.getByRole('button', { name: /this week/i });
        const monthBtn = screen.getByRole('button', { name: /this month/i });

        expect(upcomingBtn).toHaveAttribute('aria-pressed');
        expect(weekBtn).toHaveAttribute('aria-pressed');
        expect(monthBtn).toHaveAttribute('aria-pressed');
      });
    });

    it('should toggle aria-pressed when clicking time preset buttons', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const upcomingBtn = screen.getByRole('button', { name: /upcoming/i });
        const weekBtn = screen.getByRole('button', { name: /this week/i });

        // Initially, "Upcoming" should be pressed
        expect(upcomingBtn).toHaveAttribute('aria-pressed', 'true');
        expect(weekBtn).toHaveAttribute('aria-pressed', 'false');

        // Click "This Week"
        fireEvent.click(weekBtn);

        // Now "This Week" should be pressed
        expect(upcomingBtn).toHaveAttribute('aria-pressed', 'false');
        expect(weekBtn).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should update visual styling when aria-pressed changes', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const upcomingBtn = screen.getByRole('button', { name: /upcoming/i });
        const weekBtn = screen.getByRole('button', { name: /this week/i });

        // Check initial styling
        expect(upcomingBtn).toHaveClass('bg-accent-v');
        expect(weekBtn).not.toHaveClass('bg-accent-v');

        // Click "This Week"
        fireEvent.click(weekBtn);

        // Check updated styling
        expect(upcomingBtn).not.toHaveClass('bg-accent-v');
        expect(weekBtn).toHaveClass('bg-accent-v');
      });
    });
  });

  describe('City Picker Toggle', () => {
    it('should have aria-pressed and aria-expanded on city picker button', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const cityBtn = screen.getByRole('button', { name: /anywhere/i });

        expect(cityBtn).toHaveAttribute('aria-pressed');
        expect(cityBtn).toHaveAttribute('aria-expanded');
      });
    });

    it('should toggle aria-expanded when clicking city picker', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const cityBtn = screen.getByRole('button', { name: /anywhere/i });

        // Initially closed
        expect(cityBtn).toHaveAttribute('aria-expanded', 'false');

        // Click to open
        fireEvent.click(cityBtn);

        // Should be expanded
        expect(cityBtn).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('More Filters Toggle', () => {
    it('should have aria-pressed and aria-expanded on More filters button', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const moreFiltersBtn = screen.getByRole('button', { name: /more filters/i });

        expect(moreFiltersBtn).toHaveAttribute('aria-pressed');
        expect(moreFiltersBtn).toHaveAttribute('aria-expanded');
      });
    });

    it('should toggle aria-expanded when clicking More filters', async () => {
      await renderEventsPage();

      await waitFor(() => {
        const moreFiltersBtn = screen.getByRole('button', { name: /more filters/i });

        // Initially closed
        expect(moreFiltersBtn).toHaveAttribute('aria-expanded', 'false');

        // Click to open
        fireEvent.click(moreFiltersBtn);

        // Should be expanded
        expect(moreFiltersBtn).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Clear Button', () => {
    it('should reset all filters including city picker state', async () => {
      await renderEventsPage();

      // Open city picker
      const cityBtn = screen.getByRole('button', { name: /anywhere/i });
      fireEvent.click(cityBtn);

      // Verify city picker is open
      expect(cityBtn).toHaveAttribute('aria-expanded', 'true');

      // Select "This Week" preset
      const weekBtn = screen.getByRole('button', { name: /this week/i });
      fireEvent.click(weekBtn);

      // Verify week is selected
      expect(weekBtn).toHaveAttribute('aria-pressed', 'true');

      // Click Clear button (it should appear when filters are active)
      await waitFor(() => {
        const clearBtn = screen.getByRole('button', { name: /^clear$/i });
        expect(clearBtn).toBeInTheDocument();
        fireEvent.click(clearBtn);
      });

      // Verify all filters are reset
      await waitFor(() => {
        const upcomingBtn = screen.getByRole('button', { name: /upcoming/i });
        expect(upcomingBtn).toHaveAttribute('aria-pressed', 'true');
        expect(weekBtn).toHaveAttribute('aria-pressed', 'false');
        expect(cityBtn).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should reset search query', async () => {
      await renderEventsPage();

      const searchInput = screen.getByPlaceholderText(/search by artist/i);
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      expect(searchInput).toHaveValue('test search');

      const clearBtn = screen.getByRole('button', { name: /^clear$/i });
      fireEvent.click(clearBtn);

      expect(searchInput).toHaveValue('');
    });

    it('should hide city picker when clearing', async () => {
      await renderEventsPage();

      const cityBtn = screen.getByRole('button', { name: /anywhere/i });
      fireEvent.click(cityBtn);
      expect(screen.getByText(/city/i)).toBeInTheDocument();

      // Activate a filter so the Clear button appears
      const weekBtn = screen.getByRole('button', { name: /this week/i });
      fireEvent.click(weekBtn);

      const clearBtn = screen.getByRole('button', { name: /^clear$/i });
      fireEvent.click(clearBtn);

      await waitFor(() => {
        expect(screen.queryByText(/city/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Tag Buttons in Advanced Panel', () => {
    it('should have aria-pressed on tag buttons', async () => {
      await renderEventsPage();

      const moreFiltersBtn = screen.getByRole('button', { name: /more filters/i });
      fireEvent.click(moreFiltersBtn);

      const tagButtons = await screen.findAllByRole('button', {
        name: /festival|concert|workshop/i,
      });

      tagButtons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-pressed');
      });
    });

    it('should toggle aria-pressed when clicking tag buttons', async () => {
      await renderEventsPage();

      const moreFiltersBtn = screen.getByRole('button', { name: /more filters/i });
      fireEvent.click(moreFiltersBtn);

      const festivalBtn = await screen.findByRole('button', { name: /festival/i });
      expect(festivalBtn).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(festivalBtn);
      expect(festivalBtn).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(festivalBtn);
      expect(festivalBtn).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
