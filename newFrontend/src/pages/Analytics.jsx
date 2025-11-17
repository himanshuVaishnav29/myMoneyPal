

import React, { useState } from 'react';
import CurrMonthStatsByCategory from '../components/CategoryStats/CurrMonthStatsByCategory';
import CurrWeekStatsByCategory from '../components/CategoryStats/CurrWeekStatsByCategory';
import CategoryStats from '../components/CategoryStats/CategoryStats';
import CurrWeekStatsByPaymentType from '../components/PaymentTypeStats/CurrWeekStatsByPaymentType';
import CurrMonthStatsByPaymentType from '../components/PaymentTypeStats/CurrMonthStatsByPaymentType';
import PaymentTypeStats from '../components/PaymentTypeStats/PaymentTypeStats';
import CurrWeekStatsByTagBar from '../components/TagStats/CurrWeekStatsByTagBar';
import CurrMonthStatsByTagBar from '../components/TagStats/CurrMonthStatsByTagBar';
import TagStatsBar from '../components/TagStats/TagStatsBar';


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
        return <CurrWeekStatsByTagBar />;
      case 'This month':
        return <CurrMonthStatsByTagBar />;
      default:
        return <TagStatsBar />;
    }
  };

  return (
    <div className='p-4 md:p-6 text-white min-h-screen w-full'>
      <div className='text-center mb-8'>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Analytics Dashboard</h1>
      </div>

      {/* Second row - Bar chart for tags */}
      <div className='bg-transparent rounded-xl p-4 md:p-6 shadow-lg border border-gray-700 mb-8'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-white mb-3'>Tag-wise Spending Analysis</h2>
          <select
            id="tagDropdown"
            className='w-full max-w-xs p-2 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors hover:cursor-pointer'
            value={tagTimeframe}
            onChange={(e) => setTagTimeframe(e.target.value)}
          >
            <option className='bg-gray-800 text-white' value="All time">All time</option>
            <option className='bg-gray-800 text-white' value="This week">This week</option>
            <option className='bg-gray-800 text-white' value="This month">This month</option>
          </select>
        </div>
        <div className='w-full h-64 md:h-80 lg:h-96'>
          {renderTagComponent()}
        </div>
      </div>

      {/* First row - 2 pie charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8'>
        <div className='bg-transparent rounded-xl p-4 md:p-6 shadow-lg border border-gray-700'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-white mb-3'>Category Statistics</h2>
            <select
              id="categoryDropdown"
              className='w-full max-w-xs p-2 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors hover:cursor-pointer'
              value={categoryTimeframe}
              onChange={(e) => setCategoryTimeframe(e.target.value)}
            >
              <option className='bg-gray-800 text-white' value="All time">All time</option>
              <option className='bg-gray-800 text-white' value="This week">This week</option>
              <option className='bg-gray-800 text-white' value="This month">This month</option>
            </select>
          </div>
          <div className='flex justify-center items-center h-64 md:h-72 lg:h-80'>
            {renderCategoryComponent()}
          </div>
        </div>

        <div className='bg-transparent rounded-xl p-4 md:p-6 shadow-lg border border-gray-700'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-white mb-3'>Payment Type Statistics</h2>
            <select
              id="paymentDropdown"
              className='w-full max-w-xs p-2 bg-transparent border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors hover:cursor-pointer'
              value={paymentTimeframe}
              onChange={(e) => setPaymentTimeframe(e.target.value)}
            >
              <option className='bg-gray-800 text-white' value="All time">All time</option>
              <option className='bg-gray-800 text-white' value="This week">This week</option>
              <option className='bg-gray-800 text-white' value="This month">This month</option>
            </select>
          </div>
          <div className='flex justify-center items-center h-64 md:h-72 lg:h-80'>
            {renderPaymentTypeComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
