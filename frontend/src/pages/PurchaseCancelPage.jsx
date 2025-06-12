import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md overflow-hidden bg-gray-800 rounded-lg shadow-xl"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 mb-4 text-red-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-center text-red-500 sm:text-3xl">
            Purchase Cancelled
          </h1>
          <p className="mb-6 text-center text-gray-300">
            Your order has been cancelled. No charges have been made.
          </p>
          <div className="p-4 mb-6 bg-gray-700 rounded-lg">
            <p className="text-sm text-center text-gray-400">
              If you encountered any issues during the checkout process, please
              don&apos;t hesitate to contact our support team.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to={"/"}
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-gray-300 transition duration-300 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              <ArrowLeft className="mr-2" size={18} />
              Return to Shop
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
