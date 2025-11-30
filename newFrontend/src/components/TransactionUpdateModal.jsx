import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTION, GET_TRANSACTIONS_BY_USER_PAGINATED } from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import { GET_DASHBOARD_SUMMARY } from "../graphql/queries/dashboard.query";
import { IoClose } from 'react-icons/io5';
import toast from "react-hot-toast";
import ComponentLoader from "../components/Skeletons/ComponentLoader";

const TransactionUpdateModal = ({ isOpen, toggleModal, transactionId, onSuccess }) => {
	const { loading, data, error } = useQuery(GET_TRANSACTION, {
		variables: { id: transactionId },
		skip: !transactionId
	});

	const [formData, setFormData] = useState({
		description: "",
		paymentType: "",
		category: "",
		amount: "",
		location: "",
		date: "",
		tag: "",
	});

	useEffect(() => {
		if (data) {
			setFormData({
				description: data?.getTransaction.description,
				paymentType: data?.getTransaction.paymentType,
				category: data?.getTransaction.category,
				amount: data?.getTransaction.amount,
				location: data?.getTransaction.location,
				date: new Date(+data.getTransaction.date).toISOString().slice(0, 10),
				tag: data?.getTransaction.tag
			});
		}
	}, [data]);

	const [updateTransaction, { loading: loadingUpdate }] = useMutation(UPDATE_TRANSACTION, {
		refetchQueries: [
			{ query: GET_DASHBOARD_SUMMARY },
			{ query: GET_TRANSACTIONS_BY_USER_PAGINATED, variables: { page: 1, limit: 10 } },
			{ query: GET_STATS_BY_CATEGORY },
			{ query: GET_STATS_BY_PAYMENT_TYPE },
			{ query: GET_STATS_BY_TAG }
		],
		awaitRefetchQueries: true
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const amount = parseFloat(formData.amount);
		try {
			await updateTransaction({
				variables: {
					input: {
						...formData,
						amount,
						transactionId: transactionId
					}
				}
			});
			toast.success("Transaction Updated successfully");
			toggleModal();
			if (onSuccess) onSuccess();
		} catch (error) {
			console.log("Error in handle submit of update transaction", error);
			toast.error(error.message);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	if (!isOpen) return null;

	return (
		<div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm overflow-y-auto p-4`}>
			<div className='form-Background rounded-lg p-4 sm:p-6 w-full max-w-lg my-auto'>
				<div className='flex justify-between items-center pb-4'>
					<h2 className='text-xl font-bold bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>UPDATE TRANSACTION</h2>
					<button onClick={toggleModal} className='text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 hover:bg-opacity-10'>
						<IoClose size={24} />
					</button>
				</div>

				{loading ? (
					<div className="flex justify-center py-8">
						<ComponentLoader />
					</div>
				) : (
					<form className='w-full flex flex-col gap-4 sm:gap-5' onSubmit={handleSubmit}>
						{/* TAG & DESCRIPTION */}
						<div className='flex flex-col sm:flex-row gap-3 sm:gap-0'>
							<div className='w-full sm:w-1/2 sm:pr-3 md:pr-5'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='tag'>
									Tag
								</label>
								<div className='relative text-white'>
									<select
										className='block appearance-none w-full bg-transparent border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500'
										id='tag'
										name='tag'
										onChange={handleInputChange}
										value={formData.tag}
									>
										<option value="" disabled className="bg-gray-800 text-white">Tag</option>
										<option value={"Food & Dining"} className="bg-gray-800 text-white">Food & Dining</option>
										<option value={"Entertainment & Leisure"} className="bg-gray-800 text-white">Entertainment & Leisure</option>
										<option value={"Utilities & Bills"} className="bg-gray-800 text-white">Utilities & Bills</option>
										<option value={"Transportation & Fuel"} className="bg-gray-800 text-white">Transportation & Fuel</option>
										<option value={"Groceries & Household"} className="bg-gray-800 text-white">Groceries & Household</option>
										<option value={"Repairs & Maintenance"} className="bg-gray-800 text-white">Repairs & Maintenance</option>
										<option value={"Healthcare & Medical"} className="bg-gray-800 text-white">Healthcare & Medical</option>
										<option value={"Travel & Vacation"} className="bg-gray-800 text-white">Travel & Vacation</option>
										<option value={"Shopping & Personal Care"} className="bg-gray-800 text-white">Shopping & Personal Care</option>
										<option value={"Investment & Assets"} className="bg-gray-800 text-white">Investment & Assets</option>
										<option value={"Savings & Deposits"} className="bg-gray-800 text-white">Savings & Deposits</option>
										<option value={"Others"} className="bg-gray-800 text-white">Others</option>
									</select>
									<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
										<svg className='fill-current h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
											<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
										</svg>
									</div>
								</div>
							</div>

							<div className='w-full sm:w-1/2'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='description'>
									Description
								</label>
								<input
									className='appearance-none block w-full bg-transparent text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500'
									id='description'
									name='description'
									type='text'
									placeholder='Rent, Groceries, Salary, etc.'
									value={formData.description}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						{/* PAYMENT TYPE, CATEGORY & AMOUNT */}
						<div className='flex flex-col sm:flex-row gap-3'>
							<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='paymentType'>
									Payment Type
								</label>
								<div className='relative'>
									<select
										className='block appearance-none w-full bg-transparent border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500'
										id='paymentType'
										name='paymentType'
										onChange={handleInputChange}
										value={formData.paymentType}
									>
										<option value={"upi"} className="bg-gray-800 text-white">UPI</option>
										<option value={"card"} className="bg-gray-800 text-white">Card</option>
										<option value={"cash"} className="bg-gray-800 text-white">Cash</option>
									</select>
									<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
										<svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
											<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
										</svg>
									</div>
								</div>
							</div>

							<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='category'>
									Category
								</label>
								<div className='relative'>
									<select
										className='block appearance-none w-full bg-transparent border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500'
										id='category'
										name='category'
										onChange={handleInputChange}
										value={formData.category}
									>
										<option value={"saving"} className="bg-gray-800 text-white">Saving</option>
										<option value={"expense"} className="bg-gray-800 text-white">Expense</option>
										<option value={"investment"} className="bg-gray-800 text-white">Investment</option>
									</select>
									<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
										<svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
											<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
										</svg>
									</div>
								</div>
							</div>

							<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
								<label className='block uppercase text-xs font-bold mb-2' htmlFor='amount'>
									Amount (INR)
								</label>
								<input
									className='appearance-none block w-full bg-transparent border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500'
									id='amount'
									name='amount'
									type='number'
									placeholder='150'
									value={formData.amount}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						{/* LOCATION & DATE */}
						<div className='flex flex-col sm:flex-row gap-3'>
							<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='location'>
									Location
								</label>
								<input
									className='appearance-none block w-full bg-transparent text-white border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
									id='location'
									name='location'
									type='text'
									placeholder='Panchkula'
									value={formData.location || ""}
									onChange={handleInputChange}
								/>
							</div>

							<div className='w-full sm:flex-1'>
								<label className='block uppercase tracking-wide text-xs font-bold mb-2' htmlFor='date'>
									Date
								</label>
								<input
									type='date'
									name='date'
									id='date'
									className='appearance-none block w-full bg-transparent text-white border rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
									placeholder='Select date'
									value={formData.date}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						{/* SUBMIT BUTTON */}
						<button
							className='text-white font-bold w-full rounded px-4 py-3 mt-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed'
							type='submit'
							disabled={loadingUpdate}
						>
							{loadingUpdate ? "Updating..." : "Update Transaction"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default TransactionUpdateModal;