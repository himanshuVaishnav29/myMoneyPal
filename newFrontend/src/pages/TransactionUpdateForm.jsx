import { useEffect, useState } from "react";
// import TransactionFormSkeleton from "../components/skeletons/TransactionFormSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTION, GET_TRANSACTIONS_BY_USER_PAGINATED } from "../graphql/queries/transaction.query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import { GET_DASHBOARD_SUMMARY } from "../graphql/queries/dashboard.query";
import toast from "react-hot-toast";

const TransactionUpdateForm = () => {

	const {id}=useParams();
	// console.log(id);
	const navigate = useNavigate(); 
	const {loading,data,error}=useQuery(GET_TRANSACTION,{
		variables:{id:id}
	});
	// console.log("data",data);

	const [formData, setFormData] = useState({
		description:data?.getTransaction.description || "",
		paymentType: data?.getTransaction.paymentType|| "",
		category:  data?.getTransaction.category|| "",
		amount:  data?.getTransaction.amount||  "",
		location:data?.getTransaction.location||  "",
		date:data?.getTransaction.date||  "",
		tag:data?.getTransaction.tag||  "",

	});
	useEffect(()=>{
		
		if(data){
			setFormData({
				description: data?.getTransaction.description,
				paymentType: data?.getTransaction.paymentType,
				category: data?.getTransaction.category ,
				amount: data?.getTransaction.amount,
				location: data?.getTransaction.location,
				date: new Date(+data.getTransaction.date).toISOString().slice(0, 10),
				tag:data?.getTransaction.tag
			})
		}
	},[data]);


	const[updateTransaction,{loading:loadingUpdate,data:updatedData}]=useMutation(UPDATE_TRANSACTION,{
		refetchQueries: [
			{query: GET_DASHBOARD_SUMMARY },
			{query: GET_TRANSACTIONS_BY_USER_PAGINATED, variables: { page: 1, limit: 10 }},
			{query: GET_STATS_BY_CATEGORY},
			{query: GET_STATS_BY_PAYMENT_TYPE},
			{query: GET_STATS_BY_TAG}
		],
		awaitRefetchQueries: true
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const amount=parseFloat(formData.amount); //string to number, by default it's string 
		try {
			await updateTransaction({
				variables:{
					input:{
						...formData,
						amount,
						transactionId:id
					}
				}
			})
			toast.success("Transaction Updated successfully");
			navigate("/history");
		} catch (error) {
			console.log("Error in handle submit of update transaction",error)
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

	// if (loading) return <TransactionFormSkeleton />;
	// return <TransactionFormSkeleton />;
	if (loading) return <h1>Loading..</h1>;



	return (
		<div className='h-screen max-w-4xl mx-auto flex flex-col items-center pt-5 text-white'>
			<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative mt-4 mb-7 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
				Update this transaction
			</p>
			<form className='w-full max-w-lg flex flex-col gap-5 px-3' onSubmit={handleSubmit}>
				{/* TRANSACTION */}
				<div className='flex flex-wrap'>

				<div className='w-1/2 pr-5'>
					<label
						className='block uppercase tracking-wide  text-xs font-bold mb-2'
						htmlFor='tag'
					>
						Tag
					</label>
					<div className='relative  text-white'>
						<select
							className=' block appearance-none w-full bg-transparent border border-gray-200  py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500 overflow-y-auto'
							id='tag'
							name='tag'
							defaultValue=""
							onChange={handleInputChange}
							value={formData.tag}
						>
							<option value="" disabled className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Tag</option>
							<option value={"Food & Dining"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Food & Dining</option>
							<option value={"Entertainment & Leisure"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer" >Entertainment & Leisure</option>
							<option value={"Utilities & Bills"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Utilities & Bills</option>
							<option value={"Transportation & Fuel"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Transportation & Fuel</option>
							<option value={"Groceries & Household"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Utilities & Bills</option>
							<option value={"Repairs & Maintenance"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Repairs & Maintenance</option>
							<option value={"Healthcare & Medical"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Healthcare & Medical</option>
							<option value={"Travel & Vacation"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Travel & Vacation</option>
							<option value={"Shopping & Personal Care"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Shopping & Personal Care</option>
							<option value={"Others"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Others</option>
							{/* {
								tagArray.map((opt, index) => (
								<option key={index} value={opt} className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer">
									{opt}
								</option>
							))} */}

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



					<div className='w-1/2'>
						<label
							className='block uppercase tracking-wide  text-xs font-bold mb-2'
							htmlFor='description'
						>
							DESCRIPTION
						</label>
						<input
							className='appearance-none block w-full bg-transparent text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
							id='description'
							name='description'
							type='text'
							placeholder='Rent, Groceries, Salary, etc.'
							value={formData.description}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				{/* PAYMENT TYPE */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label
							className='block uppercase tracking-wide  text-xs font-bold mb-2'
							htmlFor='paymentType'
						>
							Payment Type
						</label>
						<div className='relative'>
							<select
								className='block appearance-none w-full bg-transparent border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500'
								id='paymentType'
								name='paymentType'
								onChange={handleInputChange}
								value={formData.paymentType}
							>
								<option value={"upi"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">UPI</option>
								<option value={"card"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Card</option>
								<option value={"cash"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Cash</option>
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
							className='block uppercase tracking-wide  text-xs font-bold mb-2'
							htmlFor='category'
						>
							Category
						</label>
						<div className='relative'>
							<select
								className='block appearance-none w-full bg-transparent border border-gray-200  py-3 px-4 pr-8 rounded leading-tight focus:outline-none  focus:border-gray-500'
								id='category'
								name='category'
								onChange={handleInputChange}
								value={formData.category}
							>
								<option value={"saving"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Saving</option>
								<option value={"expense"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Expense</option>
								<option value={"investment"} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">Investment</option>
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
						<label className='block uppercase  text-xs font-bold mb-2' htmlFor='amount'>
							Amount (INR)
						</label>
						<input
							className='appearance-none block w-full bg-transparent  border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
							id='amount'
							name='amount'
							type='number'
							placeholder='150'
							value={formData.amount}
							onChange={handleInputChange}
						/>
					</div>
				</div>

				{/* LOCATION */}
				<div className='flex flex-wrap gap-3'>
					<div className='w-full flex-1 mb-6 md:mb-0'>
						<label
							className='block uppercase tracking-wide  text-xs font-bold mb-2'
							htmlFor='location'
						>
							Location
						</label>
						<input
							className='appearance-none block w-full bg-transparent text-white border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
							id='location'
							name='location'
							type='text'
							placeholder='Panchkula'
							value={formData.location || ""}
							onChange={handleInputChange}
							
						/>
					</div>

					{/* DATE */}
					<div className='w-full flex-1'>
						<label
							className='block uppercase tracking-wide  text-xs font-bold mb-2'
							htmlFor='date'
						>
							Date
						</label>
						<input
							type='date'
							name='date'
							id='date'
							className='appearance-none block w-full bg-transparent text-white border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500'
							placeholder='Select date'
							value={formData.date}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				{/* SUBMIT BUTTON */}
				<button
					className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600'
					type='submit'
					disabled={loadingUpdate}
				>
					{loadingUpdate?"Updating":"Update Transaction"}
				</button>
			</form>
		</div>
	);
};
export default TransactionUpdateForm;