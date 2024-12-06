import React, { useEffect, useState } from 'react';
import { Button, Navbar, NavbarToggle, Popover } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaTimes } from 'react-icons/fa';
import { verifyToken } from '../utils/AuthUtils';
import { allNotifications, readOneNotification, clearAllTheNotifications } from '../fetch/DashHeader';

const DashHeader = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (token) {
            verifyToken(token, navigate);
        }
    }, [navigate, token]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationData = await allNotifications();
                setNotifications(notificationData);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    const handleClearNotification = async (index) => {
        const notificationToRemove = notifications[index];
        const [file_name, email] = notificationToRemove.split(" from ");
        const emailToUse = role === 'admin' || role === 'super_admin' ? email.split(" ")[0] : localStorage.getItem("email");

        try {
            await readOneNotification(file_name, emailToUse);
            setNotifications(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error clearing notification:', error);
        }
    };

    const handleClearAllNotifications = async () => {
        try {
            await clearAllTheNotifications();
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing all notifications:', error);
        }
    };

    return (
        <Navbar className='border-b-2 border-black shadow-custom-bottom bg-[rgb(31,41,55)]'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold text-white inline-flex mt-2 pl-5'>
                <span>
                    <img src="/assets/varphi final logo-01.png" alt='logo' className='m-0 w-[50px] h-[px] px-2' />
                </span>
                Varphi KBI
            </Link>
            <div className='flex gap-2 md:order-2 pr-6'>
                {role !== 'admin' && (
                    <Popover aria-labelledby="notification-popover" content={
                        <div className="w-64 p-3 max-h-[69vh] overflow-y-auto">
                            <div className="mb-3 flex justify-between">
                                <span className="font-semibold text-black">Notifications</span>
                                <Button onClick={handleClearAllNotifications} color='gray' size={'22px'} className="text-xs text-blue-500 px-2">
                                    Clear All
                                </Button>
                            </div>
                            <ul>
                                {notifications.map((notification, index) => (
                                    <li key={index} className="mb-2 flex justify-between items-center">
                                        <span className="text-sm text-black mt-3 p-3 break-all">{notification}</span>
                                        <FaTimes className="text-black-400 hover:text-red-500 cursor-pointer flex-shrink-0" onClick={() => handleClearNotification(index)} />
                                    </li>
                                ))}
                            </ul>
                            {notifications.length === 0 && (
                                <div className="text-sm text-gray-400">No new notifications</div>
                            )}
                        </div>
                    }>
                        <Button className='w-15 h-10 hidden sm:inline focus:ring-4 focus:ring-sky-400 bg-gray-800 text-white border-none' color='gray' pill>
                            <FaBell />
                            {notifications.length > 0 && (
                                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
                                    {notifications.length}
                                </span>
                            )}
                        </Button>
                    </Popover>
                )}
                <NavbarToggle />
            </div>
        </Navbar>
    );
};

export default DashHeader;
