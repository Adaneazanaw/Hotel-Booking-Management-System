import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { motion } from "framer-motion";
import { BsShieldLock } from "react-icons/bs";
import image1 from "../assets/heroSlider/2.jpg";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return dispatch(signInFailure("Please fill in all the fields."));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
            <span className="text-white font-bold text-xl tracking-wide mb-8 inline-block">🏨 Adane Grand Hotel</span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            Sign in to access the Adane Grand Hotel management dashboard and
            manage bookings, rooms, customers, and more.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="bg-white bg-opacity-10 p-2 rounded-lg">
              <BsShieldLock className="text-yellow-400 text-xl" />
            </div>
            <p className="text-gray-300 text-xs">Secure, role-based access control</p>
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
            <span className="text-customBlue font-bold text-xl">🏨 Adane Grand Hotel</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            Sign In
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-customBlue font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <Alert color="info" className="mb-6">
            <span className="font-semibold">Demo credentials — </span>
            Username:{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin</code>
            {" "}| Password:{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">admin</code>
          </Alert>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter your username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="••••••••••••"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button className="bg-customBlue w-full mt-2" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {errorMessage && (
            <Alert className="mt-5" color="failure">{errorMessage}</Alert>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Adane Grand Hotel. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
