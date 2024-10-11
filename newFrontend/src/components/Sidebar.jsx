// import React, { useState } from 'react'
// import {LuBox,LuUser, LuHistory,LuMessageSquare,LuCalendar,LuLogOut} from 'react-icons/lu';
// import {FaSuitcase} from 'react-icons/fa'
// import { Link } from 'react-router-dom';
// import moneyPalLogo from '../assets/moneyPalLogo3.jpg'
// import { useMutation, useQuery } from "@apollo/client";
// import { LOGOUT } from "../graphql/mutations/user.mutations";

// const Sidebar = () => {
//     const [activeLink,setActiveLink]=useState(0);

//     const [logout, { loading, client }] = useMutation(LOGOUT, {
//         refetchQueries: ["GetAuthenticatedUser"],
//       });

//     const handleLogout = async () => {
//         try {
//             await logout();
//             client.resetStore(); 
//             toast.success("Logout Successful");
//         } catch (error) {
//             console.log("Error in handleLogout");
//             toast.error(error.message);
//         }
//     };

//     const handleLinkClick=(index)=>{
//         setActiveLink(index)
//     }

//     const SIDEBAR_LINKS=[
//         {id:1,path:"/",name:"Dashboard",icon:LuBox},
//         {id:2,path:"/history",name:"History",icon:LuHistory},
//         {id:3,path:"/messages",name:"Messages",icon:LuMessageSquare},
//         {id:4,path:"/projects",name:"Projects",icon:FaSuitcase},
//         {id:5,path:"/clients",name:"Clients",icon:LuUser},
//         {id:6,path:"/work",name:"Work Plan",icon:LuCalendar},
//     ];
//   return (
//     <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full border-r pt-8 px-4 bg-white'>
//         <div className='mb-8'>
//             <img 
//                 src={moneyPalLogo}
//                 alt='My moneyPal' 
//                 className='w-40 hidden md:flex' 
//             />
//             <img 
//                 src='https://img.freepik.com/premium-vector/savings-icon-logo-vector-design-template_827767-3198.jpg' 
//                 alt='logo' 
//                 className='w-8 flex md:hidden' 
//              />
//         </div>

//         <ul className='mt-6 space-y-6'>
//             {
//                 SIDEBAR_LINKS.map((link,index)=>(
//                     <li key={index} className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${activeLink===index ?"bg-indigo-100 text-indigo-500":""}`}>
//                         <Link 
//                             to={link.path}
//                             className='flex justify-center md:justify-start items-center md:space-x-5'
//                             onClick={()=>handleLinkClick(index)}
//                         >
//                             <span>{link.icon()}</span>
//                             <span className='text-sm text-gray-500 hidden md:flex '>{link.name}</span>
//                         </Link>
//                     </li>
//                 ))
//             }
//             <li className='font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-red-500'>
//                 <Link 
//                     to='login'
//                     className='flex justify-center md:justify-start items-center md:space-x-5'
//                     onClick={()=>handleLogout()}
//                 >
//                     <span><LuLogOut/></span>
//                     <span className='text-sm text-gray-500 hidden md:flex '>Logout</span>
//                 </Link>
//             </li>
            
//         </ul>

//         {/* <div className='w-full absolute bottom-0 left-0 px-4 py-2 cursor-pointer text-center'>
//             <p className='flex items-center space-x-2 text-xs text-white py-2 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full'>
//                 {""}
//                 <span>?</span>
//                 <span className='hidden md:flex'>Need help</span>
//             </p>
//         </div> */}
//     </div>
//   )
// }

// export default Sidebar







// import React, { useState } from 'react';
// import { LuBox, LuUser, LuHistory, LuMessageSquare, LuCalendar, LuLogOut } from 'react-icons/lu';
// import { FaSuitcase } from 'react-icons/fa';
// import { GrAnalytics } from "react-icons/gr";
// import { Link, useLocation } from 'react-router-dom';
// import moneyPalLogo from '../assets/moneyPalLogo3.jpg';
// import { useMutation } from "@apollo/client";
// import { LOGOUT } from "../graphql/mutations/user.mutations";
// import { toast } from 'react-hot-toast'; // Don't forget to import toast

