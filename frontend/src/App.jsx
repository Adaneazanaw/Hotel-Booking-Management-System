import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import { signInSuccess, signoutSuccess } from "./redux/user/userSlice";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";

export default function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "Galaxy Hotel Management System";
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    fetch("/api/user/me", { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          dispatch(signInSuccess(data));
        } else if (res.status === 401 || res.status === 404) {
          dispatch(signoutSuccess());
        }
      })
      .catch(() => {
        // Keep the persisted session when the API is temporarily unavailable.
      });
  }, [currentUser, dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/booking" element={<Booking />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
