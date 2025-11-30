
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTIONS_BY_USER, GET_TRANSACTIONS_BY_USER_PAGINATED } from '../graphql/queries/transaction.query';
import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { GET_DASHBOARD_SUMMARY } from '../graphql/queries/dashboard.query';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ComponentLoader from '../components/Skeletons/ComponentLoader';
import TransactionUpdateModal from '../components/TransactionUpdateModal';

const History = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS_BY_USER_PAGINATED, {
        variables: { page: currentPage, limit: itemsPerPage }
    });
    const [deleteTransactionId, setDeleteTransactionId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateTransactionId, setUpdateTransactionId] = useState(null);

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
            setShowDeleteModal(false);
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
        setUpdateTransactionId(transactionId);
        setShowUpdateModal(true);
    };

    const handleUpdateSuccess = () => {
        refetch();
    };



    if (loading) return <ComponentLoader />;
    if (error) return <div>Error fetching transactions</div>;

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-3 px-4 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>

            <div className="w-full max-w-6xl">
                {transactions.length <= 0 ? (
                    <div className="p-6 rounded-lg w-full text-white text-center">
                        <h1 className='text-xl font-mono text-white'>No history found</h1>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto w-full">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-black text-neutral-300">
                                    <tr>
                                        <th className="p-3 border text-sm">S no.</th>
                                        <th className="p-3 border text-sm">Description</th>
                                        <th className="p-3 border text-sm">Payment Type</th>
                                        <th className="p-3 border text-sm">Category</th>
                                        <th className="p-3 border text-sm">Amount (₹)</th>
                                        <th className="p-3 border text-sm">Location</th>
                                        <th className="p-3 border text-sm">Date</th>
                                        <th className="p-3 border text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction, index) => (
                                        <tr key={transaction._id} className="text-center hover:bg-gray-800 hover:bg-opacity-30">
                                            <td className="p-3 border text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="p-3 border text-sm">{transaction.description}</td>
                                            <td className="p-3 border text-sm">
                                                {(transaction.paymentType === 'upi') ? "UPI" :
                                                    transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)
                                                }
                                            </td>
                                            <td className="p-3 border text-sm">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
                                            <td className="p-3 border text-sm font-semibold">₹ {transaction.amount}</td>
                                            <td className="p-3 border text-sm">{transaction.location || "-"}</td>
                                            <td className="p-3 border text-sm">
                                                {new Date(parseInt(transaction.date)).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 border">
                                                <div className="flex gap-3 justify-center">
                                                    <button
                                                        onClick={() => handleUpdate(transaction._id)}
                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowDeleteModal(true); setDeleteTransactionId(transaction._id); }}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <FaTrashAlt size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {transactions.map((transaction, index) => (
                                <div key={transaction._id} className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-600">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-white">{transaction.description}</h3>
                                            <p className="text-2xl font-bold text-green-400 mt-1">₹ {transaction.amount}</p>
                                        </div>
                                        <div className="flex gap-3 ml-4">
                                            <button
                                                onClick={() => handleUpdate(transaction._id)}
                                                className="text-blue-500 hover:text-blue-700 p-2 bg-blue-500 bg-opacity-20 rounded-full"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setShowDeleteModal(true); setDeleteTransactionId(transaction._id); }}
                                                className="text-red-500 hover:text-red-700 p-2 bg-red-500 bg-opacity-20 rounded-full"
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-400">Payment:</span>
                                            <p className="text-white font-medium">
                                                {(transaction.paymentType === 'upi') ? "UPI" :
                                                    transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Category:</span>
                                            <p className="text-white font-medium">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Location:</span>
                                            <p className="text-white font-medium">{transaction.location || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Date:</span>
                                            <p className="text-white font-medium">{new Date(parseInt(transaction.date)).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {paginationData && paginationData.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!paginationData.hasPrevPage}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors w-full sm:w-auto"
                                >
                                    Previous
                                </button>
                                
                                <span className="text-white text-center">
                                    Page {paginationData.currentPage} of {paginationData.totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!paginationData.hasNextPage}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors w-full sm:w-auto"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Update Modal */}
            <TransactionUpdateModal 
                isOpen={showUpdateModal}
                toggleModal={() => setShowUpdateModal(false)}
                transactionId={updateTransactionId}
                onSuccess={handleUpdateSuccess}
            />

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm p-4">
                    <div className="form-Background p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className='font-thin mb-6'>Are you sure you want to delete this transaction?</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteTransactionId(null); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
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