// const Sidebar = () => {
//     const [activeLink, setActiveLink] = useState(0);

//     const [logout, { client }] = useMutation(LOGOUT, {
//         refetchQueries: ["GetAuthenticatedUser"],
//     });

//     const handleLogout = async () => {
//         try {
//             await logout();
//             client.resetStore();
//             toast.success("Logout Successful");
//         } catch (error) {
//             console.log("Error in handleLogout");
//             toast.error(error.message);
//         }
//     };

//     const handleLinkClick = (index) => {
//         setActiveLink(index);
//     };

//     const SIDEBAR_LINKS = [
//         { id: 1, path: "/", name: "Dashboard", icon: LuBox },
//         { id: 2, path: "/analytics", name: "Analytics", icon: GrAnalytics },
//         { id: 3, path: "/history", name: "History", icon: LuHistory },
//         { id: 4, path: "/projects", name: "Projects", icon: FaSuitcase },
//         { id: 5, path: "/clients", name: "Clients", icon: LuUser },
//         { id: 6, path: "/work", name: "Work Plan", icon: LuCalendar },
//     ];
//     const location = useLocation();
//     const currentPath = location.pathname;
//     const currentLinkIndex = SIDEBAR_LINKS.findIndex(link => link.path === currentPath);
//     const activeIndex = currentLinkIndex >= 0 ? currentLinkIndex : 0;

//     return (
//         <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full border-r pt-8 px-4 bg-white'>
//             <div className='mb-8'>
//                 <img
//                     src={moneyPalLogo}
//                     alt='My moneyPal'
//                     className='w-40 hidden md:flex'
//                 />
//                 <img
//                     src='https://img.freepik.com/premium-vector/savings-icon-logo-vector-design-template_827767-3198.jpg'
//                     alt='logo'
//                     className='w-8 flex md:hidden'
//                 />
//             </div>

//             <ul className='mt-6 space-y-6'>
//                 {
//                     SIDEBAR_LINKS.map((link, index) => (
//                         <li key={index} className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${activeIndex === index ? "bg-indigo-100 text-indigo-500" : ""}`}>
//                             <Link
//                                 to={link.path}
//                                 className='flex justify-center md:justify-start items-center md:space-x-5'
//                                 onClick={() => handleLinkClick(index)}
//                             >
//                                 <span>{link.icon()}</span>
//                                 <span className='text-sm text-gray-500 hidden md:flex'>{link.name}</span>
//                             </Link>
//                         </li>
//                     ))
//                 }
//                 <li className='font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-red-500'>
//                     <Link
//                         to='login'
//                         className='flex justify-center md:justify-start items-center md:space-x-5'
//                         onClick={() => handleLogout()}
//                     >
//                         <span><LuLogOut /></span>
//                         <span className='text-sm text-gray-500 hidden md:flex'>Logout</span>
//                     </Link>
//                 </li>
//             </ul>
//         </div>
//     );
// }

// export default Sidebar;






//



// import React, { useState } from 'react';
// import { LuBox, LuUser, LuHistory, LuMessageSquare, LuCalendar, LuLogOut } from 'react-icons/lu';
// import { FaSuitcase } from 'react-icons/fa';
// import { GrAnalytics } from "react-icons/gr";
// import { Link, useLocation } from 'react-router-dom';
// import moneyPalLogo from '../assets/moneyPalLogo3.jpg';
// import { useMutation } from "@apollo/client";
// import { LOGOUT } from "../graphql/mutations/user.mutations";
// import { toast } from 'react-hot-toast'; // Don't forget to import toast
// import { FcMoneyTransfer } from "react-icons/fc";
// const Sidebar = () => {
//     const [activeLink, setActiveLink] = useState(0);

//     const [logout, { client }] = useMutation(LOGOUT, {
//         refetchQueries: ["GetAuthenticatedUser"],
//     });

//     const handleLogout = async () => {
//         try {
//             await logout();
//             client.resetStore();
//             toast.success("Logout Successful");
//         } catch (error) {
//             console.log("Error in handleLogout");
//             toast.error(error.message);
//         }
//     };

