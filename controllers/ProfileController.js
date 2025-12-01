// const Profile = require("../models/Profile");

// class ProfileController {
//   // 👉 CREATE profile
//   static async createProfile(req, res) {
//     try {
//       const { name, email, userId } = req.body;

//       const profile = await Profile.create({
//         name,
//         email,
//         userId,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Profile created successfully",
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET all profiles
//   static async getAllProfiles(req, res) {
//     try {
//       const profiles = await Profile.find().sort({ dateJoined: -1 });

//       return res.status(200).json({
//         success: true,
//         count: profiles.length,
//         data: profiles,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 GET profile by ID
//   static async getProfileById(req, res) {
//     try {
//       const { id } = req.params;

//       const profile = await Profile.findById(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 UPDATE profile
//   static async updateProfile(req, res) {
//     try {
//       const { id } = req.params;

//       const profile = await Profile.findByIdAndUpdate(id, req.body, {
//         new: true,
//         runValidators: true,
//       });

//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Profile updated successfully",
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 DELETE profile
//   static async deleteProfile(req, res) {
//     try {
//       const { id } = req.params;

//       const profile = await Profile.findByIdAndDelete(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Profile deleted successfully",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 ADD income to profile balance
//   static async addIncome(req, res) {
//     try {
//       const { id } = req.params;
//       const { amount } = req.body;

//       const profile = await Profile.findById(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       await profile.addIncome(amount);

//       return res.status(200).json({
//         success: true,
//         message: `Income of ${amount} added`,
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 SUBTRACT expense from profile balance
//   static async addExpense(req, res) {
//     try {
//       const { id } = req.params;
//       const { amount } = req.body;

//       const profile = await Profile.findById(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       await profile.addExpense(amount);

//       return res.status(200).json({
//         success: true,
//         message: `Expense of ${amount} subtracted`,
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 INCREMENT completed tasks
//   static async incrementCompletedTasks(req, res) {
//     try {
//       const { id } = req.params;

//       const profile = await Profile.findById(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       await profile.incrementCompletedTasks();

//       return res.status(200).json({
//         success: true,
//         message: "Completed tasks incremented",
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   // 👉 DECREMENT completed tasks
//   static async decrementCompletedTasks(req, res) {
//     try {
//       const { id } = req.params;

//       const profile = await Profile.findById(id);
//       if (!profile) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }

//       await profile.decrementCompletedTasks();

//       return res.status(200).json({
//         success: true,
//         message: "Completed tasks decremented",
//         data: profile,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = ProfileController;



const Profile = require("../models/Profile");
const User = require("../models/User");

class ProfileController {
  // 👉 CREATE profile
  static async createProfile(req, res) {
    try {
      const { name, email, userId } = req.body;
      
      // Check if profile already exists for this user
      const existingProfile = await Profile.findOne({ userId });
      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "Profile already exists for this user",
        });
      }

      const profile = await Profile.create({
        name,
        email,
        userId,
      });
      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: profile,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET all profiles
  static async getAllProfiles(req, res) {
    try {
      const profiles = await Profile.find().sort({ dateJoined: -1 });
      return res.status(200).json({
        success: true,
        count: profiles.length,
        data: profiles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 GET profile by ID (auto-create if doesn't exist)
  static async getProfileById(req, res) {
    try {
      const { id } = req.params;

      // Make sure user can only access their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this profile",
        });
      }

      // Try to find existing profile
      let profile = await Profile.findOne({ userId: id });

      // If profile doesn't exist, auto-create it
      if (!profile) {
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        profile = await Profile.create({
          userId: user._id,
          name: user.username,
          email: user.email,
          currentBalance: 0,
          totalTransactions: 0,
          completedTasks: 0,
        });
      }

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 UPDATE profile (auto-create if doesn't exist)
  static async updateProfile(req, res) {
    try {
      const { id } = req.params;

      // Make sure user can only update their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this profile",
        });
      }

      // Try to update existing profile
      let profile = await Profile.findOneAndUpdate(
        { userId: id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      // If profile doesn't exist, create it
      if (!profile) {
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        profile = await Profile.create({
          userId: user._id,
          name: req.body.name || user.username,
          email: req.body.email || user.email,
          currentBalance: req.body.currentBalance || 0,
          totalTransactions: req.body.totalTransactions || 0,
          completedTasks: req.body.completedTasks || 0,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 DELETE profile
  static async deleteProfile(req, res) {
    try {
      const { id } = req.params;

      // Make sure user can only delete their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this profile",
        });
      }

      const profile = await Profile.findOneAndDelete({ userId: id });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 ADD income to profile balance
  static async addIncome(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      // Make sure user can only update their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const profile = await Profile.findOne({ userId: id });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      await profile.addIncome(amount);

      return res.status(200).json({
        success: true,
        message: `Income of ${amount} added`,
        data: profile,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 SUBTRACT expense from profile balance
  static async addExpense(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      // Make sure user can only update their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const profile = await Profile.findOne({ userId: id });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      await profile.addExpense(amount);

      return res.status(200).json({
        success: true,
        message: `Expense of ${amount} subtracted`,
        data: profile,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 INCREMENT completed tasks
  static async incrementCompletedTasks(req, res) {
    try {
      const { id } = req.params;

      // Make sure user can only update their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const profile = await Profile.findOne({ userId: id });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      await profile.incrementCompletedTasks();

      return res.status(200).json({
        success: true,
        message: "Completed tasks incremented",
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 👉 DECREMENT completed tasks
  static async decrementCompletedTasks(req, res) {
    try {
      const { id } = req.params;

      // Make sure user can only update their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const profile = await Profile.findOne({ userId: id });

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      await profile.decrementCompletedTasks();

      return res.status(200).json({
        success: true,
        message: "Completed tasks decremented",
        data: profile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ProfileController;