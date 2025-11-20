import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders App without crashing', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  // Just verify the component renders without error
  const containers = screen.queryAllByText(/Shambani/i);
  expect(containers.length).toBeGreaterThan(0);
});
