import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { FaUsers, FaPowerOff } from "react-icons/fa";
import { RiHotelFill } from "react-icons/ri";
import { FaBed } from "react-icons/fa6";

import { FaSignInAlt, FaWindowClose, FaSignOutAlt } from "react-icons/fa";
import { MdBedroomParent, MdEditSquare, MdBathroom } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { IoIosMan, IoIosBed } from "react-icons/io";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  const bookingTabs = ["booked", "booking", "booking-create", "booking-edit", "booking-cancel"];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            active={bookingTabs.includes(tab)}
            icon={FaBed}
            href="/dashboard?tab=booked"
          >
            Booking
          </Sidebar.Item>

          <Sidebar.Collapse
            icon={FaBed}
            label="Booking Actions"
            open={true}
          >
            <Sidebar.Item
              active={tab === "booked" || tab === "booking"}
              icon={MdBathroom}
              href="/dashboard?tab=booked"
            >
              All Booking
            </Sidebar.Item>

            <Sidebar.Item
              active={tab === "booking-create"}
              icon={IoIosBed}
              href="/dashboard?tab=booking-create"
            >
              Booking Create
            </Sidebar.Item>

            <Sidebar.Item
              active={tab === "booking-edit"}
              icon={MdEditSquare}
              href="/dashboard?tab=booking-edit"
            >
              Booking Edit
            </Sidebar.Item>

            <Sidebar.Item
              active={tab === "booking-cancel"}
              icon={FaWindowClose}
              href="/dashboard?tab=booking-cancel"
            >
              Booking Cancel
            </Sidebar.Item>
          </Sidebar.Collapse>

          <Link to="/dashboard?tab=check-in">
            <Sidebar.Item
              active={tab === "check-in"}
              icon={FaSignInAlt}
              as="div"
            >
              Check In
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=check-out">
            <Sidebar.Item
              active={tab === "check-out"}
              icon={FaSignOutAlt}
              as="div"
            >
              Check Out
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=customers">
            <Sidebar.Item active={tab === "customers"} icon={IoIosMan} as="div">
              Customers
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=rooms">
            <Sidebar.Item
              active={tab === "rooms"}
              icon={MdBedroomParent}
              as="div"
            >
              Rooms
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=reports">
            <Sidebar.Item active={tab === "reports"} icon={HiChartPie} as="div">
              Reports
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=room-category">
            <Sidebar.Item
              active={tab === "room-category" || !tab}
              icon={BiSolidCategory}
              as="div"
            >
              Room Category
            </Sidebar.Item>
          </Link>

          {currentUser?.role === "admin" && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item active={tab === "users"} icon={FaUsers} as="div">
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={FaPowerOff}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
