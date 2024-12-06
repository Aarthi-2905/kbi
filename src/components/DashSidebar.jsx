import React from 'react';
import { Sidebar, Modal, Button,TextInput } from 'flowbite-react';
import { HiUser,HiArrowSmRight,HiOutlineUserGroup,HiAnnotation,HiOutlineExclamationCircle, HiUserCircle,HiX} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import { logout, setStatus } from "../utils/Auth";
import {Flowbite} from 'flowbite-react'
import { verifyToken } from '../utils/AuthUtils';

const customTheme = {  
    sidebar: {    
        root: {      
            base: "h-full",      
            inner: "h-full overflow-y-auto overflow-x-hidden bg-[rgb(31,41,55)] py-12 pl-12 text-white "    
        }  
    }
};

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userrole = useState(localStorage.getItem('role'));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showProfileModal, setShowProfileModal] = useState(false); // For profile modal
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token, navigate);
        }
    }, [navigate]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = () => {
        logout();
        localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('role');
        setShowSignOutModal(false);
        navigate('/');
        // setStatus('Signout Successfully');
        // setStatus('Signout Successfully');
        localStorage.setItem('status','Signout Successfully');
    };


    const handleSaveProfile  = async (e) => {
        e.preventDefault();
        const updatedData = {
            username: username,
            email: email,
        };
        const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/users/edit/profile`,{
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                Authorization: "Bearer " + token,
            },
            body : JSON.stringify(updatedData),
        });
        if (response) {
            const updatedData = await response.json();
            // setUserData({ username: updatedData.username, email: updatedData.email });
            setShowProfileModal(false);
            setToast({
                show: true,
                message: updatedData.detail,
                type: 'success'
            });
           autoCloseToast();
           window.location.reload();
        } else{
            setToast({
                show: true,
                message: 'Failed to Update',
                type: 'error'
            });
            autoCloseToast();
        }
    };

    const handleOpenProfileModal = () => {
        // Populate the fields with data from local storage when opening the modal
        setUsername(localStorage.getItem('username') || '');
        setEmail(localStorage.getItem('email') || '');
        setShowProfileModal(true);
    };

    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };
    const renderToast = () => {
        if (!toast.show) return null;
        const alertStyle = toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';
    
        return (
            <div  role="alert" style={{ zIndex: 9999 }}
                className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
            >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button" aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })}>
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };

  

    // const activeStyle = 'bg-gray-600 font-semibold text-white hover:bg-gray-100 hover:text-black'; // Active tab style
    // const inactiveStyle = 'hover:bg-gray-100 hover:text-black text-white'; // Inactive tab hover style

    const activeStyle = 'bg-gradient-to-r from-[rgba(31,41,55,0)] to-[rgba(168,224,255,1)] hover:font-semibold font-semibold text-white hover:bg-gray-100 hover:text-black  w-full pr-0 rounded-none'; // Active tab style
    const inactiveStyle = 'hover:bg-gradient-to-r hover:from-[rgba(31,41,55,0)] hover:font-semibold hover:to-[rgba(168,224,255,1)] hover:text-black text-white rounded-none'; // Inactive tab hover style


    return (
        <>
            <Flowbite theme={{ theme: customTheme }}>
                <div className='justify-centre items-center mb-4'>
                    {renderToast()}
                </div>
                <Sidebar className='w-80 h-full bg-gray-800 '>
                    <Sidebar.Items className='flex flex-col h-full '>
                        <Sidebar.ItemGroup className='flex flex-col gap-1 text-white'>
                            <Link to='/dashboard?tab=dash'>
                                <Sidebar.Item className={`${tab === 'dash' || !tab ? activeStyle : inactiveStyle}`}
                                    icon={() => <FaRobot style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                    Chat Interface
                                </Sidebar.Item>
                            </Link>
                            {localStorage.getItem('role') === 'super_admin' && (
                                <>
                                    <Link to='/dashboard?tab=users'>
                                        <Sidebar.Item className={`${tab === 'users' ? activeStyle : inactiveStyle}`}
                                            icon={() => <HiOutlineUserGroup  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                            User Management
                                        </Sidebar.Item>
                                    </Link>
                                    <Link to='/dashboard?tab=requests'>
                                        <Sidebar.Item className={`${tab === 'requests' ? activeStyle : inactiveStyle}`}
                                            icon={() => <HiAnnotation  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                            Requested Files
                                        </Sidebar.Item>
                                    </Link>
                                    
                                </>
                            )}
                                <Sidebar.Item className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                                    icon={() => <HiUser style={{ color: 'rgb(168,224,255)', fontSize: '28px'}} />}
                                    onClick={handleOpenProfileModal}>
                                    <div className="flex items-center justify-between w-full ">
                                        <span>Profile</span>
                                        <span className="px-2 py-1 mr-16 text-xs font-medium bg-gray-700 hover:text-white rounded">
                                            {localStorage.getItem('role')}
                                        </span>
                                    </div>
                                </Sidebar.Item>
                                <Sidebar.Item icon={() => <HiArrowSmRight  style={{ color: 'rgb(168,224,255)', fontSize: '28px'}} />} 
                                className={`${tab === '#' ? activeStyle : inactiveStyle}  `}
                                    onClick={() => setShowSignOutModal(true)}>
                                    Sign Out
                                </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                <Modal show={showSignOutModal} onClose={() => setShowSignOutModal(false)} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center m-8 mr-1- ml-10'>
                            <h1 className='text-black font-bold text-xl'>Sign Out</h1>
                            <img  src="/assets/signout.png"  alt="signout Icon"
                                className="mx-auto m-8 mb-5 h-20 w-20 object-contain" 
                            />
                            <h3 className='mb-5 text-lg  text-black'>
                                Are you sure you want to sign out?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleSignOut} aria-label='Sign Out'>
                                  Sign Out
                                </Button>
                                <Button color='gray' onClick={() => setShowSignOutModal(false)}>
                                    No, Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)}
                 popup className="w-full lg:w-10/5">
                <Modal.Header />
                <Modal.Body className='flex flex-col items-center '>
                    <h1 className='my-1 text-center font-semibold text-3xl'>Profile</h1>
                    <div className='mb-5 self-center cursor-pointer shadow-md overflow-hidden 
                        rounded-full text-gray-500'>
                        <HiUserCircle className='w-24 h-24 text-black' />
                    </div>
                    <h3 className='mb-4 text-xl font-semibold text-black'>{username}</h3>
                    <div className='flex flex-col gap-5 w-full px-12'>
                        <form className='flex flex-col gap-4'>
                            <div className='flex justify-between w-full'>
                                <div className='flex flex-col w-1/2 pr-2'>
                                    <label className='text-left text-black font-bold'>Username:</label>
                                    <TextInput
                                        className="my-2"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder='Username'
                                    />
                                </div>
                                <div className='ml-10 flex flex-col w-1/2 pl-2'>
                                    <label className='text-left text-black font-bold'>Email:</label>
                                    <TextInput
                                        className="my-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Email'
                                        disabled
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Save & Cancel Buttons */}
                    <div className='flex justify-center gap-4 mt-6'>
                        <Button color='success' onClick={handleSaveProfile} className='bg-customGreen'>
                            Save Change
                        </Button>
                        <Button  class="text-white bg-gradient-to-r from-red-400 via-red-500
                            to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                             focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                             text-sm px-4  text-center" onClick={() => setShowProfileModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            </Flowbite>
        </>
    );
}

