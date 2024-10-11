// import React from 'react'
// import CategoryStats from '../components/CategoryStats'
// import CurrWeekStatsByCategory from '../components/CurrWeekStatsByCategory'
// import CurrWeekStatsByPaymentType from '../components/CurrWeekStatsByPaymentType'
// import CurrMonthStatsByCategory from '../components/CurrMonthStatsByCategory'
// import PaymentTypeStats from '../components/PaymentTypeStats'
// import CurrMonthStatsByPaymentType from '../components/CurrMonthStatsByPaymentType'


// const Analytics = () => {
//   return (
//     <div className='p-5'>
//       {
        
//           <div className='grid md:grid:cols-2 xl:grid-cols-3 gap-4'>
//           <CategoryStats/>
//           <CurrWeekStatsByCategory/>
//           <CurrMonthStatsByCategory/>
  
//           <PaymentTypeStats/>
//           <CurrWeekStatsByPaymentType/>
//           <CurrMonthStatsByPaymentType/>
//         </div>
//       }
      
       
//     </div>
//   )
// }

// export default Analytics





import React, { useState } from 'react';
import CurrMonthStatsByCategory from '../components/CategoryStats/CurrMonthStatsByCategory';
import CurrWeekStatsByCategory from '../components/CategoryStats/CurrWeekStatsByCategory';
import CategoryStats from '../components/CategoryStats/CategoryStats';
import CurrWeekStatsByPaymentType from '../components/PaymentTypeStats/CurrWeekStatsByPaymentType';
import CurrMonthStatsByPaymentType from '../components/PaymentTypeStats/CurrMonthStatsByPaymentType';
import PaymentTypeStats from '../components/PaymentTypeStats/PaymentTypeStats';
import CurrWeekStatsByTag from '../components/TagStats/CurrWeekStatsByTag';
import CurrMonthStatsByTag from '../components/TagStats/CurrMonthStatsByTag';
import TagStats from '../components/TagStats/TagStats';


const Analytics = () => {
  const [categoryTimeframe, setCategoryTimeframe] = useState('All time');
  const [paymentTimeframe, setPaymentTimeframe] = useState('All time');
  const [tagTimeframe,setTagTimeframe] = useState('All time');

  const renderCategoryComponent = () => {
    switch (categoryTimeframe) {
      case 'This week':
        return <CurrWeekStatsByCategory />;
      case 'This month':
        return <CurrMonthStatsByCategory />;
      default:
        return <CategoryStats />;
    }
  };

  const renderPaymentTypeComponent = () => {
    switch (paymentTimeframe) {
      case 'This week':
        return <CurrWeekStatsByPaymentType />;
      case 'This month':
        return <CurrMonthStatsByPaymentType />;
      default:
        return <PaymentTypeStats />;
    }
  };

  const renderTagComponent = () => {
    switch (tagTimeframe) {
      case 'This week':
        return <CurrWeekStatsByTag />;
      case 'This month':
        return <CurrMonthStatsByTag />;
      default:
        return <TagStats />;
    }
  };

  return (
    <div className='p-6 pt-7 text-white'>
       <center>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text pb-8">Analytics</h1>
      </center>
      {/* <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'> */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='w-full pb-8'>
          <label htmlFor="categoryDropdown" className='block mb-2 text-sm font-bold text-pink-500 hover:text-white'>Category Time frame</label>
          <select
            id="categoryDropdown"
            className='w-full p-2 border bg-transparent border-gray-300 rounded hover:cursor-pointer'
            value={categoryTimeframe}
            onChange={(e) => setCategoryTimeframe(e.target.value)}
          >
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="All time">All time</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="This week">This week</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="This month">This month</option>
          </select>
          {renderCategoryComponent()}
        </div>

        <div className='w-full pb-8'>
          <label htmlFor="paymentDropdown" className="block mb-2 text-sm font-bold text-pink-500 hover:text-white">Payment Type Time frame</label>
          <select
            id="paymentDropdown"
            className='w-full p-2 border bg-transparent border-gray-300 rounded hover:cursor-pointer'
            value={paymentTimeframe}
            onChange={(e) => setPaymentTimeframe(e.target.value)}
          >
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="All time">All time</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="This week">This week</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer'  value="This month">This month</option>
          </select>
          {renderPaymentTypeComponent()}
        </div>


        <div className='w-full pb-8'>
          <label htmlFor="tagDropdown" className='block mb-2 text-sm  font-bold text-pink-500 hover:text-white'>Stats by Tags Time frame</label>
          <select
            id="tagDropdown"
            className='w-full p-2 border bg-transparent border-gray-300 rounded hover:cursor-pointer'
            value={tagTimeframe}
            onChange={(e) => setTagTimeframe(e.target.value)}
          >
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer' value="All time">All time</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer' value="This week">This week</option>
            <option className='bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer' value="This month">This month</option>
          </select>
          {renderTagComponent()}
          
        </div>

      </div>
    </div>
  );
};

export default Analytics;
