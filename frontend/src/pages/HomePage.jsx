import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/user.mutations";
import { GET_STATS_BY_CATEGORY } from "../graphql/queries/transaction.query";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {

	const { data: authUserData } = useQuery(GET_AUTHETICATED_USER);

	const [logout,{loading,client}]=useMutation(LOGOUT,{
		refetchQueries:["GetAuthenticatedUser"]
	});
	const {data, categoryStatsLoading}=useQuery(GET_STATS_BY_CATEGORY);
	

	console.log("statsByCategory",data) ;

	const [chartData,setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "₹",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 0,
				spacing: 5,
				cutout: 130,
			},
		],
	});

	useEffect(()=>{
		if(data?.getStatsByCategory){
			const categories=data.getStatsByCategory.map((stat)=>stat.category.charAt(0).toUpperCase() + stat.category.slice(1));
			const totalAmounts=data.getStatsByCategory.map((stat)=>stat.totalAmount);
			
			// const totalSum = totalAmounts.reduce((acc, amount) => acc + amount, 0);

			// Convert each amount to a percentage
			// const percentageAmounts = totalAmounts.map(amount => (amount / totalSum) * 100);

			const backgroundColors=[];
			const borderColors=[];

			categories.forEach((category) => {
				if (category === "Saving") {
					backgroundColors.push("rgba(75, 192, 192)");
					borderColors.push("rgba(75, 192, 192)");
				} else if (category === "Expense") {
					backgroundColors.push("rgba(255, 99, 132)");
					borderColors.push("rgba(255, 99, 132)");
				} else if (category === "Investment") {
					backgroundColors.push("rgba(54, 162, 235)");
					borderColors.push("rgba(54, 162, 235)");
				}
			});
			setChartData(prev=>({
				labels:categories,
				datasets:[
					{
						...prev.datasets[0],
						data:totalAmounts,
						backgroundColor:backgroundColors,
						borderColor:borderColors
					}
				]
			}))

		}
	},[data]);




	const handleLogout = async() => {
		try {
			await logout()
			client.resetStore();  //for clearing cache
			toast.success("Logout Successfull");
		} catch (error) {
			console.log("Error in handleLogout");
			toast.error(error.message);
		}
	};

	
	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						// src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
						src={authUserData?.authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
						<Doughnut data={chartData} />
					</div>

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;
