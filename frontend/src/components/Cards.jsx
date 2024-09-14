import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS_BY_USER } from "../graphql/queries/transaction.query";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";

const Cards = () => {
	const { data: authUser } = useQuery(GET_AUTHETICATED_USER);
	if(authUser){r
		const{data,loading,error}=useQuery(GET_TRANSACTIONS_BY_USER);
	}
	// if(error){
	// 	return <p>Error:{error.message}</p>
	// }
	// if(loading)
	// 	return <p>Loading...</p>
	console.log("currUserTxns",data);

	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{/* <Card cardType={"saving"} />
				<Card cardType={"saving"} />
				<Card cardType={"investment"} />
				<Card cardType={"investment"} />
				<Card cardType={"saving"} />
				<Card cardType={"expense"} /> */}

				{!loading && data.getAllTransactionsByUser.map(transaction=>(
					<Card key={transaction._id} transaction={transaction} authUser={authUser.authUser} />
				))}
			</div>

			{!loading && data?.getAllTransactionsByUser?.length === 0 && (
				<p className='text-2xl font-bold text-center w-full'>No transaction history found.</p>
			)}

		</div>
	);
};
export default Cards;