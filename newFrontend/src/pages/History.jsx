
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTIONS_BY_USER, GET_TRANSACTIONS_BY_USER_PAGINATED } from '../graphql/queries/transaction.query';
import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { GET_DASHBOARD_SUMMARY } from '../graphql/queries/dashboard.query';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const History = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS_BY_USER_PAGINATED, {
        variables: { page: currentPage, limit: itemsPerPage }
    });
    const [deleteTransactionId, setDeleteTransactionId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
        refetchQueries: [
          {query: GET_DASHBOARD_SUMMARY},
          {query: GET_STATS_BY_CATEGORY},
          {query: GET_STATS_BY_PAYMENT_TYPE},
          {query: GET_STATS_BY_TAG}
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast.success('Transaction deleted successfully');
            setShowModal(false);
            refetch();
        },
        onError: (err) => toast.error(err.message),
    });

    const paginationData = data?.getTransactionsByUserPaginated;
    const transactions = paginationData?.transactions || [];

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDelete = async () => {
        try {
            await deleteTransaction({ variables: { transactionId: deleteTransactionId } });
            setDeleteTransactionId(null);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleUpdate = (transactionId) => {
        navigate(`/history/${transactionId}`);
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching transactions</div>;

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-3 overflow-x-hidden text-white">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>

            <div className="w-full max-w-5xl px-4">
                {transactions.length <= 0 ? (
                    <div className="p-6 rounded-lg overflow-x-auto w-full text-white">
                        <center><h1 className='text-xl font-mono text-white'>No history found</h1></center>
                    </div>
                ) : (
                    <>
                        <div className="p-6 rounded-lg shadow-md thinScrollBar overflow-x-auto w-full">
                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead className="bg-black text-neutral-300">
                                        <tr>
                                            <th className="p-2 border">S no.</th>
                                            <th className="p-2 border">Description</th>
                                            <th className="p-2 border">Payment Type</th>
                                            <th className="p-2 border">Category</th>
                                            <th className="p-2 border">Amount (₹)</th>
                                            <th className="p-2 border">Location</th>
                                            <th className="p-2 border">Date</th>
                                            <th className="p-2 border">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={transaction._id} className="text-center">
                                                <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-2 border">{transaction.description}</td>
                                                <td className="p-2 border">
                                                    {(transaction.paymentType === 'upi') ? "UPI" :
                                                        transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)
                                                    }
                                                </td>
                                                <td className="p-2 border">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
                                                <td className="p-2 border">₹ {transaction.amount}</td>
                                                <td className="p-2 border">{transaction.location || ""}</td>
                                                <td className="p-2 border">
                                                    {new Date(parseInt(transaction.date)).toLocaleDateString()}
                                                </td>
                                                <td className="p-2 border">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleUpdate(transaction._id)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => { setShowModal(true); setDeleteTransactionId(transaction._id); }}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Pagination Controls */}
                        {paginationData && paginationData.totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!paginationData.hasPrevPage}
                                    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                                >
                                    Previous
                                </button>
                                
                                <span className="text-white mx-4">
                                    Page {paginationData.currentPage} of {paginationData.totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!paginationData.hasNextPage}
                                    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-index: 1000 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm">
                    <div className="form-Background p-5 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className='font-thin'>Are you sure you want to delete this transaction?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => { setShowModal(false); setDeleteTransactionId(null); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
