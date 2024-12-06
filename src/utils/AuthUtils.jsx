// src/utils/AuthUtils.js
export const verifyToken = async (token, navigate) => {
    if (!token) return false;
  
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
  
    try {
    //   const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/verify`, requestOptions);
    const data = {
        "role": "super_admin",
        "username": "super admin"
    };
    //   const data = await response.json();
  
      if (data?.role) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.name);
        return true;
      } else {
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };
  