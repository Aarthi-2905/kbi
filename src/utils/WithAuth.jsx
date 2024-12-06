import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../utils/AuthUtils'; // Utility function for token validation

const withAuth = (WrappedComponent) => {
    const ProtectedComponent = (props) => {
        const navigate = useNavigate();
        const token = localStorage.getItem('token');

        useEffect(() => {
            const checkAuth = async () => {
                const isValid = await verifyToken(token, navigate);
                if (!isValid) {
                navigate('/'); // Redirect to login if token is invalid
                }
            };
            checkAuth();
        }, [token, navigate]);

        // Only render the component if token is valid
        return token ? <WrappedComponent {...props} /> : null;
    };

    return ProtectedComponent;
};

export default withAuth;
