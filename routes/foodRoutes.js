const express = require("express");
const router = express.Router();
const FoodItem = require("../models/FoodItem");

// 👉 Add new food items (bulk insert)
router.post("/", async (req, res) => {
  try {
    const foodItems = await FoodItem.insertMany(req.body);
    res.status(201).json(foodItems);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 👉 Get all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👉 Update a food item
router.put("/:id", async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns updated doc
    );
    if (!foodItem) return res.status(404).json({ message: "Item not found" });
    res.json(foodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 👉 Delete a food item
router.delete("/:id", async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Food item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
