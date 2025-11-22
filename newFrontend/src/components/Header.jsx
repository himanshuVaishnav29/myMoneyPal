// import React from 'react';
// import {GoBell} from 'react-icons/go';


// const Header = ({loggedInUser}) => {

//   return (
//     <div className='flex justify-between items-center p-4'>
//         <div>
//             <h1 className='text-xs'>Welcome Back!</h1>
//             <p className='text-xl font-semibold'>{loggedInUser?.fullName}</p>
//         </div>
//         <div className='flex items-center space-x-5 '>
//             <div className='hidden md:flex'>
//                 <input
//                   type='text'
//                   placeholder='Search...' 
//                   className='bg-indigo-100/30 px-4 py-2 rounded-lg focus:outline-0 focus:ring-2 focus:ring-indigo-600' 
//                 />
//             </div>
//             <div className='flex items-center space-x-5'>
//               <button className='relative text-2xl text-gray-600'>
//                   <GoBell size={28}/>
//                   <span className='absolute top-0 right-0 mt-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white '>
//                      9
//                   </span>
//               </button>
//               <img 
//                 src={loggedInUser?.profilePicture} 
//                 alt='profilePictuer'
//                 className='w-8 g-8 rounded-full border-2 border-indigo-400' />
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Header





// import React, { useState } from 'react';
// import { GoBell } from 'react-icons/go';
// import { CreateTransactionModal } from './CreateTransactionModal'; 

// const Header = ({ loggedInUser }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen);
//   };

//   return (
//     <div className='flex justify-between items-center p-4 text-neutral-100 '>
//       <div>
//         <h1 className='text-xs'>Welcome Back!</h1>
//         <p className='text-xl font-semibold'>{loggedInUser?.fullName}</p>
//       </div>
//       <div className='flex items-center space-x-5'>
//         <div>
//           {/* <button
//             onClick={toggleModal}
//             className='bg-indigo-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-indigo-700'
//           >
//             Add Transaction
//           </button> */}
//            <button
//               onClick={toggleModal}
//               // className="bg-indigo-500 text-white text-base sm:text-sm md:text-base px-4 py-2 rounded-lg focus:outline-none hover:bg-indigo-700"
//               className='btn px-4 py-2'
//             >
//               Add Transaction
//             </button>
          
//         </div>
//         <div className='flex items-center space-x-5 p-r-3'>
//           {/* <button className='relative text-2xl text-gray-600'>
//             <GoBell size={28} />
//             <span className='absolute top-0 right-0 mt-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>
//               9
//             </span>
//           </button> */}
//           <img
//             src={loggedInUser?.profilePicture}
//             alt='profilePicture'
//             className='w-8 h-8 rounded-full border-2 border-indigo-400'
//           />
//         </div>
//       </div>
//       {isModalOpen && <CreateTransactionModal isOpen={isModalOpen} toggleModal={toggleModal} />}
//     </div>
//   );
// };

// export default Header;




import React, { useState, useRef, useEffect } from 'react';
import { GoBell} from 'react-icons/go';
import { CreateTransactionModal } from './CreateTransactionModal'; 
import { FaBars } from "react-icons/fa6";
import { LuUser, LuLogOut } from 'react-icons/lu';
import { FaChevronDown } from 'react-icons/fa';
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatName } from '../helpers/helperFunctions';
const Header = ({ loggedInUser,toggleSidebar }) => {
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successful");
      setIsDropdownOpen(false);
    } catch (error) {
      console.log("Error in handleLogout");
      toast.error(error.message);
    }
  };

  const handleProfile = () => {
    navigate('/dashboard/profile');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
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
    <div className='flex justify-between items-center p-4  text-neutral-100'>
        <button className='md:hidden text-white' onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>
      <div>
        <h1 className='hidden md:block md:text-xs'>Welcome Back!</h1>
        <p className=' hidden md:block text-xl md:font-semibold'>{formatName(loggedInUser?.fullName)}</p>
      </div>

      <div className='flex items-center space-x-5'>
        <div>
          {/* <button
            onClick={toggleModal}
            className='bg-indigo-500 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-indigo-700'
          >
            Add Transaction
          </button> */}
           <button
              onClick={toggleModal}
              className='btn px-2 py-2 text-xs sm:px-4 sm:text-sm md:text-base'
            >
              <span className='hidden sm:inline'>Add Transaction</span>
              <span className='sm:hidden'>New txn</span>
            </button>
          
        </div>
        <div className='flex items-center space-x-5 p-r-3'>
          {/* <button className='relative text-2xl text-gray-600'>
            <GoBell size={28} />
            <span className='absolute top-0 right-0 mt-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>
              9
            </span>
          </button> */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className='flex items-center space-x-2 hover:bg-indigo-600/20 rounded-lg p-2 transition-colors duration-200'
            >
              <img
                src={loggedInUser?.profilePicture}
                alt='profilePicture'
                className='w-8 h-8 rounded-full border-2 border-indigo-400 hover:border-indigo-300 transition-colors duration-200'
                loading='lazy'
              />
              <FaChevronDown 
                className={`text-indigo-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50'>
                <div className='py-1'>
                  <button
                    onClick={handleProfile}
                    className='flex items-center w-full px-4 py-2 text-sm font-medium text-neutral-100 hover:font-bold hover:text-purple-500 transition-all duration-500 ease-in-out'
                  >
                    <LuUser className='mr-3' />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className='flex items-center w-full px-4 py-2 text-sm font-medium text-neutral-100 hover:text-red-500 transition-all duration-500 ease-in-out'
                  >
                    <LuLogOut className='mr-3' />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && <CreateTransactionModal isOpen={isModalOpen} toggleModal={toggleModal} />}
    </div>
  );
};

export default Header;



