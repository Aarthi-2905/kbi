import React from 'react';
import {useState,useEffect} from 'react';
import { Link } from "react-router-dom";
import { Button } from 'flowbite-react';
import { FaArrowRight } from 'react-icons/fa';
import { fetchStatus, setStatus } from '../utils/Auth';
import {  HiX } from 'react-icons/hi';

const Layout = ({ children, hideButton }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); 
    };

    //Checks and displays the login status.
    useEffect(() => {
        const loginStatus = localStorage.getItem('status');
        if (loginStatus === "Signout Successfully") {
            setToast({ show: true, message: loginStatus, type: 'success' });
            autoCloseToast();
            localStorage.setItem('status','');
            setStatus('');
        }
        if (loginStatus === "Token expired please login again") {
            setToast({ show: true, message: loginStatus, type: 'success' });
            autoCloseToast();
            localStorage.setItem('status','');
            setStatus('');
        }
    }, []);
    
    const renderToast = () => {
        if (!toast.show) return null;
    
        const alertStyle = toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';

        return (
            <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
                 role="alert" style={{ zIndex: 9999 }} 
            >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button"   aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })} 
                >
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };
    return (
        <div className='min-h-screen  overflow-hidden bg-[rgb(16,23,42)] bg-cover bg-center bg-no-repeat bg-landingpage'>
            <div className="justify-center items-center mb-4">
                {renderToast()}
            </div>
            <section className='flex justify-between items-center max-lg:flex-col '>
                {/* left */}
                <div className='flex-1 p-3 max-w-3xl mx-auto gap-4 mt-11 py-8'>
                    <h2 className='font-palanquin capitalize text-4xl lg:max-w-lg text-white ml-12'>
                        Data Integration Platform
                        <span className='text-teal-400'> For </span>
                        <span className='text-teal-400'> Data AI</span>
                    </h2>
                    <p className='mt-4 lg:max-w-lg info-text ml-12 text-white'>
                        AI chatbots are sophisticated programs that simulate human conversation through natural language processing and machine learning.
                    </p>
                    <p className='mt-6 lg:max-w-lg info-text ml-12 text-white'>
                        These chatbots can understand and respond to user queries in real-time, providing efficient and scalable communication solutions.
                    </p>
                    {!hideButton && (
                        <div className='mt-11'>
                            <Link to={'/sign-in'}>
                                <Button gradientDuoTone="purpleToBlue" size="lg" className='ml-12 text-white'>
                                    Get Started
                                    <span className='ml-3'><FaArrowRight className='mt-1' /></span>
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                {/* right */}
                <div className='flex-1 flex justify-center items-center mt-10 ml-10 mr-10'>
                    {children}
                </div>
            </section>
        </div>
    );
};

export default Layout;
