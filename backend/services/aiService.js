import { GoogleGenerativeAI } from '@google/generative-ai';
import TRANSACTION from '../models/transactionSchema.js';
import { getCurrentMonthRange,convertToUTC } from '../helpers/timezoneUtils.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



const getFinancialAnalysis = async (userId, timezone = 'UTC') => {
  try {
    // 1️⃣ Get CURRENT month range
    const { startOfMonth: userStart, endOfMonth: userEnd } =
      getCurrentMonthRange(timezone);

    // 2️⃣ Convert to UTC
    const currentStart = convertToUTC(userStart, timezone);
    const currentEnd = convertToUTC(userEnd, timezone);

    // 3️⃣ Compute LAST month range (FIXED)
    const lastUserStart = new Date(userStart);
    lastUserStart.setMonth(lastUserStart.getMonth() - 1);

    // FIX: Properly calculate the end of the previous month
    // If we just subtract 1 month from Dec 31, we get Dec 1 (because Nov has no 31st)
    // Instead, we create a new date for the last millisecond of that specific month
    const lastUserEnd = new Date(
        lastUserStart.getFullYear(), 
        lastUserStart.getMonth() + 1, 
        0, 
        23, 59, 59, 999
    );

    const lastMonthStart = convertToUTC(lastUserStart, timezone);
    const lastMonthEnd = convertToUTC(lastUserEnd, timezone);

    console.log("DEBUG DATE RANGES:");
    console.log("Current:", currentStart.toISOString(), "to", currentEnd.toISOString());
    console.log("Last:", lastMonthStart.toISOString(), "to", lastMonthEnd.toISOString());

    // 4️⃣ Fetch Transactions
    const [currentMonthTxns, lastMonthTxns] = await Promise.all([
      TRANSACTION.find({
        userId,
        date: { $gte: currentStart, $lte: currentEnd }
      }).sort({ amount: -1 }),
      TRANSACTION.find({
        userId,
        date: { $gte: lastMonthStart, $lte: lastMonthEnd }
      })
    ]);

    // ... Rest of your aggregation logic remains the same ...
    
    // (Pasting the aggregation part just for completeness)
    const sum = (txns, cat) => txns.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
    const currentExpenses = sum(currentMonthTxns, "expense");
    const currentSavings = sum(currentMonthTxns, "saving");
    const currentInvestment = sum(currentMonthTxns, "investment");
    const lastExpenses = sum(lastMonthTxns, "expense");
    const lastSavings = sum(lastMonthTxns, "saving");
    const lastInvestment = sum(lastMonthTxns, "investment");

    const tagTotals = {};
    const paymentTypeTotals = {};
    for (const txn of currentMonthTxns) {
      tagTotals[txn.tag] = (tagTotals[txn.tag] || 0) + txn.amount;
      paymentTypeTotals[txn.paymentType] = (paymentTypeTotals[txn.paymentType] || 0) + txn.amount;
    }

    const topExpenses = currentMonthTxns
      .filter(t => t.category === "expense")
      .slice(0, 3)
      .map(t => ({ description: t.description, amount: t.amount, tag: t.tag }));

    return {
      currentExpenses,
      currentSavings,
      currentInvestment,
      lastExpenses,
      lastSavings,
      lastInvestment,
      expenseDifference: currentExpenses - lastExpenses,
      categoryTotals: { expense: currentExpenses, saving: currentSavings, investment: currentInvestment },
      tagTotals,
      paymentTypeTotals,
      topExpenses,
      transactionCount: currentMonthTxns.length
    };

  } catch (error) {
    console.error("FINANCIAL_ANALYSIS_ERROR:", error);
    throw error;
  }
};

const generateAIRecommendations = async (financialData) => {
  try {
      const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest" 
    });
    console.log(financialData);
    const prompt = `You are a sarcastic but financially sound advisor. Analyze this spending data and respond ONLY with valid JSON (no markdown):
      Current Month:
      - Expenses: ₹${financialData.currentExpenses}
      - Savings: ₹${financialData.currentSavings}
      - Investment: ₹${financialData.currentInvestment}

      Last Month:
      - Expenses: ₹${financialData.lastExpenses}
      - Savings: ₹${financialData.lastSavings}
      - Investment: ₹${financialData.lastInvestment}

      Expense Difference: ${financialData.expenseDifference >= 0 ? '+' : ''}₹${financialData.expenseDifference}

      Payment Type Breakdown: ${JSON.stringify(financialData.paymentTypeTotals)}
      Tag Breakdown: ${JSON.stringify(financialData.tagTotals)}
      Top 3 Expenses: ${JSON.stringify(financialData.topExpenses)}

      Return JSON with:
      {
        "headline": "One punchy sentence about their financial health",
        "mood": "positive|warning|critical",
        "sarcastic_tips": ["3 funny but actionable tips with numbers"],
        "unusual_spending_alerts": ["Comments on the top 3 expenses with amounts"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('AI_GENERATION_FAILED');
  }
};

export { getFinancialAnalysis, generateAIRecommendations };