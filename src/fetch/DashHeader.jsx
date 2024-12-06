// api.js
const getToken = () => localStorage.getItem('token');

// To get all the notifications for a specific user or Admin
export async function allNotifications() {
    const token = getToken();
    try {
        const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        return data.detail.map(item => {
            if (item.from && item.status) {
                return `${item.file_name} from ${item.from} was ${item.status}`;
            } else {
                return `${item.file_name} from ${item.email}`;
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

// To delete a particular notification
export async function readOneNotification(file_name, email) {
    const token = getToken();
    try {
        const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/notifications/read_one`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ file_name, email }),
        });
        if (!response.ok) {
            throw new Error('Failed to delete notification');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
}

// To clear all notifications for a particular user
export async function clearAllTheNotifications() {
    const token = getToken();
    try {
        const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/notifications/read_all`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });
        if (!response.ok) {
            throw new Error('Failed to clear all notifications');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error clearing all notifications:', error);
        throw error;
    }
}
