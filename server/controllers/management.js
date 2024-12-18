import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  // We wanna get the user's affiliate stats and transactions so we're gonna add these 2 fields to the returned documents
  // Using aggregation pipeline to join multiple collections and getting required data
  // This is similar to JOIN in SQL

  try {
    const { id } = req.params;
    const userWithStats = await User.aggregate([
      // Filter users by id
      { $match: { _id: new mongoose.Types.ObjectId(`${id}`) } }, // convert id from params to the correct id type of mongoose

      // Simply join the User collection with the AffiliateStat collection
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },

      // Deconstruct the affiliateStats field to output a document for matched user
      // affiliateStats will eventually become one field in the returned document
      { $unwind: "$affiliateStats" },
    ]);

    // Get all transactions made by this particular user
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );

    // Make sure the transactions are not null
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res.status(200).json({
      user: userWithStats[0],
      sales: filteredSaleTransactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
