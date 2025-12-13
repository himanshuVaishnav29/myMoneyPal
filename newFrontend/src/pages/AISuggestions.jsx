import { useQuery } from '@apollo/client';
import { GET_AI_RECOMMENDATIONS } from '../graphql/queries/ai.query';
import { FaBrain, FaChartLine, FaExclamationTriangle, FaLightbulb, FaRedo, FaSpinner, FaRocket, FaFire, FaShieldAlt, FaBolt } from 'react-icons/fa';
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
			case 'positive': return 'from-emerald-400 via-cyan-400 to-teal-400';
			case 'warning': return 'from-amber-400 via-orange-400 to-rose-400';
			case 'critical': return 'from-red-400 via-rose-400 to-pink-400';
			default: return 'from-cyan-400 via-violet-400 to-purple-400';
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
			<div className="min-h-screen bg-space-dark flex items-center justify-center">
				<ComponentLoader />
			</div>
		);
	}

	if (error) {
		const errorMessage = error.graphQLErrors?.[0]?.message || error.message;

		return (
			<div className="min-h-screen bg-space-dark flex items-center justify-center px-4">
				<div className="grid-background"></div>
				<div className="ambient-orbs">
					<div className="orb orb-red"></div>
				</div>
				
				<div className="max-w-md w-full p-8 rounded-3xl glass-card border-gradient-red neon-glow-red text-center relative z-10 animate-fade-up">
					<div className="relative">
						<FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6 drop-shadow-neon-red animate-pulse-glow" />
					</div>
					<h2 className="text-2xl font-bold mb-3 text-gradient-red">
						AI Failed. You Still Spent the Money.
					</h2>
					<p className="text-sm text-gray-400 mb-8 leading-relaxed">
						{errorMessage}
					</p>
					<button
						onClick={() => refetch()}
						className="px-6 py-3 rounded-xl text-sm font-medium glass-card border-gradient-red hover:neon-glow-red transition-all duration-300"
					>
						Retry Analysis
					</button>
				</div>
			</div>
		);
	}

	const recommendations = data?.getAIRecommendations;

	if (!recommendations) {
		return (
			<div className="min-h-screen bg-space-dark flex items-center justify-center px-4">
				<div className="grid-background"></div>
				<div className="ambient-orbs">
					<div className="orb orb-violet"></div>
				</div>
				
				<div className="max-w-md w-full p-8 rounded-3xl glass-card border-gradient-cyan text-center relative z-10">
					<FaBrain className="text-6xl text-cyan-400 mx-auto mb-6 drop-shadow-neon-cyan animate-pulse-glow" />
					<h2 className="text-2xl font-bold mb-3 text-white">
						Nothing to Analyze
					</h2>
					<p className="text-sm text-gray-400 mb-8 leading-relaxed">
						No transactions. No advice. Start spending (or saving) first.
					</p>
					<a
						href="/dashboard"
						className="inline-block px-6 py-3 rounded-xl text-sm font-medium glass-card border-gradient-cyan hover:neon-glow-cyan transition-all duration-300"
					>
						Go to Dashboard
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-space-dark text-white px-4 sm:px-6 py-8 relative overflow-hidden">
			{/* Grid background */}
			<div className="grid-background"></div>
			
			{/* Ambient orbs */}
			<div className="ambient-orbs">
				<div className="orb orb-cyan"></div>
				<div className="orb orb-violet"></div>
				<div className="orb orb-purple"></div>
			</div>

			<div className="max-w-7xl mx-auto space-y-8 relative z-10">

				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card border-gradient-cyan rounded-2xl p-6 animate-fade-up">
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="absolute inset-0 bg-cyan-500 blur-xl opacity-60 animate-pulse"></div>
							<FaBrain className="text-5xl text-cyan-400 relative z-10 drop-shadow-neon-cyan" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-cyan">
								AI Money Coach
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								No motivation. Just consequences.
							</p>
						</div>
					</div>

					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="px-5 py-3 rounded-xl text-sm font-medium glass-card border-gradient-violet hover:neon-glow-violet transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isRefreshing ? (
							<>
								<FaSpinner className="animate-spin" />
								<span className="hidden sm:inline">Refreshing...</span>
							</>
						) : (
							<>
								<FaRedo />
								<span className="hidden sm:inline">Refresh</span>
							</>
						)}
					</button>
				</div>

				{/* Mood Badge & Headline */}
				<div className={`glass-card border-gradient-glow rounded-3xl p-8 relative overflow-hidden animate-fade-up`}
					style={{ animationDelay: '0.1s' }}>
					<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-purple-500/10"></div>
					<div className="relative z-10">
						<div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border-gradient-cyan mb-6">
							<span className="text-2xl animate-pulse-glow">{getMoodIcon(recommendations.mood)}</span>
							<span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
								{recommendations.mood} financial behavior
							</span>
						</div>

						<h2 className="text-2xl sm:text-4xl font-bold leading-tight text-white drop-shadow-lg">
							{recommendations.headline}
						</h2>
					</div>
				</div>

				{/* Metrics Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					{[
						{ 
							label: 'This Month', 
							value: recommendations.currentMonthTotal,
							icon: <FaFire className="text-orange-400" />,
							color: 'orange'
						},
						{ 
							label: 'Last Month', 
							value: recommendations.lastMonthTotal,
							icon: <FaChartLine className="text-cyan-400" />,
							color: 'cyan'
						},
						{ 
							label: 'Delta', 
							value: recommendations.difference,
							icon: recommendations.difference >= 0 ? 
								<FaExclamationTriangle className="text-red-400" /> : 
								<FaShieldAlt className="text-emerald-400" />,
							color: recommendations.difference >= 0 ? 'red' : 'emerald'
						},
					].map((item, i) => (
						<div
							key={i}
							className={`metric-card glass-card border-gradient-${item.color} rounded-2xl p-6 hover-lift animate-fade-up`}
							style={{ animationDelay: `${0.2 + i * 0.1}s` }}
						>
							<div className="flex items-center justify-between mb-4">
								<p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
									{item.label}
								</p>
								<div className="text-2xl opacity-70">
									{item.icon}
								</div>
							</div>
							<p
								className={`text-3xl sm:text-4xl font-bold ${
									item.label === 'Delta'
										? item.value >= 0
											? 'text-red-400 drop-shadow-neon-red'
											: 'text-emerald-400 drop-shadow-neon-emerald'
										: 'text-white'
								}`}
							>
								{item.label === 'Delta' && item.value > 0 ? '+' : ''}
								₹{item.value.toFixed(0)}
							</p>
						</div>
					))}
				</div>

				{/* Sarcastic Tips */}
				<div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
					<div className="flex items-center gap-3">
						<FaLightbulb className="text-3xl text-amber-400 drop-shadow-neon-amber animate-pulse-glow" />
						<h3 className="text-xl sm:text-2xl font-bold text-white">
							Your Financial Reality Check
						</h3>
					</div>

					<div className="space-y-4">
						{recommendations.sarcastic_tips.map((tip, index) => (
							<div
								key={index}
								className="tip-card glass-card border-gradient-violet rounded-2xl p-6 hover-lift group relative overflow-hidden"
							>
								<div className="gradient-accent-bar"></div>
								<div className="flex gap-4 relative z-10">
									<div className="flex-shrink-0 w-10 h-10 rounded-full glass-card border-gradient-cyan flex items-center justify-center text-sm font-bold text-cyan-400 drop-shadow-neon-cyan">
										{index + 1}
									</div>
									<p className="text-gray-200 leading-relaxed flex-1 text-sm sm:text-base">
										{tip}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Spending Alerts */}
				{recommendations.unusual_spending_alerts.length > 0 && (
					<div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.6s' }}>
						<div className="flex items-center gap-3">
							<FaExclamationTriangle className="text-3xl text-red-400 drop-shadow-neon-red animate-pulse-glow" />
							<h3 className="text-xl sm:text-2xl font-bold text-gradient-red">
								Financial Damage Detected
							</h3>
						</div>

						<div className="space-y-4">
							{recommendations.unusual_spending_alerts.map((alert, index) => (
								<div
									key={index}
									className="alert-card glass-card border-gradient-red rounded-2xl p-6 hover-lift group relative overflow-hidden neon-glow-red-subtle"
								>
									<div className="gradient-accent-bar-red"></div>
									<div className="flex gap-4 relative z-10">
										<div className="flex-shrink-0 w-10 h-10 rounded-full glass-card border-gradient-red flex items-center justify-center">
											<FaFire className="text-red-400 text-lg drop-shadow-neon-red" />
										</div>
										<p className="text-gray-200 leading-relaxed flex-1 text-sm sm:text-base">
											{alert}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Footer */}
				<div className="glass-card border-gradient-violet rounded-2xl p-6 text-center animate-fade-up" style={{ animationDelay: '0.7s' }}>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse drop-shadow-neon-cyan"></div>
							<span>{recommendations.transactionCount} transactions analyzed</span>
						</div>
						<div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
						<div className="flex items-center gap-2">
							<FaBolt className="text-violet-400 text-xs" />
							<span>No excuses applied</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AISuggestions;