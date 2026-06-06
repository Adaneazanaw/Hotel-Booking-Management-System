import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
    >
      <h1 className="text-8xl font-bold text-customBlue mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
        The page you are looking for does not exist or may have been moved.
        Please check the URL or return to the home page.
      </p>
      <Link to="/">
        <Button className="bg-customBlue" size="lg">
          <HiHome className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </Link>
    </motion.div>
  );
}
