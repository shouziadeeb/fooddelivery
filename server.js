import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js"; // ✅ import default
import FoodItem from "./models/FoodItem.js";
import authRoutes from "./routes/auth.js"; // ✅ import default
import { foodData } from "./data.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// ✅ Auth routes

// Connect to DB
connectDB();

// Hardcoded data
app.use("/api/auth", authRoutes);
// Insert default data if DB empty
const insertDefaultData = async () => {
  try {
    const count = await FoodItem.countDocuments();
    if (count === 0) {
      await FoodItem.insertMany(foodData);
      console.log("✅ Default food data inserted into DB");
    }
  } catch (error) {
    console.error("❌ Error inserting default data:", error);
  }
};
insertDefaultData();



// Routes
app.get("/api/food", async (req, res) => {
  try {
    const {
      skip = 0,
      limit = 10,
      search = "",
      category = "",
      minPrice,
      maxPrice,
    } = req.query;

    // Build filters dynamically
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case-insensitive search by name
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" }; // case-insensitive category match
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }
    // Count total items (for frontend pagination)
    const total = await FoodItem.countDocuments(filter);

    // Fetch paginated + filtered data
    const data = await FoodItem.find(filter)
      .skip(Number(skip))
      .limit(Number(limit));

    res.json({ data, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/food", async (req, res) => {
  try {
    const foodItems = await FoodItem.insertMany(req.body);
    res.status(201).json(foodItems);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/food/:id", async (req, res) => {
  try {
    const updatedFood = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/food/:id", async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
