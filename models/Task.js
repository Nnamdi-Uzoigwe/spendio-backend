// src/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['high', 'medium', 'low'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium',
      lowercase: true
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      lowercase: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    userId: {
      type: String,
      // required: true, // Uncomment when you add authentication
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });

// Method to mark task as complete
taskSchema.methods.markComplete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to mark task as pending
taskSchema.methods.markPending = function() {
  this.status = 'pending';
  this.completedAt = null;
  return this.save();
};

// Virtual to check if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Ensure virtuals are included when converting to JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);