import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";

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
    res.status(400).json({ message: error.message });
  }
};
