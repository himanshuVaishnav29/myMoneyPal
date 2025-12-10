import React, { useRef, useEffect, useState } from 'react';
import { LuBox, LuUser, LuHistory, LuBrain, LuTrendingUp, LuLogOut } from 'react-icons/lu';
import { FaSuitcase, FaTimes } from 'react-icons/fa';
import { GrAnalytics } from "react-icons/gr";
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { toast } from 'react-hot-toast';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const sidebarRef = useRef(null);
    const myLogo = '/myMoneyPalLogo.png'; 
    const location = useLocation();
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
            try { localStorage.removeItem('token'); } catch(e) {}
            await logout();
            try { await client.clearStore(); } catch (e) {}
            toast.success("Logout Successful");
            if (window.innerWidth < 768) toggleSidebar();
        } catch (error) {
            console.error("Logout error", error);
            toast.error(error.message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const SIDEBAR_LINKS = [
        { path: "/dashboard", name: "Dashboard", icon: LuBox },
        { path: "/dashboard/analytics", name: "Analytics", icon: GrAnalytics },
        { path: "/dashboard/ai-suggestions", name: "AI Suggestions", icon: LuBrain },
        { path: "/dashboard/future-insights", name: "Future Insights", icon: LuTrendingUp },
        { path: "/dashboard/history", name: "Transactions", icon: LuHistory },
        { path: "/dashboard/statement", name: "Statement", icon: FaSuitcase },
        { path: "/dashboard/profile", name: "My Profile", icon: LuUser },
    ];

    const isActive = (path) => {
        const currentPath = location.pathname;
        if (path === "/dashboard") {
            return currentPath === "/dashboard" || currentPath === "/dashboard/";
        }
        return (
            currentPath === path || 
            currentPath === `${path}/` || 
            currentPath.startsWith(`${path}/`)
        );
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleOutside = (e) => {
            if (window.innerWidth < 768 && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                toggleSidebar();
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isOpen, toggleSidebar]);

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar Container */}
            <aside 
                ref={sidebarRef}
                className={`fixed top-0 left-0 z-50 h-full w-64 md:w-56 bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                {/* 1. Header & Logo */}
                <div className="flex-none p-5 md:p-6 flex items-center justify-between border-b border-gray-800/50">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 md:group-hover:border-indigo-500/50 transition-all duration-300">
                            <img src={myLogo} alt="Logo" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base md:text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                                My MoneyPal
                            </span>
                        </div>
                    </Link>
                    
                    <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* 2. Scrollable Navigation Links */}
                {/* CHANGED: py-3 (mobile) md:py-6 (desktop) and space-y-1 (mobile) md:space-y-2 (desktop) */}
                <div className="flex-1 overflow-y-auto sidebar-scroll px-3 py-3 md:py-3 space-y-1 md:space-y-2">
                    <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Menu</p>
                    
                    {SIDEBAR_LINKS.map((link, index) => {
                        const active = isActive(link.path);
                        const Icon = link.icon;
                        
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                /* CHANGED: py-2.5 (mobile) md:py-3.5 (desktop) */
                                className={`
                                    relative flex items-center gap-3 px-3 py-2.5 md:py-3.5 rounded-lg transition-all duration-300 group
                                    ${active 
                                        ? 'nav-item-active text-white font-medium' 
                                        : 'text-gray-400 active:bg-gray-800 md:hover:bg-gray-800 md:hover:text-white'
                                    }
                                `}
                            >
                                <Icon className={`text-xl transition-colors ${active ? 'text-purple-400' : 'text-gray-500 md:group-hover:text-indigo-400'}`} />
                                <span className="text-sm">{link.name}</span>
                                
                                {active && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* 3. Footer / Logout */}
                <div className="flex-none p-5 border-t border-gray-800 bg-gray-900">
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-red-500/20 text-red-400 bg-red-500/5 active:bg-red-500/10 md:hover:bg-red-500/10 md:hover:border-red-500/40 transition-all duration-300 group"
                    >
                        <LuLogOut className="text-lg md:group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
