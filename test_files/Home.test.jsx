import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from 'pages/Home';
import Header from 'components/Header';
import Layout from 'components/Layout';

// Mocking components if needed
jest.mock('components/Header', () => () => <div data-testid="header-component">Header Mock</div>);
jest.mock('components/Layout', () => ({ children }) => <div data-testid="layout-component">{children}</div>);

describe('Home Component', () => {
    test('renders Header and Layout components', () => {
        render(<Home />);

        // Check if the Header component is rendered
        const headerElement = screen.getByTestId('header-component');
        expect(headerElement).toBeInTheDocument();

        // Check if the Layout component is rendered
        const layoutElement = screen.getByTestId('layout-component');
        expect(layoutElement).toBeInTheDocument();
    });

    test('passes props to Header component', () => {
        render(<Home />);
        
        // Check if Header is passed the correct prop (hideSigninButton = false)
        const headerElement = screen.getByTestId('header-component');
        expect(headerElement).toHaveTextContent('Header Mock');
    });

    // Add more tests as necessary
});
