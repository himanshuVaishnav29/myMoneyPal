import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from 'react-hot-toast';
import { GET_STATS_BY_CATEGORY, GET_TRANSACTIONS_BY_USER } from "../graphql/queries/transaction.query";
import {FaRupeeSign} from "react-icons/fa";

const TransactionForm = () => {

	const[createTransaction,{loading,error}]=useMutation(CREATE_TRANSACTION,{
		refetchQueries: [{ query: GET_TRANSACTIONS_BY_USER },{query:GET_STATS_BY_CATEGORY}],
	});


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
		};
		// if(!description || !paymentType || !category || !amount || !date){
		// 	toast.error("Please fill out necessary fields for creating transaction");
		// 	return;
		// }
		try {
			await createTransaction({
				variables:{
					input:transactionData
				}
			})
			form.reset();
			toast.success("Transaction added successfully");
		} catch (error) {
			console.log("Error in handleSubmit transaction");
			toast.error(error.message);

		}
		console.log("transactionData", transactionData);
	};

	return (
		<form className='w-full max-w-lg flex flex-col gap-5 px-3' onSubmit={handleSubmit}>
			{/* TRANSACTION */}
			<div className='flex flex-wrap'>
				<div className='w-full'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='description'
					>
						Description
					</label>
					<input
						className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
						id='description'
						name='description'
						type='text'
						required
						placeholder='Rent, Groceries, Salary, etc.'
					/>
				</div>
			</div>
			{/* PAYMENT TYPE */}
			<div className='flex flex-wrap gap-3'>
				<div className='w-full flex-1 mb-6 md:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='paymentType'
					>
						Payment Type
					</label>
					<div className='relative'>
						<select
							className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							id='paymentType'
							name='paymentType'
							defaultValue=""
							required
						>
							<option value="" disabled>Type</option>
							<option value={"upi"}>UPI</option>
							<option value={"card"}>Card</option>
							<option value={"cash"}>Cash</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
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

				{/* CATEGORY */}
				<div className='w-full flex-1 mb-6 md:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='category'
					>
						Category
					</label>
					<div className='relative'>
						<select
							className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
							id='category'
							name='category'
							defaultValue=""
							required
						>
							<option value="" disabled>Category</option>
							<option value={"saving"}>Saving</option>
							<option value={"expense"}>Expense</option>
							<option value={"investment"}>Investment</option>
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
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
				<div className='w-full flex-1 mb-6 md:mb-0'>
					<label className='block uppercase text-white text-xs font-bold mb-2' htmlFor='amount'>
						Amount(INR)
					</label>
					<input
						className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
						id='amount'
						name='amount'
						type='number'
						placeholder='150'
						required
					/>
				</div>
			</div>

			{/* LOCATION */}
			<div className='flex flex-wrap gap-3'>
				<div className='w-full flex-1 mb-6 md:mb-0'>
					<label
						className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
						htmlFor='location'
					>
						Location
					</label>
					<input
						className='appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
						id='location'
						name='location'
						type='text'
						placeholder='Panchkula'
					/>
				</div>

				{/* DATE */}
				<div className='w-full flex-1'>
					<label className='block uppercase tracking-wide text-white text-xs font-bold mb-2' htmlFor='date'>
						Date
					</label>
					<input
						type='date'
						name='date'
						id='date'
						className='appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none
						 focus:bg-white'
						placeholder='Select date'
						required
					/>
				</div>
			</div>
			{/* SUBMIT BUTTON */}
			<button
				className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
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