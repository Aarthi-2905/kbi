import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from 'pages/SignIn'; // Absolute import
import { loginUser } from 'fetch/SignIn';
import { setStatus } from 'utils/Auth';
import jwtDecode from 'jwt-decode';

jest.mock('fetch/SignIn', () => ({
    loginUser: jest.fn(),
}));

jest.mock('utils/Auth', () => ({
    setStatus: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('SignIn Component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );
    });

    test('renders SignIn component', () => {
        expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    test('shows password when toggle is clicked', () => {
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        const toggleButton = screen.getByLabelText(/toggle password visibility/i);

        expect(passwordInput).toHaveAttribute('type', 'password');

        fireEvent.click(toggleButton);

        expect(passwordInput).toHaveAttribute('type', 'text');
    });

    test('toggles password visibility when clicking the eye icon', () => {
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const togglePasswordButton = screen.getByLabelText(/toggle password visibility/i);

        // Check that password input is of type "password"
        expect(passwordInput).toHaveAttribute('type', 'password');

        // Click to toggle password visibility
        fireEvent.click(togglePasswordButton);

        // Check that password input type has changed to "text"
        expect(passwordInput).toHaveAttribute('type', 'text');

        // Click again to toggle back
        fireEvent.click(togglePasswordButton);

        // Check that password input type has reverted to "password"
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('displays error message on invalid credentials', async () => {
        // Mock rejected login response
        loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

        // Fill in the form with wrong credentials
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongPassword' } });

        // Simulate clicking the sign-in button
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText(/Invalid Credentials!!/i)).toBeInTheDocument();
        });
    });

    test('displays toast message on failed login', async () => {
        loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid Credentials!!')).toBeInTheDocument();
        });
    });

    test('displays toast message on successful login', async () => {
        const mockToken = 'mock-token';
        loginUser.mockResolvedValueOnce({ access_token: mockToken });
        jwtDecode.jwtDecode.mockReturnValueOnce({ role: 'user' });

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(localStorage.getItem('role')).toBe('user');
        expect(localStorage.getItem('status')).toBe('Loggedin Successfully');
    });
    // test('displays error when email and password are empty', async () => {
    //     render(
    //         <MemoryRouter>
    //             <SignIn />
    //         </MemoryRouter>
    //     );
    
    //     const signInButtons = screen.getAllByTestId(/sign-in-button/i); // Get all buttons
    //     fireEvent.click(signInButtons[0]); 

    //     // Wait for the error message to appear in the toast
    //     await waitFor(() => {
    //         const errorMessage = screen.getByText(/Fields/i);
    //         expect(errorMessage).toBeInTheDocument();
    //       });
    // });
});
