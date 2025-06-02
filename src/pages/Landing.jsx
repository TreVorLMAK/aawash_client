import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import FeatureSection from "../components/FeatureSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <motion.div
  className="relative min-h-[90vh] w-full flex flex-col justify-center items-center text-center px-4 md:px-8 overflow-hidden"
  initial={{ opacity: 0, y: 60 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <img
    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1740&q=80"
    alt="Room Background"
    className="absolute inset-0 w-full h-full object-cover opacity-30"
  />

  <div className="relative z-10 max-w-3xl">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md mb-6">
      Find Your Perfect Space
    </h1>
    <p className="text-base sm:text-lg md:text-xl text-gray-200 drop-shadow-sm px-2 sm:px-0">
      Discover modern homes, cozy rooms, and long-term apartments — all in one place.
    </p>
    <button className="mt-10 px-6 sm:px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
      Start Exploring
    </button>
  </div>
</motion.div>

      <FeatureSection />
    </div>
  );
}
