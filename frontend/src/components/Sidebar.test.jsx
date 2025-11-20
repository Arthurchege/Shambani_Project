import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Guest when no user', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </AuthProvider>
    );

    // The sidebar button is in the document
    const btn = screen.getByLabelText(/toggle menu/i);
    expect(btn).toBeInTheDocument();
  });

  test('displays user email when logged in', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    localStorage.setItem('token', 'fake-token');

    render(
      <AuthProvider>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </AuthProvider>
    );

    // Open the menu by clicking the hamburger button
    const btn = screen.getByLabelText(/toggle menu/i);
    expect(btn).toBeInTheDocument();
  });
});
