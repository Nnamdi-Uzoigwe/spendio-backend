// const Task = require("../models/Task");

// class TaskController {
//   // 👉 CREATE task
//   static async createTask(req, res) {
//     try {
//       const { title, description, priority, dueDate, userId } = req.body;

//       const task = await Task.create({
//         title,
//         description,
//         priority,
//         dueDate,
//         userId,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Task created successfully",
//         data: task,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET all tasks (optional filter by userId or status)
//   static async getAllTasks(req, res) {
//     try {
//       const { userId, status } = req.query;

//       const filter = {};
//       if (userId) filter.userId = userId;
//       if (status) filter.status = status;

//       const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });

//       return res.status(200).json({
//         success: true,
//         count: tasks.length,
//         data: tasks,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET single task
//   static async getTaskById(req, res) {
//     try {
//       const { id } = req.params;

//       const task = await Task.findById(id);
//       if (!task) {
//         return res.status(404).json({
//           success: false,
//           message: "Task not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: task,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 UPDATE task
//   static async updateTask(req, res) {
//     try {
//       const { id } = req.params;

//       const task = await Task.findByIdAndUpdate(id, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       if (!task) {
//         return res.status(404).json({
//           success: false,
//           message: "Task not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Task updated successfully",
//         data: task,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 DELETE task
//   static async deleteTask(req, res) {
//     try {
//       const { id } = req.params;

//       const task = await Task.findByIdAndDelete(id);
//       if (!task) {
//         return res.status(404).json({
//           success: false,
//           message: "Task not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Task deleted successfully",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 MARK task as completed
//   static async markComplete(req, res) {
//     try {
//       const { id } = req.params;

//       const task = await Task.findById(id);
//       if (!task) {
//         return res.status(404).json({
//           success: false,
//           message: "Task not found",
//         });
//       }

//       await task.markComplete();

//       return res.status(200).json({
//         success: true,
//         message: "Task marked as completed",
//         data: task,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 MARK task as pending
//   static async markPending(req, res) {
//     try {
//       const { id } = req.params;

//       const task = await Task.findById(id);
//       if (!task) {
//         return res.status(404).json({
//           success: false,
//           message: "Task not found",
//         });
//       }

//       await task.markPending();

//       return res.status(200).json({
//         success: true,
//         message: "Task marked as pending",
//         data: task,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = TaskController;



const Task = require("../models/Task");

class TaskController {
  // 👉 CREATE task
  static async createTask(req, res) {
    try {
      const { title, description, priority, dueDate } = req.body;

      // Get userId from authenticated user
      const userId = req.user._id;

      const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET all tasks (filter by authenticated user)
  static async getAllTasks(req, res) {
    try {
      // Get userId from authenticated user (from protect middleware)
      const userId = req.user._id;

      console.log("🔍 Fetching tasks for userId:", userId);

      const { status } = req.query;

      const filter = { userId: userId }; // Always filter by authenticated user
      if (status) filter.status = status;

      const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });

      console.log("📊 Found tasks:", tasks.length);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      console.error("❌ Error in getAllTasks:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET single task
  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Find task and verify it belongs to the user
      const task = await Task.findOne({ _id: id, userId: userId });
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 UPDATE task
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Find and update only if task belongs to user
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: userId },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 DELETE task
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Delete only if task belongs to user
      const task = await Task.findOneAndDelete({ _id: id, userId: userId });
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 MARK task as completed
  static async markComplete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Find task and verify ownership
      const task = await Task.findOne({ _id: id, userId: userId });
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      await task.markComplete();

      return res.status(200).json({
        success: true,
        message: "Task marked as completed",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 MARK task as pending
  static async markPending(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      // Find task and verify ownership
      const task = await Task.findOne({ _id: id, userId: userId });
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      await task.markPending();

      return res.status(200).json({
        success: true,
        message: "Task marked as pending",
        data: task,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = TaskController;