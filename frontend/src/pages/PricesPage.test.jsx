import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PricesPage from './PricesPage';
import { AuthProvider } from '../context/AuthContext';

// Mock socket.io-client's named export `io`
jest.mock('socket.io-client', () => ({
  io: (url, opts) => {
    const fakePayload = {
      price: 120,
      product: { name: 'Maize' },
      market: { name: 'Kisumu' }
    };

    return {
      on: (ev, cb) => {
        if (ev === 'priceUpdate') {
          // deliver the event on next tick so component can mount
          setTimeout(() => cb(fakePayload), 0);
        }
      },
      off: jest.fn(),
      disconnect: jest.fn()
    };
  }
}));

describe('PricesPage real-time', () => {
  beforeEach(() => {
    // Provide a token so the component connects
    localStorage.setItem('token', 'testtoken');
    localStorage.setItem('user', JSON.stringify({ email: 'tester@example.com' }));

    // Mock fetch for categories/markets to avoid network requests
    global.fetch = jest.fn((url) =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test('shows a live update banner when priceUpdate is received', async () => {
    render(
      <AuthProvider>
        <PricesPage />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText(/New price:/i)).toBeInTheDocument());

    expect(screen.getByText(/Maize/i)).toBeInTheDocument();
    expect(screen.getByText(/Kisumu/i)).toBeInTheDocument();
    expect(screen.getByText(/KSh 120/)).toBeInTheDocument();
  });
});
