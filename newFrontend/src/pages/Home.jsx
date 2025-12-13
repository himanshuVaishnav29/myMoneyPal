import React, { useEffect, useState } from 'react';
import { formatName } from '../helpers/helperFunctions';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_SUMMARY } from '../graphql/queries/dashboard.query';
import FinanceCarousel from '../components/FinanceCarousel';
import Footer from '../components/Footer';
import ComponentLoader from '../components/ComponentLoader';
import SkeletonCard from '../components/SkeletonCard';
import { 
  FaFire, 
  FaShieldAlt, 
  FaRocket, 
  FaClock, 
  FaPiggyBank, 
  FaChartLine, 
  FaChartArea 
} from 'react-icons/fa';

const HomePage = ({ loggedInUser }) => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const { data, loading, error } = useQuery(GET_DASHBOARD_SUMMARY);

  useEffect(() => {
    if (!loading && data?.getDashboardSummary) {
      const summary = data.getDashboardSummary;
      setTotalExpenses(summary.totalExpenses);
      setTotalSavings(summary.totalSavings);
      setTotalInvestment(summary.totalInvestment);
      setRecentTransactions(summary.recentTransactions.slice(0, 4));
    }
  }, [data, loading]);

  // Helper to format large numbers to Indian System (k, L, Cr)
  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)} k`;
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="p-6 min-h-screen text-white mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Financial Summary Row */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            <>
              <SkeletonCard gradient="bg-gradient-to-br from-red-500 via-red-500 to-red-700" />
              <SkeletonCard gradient="bg-gradient-to-br from-green-500 via-green-600 to-green-700" />
              <SkeletonCard gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" />
            </>
          ) : (
            <>
              {/* Monthly Expense Card */}
              <div className="finance-card-expense glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 border border-white/10">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-100"></div>
                
                {/* Floating Icon */}
                <div className="absolute top-4 right-4 opacity-30">
                  <FaFire className="text-6xl text-red-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl glass-card border border-red-500/30 flex items-center justify-center shrink-0">
                      <FaFire className="text-xl text-red-400 drop-shadow-neon-red animate-pulse-glow" />
                    </div>
                    <div>
                      {/* UPDATED HEADER: Brighter, bolder, larger */}
                      <p className="text-sm text-white font-bold uppercase tracking-wider shadow-sm">
                        Monthly Expense
                      </p>
                    </div>
                  </div>

                  {/* Formatted Amount */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-red-400 drop-shadow-neon-red mb-4">
                    {formatCurrency(totalExpenses)}
                  </h2>

                  {/* SVG Visualization (Centered) */}
                  <div className="w-full h-16 flex items-center justify-center opacity-80 group-hover:scale-110 transition-all duration-300">
                     <FaChartArea className="w-full h-full text-red-500/30" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></div>
                    <span>Tracking your spending</span>
                  </div>
                </div>

                {/* Bottom Border Accent (Default Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
              </div>

              {/* Monthly Savings Card */}
              <div className="finance-card-savings glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 border border-white/10" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-100"></div>
                
                <div className="absolute top-4 right-4 opacity-30">
                  <FaShieldAlt className="text-6xl text-emerald-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl glass-card border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <FaShieldAlt className="text-xl text-emerald-400 drop-shadow-neon-emerald animate-pulse-glow" />
                    </div>
                    <div>
                       {/* UPDATED HEADER */}
                      <p className="text-sm text-white font-bold uppercase tracking-wider shadow-sm">
                        Monthly Savings
                      </p>
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 drop-shadow-neon-emerald mb-4">
                    {formatCurrency(totalSavings)}
                  </h2>

                  {/* SVG Visualization (Centered) */}
                  <div className="w-full h-16 flex items-center justify-center opacity-80 group-hover:scale-110 transition-all duration-300">
                    <FaPiggyBank className="w-16 h-16 text-emerald-500/30" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                    <span>Building your safety net</span>
                  </div>
                </div>

                {/* Bottom Border Accent (Default Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              </div>

              {/* Monthly Investment Card */}
              <div className="finance-card-investment glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 border border-white/10" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-100"></div>
                
                <div className="absolute top-4 right-4 opacity-30">
                  <FaRocket className="text-6xl text-cyan-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl glass-card border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <FaRocket className="text-xl text-cyan-400 drop-shadow-neon-cyan animate-pulse-glow" />
                    </div>
                    <div>
                       {/* UPDATED HEADER */}
                      <p className="text-sm text-white font-bold uppercase tracking-wider shadow-sm">
                        Monthly Investment
                      </p>
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 drop-shadow-neon-cyan mb-4">
                    {formatCurrency(totalInvestment)}
                  </h2>

                  {/* SVG Visualization (Centered) */}
                  <div className="w-full h-16 flex items-center justify-center opacity-80 group-hover:scale-110 transition-all duration-300">
                    <FaChartLine className="w-full h-full text-cyan-500/30" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0"></div>
                    <span>Growing your wealth</span>
                  </div>
                </div>

                {/* Bottom Border Accent (Default Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </div>

              {/* RECENT TRANSACTIONS CARD */}
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer finance-card-transactions border border-white/10" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-100"></div>
                
                <div className="absolute top-4 right-4 opacity-30">
                  <FaClock className="text-6xl text-violet-400" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl glass-card border border-violet-500/30 flex items-center justify-center shrink-0">
                        <FaClock className="text-xl text-violet-400 drop-shadow-neon-violet animate-pulse-glow" />
                      </div>
                       {/* UPDATED HEADER */}
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider shadow-sm">
                        Recent Activity
                      </h3>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse drop-shadow-neon-violet shrink-0"></div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <ComponentLoader />
                    </div>
                  ) : recentTransactions?.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                      {recentTransactions.map((transaction, index) => (
                        <div
                          key={transaction._id}
                          className="transaction-item glass-card rounded-xl p-3 border border-white/5 hover:border-violet-500/30 transition-all w-full"
                          style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between gap-2 w-full">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm truncate">
                                {transaction.description.toUpperCase()}
                              </p>
                              <p className="text-gray-400 text-xs mt-0.5 truncate">
                                {new Date(parseInt(transaction.date)).toLocaleDateString()} • {formatName(transaction.category)}
                              </p>
                            </div>

                            <div className="flex flex-col items-end shrink-0 pl-2">
                              <p
                                className={`text-sm font-bold text-right ${
                                  transaction.category.toLowerCase().includes('investment') ? 'text-cyan-400 drop-shadow-neon-cyan' :
                                  transaction.category.toLowerCase().includes('saving') ? 'text-emerald-400 drop-shadow-neon-emerald' :
                                  'text-red-400 drop-shadow-neon-red'
                                }`}
                              >
                                {formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5">
                                {transaction.paymentType === 'upi' ? 'UPI' : formatName(transaction.paymentType)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No recent transactions</p>
                    </div>
                  )}
                </div>
                
                 {/* Bottom Border Accent (Default Visible) */}
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
              </div>
            </>
          )}
        </div>

        {/* Finance Carousel Section */}
        <div className="col-span-1 md:col-span-3">
          <FinanceCarousel />
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default HomePage;