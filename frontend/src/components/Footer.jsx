import React from "react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsYoutube,
  BsGeoAlt,
  BsPhone,
  BsMailbox,
} from "react-icons/bs";
import brandImage from "../assets/heroSlider/1.jpg";
export default function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/">
              <span className="flex items-center gap-2 text-white text-xl font-bold tracking-wide mb-4">
                <img src={brandImage} alt="Galaxy Hotel" className="w-9 h-9 rounded-full object-cover" />
                Galaxy Hotel
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Galaxy Hotel is a luxury destination offering unparalleled
              comfort, world-class service, and unforgettable experiences in
              the heart of the city.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <BsFacebook />, href: "#" },
                { icon: <BsInstagram />, href: "#" },
                { icon: <BsTwitter />, href: "#" },
                { icon: <BsYoutube />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-gray-700 hover:bg-customBlue flex items-center justify-center text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-5">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "Rooms & Suites", to: "/booking" },
                { label: "About Us", to: "/about-us" },
                { label: "Contact Us", to: "/contact-us" },
                { label: "Sign In", to: "/sign-in" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white hover:pl-1 transition-all text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-5">
              Our Services
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                "Room Booking",
                "Gourmet Restaurant",
                "Luxury Spa",
                "Infinity Pool",
                "24/7 Concierge",
                "Valet Parking",
              ].map((s, i) => (
                <li key={i} className="text-gray-400 text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-5">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <BsGeoAlt className="text-yellow-400 mt-0.5 shrink-0" />
                <span>12 Grand Avenue, Adane, City Centre</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <BsPhone className="text-yellow-400 shrink-0" />
                <a href="tel:+251974088153" className="hover:text-white transition-colors">
                  +251 974088153
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <BsMailbox className="text-yellow-400 shrink-0" />
                <a href="mailto:info@adanegrand.com" className="hover:text-white transition-colors">
                  info@adanegrand.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {currentYear} Galaxy Hotel. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
