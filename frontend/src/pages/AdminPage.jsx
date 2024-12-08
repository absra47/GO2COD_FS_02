import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState, useEffect } from "react";
import AnalyticsTab from "../components/AnalyticsTab.jsx";
import CreateProductForm from "../components/CreateProductForm.jsx";
import ProductsList from "../components/ProductsList.jsx";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];
const AdminPage = () => {
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const [activeTab, setActiveTab] = useState("create");
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="container relative z-10 px-4 py-16 mx-auto">
        <motion.h1
          className="mb-8 text-4xl font-bold text-center text-emerald-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>
        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
