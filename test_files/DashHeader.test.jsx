import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashHeader from 'components/DashHeader';

// Mock the necessary modules
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('DashHeader Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url) => {
        if (url.includes('/verify')) {
            return Promise.resolve({
            json: () => Promise.resolve({ role: 'user' }),
            });
        } else if (url.includes('/notifications')) {
            return Promise.resolve({
            json: () => Promise.resolve({ detail: [{ file_name: 'test.txt', from: 'user', status: 'accepted' }] }),
            });
        }
        return Promise.resolve({ ok: true });
        });

        localStorage.clear();
    });

    beforeAll(() => {
        process.env.VITE_HOST = 'http://localhost';
        process.env.VITE_PORT = '3000';
    });
  
    // Mock fetch globally
    global.fetch = jest.fn();
    
    // Cleanup after each test
    afterEach(() => {
        global.fetch.mockClear();
    });

    test('renders without crashing', () => {
        render(
            <BrowserRouter>
                <DashHeader />
            </BrowserRouter>
        );
        expect(screen.getByText('Varphi KBI')).toBeInTheDocument();
    });

    test('fetches user data on mount', async () => {
        localStorage.setItem('token', 'fake-token');
      
        render(
          <BrowserRouter>
            <DashHeader />
          </BrowserRouter>
        );
      
        // Assert first fetch call to `/verify`
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/verify',
                expect.objectContaining({ method: 'GET' })
              );
        });
      
        // Assert second fetch call to `/notifications`
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/notifications',
                expect.objectContaining({ method: 'GET' })
              );
        });
      });
      
      

    test('fetches notifications on mount', async () => {
        localStorage.setItem('token', 'fake-token');
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ role: 'user' }),
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ detail: [{ file_name: 'test.txt', from: 'user', status: 'accepted' }] }),
        });

        render(
            <BrowserRouter>
                <DashHeader />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `${process.env.VITE_HOST}:${process.env.VITE_PORT}/notifications`,
                expect.any(Object)
            );
        });
    });

    test('displays notification count', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('role', 'user');
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ role: 'user' }),
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ detail: [{ file_name: 'test.txt', from: 'user', status: 'accepted' }] }),
        });

        render(
            <BrowserRouter>
                <DashHeader />
            </BrowserRouter>
        );

        await waitFor(() => {
            const notificationButton = screen.getByTestId('flowbite-popover-target');
            expect(notificationButton).toBeInTheDocument();
            expect(notificationButton).toContainHTML('1');
        });
    });

    test('clears a single notification', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('role', 'user');
        localStorage.setItem('email', 'test@example.com');
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ role: 'user' }),
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ detail: [{ file_name: 'test.txt', from: 'user', status: 'accepted' }] }),
        })
        .mockResolvedValueOnce({
            ok: true,
        });

        render(
            <BrowserRouter>
                <DashHeader />
            </BrowserRouter>
        );

        await waitFor(() => {
            const notificationButton = screen.getByTestId('flowbite-popover-target');
            fireEvent.click(notificationButton);
        });

        
    });

    test('clears all notifications', async () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('role', 'user');
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ role: 'user' }),
        })
        .mockResolvedValueOnce({
            json: () => Promise.resolve({ detail: [{ file_name: 'test.txt', from: 'user', status: 'accepted' }] }),
        })
        .mockResolvedValueOnce({
            ok: true,
        });

        render(
            <BrowserRouter>
                <DashHeader />
            </BrowserRouter>
        );

        await waitFor(() => {
        const notificationButton = screen.getByTestId('flowbite-popover-target');
        fireEvent.click(notificationButton);
        });
    });
});