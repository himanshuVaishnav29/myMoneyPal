import React from 'react';
import { IoClose } from 'react-icons/io5';
import TransactionForm from './TransactionForm'; // Assuming TransactionForm is in the same folder

export const CreateTransactionModal = ({ isOpen, toggleModal }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-index: 1000 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm overflow-y-auto p-4 ${
        isOpen ? 'opacity-100 pointer-events-auto z-50' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className='form-Background rounded-lg p-4 sm:p-6 w-full max-w-lg my-auto'>
        <div className='flex justify-between items-center pb-7'>
          <h2 className='text-xl font-bold'>Add New Transaction</h2>
          <button onClick={toggleModal} className='text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 hover:bg-opacity-10'>
            <IoClose size={24} />
          </button>
        </div>
        <TransactionForm toggleModal={toggleModal}/> 
      </div>
    </div>
  );
};
