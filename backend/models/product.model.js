import mongoose from "mongoose";
import Mongoose from "mongoose";

const productSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: [true, "Image is required"] },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Product = mongoose.model("product", productSchema);
export default Product;
