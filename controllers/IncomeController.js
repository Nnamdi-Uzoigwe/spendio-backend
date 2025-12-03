// const Income = require("../models/Income");

// class IncomeController {
//   // 👉 CREATE Income
//   static async createIncome(req, res) {
//     try {
//       const { amount, description, category, date } = req.body;

//       const userId = req.user._id;

//       const income = await Income.create({
//         amount,
//         description,
//         category,
//         date,
//         userId,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Income created successfully",
//         data: income,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET all income (optional filter by userId)
//   static async getAllIncome(req, res) {
//     try {
//       const { userId } = req.query;

//       const filter = {};
//       if (userId) filter.userId = userId;

//       const incomes = await Income.find(filter).sort({ date: -1 });

//       return res.status(200).json({
//         success: true,
//         count: incomes.length,
//         data: incomes,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET monthly income total
//   static async getMonthlyIncome(req, res) {
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

//       // Find all income for this user in current month
//       const incomes = await Income.find({
//         userId: userObjectId,
//         date: {
//           $gte: startOfMonth,
//           $lte: endOfMonth,
//         },
//       });

//       // Calculate total
//       const total = incomes.reduce((sum, income) => sum + income.amount, 0);

//       return res.status(200).json({
//         success: true,
//         total,
//         count: incomes.length,
//         data: incomes,
//       });
//     } catch (error) {
//       console.error("❌ Error in getMonthlyIncome:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET a single income
//   static async getIncomeById(req, res) {
//     try {
//       const { id } = req.params;

//       const income = await Income.findById(id);
//       if (!income) {
//         return res.status(404).json({
//           success: false,
//           message: "Income not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: income,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 UPDATE income
//   static async updateIncome(req, res) {
//     try {
//       const { id } = req.params;

//       const income = await Income.findByIdAndUpdate(id, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       if (!income) {
//         return res.status(404).json({
//           success: false,
//           message: "Income not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Income updated successfully",
//         data: income,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 DELETE income
//   static async deleteIncome(req, res) {
//     try {
//       const { id } = req.params;

//       const income = await Income.findByIdAndDelete(id);

//       if (!income) {
//         return res.status(404).json({
//           success: false,
//           message: "Income not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Income deleted successfully",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = IncomeController;



const Income = require("../models/Income");
const mongoose = require('mongoose');

class IncomeController {
  // 👉 CREATE Income
  static async createIncome(req, res) {
    try {
      const { amount, description, category, date } = req.body;

      const userId = req.user._id;

      const income = await Income.create({
        amount,
        description,
        category,
        date,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: "Income created successfully",
        data: income,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET income by month and year (MUST BE BEFORE getAllIncome in routes!)
  static async getIncomeByMonth(req, res) {
    try {
      const { userId, year, month } = req.query;

      console.log("📅 getIncomeByMonth called with:", { userId, year, month });

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

      const incomes = await Income.find({
        userId: userObjectId,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      const total = incomes.reduce((sum, income) => sum + income.amount, 0);

      return res.status(200).json({
        success: true,
        total,
        count: incomes.length,
        month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
        data: incomes,
      });
    } catch (error) {
      console.error("❌ Error in getIncomeByMonth:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET monthly income total
  static async getMonthlyIncome(req, res) {
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

      // Find all income for this user in current month
      const incomes = await Income.find({
        userId: userObjectId,
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      // Calculate total
      const total = incomes.reduce((sum, income) => sum + income.amount, 0);

      return res.status(200).json({
        success: true,
        total,
        count: incomes.length,
        incomes: incomes, // Also return the income array for category breakdown
      });
    } catch (error) {
      console.error("❌ Error in getMonthlyIncome:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET all income with optional filters (userId, startDate, endDate)
  static async getAllIncome(req, res) {
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

      const incomes = await Income.find(filter).sort({ date: -1 });

      // Calculate total
      const total = incomes.reduce((sum, income) => sum + income.amount, 0);

      return res.status(200).json({
        success: true,
        count: incomes.length,
        total,
        data: incomes,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET a single income by ID
  static async getIncomeById(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid income ID format",
        });
      }

      const income = await Income.findById(id);
      if (!income) {
        return res.status(404).json({
          success: false,
          message: "Income not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: income,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 UPDATE income
  static async updateIncome(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid income ID format",
        });
      }

      const income = await Income.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!income) {
        return res.status(404).json({
          success: false,
          message: "Income not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Income updated successfully",
        data: income,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 DELETE income
  static async deleteIncome(req, res) {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid income ID format",
        });
      }

      const income = await Income.findByIdAndDelete(id);

      if (!income) {
        return res.status(404).json({
          success: false,
          message: "Income not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Income deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = IncomeController;