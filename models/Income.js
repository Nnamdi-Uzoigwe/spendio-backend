  // // src/models/Income.js
  // const mongoose = require('mongoose');

  // const incomeSchema = new mongoose.Schema(
  //   {
  //     amount: {
  //       type: Number,
  //       required: [true, 'Amount is required'],
  //       min: [0, 'Amount cannot be negative']
  //     },
  //     description: {
  //       type: String,
  //       required: [true, 'Description is required'],
  //       trim: true,
  //       maxlength: [500, 'Description cannot exceed 500 characters']
  //     },
  //     category: {
  //       type: String,
  //       required: [true, 'Category is required'],
  //       enum: {
  //         values: ['salary', 'freelance', 'investment', 'business', 'gift', 'other'],
  //         message: '{VALUE} is not a valid category'
  //       }
  //     },
  //     date: {
  //       type: Date,
  //       required: [true, 'Date is required'],
  //       default: Date.now
  //     },
  //     userId: {
  //       type: String,
  //       // required: true, // Uncomment when you add authentication
  //     }
  //   },
  //   {
  //     timestamps: true
  //   }
  // );

  // // Indexes for better query performance
  // incomeSchema.index({ userId: 1, date: -1 });
  // incomeSchema.index({ category: 1 });

  // module.exports = mongoose.model('Income', incomeSchema);


  const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // Make sure this is required
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", incomeSchema);