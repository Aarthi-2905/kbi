// Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from 'components/Header';

describe('Header Component', () => {
    test('renders logo and title', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        // Check if the logo is rendered
        const logo = screen.getByAltText(/logo/i);
        expect(logo).toBeInTheDocument();
        
        // Check if the title is rendered
        expect(screen.getByText(/Varphi KBI/i)).toBeInTheDocument();
    });

    test('renders Sign In button when hideSigninButton is false', () => {
        render(
            <MemoryRouter>
                <Header hideSigninButton={false} />
            </MemoryRouter>
        );

        const signInButton = screen.getByRole('button', { name: /sign in/i });
        expect(signInButton).toBeInTheDocument();
    });

    test('does not render Sign In button when hideSigninButton is true', () => {
        render(
            <MemoryRouter>
                <Header hideSigninButton={true} />
            </MemoryRouter>
        );

        const signInButton = screen.queryByRole('button', { name: /sign in/i });
        expect(signInButton).not.toBeInTheDocument();
    });

    test('renders navigation links when hideSigninButton is true', () => {
        render(
            <MemoryRouter>
                <Header hideSigninButton={true} />
            </MemoryRouter>
        );

        const homeLink = screen.getByText(/home/i);
        expect(homeLink).toBeInTheDocument();
    });
});
