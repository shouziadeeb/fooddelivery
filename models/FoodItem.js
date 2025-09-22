import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  img: String,
  category: String,
  price: Number,
  content: String,
  unique: String,
});

const FoodItem = mongoose.model("FoodItem", FoodItemSchema);
export default FoodItem;
