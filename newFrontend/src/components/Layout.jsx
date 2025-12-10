// import React from 'react'
// import Sidebar from './Sidebar'
// import Header from './Header'
// import { Outlet } from 'react-router-dom'

// const Layout = ({loggedInUser}) => {

//   return (
//     <div>
//         <div className='flex'>
//             <Sidebar/>
//             <div className='w-full ml-16 md:ml-56 '>
//                 <Header loggedInUser={loggedInUser}/>
//                 <Outlet/>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Layout







import React, {useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = ({loggedInUser}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);





  };
  return (
    <div>
        <div className='flex'>
            {/* <Sidebar/> */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {/* <div className='w-full ml-16 md:ml-56 '>
                <Header loggedInUser={loggedInUser}/>
                <Outlet/>
            </div> */}
            <div className={`flex-1 ml-0 md:ml-56 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'} overflow-x-hidden`}>
              <Header loggedInUser={loggedInUser} toggleSidebar={toggleSidebar}  isOpen={isSidebarOpen} />
              <div className="overflow-x-hidden">
                <Outlet />
              </div>
            </div>
        </div>
    </div>
  )
}

export default Layout