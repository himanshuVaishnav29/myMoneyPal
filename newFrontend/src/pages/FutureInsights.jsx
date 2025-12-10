import React from 'react';

const FutureInsights = () => {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Future Insights
                    </h1>
                    
                    <div className="flex justify-center items-center mb-6">
                        <img 
                            src="/coming_soon_image.svg" 
                            alt="Coming Soon" 
                            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                            🚀 Revolutionary Features Coming Soon!
                        </h2>
                        
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">🔮 AI-Powered Predictions</h3>
                                <p className="text-gray-600 dark:text-gray-300">Get personalized spending forecasts and budget recommendations powered by advanced machine learning.</p>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">📊 Smart Analytics</h3>
                                <p className="text-gray-600 dark:text-gray-300">Discover hidden patterns in your financial behavior with intelligent trend analysis.</p>
                            </div>
                            
                            <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">💡 Goal Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300">Set and achieve financial goals with personalized milestones and progress tracking.</p>
                            </div>
                        </div>
                        
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-8">
                            ✨ <span className="font-semibold">Stay tuned!</span> These game-changing features will transform how you manage your money.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FutureInsights;