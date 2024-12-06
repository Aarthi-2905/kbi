import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from 'pages/Dashboard';
import { useLocation, useNavigate } from 'react-router-dom';
// import DashHeader from '.';
// import DashSidebar from '../components/DashSidebar';
// import DashUsers from '../components/DashUsers';
// import DashboardComp from '../components/DashboardComp';
// import DashRequest from '../components/DashRequest';

// Mocking components
jest.mock('components/DashHeader', () => () => <div data-testid="dash-header">DashHeader Mock</div>);
jest.mock('components/DashSidebar', () => () => <div data-testid="dash-sidebar">DashSidebar Mock</div>);
jest.mock('components/DashUsers', () => () => <div data-testid="dash-users">DashUsers Mock</div>);
jest.mock('components/DashboardComp', () => () => <div data-testid="dashboard-comp">DashboardComp Mock</div>);
jest.mock('components/DashRequest', () => () => <div data-testid="dash-request">DashRequest Mock</div>);

// Mocking react-router-dom hooks
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('Dashboard Component', () => {
    let mockNavigate;
    let mockLocation;

    beforeEach(() => {
        // Mock implementation for useNavigate and useLocation
        mockNavigate = jest.fn();
        mockLocation = { search: '?tab=dash' };
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);

        // Mock localStorage
        localStorage.setItem('token', 'dummy_token');
    });

    afterEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    test('renders DashHeader and DashSidebar components', () => {
        render(<Dashboard />);

        // Check if DashHeader is rendered
        expect(screen.getByTestId('dash-header')).toBeInTheDocument();

        // Check if DashSidebar is rendered
        expect(screen.getByTestId('dash-sidebar')).toBeInTheDocument();
    });

    test('renders DashboardComp when tab is "dash"', () => {
        render(<Dashboard />);

        // Check if DashboardComp is rendered when the tab is 'dash'
        expect(screen.getByTestId('dashboard-comp')).toBeInTheDocument();
    });

    test('renders DashUsers when tab is "users"', () => {
        // Changing the location search to tab=users
        useLocation.mockReturnValueOnce({ search: '?tab=users' });

        render(<Dashboard />);

        // Check if DashUsers is rendered when the tab is 'users'
        expect(screen.getByTestId('dash-users')).toBeInTheDocument();
    });

    test('navigates to /dashboard?tab=dash if no tab is present', () => {
        // Simulate the case where tab is missing
        useLocation.mockReturnValueOnce({ search: '' });

        render(<Dashboard />);

        // Check if the component navigates to the default tab
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard?tab=dash');
    });

    // test('handles token validation and API call', async () => {
    //     // Mock fetch response
    //     global.fetch = jest.fn(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve({ name: 'test_user', role: 'admin' }),
    //         })
    //     );
    
    //     render(<Dashboard />);
    
    //     await waitFor(() => {
    //         // Check if token is stored in localStorage
    //         expect(localStorage.getItem('token')).toBe('dummy_token');
    //     });
    
    //     // Ensure fetch was called with the correct URL and request options
    //     expect(global.fetch).toHaveBeenCalledWith(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/login`, expect.any(Object));
    // });
});