//     const handleLinkClick = (index) => {
//         setActiveLink(index);
//     };

//     const SIDEBAR_LINKS = [
//         { id: 1, path: "/", name: "Dashboard", icon: LuBox },
//         { id: 2, path: "/analytics", name: "Analytics", icon: GrAnalytics },
//         { id: 3, path: "/history", name: "History", icon: LuHistory },
//         { id: 4, path: "/statement", name: "Statement", icon: FaSuitcase },
//         // { id: 5, path: "/clients", name: "Clients", icon: LuUser },
//         // { id: 6, path: "/work", name: "Work Plan", icon: LuCalendar },
//     ];

//     const location = useLocation();
//     const currentPath = location.pathname;

//     // Function to check if the current path matches a base path (e.g., /history)
//     const isActiveLink = (linkPath) => {
//         return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
//     };

//     return (
//         // <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full border-r pt-8 px-4 text-neutral-100'>
//         <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full shadow-lg shadow-neutral-900/50 pt-8 px-4 text-neutral-100'>

//            <div className='flex justify-center items-center mb-8 space-x-2'>
//                 {/* <img
//                     // src={moneyPalLogo}
//                     src='./moneyPalImg.jpg'
//                     alt='My moneyPal'
//                     className='w-40  h-13 hidden md:flex'
//                 /> */}
//                 <a className='inline w-40  h-13 hidden md:flex'>
//                     <FcMoneyTransfer className='text-2xl' />
//                     <span className='font-bold text-pink-500'>My MoneyPal</span>
//                 </a>
//                 <img
//                     src='https://img.freepik.com/premium-vector/savings-icon-logo-vector-design-template_827767-3198.jpg'
//                     alt='logo'
//                     className='w-8 flex md:hidden'
//                 />
//             </div>

//             <ul className='mt-6 space-y-6'>
//                 {
//                     SIDEBAR_LINKS.map((link, index) => (
//                         <li key={index} className={`font-medium  rounded-md py-2 px-5 hover:font-bold hover:text-blue-500 transition-all duration-500 ease-in-out ${isActiveLink(link.path) ? "form-Background text-neutral-200 font-thin" : ""}`}>
                            

//                         {/* // <li 
//                         //     key={index} 
//                         //     className={`font-medium rounded-md py-2 px-5 relative hover:bg-gray-100 hover:text-indigo-500 
//                         //     ${isActiveLink(link.path) ? "active-link" : ""}`}
//                         // >     */}
//                             <Link
//                                 to={link.path}
//                                 className='flex justify-center md:justify-start items-center md:space-x-5'
//                                 onClick={() => handleLinkClick(index)}
//                             >
//                                 <span>{link.icon()}</span>
//                                 <span className='text-sm  hidden md:flex'>{link.name}</span>
//                             </Link>
//                         </li>
//                     ))
//                 }
//                 <li className='font-medium rounded-md py-2 px-5  hover:text-red-500'>
//                     <Link
//                         to='login'
//                         className='flex justify-center md:justify-start items-center md:space-x-5'
//                         onClick={() => handleLogout()}
//                     >
//                         <span><LuLogOut /></span>
//                         <span className='text-sm  hidden md:flex'>Logout</span>
//                     </Link>
//                 </li>
//             </ul>
//         </div>
//     );
// }

// export default Sidebar;








import React, { forwardRef, useState } from 'react';
import { LuBox, LuUser, LuHistory, LuMessageSquare, LuCalendar, LuLogOut } from 'react-icons/lu';
import { FaSuitcase,FaTimes } from 'react-icons/fa';
import { GrAnalytics } from "react-icons/gr";
import { Link, useLocation } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { toast } from 'react-hot-toast'; // Don't forget to import toast
import { FcMoneyTransfer } from "react-icons/fc";


