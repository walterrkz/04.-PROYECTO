import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, min: 5, max: 140 },
  imageUrl: { type: String, default: "https://placehold.co/800x600.png" },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
