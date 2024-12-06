
 // Mock the Auth functions

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DashSidebar from 'components/DashSidebar';
import * as Auth from 'utils/Auth'; // Assuming you have an Auth module for logout
import { MemoryRouter } from 'react-router-dom';
import { setStatus } from 'utils/Auth'; // Adjust the path as needed


jest.mock('utils/Auth',() => ({
    setStatus: jest.fn(),
}));
 
// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({
        search: '?tab=dash'
    })
}));
 
// Mock localStorage
const localStorageMock = (function() {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value ? value.toString() : '';
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
 
// Mock fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ role: 'user', name: 'Test User', email: 'test@example.com' }),
        ok: true
    })
);
 
// Mock the navigation
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));
 
jest.mock('utils/Auth', () => ({
    logout: jest.fn(),
    // ... other mocked functions if any
  }));
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
 
describe('DashSidebar Component', () => {
    beforeEach(() => {
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });
    });
 
  test('renders without crashing', () => {
    renderWithRouter(<DashSidebar />);
    expect(screen.getByText('Chat Interface')).toBeInTheDocument();
  });
 
  test('displays user role', () => {
    localStorage.getItem.mockReturnValue('user');
    renderWithRouter(<DashSidebar />);
    expect(screen.getByText('user')).toBeInTheDocument();
  });
 
  test('shows admin options for super_admin role', () => {
    localStorage.getItem.mockReturnValue('super_admin');
    renderWithRouter(<DashSidebar />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Requested Files')).toBeInTheDocument();
  });
 
  test('does not show admin options for non-admin roles', () => {
    localStorage.getItem.mockReturnValue('user');
    renderWithRouter(<DashSidebar />);
    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
    expect(screen.queryByText('Requested Files')).not.toBeInTheDocument();
  });
 
  test('opens profile modal when clicking on Profile', async () => {
    render(
      <BrowserRouter>
        <DashSidebar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Profile'));
    await waitFor(() => {
      expect(screen.getByText('Save Change')).toBeInTheDocument();
    });
  });
 
  test('opens sign out modal when clicking on Sign Out', () => {
    renderWithRouter(<DashSidebar />);
    fireEvent.click(screen.getByText('Sign Out'));
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument();
  });
 
  test('handles sign out process', async () => {
    render(
        <MemoryRouter>
            <DashSidebar />
        </MemoryRouter>
    );

    // Open sign out modal
    const signOutButton = screen.getByText(/Sign Out/i);
    fireEvent.click(signOutButton);

    // Check if the "Sign Out" button in the modal is present
    const confirmSignOutButton = screen.getByRole('button', { name: /Sign Out/i });

    // Click the sign out button
    fireEvent.click(confirmSignOutButton);

    // Check if localStorage items were removed
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('username');
    expect(localStorage.removeItem).toHaveBeenCalledWith('useremail');
    expect(localStorage.removeItem).toHaveBeenCalledWith('role');
  });
 
  test('fetches user data on component mount', async () => {
    renderWithRouter(<DashSidebar />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/verify`, expect.any(Object));
    });
  });
 
  test('updates profile information', async () => {
    renderWithRouter(<DashSidebar />);
    fireEvent.click(screen.getByText('Profile'));
   
    await waitFor(() => {
      const usernameInput = screen.getByPlaceholderText('Username');
      fireEvent.change(usernameInput, { target: { value: 'Username' } });
    });
 
    fireEvent.click(screen.getByText('Save Change'));
 
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/users/edit/profile`, expect.any(Object));
    });
  });
});