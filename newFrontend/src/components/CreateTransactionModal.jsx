import React from 'react';
import TransactionForm from './TransactionForm'; // Assuming TransactionForm is in the same folder

export const CreateTransactionModal = ({ isOpen, toggleModal }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-index: 1000 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm ${
        isOpen ? 'opacity-100 pointer-events-auto z-50' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='form-Background rounded-lg p-6 w-full max-w-lg'>
        <div className='flex justify-between items-center pb-7'>
          <h2 className='text-xl font-bold'>Add New Transaction</h2>
          <button onClick={toggleModal} className=' hover:text-red-500'>
            &#10005;
          </button>
        </div>
        <TransactionForm /> 
      </div>
    </div>
  );
};
