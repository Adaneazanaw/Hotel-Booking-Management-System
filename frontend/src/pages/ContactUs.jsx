import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Alert, Button, Label, Spinner, TextInput, Textarea } from "flowbite-react";
import {
  BsFacebook, BsInstagram, BsMailbox, BsPhone,
  BsTwitter, BsYoutube, BsGeoAlt, BsClock,
} from "react-icons/bs";
import FooterComponent from "../components/Footer";
import image1 from "../assets/heroSlider/1.jpg";

const contactInfo = [
  { icon: <BsPhone className="text-2xl text-customBlue" />, label: "Phone", value: "+1 (123) 456-7890", sub: "Mon–Fri, 8am – 8pm" },
  { icon: <BsMailbox className="text-2xl text-customBlue" />, label: "Email", value: "info@adanegrand.com", sub: "We reply within 24 hours" },
  { icon: <BsGeoAlt className="text-2xl text-customBlue" />, label: "Address", value: "12 Grand Avenue, Adane", sub: "City Centre" },
  { icon: <BsClock className="text-2xl text-customBlue" />, label: "Reception Hours", value: "24 / 7", sub: "Always here for you" },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 6000);
  };

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
            style={{ backgroundImage: `url(${image1})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60" />
            <div className="relative text-center text-white px-4">
              <p className="uppercase tracking-widest text-yellow-400 text-sm font-semibold mb-2">
                We'd Love to Hear From You
              </p>
              <h1 className="text-5xl font-bold mb-3">Contact Us</h1>
              <p className="text-gray-300 max-w-lg mx-auto">
                Our team at Adane Grand Hotel is available around the clock to assist
                you with reservations, enquiries, and anything else you need.
              </p>
            </div>
          </div>

          {/* ── Contact Cards ── */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center gap-3"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full">{item.icon}</div>
                    <p className="font-bold text-gray-700 dark:text-white">{item.label}</p>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{item.value}</p>
                    <p className="text-gray-400 text-sm">{item.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Form + Social ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Contact Form */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Send Us a Message</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  {success && (
                    <Alert color="success" className="mb-4">
                      Thank you! Your message has been sent. We'll be in touch shortly.
                    </Alert>
                  )}
                  {error && <Alert color="failure" className="mb-4">{error}</Alert>}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label value="Full Name *" />
                        <TextInput id="name" type="text" placeholder="John Smith" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label value="Email Address *" />
                        <TextInput id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div>
                      <Label value="Subject" />
                      <TextInput id="subject" type="text" placeholder="Booking enquiry, special request..." value={formData.subject} onChange={handleChange} />
                    </div>
                    <div>
                      <Label value="Message *" />
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" className="bg-customBlue w-full sm:w-auto self-end px-10" disabled={loading}>
                      {loading ? (
                        <><Spinner size="sm" /><span className="pl-3">Sending...</span></>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </div>

                {/* Social + Help Panel */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Follow Us</h3>
                    <p className="text-gray-400 text-sm mb-5">Stay updated with our latest offers, events, and news.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: <BsFacebook />, label: "Facebook", color: "bg-blue-600" },
                        { icon: <BsInstagram />, label: "Instagram", color: "bg-pink-500" },
                        { icon: <BsTwitter />, label: "Twitter / X", color: "bg-sky-500" },
                        { icon: <BsYoutube />, label: "YouTube", color: "bg-red-600" },
                      ].map((s, i) => (
                        <button
                          key={i}
                          className={`flex items-center gap-2 ${s.color} text-white text-sm font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity`}
                        >
                          <span className="text-base">{s.icon}</span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-customBlue text-white rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-2">Need Immediate Help?</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Our reception team is available 24/7 to assist with any urgent requests.
                    </p>
                    <a
                      href="tel:+11234567890"
                      className="inline-flex items-center gap-2 bg-yellow-400 text-customBlue font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                    >
                      <BsPhone />
                      Call Now
                    </a>
                  </div>
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
