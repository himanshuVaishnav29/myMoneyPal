import React, { useState, useRef, useEffect } from 'react';
import { CreateTransactionModal } from './CreateTransactionModal'; 
import { FaBars } from "react-icons/fa6";
import { LuUser, LuLogOut } from 'react-icons/lu';
import { FaChevronDown } from 'react-icons/fa';
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatName } from '../helpers/helperFunctions';

const myLogo = "/myMoneyPalLogo.png"; 

const Header = ({ loggedInUser, toggleSidebar, isOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      await logout();
      await client.clearStore();
      toast.success("Logout Successful");
      setIsDropdownOpen(false);
    } catch (error) {
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Local Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Outfit:wght@400;600&display=swap');
          .font-brand { font-family: 'Orbitron', sans-serif; }
          .font-user { font-family: 'Outfit', sans-serif; }
        `}
      </style>

      <div className={`
        sticky top-0 w-full z-30 flex justify-between items-center 
        p-4 md:px-8 text-neutral-100 transition-all duration-300
        backdrop-blur-xl bg-[#0B0F19]/80 header-glow
        md:${isOpen ? "backdrop-blur-xl bg-[#0B0F19]/80" : "bg-transparent backdrop-blur-none"}
      `}>
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          
          {/* Mobile Toggle */}
          <button 
            className='md:hidden text-gray-300 hover:text-white transition-colors p-1' 
            onClick={toggleSidebar}
          >
            <FaBars size={22} />
          </button>

          {/* Desktop Welcome Text */}
          <div className="hidden md:block">
            <h1 className='text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-0.5 font-user'>
              Welcome Back
            </h1>
            <p className='text-base font-bold text-white tracking-wide font-brand'>
              {formatName(loggedInUser?.fullName)}
            </p>
          </div>

          {/* MOBILE BRANDING FIX — TEXT → LOGO SWITCH */}
          <div className="md:hidden flex items-center flex-1 min-w-0">
            
            {/* Full Text — visible only when enough width */}
            <span
              className="
                font-bold text-base truncate 
                bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
                bg-clip-text text-transparent leading-none font-brand tracking-wider
                max-[370px]:hidden    /* 🔥 Hide text if screen < 370px */
              "
            >
              MoneyPal
            </span>

            {/* Logo — shown only when text is hidden */}
            <img 
              src={myLogo}
              alt="MoneyPal Logo"
              className="hidden max-[370px]:block h-6 w-auto ml-1"
            />
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className='flex items-center space-x-3 sm:space-x-6 flex-shrink-0'>
          
          {/* Add Transaction */}
          <button
            onClick={toggleModal}
            className='btn px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm md:text-base'
          >
            <span className='hidden sm:inline'>Add Transaction</span>
            <span className='sm:hidden'>+ Add</span>
          </button>

          {/* Profile Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className='flex items-center space-x-2 p-1 rounded-full hover:bg-white/5'
            >
              <div className="relative">
                <img
                  src={loggedInUser?.profilePicture}
                  className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0F19] rounded-full"></span>
              </div>

              <FaChevronDown 
                className={`text-gray-400 text-[10px] sm:text-xs transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`}
              />
            </button>

            {/* Dropdown */}
            <div 
              className={`
                absolute right-0 mt-4 w-60 
                bg-[#111827]/95 backdrop-blur-2xl 
                border border-indigo-500/20 rounded-2xl shadow-xl
                transform transition-all duration-200 origin-top-right z-50
                ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              `}
            >
              <div className="p-2 space-y-1">

                <div className="px-3 py-3 mb-2 border-b border-white/5 sm:hidden">
                  <p className="text-sm font-bold text-white">{formatName(loggedInUser?.fullName)}</p>
                  <p className="text-[10px] text-gray-400 truncate">{loggedInUser?.email}</p>
                </div>

                <button
                  onClick={handleProfile}
                  className='flex items-center w-full px-3 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-indigo-500/10'
                >
                  <LuUser className='mr-3 text-lg text-gray-500' />
                  <span className="font-user">My Profile</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className='flex items-center w-full px-3 py-3 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-500/10'
                >
                  <LuLogOut className='mr-3 text-lg text-gray-500' />
                  <span className="font-user">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>

              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[99999]">
            <CreateTransactionModal isOpen={isModalOpen} toggleModal={toggleModal} />
          </div>
        )}
      </div>
    </>
  );
};

export default Header;



