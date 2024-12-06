import React from 'react';
import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, Popover } from 'flowbite-react';
import { useState } from 'react';
// import { varphilogo } from '../assets/index.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';

const Header = ({ hideSigninButton }) => {
    const path = useLocation().pathname;
  
    return (
        <Navbar className='border-b-2 border-slate-400 shadow-custom-bottom
            shadow-custom-bottom bg-[rgb(31,41,55)]'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold
                 text-white inline-flex mt-2 pl-5'>
                <span>
                    <img src="/assets/varphi final logo-01.png" alt='logo' className='m-0 w-[50px] h-[px] px-2' />
                </span>
                Varphi KBI
            </Link>
            {!hideSigninButton && (
                <div className='flex gap-2 md:order-2 pr-6'>
                    <Link to='/sign-in'>
                        <Button gradientDuoTone="purpleToBlue">Sign In</Button>
                    </Link>
                    <NavbarToggle></NavbarToggle>
                </div>
            )}
             {hideSigninButton && (
            <NavbarCollapse>
                <NavbarLink active={path === '/'} as={'div'} className='text-lg text-white'>
                    <Link to='/'>Home</Link>
                </NavbarLink>

            </NavbarCollapse>
             )}
        </Navbar>
    );
};

export default Header;
