const Income = require("../models/Income");

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

  // 👉 GET all income (optional filter by userId)
  static async getAllIncome(req, res) {
    try {
      const { userId } = req.query;

      const filter = {};
      if (userId) filter.userId = userId;

      const incomes = await Income.find(filter).sort({ date: -1 });

      return res.status(200).json({
        success: true,
        count: incomes.length,
        data: incomes,
      });
    } catch (error) {
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
      const mongoose = require('mongoose');
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
        data: incomes,
      });
    } catch (error) {
      console.error("❌ Error in getMonthlyIncome:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET a single income
  static async getIncomeById(req, res) {
    try {
      const { id } = req.params;

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