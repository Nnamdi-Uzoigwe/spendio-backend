const Income = require("../models/Income");
const Expense = require("../models/Expense");

class TransactionController {
  // 👉 GET recent transactions (combined income + expenses)
  static async getRecentTransactions(req, res) {
    try {
      // Get userId from authenticated user (already an ObjectId)
      const userId = req.user._id;

      console.log("🔍 Fetching transactions for userId:", userId); // Debug log

      // Fetch last 10 incomes and expenses
      const [incomes, expenses] = await Promise.all([
        Income.find({ userId: userId })
          .sort({ date: -1 })
          .limit(10)
          .lean(),
        Expense.find({ userId: userId })
          .sort({ date: -1 })
          .limit(10)
          .lean(),
      ]);

      console.log("📊 Found incomes:", incomes.length, "expenses:", expenses.length); // Debug log

      // Transform and mark each transaction type
      const incomeTransactions = incomes.map((income) => ({
        id: income._id.toString(),
        description: income.description,
        category: income.category,
        amount: income.amount,
        isExpense: false,
        date: income.date,
        createdAt: income.createdAt,
      }));

      const expenseTransactions = expenses.map((expense) => ({
        id: expense._id.toString(),
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        isExpense: true,
        date: expense.date,
        createdAt: expense.createdAt,
      }));

      // Combine and sort by date (most recent first)
      const allTransactions = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Take only the 5 most recent
      const recentTransactions = allTransactions.slice(0, 5);

      console.log("✅ Returning transactions:", recentTransactions.length); // Debug log

      return res.status(200).json({
        success: true,
        count: recentTransactions.length,
        data: recentTransactions,
      });
    } catch (error) {
      console.error("❌ Error in getRecentTransactions:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = TransactionController;