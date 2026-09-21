import React, { useEffect, useState } from "react";
import { Button, Carousel, Card, Spinner } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BsFacebook,
  BsInstagram,
  BsMailbox,
  BsPhone,
  BsTwitter,
  BsStarFill,
  BsWifi,
  BsCupHot,
  BsShieldCheck,
} from "react-icons/bs";
import { FaSpa, FaConciergeBell, FaParking, FaSwimmingPool } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import image1 from "../assets/heroSlider/1.jpg";
import image2 from "../assets/heroSlider/2.jpg";
import image3 from "../assets/heroSlider/3.jpg";
import FooterComponent from "../components/Footer";

const heroSlides = [
  {
    image: image1,
    title: "Experience the Height of Luxury",
    subtitle:
      "Indulge in unparalleled comfort and world-class service, where every detail is designed for your ultimate relaxation.",
  },
  {
    image: image2,
    title: "Your Sanctuary Awaits",
    subtitle:
      "Escape to elegance and serenity in our exclusive rooms and suites, crafted to provide an unforgettable stay.",
  },
  {
    image: image3,
    title: "Unwind in Pure Luxury",
    subtitle:
      "Pamper yourself with lavish accommodations, gourmet dining, and spa treatments tailored for ultimate rejuvenation.",
  },
];

const amenities = [
  { icon: <BsWifi className="text-3xl text-customBlue" />, label: "Free High-Speed Wi-Fi" },
  { icon: <FaSpa className="text-3xl text-customBlue" />, label: "World-Class Spa" },
  { icon: <FaSwimmingPool className="text-3xl text-customBlue" />, label: "Infinity Pool" },
  { icon: <FaConciergeBell className="text-3xl text-customBlue" />, label: "24/7 Concierge" },
  { icon: <BsCupHot className="text-3xl text-customBlue" />, label: "Gourmet Restaurant" },
  { icon: <FaParking className="text-3xl text-customBlue" />, label: "Valet Parking" },
  { icon: <BsShieldCheck className="text-3xl text-customBlue" />, label: "24/7 Security" },
  { icon: <FaConciergeBell className="text-3xl text-customBlue" />, label: "Room Service" },
];

const testimonials = [
  {
    name: "James Hartwell",
    role: "Business Traveller",
    initials: "JH",
    color: "bg-blue-600",
    review:
      "Staying at Adane Grand Hotel was an unforgettable experience. The service was exceptional, the rooms immaculate, and the ambiance felt like home away from home.",
    stars: 5,
  },
  {
    name: "Sophia Laurent",
    role: "Leisure Guest",
    initials: "SL",
    color: "bg-rose-500",
    review:
      "The rooms were stunning and the staff went above and beyond every single time. The spa treatment was phenomenal. I can't wait to return!",
    stars: 5,
  },
  {
    name: "Alex Morrison",
    role: "Corporate Guest",
    initials: "AM",
    color: "bg-emerald-600",
    review:
      "Fantastic experience from check-in to check-out. The location is perfect, the amenities are top-notch, and the food exceeded every expectation.",
    stars: 5,
  },
];

export default function Home() {
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
          {/* ── Hero ── */}
          <div className="w-full h-screen">
            <Carousel slide slideInterval={5000} indicators={false}>
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  className="w-full h-screen bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="bg-black bg-opacity-55 h-full flex items-center justify-center">
                    <div className="text-center text-white max-w-3xl px-6">
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="uppercase tracking-widest text-sm font-medium text-yellow-400 mb-3"
                      >
                        Adane Grand Hotel — Luxury &amp; Comfort
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl font-bold mb-5 leading-tight"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-gray-200 mb-8"
                      >
                        {slide.subtitle}
                      </motion.p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <ScrollLink to="rooms" smooth duration={1000}>
                          <Button size="lg" className="bg-customBlue px-8">Explore Rooms</Button>
                        </ScrollLink>
                        <Link to="/contact-us">
                          <Button size="lg" color="light" className="px-8">Contact Us</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* ── Stats Banner ── */}
          <div className="bg-customBlue text-white py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "150+", label: "Luxury Rooms" },
                  { value: "25+", label: "Years Experience" },
                  { value: "10K+", label: "Happy Guests" },
                  { value: "4.9★", label: "Average Rating" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-4xl font-bold text-yellow-400">{stat.value}</p>
                    <p className="text-sm text-gray-300 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Rooms ── */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900" id="rooms">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">Accommodation</p>
                <h2 className="text-4xl font-bold mb-4">Rooms &amp; Suites</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Each room is thoughtfully designed to blend elegance with comfort,
                  ensuring every stay is truly unforgettable.
                </p>
              </div>
              {fetchLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner size="xl" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {roomCategory.map((room) => (
                    <motion.div key={room.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card
                        imgSrc={`/uploads/${room.image}`}
                        className="overflow-hidden shadow-md rounded-xl h-full"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{room.category_name}</h3>
                          <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">Popular</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">{room.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="text-xs text-gray-400">from</span>
                            <p className="text-2xl font-bold text-customBlue">
                              Rs {room.price}
                              <span className="text-sm font-normal text-gray-400">/night</span>
                            </p>
                          </div>
                        </div>
                        <Link to="/sign-in">
                          <Button className="w-full bg-customBlue mt-2">Book Now</Button>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Amenities ── */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">What We Offer</p>
                <h2 className="text-4xl font-bold mb-4">Hotel Amenities</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Everything you need for a perfect stay, all under one roof.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {amenities.map((a, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {a.icon}
                    <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">{a.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative bg-customBlue text-white py-24 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${image2})` }} />
            <div className="relative container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-3">Reserve Your Stay</p>
                  <h2 className="text-5xl font-bold mb-6 leading-tight">Book Your Dream Stay Today</h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Experience the height of luxury with our exclusive rooms and suites.
                    Our team is available around the clock to ensure your stay is perfect.
                  </p>
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-10 p-2 rounded-lg">
                        <BsPhone className="text-xl text-yellow-400" />
                      </div>
                      <span>+1 (123) 456-7890</span>
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
                    <Link to="/sign-in">
                      <Button size="lg" className="bg-yellow-400 text-customBlue font-bold hover:bg-yellow-300 border-0">
                        Book Now
                      </Button>
                    </Link>
                    <Link to="/contact-us">
                      <Button size="lg" color="light" className="bg-transparent border-white text-white hover:bg-white hover:text-customBlue">
                        Get in Touch
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={image1} alt="Luxury hotel room" className="rounded-2xl shadow-2xl" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <p className="text-customBlue uppercase tracking-widest text-sm font-semibold mb-2">Guest Reviews</p>
                <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Real experiences from real guests — this is what makes Adane Grand Hotel truly special.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col gap-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <BsStarFill key={s} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{t.review}"</p>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{t.name}</p>
                        <p className="text-sm text-gray-400">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <FooterComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
