import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };

      reader.readAsDataURL(file); // base64
    }
  };

  return (
    <motion.div
      className="max-w-xl p-8 mx-auto mb-8 bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-semibold text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="block w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-1">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="px-3 py-2 text-sm font-medium leading-4 text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="inline-block w-5 h-5 mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded </span>
          )}
        </div>
        <button
          type="submit"
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="w-5 h-5 mr-2 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
