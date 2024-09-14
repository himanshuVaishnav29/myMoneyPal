import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaTrash ,FaRupeeSign} from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import { GET_STATS_BY_CATEGORY, GET_TRANSACTIONS_BY_USER } from "../graphql/queries/transaction.query";

const categoryColorMap = {
	Saving: "from-green-700 to-green-400",
	Expense: "from-pink-800 to-pink-600",
	Investment: "from-blue-700 to-blue-400",
};

const Card = ({ transaction,authUser}) => {

	let { category, amount, location, date, paymentType, description } = transaction;
	description = description[0]?.toUpperCase() + description.slice(1);
	category = category[0]?.toUpperCase() + category.slice(1);
	paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);
	if (paymentType === 'Upi') {
		paymentType = paymentType.toUpperCase();
	}
	const formattedDate = formatDate(date);

	const cardClass = categoryColorMap[category];


	const[deleteTransaction,{loading,error}]=useMutation(DELETE_TRANSACTION,{
		refetchQueries: [{ query: GET_TRANSACTIONS_BY_USER},{query:GET_STATS_BY_CATEGORY}],
	});

	const handleDelete=async()=>{
		try {
			await deleteTransaction({ variables: { transactionId: transaction._id } });
			toast.success("Transaction deleted successfully");
		} catch (error) {
			console.log("error in handleDelete transaction",error);
			toast.error(error.message);
		}
	}

	return (
		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-row items-center justify-between'>
					<h2 className='text-lg font-bold text-white'>{category}</h2>
					<div className='flex items-center gap-2'>
							{!loading && <FaTrash className={"cursor-pointer"} onClick={handleDelete} />}
							{loading && <div className='w-6 h-6 border-t-2 border-b-2  rounded-full animate-spin'></div>}<Link to={`/transaction/${transaction._id}`}>
							<HiPencilAlt className="cursor-pointer text-white hover:text-black transition-colors duration-300" size={20} />
						</Link>
					</div>
				</div>
				<p className='text-white flex items-center gap-1'>
					<BsCardText />
					Description: {description}
				</p>
				<p className='text-white flex items-center gap-1'>
					<MdOutlinePayments />
					Payment Type: {paymentType}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaRupeeSign/>
					Amount: ₹ {amount}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaLocationDot />
					Location: {location || "NA"}
				</p>
				<div className='flex justify-between items-center'>
					<p className='text-xs text-black font-bold'>{formattedDate}</p>
					<img
						src={authUser?.profilePicture} alt='profileImg'
						className='h-8 w-8 border rounded-full'
						
					/>
				</div>
			</div>
		</div>
	);
};
export default Card;