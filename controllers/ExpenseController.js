// const Expense = require("../models/Expense");

// class ExpenseController {
//   // 👉 CREATE Expense
//   static async createExpense(req, res) {
//     try {
//       const { amount, description, category, date } = req.body;

//       const userId = req.user._id;
//       const expense = await Expense.create({
//         amount,
//         description,
//         category,
//         date,
//         userId,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Expense created successfully",
//         data: expense,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET all expenses (optional filter by userId)
//   static async getAllExpense(req, res) {
//     try {
//       const { userId } = req.query;

//       const filter = {};
//       if (userId) filter.userId = userId;

//       const expenses = await Expense.find(filter).sort({ date: -1 });

//       return res.status(200).json({
//         success: true,
//         count: expenses.length,
//         data: expenses,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET monthly expenses total
//   static async getMonthlyExpense(req, res) {
//     try {
//       const { userId } = req.query;

//       if (!userId) {
//         return res.status(400).json({
//           success: false,
//           message: "userId is required",
//         });
//       }

//       // Get current month's start and end dates
//       const now = new Date();
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

//       // Convert userId to ObjectId for MongoDB query
//       const mongoose = require('mongoose');
//       const userObjectId = new mongoose.Types.ObjectId(userId);

//       // Find all expenses for this user in current month
//       const expenses = await Expense.find({
//         userId: userObjectId,
//         date: {
//           $gte: startOfMonth,
//           $lte: endOfMonth,
//         },
//       });

//       // Calculate total
//       const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

//       return res.status(200).json({
//         success: true,
//         total,
//         count: expenses.length,
//         data: expenses,
//       });
//     } catch (error) {
//       console.error("❌ Error in getMonthlyExpense:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET a single expense
//   static async getExpenseById(req, res) {
//     try {
//       const { id } = req.params;

//       const expense = await Expense.findById(id);
//       if (!expense) {
//         return res.status(404).json({
//           success: false,
//           message: "Expense not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: expense,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 UPDATE expense
//   static async updateExpense(req, res) {
//     try {
//       const { id } = req.params;

//       const expense = await Expense.findByIdAndUpdate(id, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       if (!expense) {
//         return res.status(404).json({
//           success: false,
//           message: "Expense not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Expense updated successfully",
//         data: expense,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 DELETE expense
//   static async deleteExpense(req, res) {
//     try {
//       const { id } = req.params;

//       const expense = await Expense.findByIdAndDelete(id);

//       if (!expense) {
//         return res.status(404).json({
//           success: false,
//           message: "Expense not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Expense deleted successfully",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = ExpenseController;


const Expense = require("../models/Expense");
const mongoose = require('mongoose');

class ExpenseController {
  // 👉 CREATE Expense
  static async createExpense(req, res) {
    try {
      const { amount, description, category, date } = req.body;

      const userId = req.user._id;
      const expense = await Expense.create({
        amount,
        description,
        category,
        date,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: expense,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET expense by month and year (MUST BE BEFORE getAllExpense in routes!)
  static async getExpenseByMonth(req, res) {
    try {
      const { userId, year, month } = req.query;

      console.log("📅 getExpenseByMonth called with:", { userId, year, month });

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required",
        });
      }

      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

      const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
      const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const expenses = await Expense.find({
        userId: userObjectId,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return res.status(200).json({
        success: true,
        total,
        count: expenses.length,
        month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
        data: expenses,
      });
    } catch (error) {
      console.error("❌ Error in getExpenseByMonth:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET monthly expenses total
  static async getMonthlyExpense(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required",
        });
      }

      // Get current month's start and end dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Convert userId to ObjectId for MongoDB query
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Find all expenses for this user in current month
      const expenses = await Expense.find({
        userId: userObjectId,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      // Calculate total
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return res.status(200).json({
        success: true,
        total,
        count: expenses.length,
        expenses: expenses, // Return expenses array for category breakdown
      });
    } catch (error) {
      console.error("❌ Error in getMonthlyExpense:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET all expenses with optional filters (userId, startDate, endDate)
  static async getAllExpense(req, res) {
    try {
      const { userId, startDate, endDate } = req.query;

      const filter = {};
      if (userId) {
        filter.userId = new mongoose.Types.ObjectId(userId);
      }

      // Add date range filter if provided
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const expenses = await Expense.find(filter).sort({ date: -1 });

      // Calculate total
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return res.status(200).json({
        success: true,
        count: expenses.length,
        total,
        data: expenses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET a single expense by ID
  static async getExpenseById(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense ID format",
        });
      }

      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 UPDATE expense
  static async updateExpense(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense ID format",
        });
      }

      const expense = await Expense.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        data: expense,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 DELETE expense
  static async deleteExpense(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense ID format",
        });
      }

      const expense = await Expense.findByIdAndDelete(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ExpenseController;