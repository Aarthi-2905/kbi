import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from 'components/Layout';
import { fetchStatus, setStatus } from 'utils/Auth';

jest.mock('utils/Auth', () => ({
    fetchStatus: jest.fn(),
    setStatus: jest.fn(),
}));

describe('Layout Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
        localStorage.clear(); // Clear local storage before each test
    });

    test('renders layout with default elements', () => {
        render(
            <MemoryRouter>
                <Layout hideButton={false}>Child Component</Layout>
            </MemoryRouter>
        );
        expect(screen.getByText(/data integration platform/i)).toBeInTheDocument();
        expect(screen.getByText(/AI chatbots/i)).toBeInTheDocument();
        expect(screen.getByText(/Child Component/)).toBeInTheDocument();
        expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    test('does not render Get Started button if hideButton is true', () => {
        render(
            <MemoryRouter>
                <Layout hideButton={true}>Child Component</Layout>
            </MemoryRouter>
        );
        expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
    });

    test('displays toast notification on successful signout', async () => {
        // Set the status in local storage to trigger the toast
        localStorage.setItem('status', 'Signout Successfully');
        fetchStatus.mockReturnValue('Signout Successfully');

        render(
            <MemoryRouter>
                <Layout hideButton={false}>Child Component</Layout>
            </MemoryRouter>
        );

        // Verify that toast message is displayed
        expect(screen.getByText('Signout Successfully')).toBeInTheDocument();

        // Wait for the toast to auto-close
        await waitFor(() => {
            expect(screen.queryByText('Signout Successfully')).not.toBeInTheDocument();
        }, { timeout: 5000 });
    });

    test('closes toast notification when close button is clicked', async () => {
        // Set the status in local storage to trigger the toast
        localStorage.setItem('status', 'Signout Successfully');
        fetchStatus.mockReturnValue('Signout Successfully');

        render(
            <MemoryRouter>
                <Layout hideButton={false}>Child Component</Layout>
            </MemoryRouter>
        );

        // Click the close button on the toast
        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);

        // Ensure toast is no longer visible
        expect(screen.queryByText('Signout Successfully')).not.toBeInTheDocument();
    });
});
