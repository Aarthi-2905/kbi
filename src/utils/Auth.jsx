
export const setToken = (token) => {
    localStorage.setItem('token', token)
} 

export const setName = (username) => {
    localStorage.setItem('username', username);
};

export const setUseremail = (useremail) => {
    localStorage.setItem('useremail', useremail);
};

export const setRole = (role) => {
    localStorage.setItem('role', role);
}

export const setStatus = (status) => {
    localStorage.setItem('status', status);
}

export const fetchToken = () => {
    return localStorage.getItem('token')
}

export const fetchUsername = () => {
    return localStorage.getItem('username')
}

export const fetchUseremail = () => {
    return localStorage.getItem('useremail')
}

export const fetchRole = () => {
    return localStorage.getItem('role')
}

export const fetchStatus = () => {
    return localStorage.getItem('status')
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
};



