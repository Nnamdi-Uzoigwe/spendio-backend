// src/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // unique index already created by Mongoose
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    dateJoined: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    currentBalance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    totalTransactions: {
      type: Number,
      default: 0,
      min: [0, 'Total transactions cannot be negative']
    },
    completedTasks: {
      type: Number,
      default: 0,
      min: [0, 'Completed tasks cannot be negative']
    },
    userId: {
      type: String,
      unique: true, // unique index already created by Mongoose
      // required: true, // Uncomment when you add authentication
    }
  },
  {
    timestamps: true
  }
);

// Method to update balance after income
profileSchema.methods.addIncome = async function(amount) {
  this.currentBalance += amount;
  this.totalTransactions += 1;
  return this.save();
};

// Method to update balance after expense
profileSchema.methods.addExpense = async function(amount) {
  if (this.currentBalance >= amount) {
    this.currentBalance -= amount;
    this.totalTransactions += 1;
    return this.save();
  } else {
    throw new Error('Insufficient balance');
  }
};

// Method to increment completed tasks
profileSchema.methods.incrementCompletedTasks = async function() {
  this.completedTasks += 1;
  return this.save();
};

// Method to decrement completed tasks (if task is unchecked)
profileSchema.methods.decrementCompletedTasks = async function() {
  if (this.completedTasks > 0) {
    this.completedTasks -= 1;
    return this.save();
  }
};

// Virtual to calculate days since joined
profileSchema.virtual('daysSinceJoined').get(function() {
  const now = new Date();
  const joined = new Date(this.dateJoined);
  const diffTime = Math.abs(now - joined);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included when converting to JSON
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Profile', profileSchema);