const Sidebar = ({ isOpen, toggleSidebar }) => {
// const Sidebar = forwardRef(({ isOpen, toggleSidebar }, ref) => {

    const [activeLink, setActiveLink] = useState(0);

    const [logout, { client }] = useMutation(LOGOUT, {
        refetchQueries: ["GetAuthenticatedUser"],
    });

    const handleLogout = async () => {
        try {
            await logout();
            client.resetStore();
            toast.success("Logout Successful");
        } catch (error) {
            console.log("Error in handleLogout");
            toast.error(error.message);
        }
    };

    const handleLinkClick = (index) => {
        setActiveLink(index);
        toggleSidebar();
    };

    const SIDEBAR_LINKS = [
        { id: 1, path: "/", name: "Dashboard", icon: LuBox },
        { id: 2, path: "/analytics", name: "Analytics", icon: GrAnalytics },
        { id: 3, path: "/history", name: "Transactions", icon: LuHistory },
        { id: 4, path: "/statement", name: "Statement", icon: FaSuitcase },
        // { id: 5, path: "/clients", name: "Clients", icon: LuUser },
        // { id: 6, path: "/work", name: "Work Plan", icon: LuCalendar },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    // Function to check if the current path matches a base path (e.g., /history)
    const isActiveLink = (linkPath) => {
        return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
    };

    return (
        // <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full border-r pt-8 px-4 text-neutral-100'>
        // <div className='w-16 md:w-56 fixed left-0 top-0 z-10 min-h-full shadow-lg shadow-neutral-900/50 pt-8 px-4 text-neutral-100'>
        <div
        className={`fixed left-0 top-0 z-10 md:w-56 min-h-full bg-gray-900 text-white shadow-lg pt-8 px-4 transition-transform transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        
      >
            <div className="flex justify-end mb-4 md:hidden">
                <button onClick={toggleSidebar}>
                    <FaTimes size={24} className="text-white" />
                </button>
            </div>
           <div className='flex justify-center items-center mb-8 space-x-2 pb-6'>
                {/* <img
                    // src={moneyPalLogo}
                    src='./moneyPalImg.jpg'
                    alt='My moneyPal'
                    className='w-40  h-13 hidden md:flex'
                /> */}
                <a className='w-40 cursor:pointer h-13 hidden md:flex' href='/'>
                    <FcMoneyTransfer className='text-2xl' />
                    <span className='ml-2 font-bold text-pink-500'>My MoneyPal</span>
                </a>
                <img
                    src='https://img.freepik.com/premium-vector/savings-icon-logo-vector-design-template_827767-3198.jpg'
                    alt='logo'
                    className='w-8 flex md:hidden'
                />
            </div>

            <ul className='mt-6 space-y-6'>
                {
                    SIDEBAR_LINKS.map((link, index) => (
                        <li key={index} className={`font-medium  rounded-md py-2 px-5 hover:font-bold hover:text-blue-500 transition-all duration-500 ease-in-out ${isActiveLink(link.path) ? "form-Background text-neutral-200 font-thin" : ""}`}>
                            

                        {/* // <li 
                        //     key={index} 
                        //     className={`font-medium rounded-md py-2 px-5 relative hover:bg-gray-100 hover:text-indigo-500 
                        //     ${isActiveLink(link.path) ? "active-link" : ""}`}
                        // >     */}
                            <Link
                                to={link.path}
                                className='flex sm:justify-center md:justify-start items-center space-x-2 sm:space-x-4 md:space-x-5'
                                // className='flex items-center space-x-2 sm:space-x-4 md:space-x-5 w-full justify-center sm:justify-start'
                                onClick={() => handleLinkClick(index)}
                            >
                                <span>{link.icon()}</span>
                                <span className='text-sm   md:flex '>{link.name}</span>
                            </Link>
                        </li>
                    ))
                }
                <li className='font-medium rounded-md py-2 px-5  hover:text-red-500'>
                    <Link
                        to='login'
                        className='flex sm:justify-center md:justify-start items-center space-x-2 sm:space-x-4 md:space-x-5'
                        // className='flex items-center space-x-2 sm:space-x-4 md:space-x-5 w-full justify-center sm:justify-start'
                        onClick={() => handleLogout()}
                    >
                        <span><LuLogOut /></span>
                        <span className='text-sm  md:flex'>Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
