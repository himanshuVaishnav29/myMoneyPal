import React, { useState, useRef, useEffect } from 'react';
import { CreateTransactionModal } from './CreateTransactionModal'; 
import { FaBars, FaPlus } from "react-icons/fa6";
import { LuUser, LuLogOut } from 'react-icons/lu';
import { FaChevronDown } from 'react-icons/fa';
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatName } from '../helpers/helperFunctions';

const Header = ({ loggedInUser, toggleSidebar, isOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const myLogo = '/myMoneyPalLogo.png'; 

  const [logout] = useMutation(LOGOUT, {
    update(cache) {
      cache.writeQuery({
        query: GET_AUTHETICATED_USER,
        data: { authUser: null }
      });
    }
  });
  const client = useApolloClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      try { localStorage.removeItem('token'); } catch(e) {}
      await logout();
      try { await client.clearStore(); } catch (e) {}
      toast.success("Logout Successful");
      setIsDropdownOpen(false);
    } catch (error) {
      console.log("Error in handleLogout", error);
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfile = () => {
    navigate('/dashboard/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Outfit:wght@400;600&display=swap');
          
          .font-brand { font-family: 'Orbitron', sans-serif; }
          .font-user { font-family: 'Outfit', sans-serif; }
          
          .header-glow {
            box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.2);
            border-bottom: 1px solid rgba(167, 139, 250, 0.1);
          }
        `}
      </style>

      {/* --- HEADER CONTAINER --- */}
      {/* Reverted padding to p-4 to match original height */}
      <div className={`
        sticky top-0 z-30 flex justify-between items-center p-4 md:px-8 text-neutral-100 transition-all duration-300
        backdrop-blur-xl bg-[#0B0F19]/80 header-glow
        md:backdrop-blur-none md:shadow-none md:border-b-0
        ${isOpen ? 'md:bg-[#0B0F19]/80 md:backdrop-blur-xl' : 'md:bg-transparent'}
      `}>
        
        {/* LEFT: Toggle + Brand */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className='md:hidden text-gray-300 hover:text-white transition-colors p-1' 
            onClick={toggleSidebar}
          >
            <FaBars size={20} />
          </button>

          {/* Desktop Text */}
          <div className="hidden md:block">
            <h1 className='text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-0.5 font-user'>
              Welcome Back
            </h1>
            <p className='text-base font-bold text-white tracking-wide font-brand'>
              {formatName(loggedInUser?.fullName)}
            </p>
          </div>

          {/* Mobile Branding Logic */}
          <div className="md:hidden flex items-center">
             {/* 1. Show Logo Image ONLY for < 360px */}
             <img 
               src={myLogo} 
               alt="Logo" 
               className="h-8 w-8 object-contain block min-[360px]:hidden" 
             />

             {/* 2. Show MoneyPal Text ONLY for >= 360px */}
             <span className='hidden min-[360px]:block font-bold text-base bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none font-brand tracking-wider'>
                MoneyPal
             </span>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className='flex items-center gap-3 sm:gap-6'>
          
          {/* Add Button - Original Styling Restored */}
          <div>
             <button
                onClick={toggleModal}
                // Original classes, no custom font applied here
                className='btn px-3 py-2 text-xs sm:px-5 sm:py-2 sm:text-sm md:text-base flex items-center gap-2'
              >
                <span className='hidden sm:inline'>Add Transaction</span>
                {/* Simple mobile text/icon */}
                <span className='sm:hidden flex items-center gap-1'>
                  <FaPlus size={10} /> Add
                </span>
              </button>
          </div>

          {/* Profile Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className='flex items-center gap-2 group focus:outline-none p-1 rounded-full hover:bg-white/5 transition-colors'
            >
              <div className="relative">
                <img
                  src={loggedInUser?.profilePicture}
                  alt='profilePicture'
                  className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-indigo-500/50 
                             shadow-[0_0_12px_rgba(99,102,241,0.5)] 
                             group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] 
                             group-hover:border-purple-400 transition-all duration-300'
                  loading='lazy'
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0F19] rounded-full"></span>
              </div>
              
              <FaChevronDown 
                className={`text-gray-400 text-[10px] sm:text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-white' : 'group-hover:text-indigo-300'}`} 
              />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`
                absolute right-0 mt-4 w-56 
                bg-[#111827]/95 backdrop-blur-2xl 
                border border-indigo-500/20 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
                transform transition-all duration-200 origin-top-right z-50
                ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
              `}
            >
              <div className="p-2 space-y-1">
                <div className="px-3 py-3 mb-2 border-b border-white/5 sm:hidden">
                  <p className="text-sm font-bold text-white font-brand">{formatName(loggedInUser?.fullName)}</p>
                  <p className="text-[10px] text-gray-400 truncate font-mono">{loggedInUser?.email}</p>
                </div>

                <button
                  onClick={handleProfile}
                  className='flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-300 hover:pl-4 transition-all duration-200 group'
                >
                  <LuUser className='mr-3 text-lg text-gray-500 group-hover:text-indigo-400 transition-colors' />
                  <span className="font-user">My Profile</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:pl-4 transition-all duration-200 group ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={isLoggingOut}
                >
                  <LuLogOut className='mr-3 text-lg text-gray-500 group-hover:text-red-400 transition-colors' />
                  <span className="font-user">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL PORTAL (FIXED Z-INDEX) --- */}
      {/* Wrapped in text-white to fix the "black text" issue caused by moving it out of the header context */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center isolate text-white">
            {/* Full Screen Blur Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={toggleModal}
            ></div>
            
            {/* Modal Content Wrapper */}
            <div className="relative z-10 w-full max-w-lg px-4">
                <CreateTransactionModal isOpen={isModalOpen} toggleModal={toggleModal} />
            </div>
        </div>
      )}
    </>
  );
};

export default Header;



