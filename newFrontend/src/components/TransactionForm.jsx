import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from 'react-hot-toast';
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTIONS_BY_USER, GET_TRANSACTIONS_BY_USER_PAGINATED } from "../graphql/queries/transaction.query";
import { GET_DASHBOARD_SUMMARY } from "../graphql/queries/dashboard.query";
import {FaRupeeSign} from "react-icons/fa";
import { getCurrentDateInTimezone } from "../helpers/timezoneHelper";

const TransactionForm = ({toggleModal}) => {

	const[createTransaction,{loading,error}]=useMutation(CREATE_TRANSACTION,{
		refetchQueries: [
			{query: GET_DASHBOARD_SUMMARY },
			{query: GET_TRANSACTIONS_BY_USER_PAGINATED, variables: { page: 1, limit: 10 }},
			{query: GET_STATS_BY_CATEGORY},
			{query:GET_CURRENT_WEEK_STATS_BY_CATEGORY},
			{query:GET_CURRENT_MONTH_STATS_BY_CATEGORY},
			{query: GET_STATS_BY_PAYMENT_TYPE},
			{query:GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE},
			{query:GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE},
			{query: GET_STATS_BY_TAG},
			{query:GET_CURRENT_MONTH_STATS_BY_TAG},
			{query:GET_CURRENT_WEEK_STATS_BY_TAG},
		],
		awaitRefetchQueries: true
	});
	const tagArray=[
		"Food & Dining",
		"Entertainment & Leisure",
		"Utilities & Bills",
		"Transportation & Fuel",
		"Groceries & Household",
		"Repairs & Maintenance",
		"Healthcare & Medical",
		"Travel & Vacation",
		"Shopping & Personal Care",
		"Investment & Assets",
		"Savings & Deposits",
		"Others"
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);
		const transactionData = {
			description: formData.get("description"),
			paymentType: formData.get("paymentType"),
			category: formData.get("category"),
			amount: parseFloat(formData.get("amount")),
			location: formData.get("location"),
			date: formData.get("date"),
			tag:formData.get("tag")
		};

		try {
			await createTransaction({
				variables:{
					input:transactionData
				}
			})
			form.reset();
			toast.success("Transaction added successfully");
			toggleModal();
		} catch (error) {
			// Removed manual toast.error -> Global Handler in main.jsx catches this
			console.log("Error in handleSubmit transaction", error);
		}
		console.log("transactionData", transactionData);
	};

	return (
		<form className='w-full max-w-lg flex flex-col gap-4 sm:gap-5 px-3 sm:px-4' onSubmit={handleSubmit}>
			{/* TRANSACTION */}
			<div className='flex flex-col sm:flex-row gap-3 sm:gap-0'>

			<div className='w-full sm:w-1/2 sm:pr-3 md:pr-5'>
					<label
						className='block uppercase tracking-wide  text-xs font-bold mb-2'
						htmlFor='tag'
					>
						Tag
					</label>
					<div className='relative'>
						<select
							className=' block appearance-none w-full bg-transparent border border-gray-200  py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500 overflow-y-auto'
							id='tag'
							name='tag'
							defaultValue=""
							required
						>
							<option value="" disabled className="bg-neutral-500 text-white hover:bg-gray-700 hover:cursor-pointer">Tag</option>
							<option value={"Food & Dining"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Food & Dining</option>
							<option value={"Entertainment & Leisure"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer" >Entertainment & Leisure</option>
							<option value={"Utilities & Bills"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Utilities & Bills</option>
							<option value={"Transportation & Fuel"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Transportation & Fuel</option>
							<option value={"Repairs & Maintenance"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Repairs & Maintenance</option>
							<option value={"Healthcare & Medical"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Healthcare & Medical</option>
							<option value={"Travel & Vacation"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Travel & Vacation</option>
							<option value={"Shopping & Personal Care"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Shopping & Personal Care</option>
							<option value={"Investment & Assets"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Investment & Assets</option>
							<option value={"Savings & Deposits"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Savings & Deposits</option>
							<option value={"Others"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Others</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
							<svg
								className='fill-current h-4 w-4 text-white'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
							>
								<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
							</svg>
						</div>
					</div>
				</div>

				<div className='w-full sm:w-1/2'>
					<label
						className='block uppercase tracking-wide  text-xs font-bold mb-2'
						htmlFor='description'
					>
						Description
					</label>
					<input
						className='appearance-none block w-full bg-transparent  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
						id='description'
						name='description'
						type='text'
						required
						placeholder='Fuel'
					/>
				</div>

				
			</div>
			{/* PAYMENT TYPE */}
			<div className='flex flex-col sm:flex-row gap-3'>
				<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='paymentType'
					>
						Payment Type
					</label>
					<div className='relative'>
						<select
							className='block appearance-none w-full bg-transparent border border-gray-200  py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500'
							id='paymentType'
							name='paymentType'
							defaultValue=""
							required
						>
							<option value="" disabled className="bg-neutral-500 text-white hover:bg-gray-700 hover:cursor-pointer">Type</option>
							<option value={"upi"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">UPI</option>
							<option value={"card"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer" >Card</option>
							<option value={"cash"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Cash</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white'>
							<svg
								className='fill-current h-4 w-4 text-white'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
							>
								<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
							</svg>
						</div>
					</div>
				</div>

				{/* CATEGORY */}
				<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='category'
					>
						Category
					</label>
					<div className='relative'>
						<select
							className='block appearance-none w-full bg-transparent border border-gray-200  py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500'
							id='category'
							name='category'
							defaultValue=""
							required
						>
							<option value="" disabled className="bg-neutral-500 text-white hover:bg-gray-700 hover:cursor-pointer">Category</option>
							<option value={"saving"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Saving</option>
							<option value={"expense"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Expense</option>
							<option value={"investment"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Investment</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
							<svg
								className='fill-current h-4 w-4'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
							>
								<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
							</svg>
						</div>
					</div>
				</div>

				{/* AMOUNT */}
				<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
					<label className='block uppercase text-white text-xs font-bold mb-2' htmlFor='amount'>
						Amount(INR)
					</label>
					<input
						className='appearance-none block w-full  bg-transparent border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
						id='amount'
						name='amount'
						type='number'
						placeholder='₹ 150'
						required
					/>
				</div>
			</div>

			{/* LOCATION */}
			<div className='flex flex-col sm:flex-row gap-3'>
				<div className='w-full sm:flex-1 mb-4 sm:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='location'
					>
						Location
					</label>
					<input
						className='appearance-none block w-full bg-transparent  border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
						id='location'
						name='location'
						type='text'
						placeholder='Panchkula'
					/>
				</div>

				{/* DATE */}
				<div className='w-full sm:flex-1'>
					<label className='block uppercase tracking-wide text-white text-xs font-bold mb-2' htmlFor='date'>
						Date
					</label>
					<input
						type='date'
						name='date'
						id='date'
						defaultValue={getCurrentDateInTimezone()}
						className='appearance-none block w-full bg-transparent  border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
						placeholder='Select date'
						required
					/>
				</div>
			</div>
			{/* SUBMIT BUTTON */}
			<button
				className='text-white font-bold w-full rounded px-4 py-3 mt-2 bg-gradient-to-br
         					 from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600
							disabled:opacity-70 disabled:cursor-not-allowed'
				type='submit'
				disabled={loading}
			>
			{loading?"Loading...":"Add Transaction"}
			</button>
		</form>
	);
};

export default TransactionForm;