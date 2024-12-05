import Product from "../models/Product.js";
import User from "../models/User.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import getCountryISO3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    // Step 1: Get all the products
    const products = await Product.find();

    // Step 2: Find stats for each product
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Map through each product to get the stats
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // 1. Extract query object, default: page = 1, pageSize = 20
    // sort should look like this: { "field": "userId", "sort": "desc" }
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
    console.log(search);

    // 2. Generate sort object from query
    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };

      return sortFormatted;
    };

    // 3. Conditionally sort
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // 4. Fetch transactions
    const filter = {
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    };

    const transactions = await Transaction.find(filter)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    // 5. Get total documents to display pagination
    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
