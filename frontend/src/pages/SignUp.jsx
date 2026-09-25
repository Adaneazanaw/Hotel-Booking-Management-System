import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsPersonPlus } from "react-icons/bs";
import image1 from "../assets/heroSlider/1.jpg";
import brandImage from "../assets/heroSlider/1.jpg";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all required fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        return setErrorMessage(
          data.message || "Unable to create the account. Please try again."
        );
      }
      setSuccessMessage("Account created successfully! Redirecting to sign in...");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="absolute inset-0 bg-customBlue bg-opacity-80 flex flex-col justify-end p-12">
          <Link to="/">
            <span className="flex items-center gap-2 text-white font-bold text-xl tracking-wide mb-8">
              <img src={brandImage} alt="Galaxy Hotel" className="w-9 h-9 rounded-full object-cover" />
              Galaxy Hotel
            </span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            Create your account to access the Galaxy Hotel management
            system and start managing bookings effortlessly.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="bg-white bg-opacity-10 p-2 rounded-lg">
              <BsPersonPlus className="text-yellow-400 text-xl" />
            </div>
            <p className="text-gray-300 text-xs">Quick sign-up — takes less than a minute</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex justify-center mb-8 md:hidden">
            <span className="flex items-center gap-2 text-customBlue font-bold text-xl">
              <img src={brandImage} alt="Galaxy Hotel" className="w-9 h-9 rounded-full object-cover" />
              Galaxy Hotel
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-customBlue font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username *" />
              <TextInput type="text" placeholder="john_doe" id="username" onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="First Name" />
                <TextInput type="text" placeholder="John" id="firstname" onChange={handleChange} />
              </div>
              <div>
                <Label value="Last Name" />
                <TextInput type="text" placeholder="Doe" id="lastname" onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label value="Email Address *" />
              <TextInput type="email" placeholder="john@example.com" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Phone Number" />
              <TextInput type="tel" placeholder="+1 xxx xxx xxxx" id="phone" onChange={handleChange} />
            </div>
            <div>
              <Label value="Password *" />
              <TextInput type="password" placeholder="••••••••••••" id="password" onChange={handleChange} />
            </div>
            <Button className="bg-customBlue w-full mt-2" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {successMessage && <Alert className="mt-5" color="success">{successMessage}</Alert>}
          {errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>}

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Galaxy Hotel. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
