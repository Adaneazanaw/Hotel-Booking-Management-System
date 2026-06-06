import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaSpa, FaConciergeBell, FaSwimmingPool, FaUtensils } from "react-icons/fa";
import { BsAward, BsShieldCheck, BsHeartFill, BsStarFill } from "react-icons/bs";
import FooterComponent from "../components/Footer";
import image1 from "../assets/heroSlider/1.jpg";
import image2 from "../assets/heroSlider/2.jpg";
import image3 from "../assets/heroSlider/3.jpg";

const services = [
  {
    icon: <FaUtensils className="text-3xl text-customBlue" />,
    title: "Gourmet Restaurant",
    description:
      "Savor exceptional cuisine crafted by our world-class chefs, using fresh, locally sourced ingredients. From hearty breakfasts to fine-dining dinners, every meal is an experience.",
  },
  {
    icon: <FaSpa className="text-3xl text-customBlue" />,
    title: "Luxury Spa & Wellness",
    description:
      "Rejuvenate your body and mind at our award-winning spa. Choose from a curated menu of massages, facials, and holistic treatments delivered by certified therapists.",
  },
  {
    icon: <FaSwimmingPool className="text-3xl text-customBlue" />,
    title: "Infinity Pool",
    description:
      "Unwind in our rooftop infinity pool offering panoramic city views. Open year-round, it's the perfect spot to relax after a busy day.",
  },
  {
    icon: <FaConciergeBell className="text-3xl text-customBlue" />,
    title: "24/7 Concierge",
    description:
      "Our dedicated concierge team is available around the clock to arrange reservations, transport, tours, and any personal requests you may have.",
  },
];

const values = [
  {
    icon: <BsAward className="text-3xl text-yellow-500" />,
    title: "Excellence",
    desc: "We hold every detail to the highest standard, from room cleanliness to the warmth of our welcome.",
  },
  {
    icon: <BsHeartFill className="text-3xl text-rose-500" />,
    title: "Hospitality",
    desc: "Genuine care for every guest is at the heart of everything we do. Your comfort is our priority.",
  },
  {
    icon: <BsShieldCheck className="text-3xl text-green-500" />,
    title: "Integrity",
    desc: "We operate with full transparency and honesty in every interaction with guests and partners alike.",
  },
  {
    icon: <BsStarFill className="text-3xl text-blue-500" />,
    title: "Innovation",
    desc: "We continuously evolve our services to exceed expectations and set new standards in luxury hospitality.",
  },
];

export default function AboutUs() {
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
    <div className="w-full">
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
            style={{ backgroundImage: `url(${image2})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative text-center text-white px-4">
              <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-2">Our Story</p>
              <h1 className="text-5xl font-bold mb-3">About Us</h1>
              <p className="text-gray-300 max-w-lg mx-auto">
                A legacy of luxury, comfort, and exceptional service — welcome to Adane Grand Hotel.
              </p>
            </div>
          </div>

          {/* ── Our Story ── */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                <div>
                  <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-3">Who We Are</p>
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-5 leading-tight">
                    A Landmark of Luxury in the Heart of the City
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    Founded over 25 years ago, Adane Grand Hotel has earned its reputation as one of the
                    city's premier luxury destinations. Nestled in the heart of the city, our hotel
                    blends timeless elegance with modern comfort.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                    We believe that a great stay is built on the details — the perfect thread count,
                    the warmth of a genuine smile, the quiet assurance that everything is taken care of.
                    Every member of our team is dedicated to making your experience exceptional.
                  </p>
                  <Link to="/booking">
                    <Button className="bg-customBlue px-8">Explore Our Rooms</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <img src={image1} alt="Adane Grand Hotel lobby" className="rounded-2xl shadow-md w-full h-48 object-cover" />
                  <img src={image2} alt="Luxury suite" className="rounded-2xl shadow-md w-full h-48 object-cover mt-6" />
                  <img src={image3} alt="Hotel exterior" className="rounded-2xl shadow-md w-full h-48 object-cover col-span-2" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Values ── */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">What Drives Us</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Core Values</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                  These principles shape every decision we make and every experience we create.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((v, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center gap-3"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full">{v.icon}</div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{v.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Rooms ── */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">Accommodation</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Rooms &amp; Suites</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Every room is a haven of comfort, thoughtfully furnished and equipped for a perfect stay.
                </p>
              </div>
              {fetchLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {roomCategory.map((room) => (
                    <motion.div key={room.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card
                        className="overflow-hidden shadow-md rounded-xl h-full"
                        imgSrc={`/api/roomcategory/image/${room.image}`}
                        imgAlt={room.category_name}
                      >
                        <h5 className="text-xl font-bold text-gray-800 dark:text-white">{room.category_name}</h5>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{room.description}</p>
                        <p className="text-customBlue font-bold text-lg">
                          Rs {room.price}
                          <span className="text-sm font-normal text-gray-400">/night</span>
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Services ── */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">What We Offer</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Services</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                  From fine dining to wellness, every service is designed to make your stay extraordinary.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl w-fit">{s.icon}</div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{s.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{s.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="bg-customBlue text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-3">Ready to Experience It?</p>
              <h2 className="text-4xl font-bold mb-5">Begin Your Luxury Journey Today</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8">
                Whether you're visiting for business or leisure, Adane Grand Hotel promises an experience you'll never forget.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/sign-in">
                  <Button size="lg" className="bg-yellow-400 text-customBlue font-bold border-0 hover:bg-yellow-300">
                    Book Your Stay
                  </Button>
                </Link>
                <Link to="/contact-us">
                  <Button size="lg" color="light" className="bg-transparent border-white text-white hover:bg-white hover:text-customBlue">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <FooterComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
