// frontend/stores/useProductStore.js

import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null, // Good to have an error state for better UX

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
        error: null,
      }));
      toast.success("Product created successfully!"); // Add success toast
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product"); // Use optional chaining
      set({
        loading: false,
        error: error.response?.data?.error || "Failed to create product",
      });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false }); // Assuming backend returns { products: [...] }
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch products",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false }); // Assuming backend returns { products: [...] }
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch products",
        loading: false,
      });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
        error: null,
      }));
      toast.success("Product deleted successfully!"); // Add success toast
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Failed to delete product",
      });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
        error: null,
      }));
      toast.success("Product featured status updated!"); // Add success toast
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Failed to update product",
      });
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/products/featured");
      // --- CRUCIAL FIX HERE ---
      set({ products: response.data.products, loading: false }); // Access .products property
      // --- END CRUCIAL FIX ---
      console.log(
        "Featured products fetched successfully:",
        response.data.products
      ); // Log actual products
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch featured products",
        loading: false,
      });
      console.error(
        "Error fetching featured products:",
        error.response?.data || error.message
      ); // Use console.error
      toast.error(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  },
}));
