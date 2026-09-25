import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Badge } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsMailbox, BsPhone, BsCheckCircleFill } from "react-icons/bs";
import { FaWifi, FaTv, FaSnowflake, FaCoffee } from "react-icons/fa";
import FooterComponent from "../components/Footer";
import image1 from "../assets/heroSlider/1.jpg";
import image2 from "../assets/heroSlider/3.jpg";

const roomAmenities = [
  { icon: <FaWifi />, label: "Free Wi-Fi" },
  { icon: <FaTv />, label: "Smart TV" },
  { icon: <FaSnowflake />, label: "Air Conditioning" },
  { icon: <FaCoffee />, label: "Mini Bar" },
];

const bookingSteps = [
  { step: "01", title: "Choose Your Room", desc: "Browse our selection and pick the room that suits you best." },
  { step: "02", title: "Sign In or Register", desc: "Log in to your account or create one — it only takes a moment." },
  { step: "03", title: "Confirm Your Booking", desc: "Select your dates and confirm with our reception team." },
];

export default function Booking() {
  const { currentUser } = useSelector((state) => state.user);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [roomCategory, setRoomCategory] = useState([]);

  const fetchRoomCategory = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/roomcategory/getroomcategories`);
      const data = await res.json();
      if (res.ok) setRoomCategory(data.roomcategories);
    } catch (error) {
      console.log(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchRoomCategory(); }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Hero Banner ── */}
          <div
            className="relative w-full h-72 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${image1})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative text-center text-white px-4">
              <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-2">Accommodation</p>
              <h1 className="text-5xl font-bold mb-3">Rooms &amp; Suites</h1>
              <p className="text-gray-300 max-w-lg mx-auto">
                Discover the perfect room for your stay at Galaxy Hotel — from cosy standard rooms to expansive luxury suites.
              </p>
            </div>
          </div>

          {/* ── Amenities Strip ── */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-5">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-8">
                {roomAmenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-customBlue">{a.icon}</span>
                    <span className="text-sm font-medium">{a.label}</span>
                    <span className="text-gray-300">|</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <BsCheckCircleFill className="text-green-500" />
                  <span className="text-sm font-medium">All rooms include breakfast</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Rooms Grid ── */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900" id="rooms">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">Our Rooms</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Choose Your Perfect Stay</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Each room is thoughtfully designed to deliver the utmost comfort, style, and convenience.
                </p>
              </div>

              {fetchLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>
              ) : roomCategory.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                  <p className="text-lg">No rooms available at the moment. Please check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {roomCategory.map((room) => (
                    <motion.div key={room.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card
                        imgSrc={`/uploads/${room.image}`}
                        imgAlt={room.category_name}
                        className="overflow-hidden shadow-md rounded-2xl h-full"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{room.category_name}</h3>
                          <Badge color="success" className="shrink-0">Available</Badge>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{room.description}</p>
                        <div className="flex items-end justify-between mt-2">
                          <div>
                            <span className="text-xs text-gray-400">from</span>
                            <p className="text-2xl font-bold text-customBlue">
                              Rs {room.price}
                              <span className="text-sm font-normal text-gray-400">/night</span>
                            </p>
                          </div>
                        </div>
                        <Link to={currentUser ? "/dashboard?tab=booking-create" : "/sign-in"}>
                          <Button className="w-full bg-customBlue mt-2">Book This Room</Button>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── How It Works ── */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">Simple Process</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">How to Book</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                  Booking your stay at Galaxy Hotel is quick and easy.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bookingSteps.map((s, i) => (
                  <div key={i} className="text-center flex flex-col items-center gap-4 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="text-5xl font-black text-blue-100 dark:text-blue-900">{s.step}</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{s.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative bg-customBlue text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${image2})` }} />
            <div className="relative container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-3">Reserve Today</p>
                  <h2 className="text-5xl font-bold mb-6 leading-tight">Ready to Book Your Stay?</h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Contact our reservations team directly and we'll take care of everything for you.
                  </p>
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">
                        <BsPhone className="text-xl text-yellow-400" />
                      </div>
                      <span>+251 974088153</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">
                        <BsMailbox className="text-xl text-yellow-400" />
                      </div>
                      <a href="mailto:info@adanegrand.com" className="hover:text-yellow-400 transition-colors">
                        info@adanegrand.com
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={currentUser ? "/dashboard?tab=booking-create" : "/sign-in"}>
                      <Button size="lg" className="bg-yellow-400 text-customBlue font-bold border-0 hover:bg-yellow-300">Book Now</Button>
                    </Link>
                    <Link to="/contact-us">
                      <Button size="lg" color="light" className="bg-transparent border-white text-white hover:bg-white hover:text-customBlue">Contact Us</Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={image1} alt="Galaxy Hotel room" className="rounded-2xl shadow-2xl" />
                </div>
              </div>
            </div>
          </section>

          <FooterComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
