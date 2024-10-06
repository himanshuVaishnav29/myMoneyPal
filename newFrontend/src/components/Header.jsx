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




import React, { useState } from 'react';
import { GoBell} from 'react-icons/go';
import { CreateTransactionModal } from './CreateTransactionModal'; 
import { FaBars } from "react-icons/fa6";
const Header = ({ loggedInUser,toggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  

  return (
    <div className='flex justify-between items-center p-4  text-neutral-100'>
        <button className='md:hidden text-white' onClick={toggleSidebar}>
          <FaBars size={20} />
        </button>
      <div>
        <h1 className='hidden md:block md:text-xs'>Welcome Back!</h1>
        <p className=' hidden md:block text-xl md:font-semibold'>{loggedInUser?.fullName}</p>
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
              // className="bg-indigo-500 text-white text-base sm:text-sm md:text-base px-4 py-2 rounded-lg focus:outline-none hover:bg-indigo-700"
              className='btn px-4 py-2'
            >
              Add Transaction
            </button>
          
        </div>
        <div className='flex items-center space-x-5 p-r-3'>
          {/* <button className='relative text-2xl text-gray-600'>
            <GoBell size={28} />
            <span className='absolute top-0 right-0 mt-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>
              9
            </span>
          </button> */}
          <img
            src={loggedInUser?.profilePicture}
            alt='profilePicture'
            className='w-8 h-8 rounded-full border-2 border-indigo-400 '
          />
        </div>
      </div>

      
      {isModalOpen && <CreateTransactionModal isOpen={isModalOpen} toggleModal={toggleModal} />}
    </div>
  );
};

export default Header;



