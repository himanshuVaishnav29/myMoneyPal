import { useQuery } from '@apollo/client';
import { GET_AI_RECOMMENDATIONS } from '../graphql/queries/ai.query';
import { FaBrain, FaChartLine, FaExclamationTriangle, FaLightbulb, FaRedo, FaSpinner } from 'react-icons/fa';
import ComponentLoader from '../components/ComponentLoader';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AISuggestions = () => {
	const { data, loading, error, refetch } = useQuery(GET_AI_RECOMMENDATIONS);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			const result = await refetch({ forceRefresh: true });
			
			// This is business logic (successful 200 response, but data says limit reached)
			// So we keep this specific toast here.
			if (result.data?.getAIRecommendations?.isRateLimited) {
				const hours = result.data.getAIRecommendations.hoursRemaining;
				toast.error(
					`AI is tired! Come back in ${hours} hours to get roasted again. 😴`,
					{ duration: 5000 }
				);
			} else {
				toast.success('AI recommendations refreshed!');
			}
		} catch (err) {
			// Removed manual toast.error calls.
			// Global Handler in main.jsx catches Network 429 and other GraphQL errors.
			console.error("Error refreshing AI suggestions:", err);
		} finally {
			setIsRefreshing(false);
		}
	};

	const getMoodColor = (mood) => {
		switch (mood) {
			case 'positive': return 'from-green-500 to-emerald-600';
			case 'warning': return 'from-yellow-500 to-orange-600';
			case 'critical': return 'from-red-500 to-pink-600';
			default: return 'from-blue-500 to-cyan-600';
		}
	};

	const getMoodIcon = (mood) => {
		switch (mood) {
			case 'positive': return '🎉';
			case 'warning': return '⚠️';
			case 'critical': return '🚨';
			default: return '💡';
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<ComponentLoader />
			</div>
		);
	}

	if (error) {
		// We can still display a nice error UI for persistent page-load errors
		// independent of the toast notifications.
		const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
		
		return (
			<div className="min-h-screen p-6 text-white">
				<div className="max-w-4xl mx-auto">
					<div className="bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-700/50 backdrop-blur-md border rounded-2xl p-8 text-center">
						<FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
						<h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
						<p className="text-gray-300 mb-6">{errorMessage}</p>
						<button
							onClick={() => refetch()}
							className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
						>
							<FaRedo /> Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	const recommendations = data?.getAIRecommendations;

	if (!recommendations) {
		return (
			<div className="min-h-screen p-6 text-white">
				<div className="max-w-4xl mx-auto">
					<div className="bg-gradient-to-br from-cyan-900/40 to-slate-900/40 backdrop-blur-md border border-cyan-700/50 rounded-2xl p-8 text-center">
						<img src="/coming_soon_image.svg" alt="No Data" className="w-64 mx-auto mb-6" />
						<h2 className="text-2xl font-bold mb-2">No Transactions Found!</h2>
						<p className="text-gray-300 mb-6">Start adding transactions to get personalized AI recommendations</p>
						<a
							href="/dashboard"
							className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-all duration-300 inline-block"
						>
							Go to Dashboard
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 sm:p-6 text-white">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-3">
						<FaBrain className="text-4xl text-purple-400" />
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold">AI Financial Advisor</h1>
							<p className="text-gray-400 text-sm">Your sarcastic money mentor</p>
						</div>
					</div>
					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
					>
						{isRefreshing ? <FaSpinner className="animate-spin" /> : <FaRedo />}
						{isRefreshing ? 'Refreshing...' : 'Refresh'}
					</button>
				</div>

				{/* Headline Card */}
				<div className={`bg-gradient-to-br ${getMoodColor(recommendations.mood)} p-6 sm:p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
					<div className="flex items-start gap-4">
						<span className="text-5xl">{getMoodIcon(recommendations.mood)}</span>
						<div className="flex-1">
							<h2 className="text-xl sm:text-2xl font-bold mb-4">{recommendations.headline}</h2>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
								<div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
									<p className="text-white/80">This Month</p>
									<p className="text-2xl font-bold">₹{recommendations.currentMonthTotal.toFixed(0)}</p>
								</div>
								<div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
									<p className="text-white/80">Last Month</p>
									<p className="text-2xl font-bold">₹{recommendations.lastMonthTotal.toFixed(0)}</p>
								</div>
								<div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
									<p className="text-white/80">Difference</p>
									<p className={`text-2xl font-bold ${recommendations.difference >= 0 ? 'text-red-200' : 'text-green-200'}`}>
										{recommendations.difference >= 0 ? '+' : ''}₹{recommendations.difference.toFixed(0)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Sarcastic Tips */}
				<div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-700/50 rounded-2xl p-6 sm:p-8">
					<div className="flex items-center gap-3 mb-6">
						<FaLightbulb className="text-3xl text-yellow-400" />
						<h3 className="text-xl sm:text-2xl font-bold">Sarcastic Tips (But Actually Useful)</h3>
					</div>
					<div className="space-y-4">
						{recommendations.sarcastic_tips.map((tip, index) => (
							<div
								key={index}
								className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
							>
								<div className="flex gap-3">
									<span className="text-2xl flex-shrink-0">{index === 0 ? '🎯' : index === 1 ? '💰' : '🔥'}</span>
									<p className="text-gray-200 leading-relaxed">{tip}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Unusual Spending Alerts */}
				{recommendations.unusual_spending_alerts.length > 0 && (
					<div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-md border border-orange-700/50 rounded-2xl p-6 sm:p-8">
						<div className="flex items-center gap-3 mb-6">
							<FaChartLine className="text-3xl text-orange-400" />
							<h3 className="text-xl sm:text-2xl font-bold">Unusual Spending Detected</h3>
						</div>
						<div className="space-y-4">
							{recommendations.unusual_spending_alerts.map((alert, index) => (
								<div
									key={index}
									className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
								>
									<div className="flex gap-3">
										<span className="text-2xl flex-shrink-0">⚡</span>
										<p className="text-gray-200 leading-relaxed">{alert}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Stats Footer */}
				<div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 text-center">
					<p className="text-gray-400 text-sm">
						Analyzed {recommendations.transactionCount} transactions from this month
					</p>
					<p className="text-gray-500 text-xs mt-2">
						Powered by Google Gemini AI • Updates daily • 1 refresh per day
					</p>
				</div>
			</div>
		</div>
	);
};

export default AISuggestions;