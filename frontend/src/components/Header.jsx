import { Button, Navbar, Dropdown, Avatar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import brandImage from "../assets/heroSlider/1.jpg";

export default function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
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

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/booking" },
    { label: "About Us", to: "/about-us" },
    { label: "Contact Us", to: "/contact-us" },
  ];

  return (
    <Navbar
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-100 dark:border-gray-700"
      }`}
      fluid
    >
      <Link to="/">
        <span className="flex items-center gap-2 text-customBlue font-bold text-lg tracking-wide">
          <img src={brandImage} alt="Galaxy Hotel" className="w-8 h-8 rounded-full object-cover" />
          Galaxy Hotel
        </span>
      </Link>

      <div className="flex items-center gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt={currentUser.username}
                img={currentUser.profilepicurl || undefined}
                rounded
                placeholderInitials={currentUser.username?.[0]?.toUpperCase()}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">
                @{currentUser.username}
              </span>
              <span className="block text-xs text-gray-500 truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/"><Dropdown.Item>Home</Dropdown.Item></Link>
            <Link to="/dashboard?tab=profile"><Dropdown.Item>Profile</Dropdown.Item></Link>
            <Link to="/dashboard?tab=dash"><Dropdown.Item>Dashboard</Dropdown.Item></Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} className="text-red-500">
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button className="bg-customBlue" size="sm">Sign In</Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse className="mr-20">
        {navLinks.map((link) => (
          <Navbar.Link key={link.to} active={path === link.to} as="div" className="cursor-pointer">
            <Link
              to={link.to}
              className={`font-medium text-sm ${
                path === link.to
                  ? "text-customBlue dark:text-blue-400"
                  : "text-gray-600 hover:text-customBlue dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
