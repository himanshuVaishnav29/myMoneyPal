

import React, { useState, useRef, useEffect } from 'react';
import { LuBox, LuUser, LuHistory, LuMessageSquare, LuCalendar, LuLogOut } from 'react-icons/lu';
import { FaSuitcase,FaTimes } from 'react-icons/fa';
import { GrAnalytics } from "react-icons/gr";
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { toast } from 'react-hot-toast';
import { FcMoneyTransfer } from "react-icons/fc";


const Sidebar = ({ isOpen, toggleSidebar }) => {
    const sidebarRef = useRef(null);
    const myLogo = './myMoneyPalLogo.png'; // Path to your logo image

    const client = useApolloClient();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [logout] = useMutation(LOGOUT, {
        update(cache) {
            cache.writeQuery({
                query: GET_AUTHETICATED_USER,
                data: { authUser: null }
            });
        }
    });

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            // Remove token from localStorage FIRST so middleware won't find it during subsequent queries
            try { localStorage.removeItem('token'); } catch(e) { /* ignore */ }

            // Then logout on server
            await logout();

            // Finally clear Apollo cache
            try {
                await client.clearStore();
            } catch (cacheErr) {
                console.warn('Error clearing Apollo cache after logout', cacheErr);
            }

            toast.success("Logout Successful");
            toggleSidebar(); // Close sidebar after logout
        } catch (error) {
            console.log("Error in handleLogout", error);
            toast.error(error.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleLinkClick = () => {
        toggleSidebar();
    };

    const SIDEBAR_LINKS = [
        { id: 1, path: "/dashboard", name: "Dashboard", icon: LuBox },
        { id: 2, path: "/dashboard/analytics", name: "Analytics", icon: GrAnalytics },
        { id: 3, path: "/dashboard/history", name: "Transactions", icon: LuHistory },
        { id: 4, path: "/dashboard/statement", name: "Statement", icon: FaSuitcase },
        { id: 5, path: "/dashboard/profile", name: "My Profile", icon: LuUser },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    // Function to check if the current path matches a base path
    const isActiveLink = (linkPath) => {
        if (linkPath === "/dashboard") {
            return currentPath === "/dashboard";
        }
        return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e) => {
            // Only auto-close on small screens (Tailwind 'md' breakpoint = 768px)
            if (window.innerWidth >= 768) return;
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                toggleSidebar();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isOpen, toggleSidebar]);

    return (
        <>
            {/* Overlay for small screens */}
            <div
                className={`fixed inset-0 z-40 md:hidden pointer-events-none transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0'}`}
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                onClick={() => {
                    if (window.innerWidth < 768) toggleSidebar();
                }}
            />

            {/* Sidebar container */}
            <div
                ref={sidebarRef}
                className={`fixed left-0 top-0 z-50 md:w-56 min-h-full bg-gray-900 text-white shadow-lg pt-8 px-4 transition-transform transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
            <div className="flex justify-end mb-4 md:hidden">
                <button onClick={toggleSidebar}>
                    <FaTimes size={24} className="text-white" />
                </button>
            </div>
           <div className='flex justify-center md:justify-start items-center mb-8 space-x-2 pb-6 px-2 md:px-0'>
                {/* Branding - visible on all sizes, responsive */}
                <Link to='/dashboard' className='flex items-center space-x-2 w-auto cursor-pointer'>
                    <img src={myLogo} alt='My MoneyPal logo' className='w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 object-contain' />
                    <span className='font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none tracking-tight text-sm sm:text-sm md:text-lg'>My MoneyPal</span>
                </Link>
            </div>

            <ul className='mt-6 space-y-6'>
                {
                    SIDEBAR_LINKS.map((link, index) => (
                        <li
                            key={index}
                            style={{ transitionDelay: `${index * 50}ms` }}
                            className={`font-medium rounded-md py-2 px-5 hover:font-bold hover:text-purple-500 transition-all duration-300 ease-in-out transform ${isActiveLink(link.path) ? "form-Background text-neutral-200 font-thin" : ""} ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 md:opacity-100 md:translate-x-0'}`}
                        >
                            

                        {/* // <li 
                        //     key={index} 
                        //     className={`font-medium rounded-md py-2 px-5 relative hover:bg-gray-100 hover:text-indigo-500 
                        //     ${isActiveLink(link.path) ? "active-link" : ""}`}
                        // >     */}
                            <Link
                                to={link.path}
                                className='flex items-center space-x-2 sm:space-x-4 md:space-x-5 justify-start w-full'
                                onClick={handleLinkClick}
                            >
                                <span>{link.icon()}</span>
                                <span className='text-sm   md:flex '>{link.name}</span>
                            </Link>
                        </li>
                    ))
                }
                <li className='font-medium rounded-md py-2 px-5 hover:text-red-500' style={{ transitionDelay: `${SIDEBAR_LINKS.length * 50}ms` }}>
                    <button
                        className={`flex justify-start items-center space-x-2 sm:space-x-4 md:space-x-5 w-full text-left ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <span><LuLogOut /></span>
                        <span className='text-sm md:flex'>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </li>
            </ul>
        </div>
        </>
    );
};

export default Sidebar;
