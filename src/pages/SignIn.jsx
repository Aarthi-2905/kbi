import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card } from 'flowbite-react';
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import {loginUser} from '../fetch/SignIn';
import Header from '../components/Header';
import { jwtDecode } from 'jwt-decode';
import {  HiX } from 'react-icons/hi';
import { setStatus } from "../utils/Auth";

const SignIn = () => {
    const navigate = useNavigate();
    //Holds the email entered by the user.
    const [email, setEmail] = useState("");
    //Holds the password entered by the user. 
    const [password, setPassword] = useState("");
    //Toggles the visibility of the password.
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });


    //Toggles the state of showPassword to show or hide the password.
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };

    //Handles form submission, validates input, calls the login API, and sets authentication data upon success.
    const handleLoginForm = async (event) => {
        event.preventDefault();
        if (email === '' || password === '') {
        // if (email === 'admin@unwita.com' || password === '123') {
            setToast({
                show: true,
                message: 'Email and password are required',
                type: 'error'
            });
            autoCloseToast(); 
            // localStorage.setItem('token', "sfjsgfjhsgfysdgfhgbshjgj")
            // localStorage.setItem("status", "Loggedin Successfully");
            // navigate('/dashboard');
            return;
        }
    
        try {
            const data = await loginUser(email, password);
            const user = jwtDecode(data['access_token']);
    
            if (!data['access_token']) {
                setToast({
                    show: true,
                    message: 'Invalid Token',
                    type: 'error'
                });
            } else {
                localStorage.setItem('token', data['access_token']);
                localStorage.setItem("role", user["role"]);
                // localStorage.setItem('token', "sfjsgfjhsgfysdgfhgbshjgj")
                localStorage.setItem("status", "Loggedin Successfully");
                navigate('/dashboard');
                
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Invalid Credentials!!',
                type: 'error'
            });
            autoCloseToast(); 
        }
    };
    
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
                <button type="button" aria-label="Close"
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
        <>
            <Header hideSigninButton={true}/>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-signinpage" >
                <div className='justify-centre items-center mb-4'>
                    {renderToast()}
                </div>
                <Card className='w-full max-w-md max-h-max mt-12 text-center h-[50vh] mb-28'>
                    <h2 className='font-bold  text-black text-4xl text-center mb-7'>Sign In</h2>
                    <form className='flex flex-col gap-6 mb-1 '  onSubmit={handleLoginForm}>
                        <div className="relative">
                            <TextInput type='email' placeholder='Email' id='email' required
                                value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
                        </div>
                        <div className="relative">
                            <TextInput type={showPassword ? "text" : "password"} placeholder="Password" required
                                value={password}  id="password" onChange={(e) => setPassword(e.target.value)} />
                            <span onClick={handleTogglePassword} className="absolute right-3 top-1/2 
                                transform -translate-y-1/2 text-black cursor-pointer"
                                aria-label="toggle password visibility">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span> 
                        </div>
                        <Button aria-label='Sign In' data-testid="sign-in-button" gradientDuoTone="purpleToBlue" type='submit' className='text-xl  mt-4'>
                            Sign In
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default SignIn;
