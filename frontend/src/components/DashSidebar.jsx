import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import {
  FaUsers, FaPowerOff, FaSignInAlt, FaWindowClose,
  FaSignOutAlt, FaCalendarPlus, FaBed,
} from "react-icons/fa";
import { MdBedroomParent, MdEditSquare } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosMan } from "react-icons/io";
import { MdBathroom } from "react-icons/md";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchJson } from "../utils/fetchJson";

// A plain nav link styled to match Flowbite sidebar items
function NavItem({ to, icon: Icon, active, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
        ${active
          ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-700 dark:text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        } ${className}`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span>{children}</span>
    </Link>
  );
}

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("dash");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTab(params.get("tab") || "dash");
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
      const data = await fetchJson(res);
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full md:w-56 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1">

      {/* Dashboard */}
      <NavItem to="/dashboard?tab=dash" icon={HiChartPie} active={tab === "dash"}>
        Dashboard
      </NavItem>

      {/* ── Booking section ── */}
      <div className="mt-3 mb-1 px-2">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          <FaBed />
          Booking
        </span>
      </div>

      <NavItem
        to="/dashboard?tab=booked"
        icon={MdBathroom}
        active={tab === "booked" || tab === "booking"}
        className="pl-5"
      >
        All Bookings
      </NavItem>

      <NavItem
        to="/dashboard?tab=booking-create"
        icon={FaCalendarPlus}
        active={tab === "booking-create"}
        className="pl-5"
      >
        Create Booking
      </NavItem>

      <NavItem
        to="/dashboard?tab=booking-edit"
        icon={MdEditSquare}
        active={tab === "booking-edit"}
        className="pl-5"
      >
        Edit Booking
      </NavItem>

      <NavItem
        to="/dashboard?tab=booking-cancel"
        icon={FaWindowClose}
        active={tab === "booking-cancel"}
        className="pl-5"
      >
        Cancel Booking
      </NavItem>

      {/* ── Other items ── */}
      <div className="mt-2" />

      <NavItem to="/dashboard?tab=check-in" icon={FaSignInAlt} active={tab === "check-in"}>
        Check In
      </NavItem>

      <NavItem to="/dashboard?tab=check-out" icon={FaSignOutAlt} active={tab === "check-out"}>
        Check Out
      </NavItem>

      <NavItem to="/dashboard?tab=customers" icon={IoIosMan} active={tab === "customers"}>
        Customers
      </NavItem>

      <NavItem to="/dashboard?tab=rooms" icon={MdBedroomParent} active={tab === "rooms"}>
        Rooms
      </NavItem>

      <NavItem to="/dashboard?tab=room-category" icon={BiSolidCategory} active={tab === "room-category"}>
        Room Category
      </NavItem>

      <NavItem to="/dashboard?tab=reports" icon={HiChartPie} active={tab === "reports"}>
        Reports
      </NavItem>

      {currentUser?.role === "admin" && (
        <NavItem to="/dashboard?tab=users" icon={FaUsers} active={tab === "users"}>
          Users
        </NavItem>
      )}

      {/* Sign Out */}
      <button
        onClick={handleSignout}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <FaPowerOff className="h-5 w-5 shrink-0" />
        <span>Sign Out</span>
      </button>

    </div>
  );
}
