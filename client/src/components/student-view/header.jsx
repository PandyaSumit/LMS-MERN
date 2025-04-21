import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    setMenuOpen(false);
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-md relative">
      {/* Left Section: Logo */}
      <Link to="/home" className="flex items-center hover:text-black transition">
        <GraduationCap className="h-8 w-8 text-blue-600" />
        <span className="font-extrabold text-lg md:text-xl ml-2">LMS</span>
      </Link>

      {/* Desktop Navigation (Aligned to Right) */}
      <nav className="hidden md:flex items-center space-x-6 ml-auto">
        <Button
          variant="ghost"
          onClick={() => {
            if (!location.pathname.includes("/courses")) navigate("/courses");
          }}
          className="text-[15px] font-medium hover:text-blue-600 transition"
        >
          Explore Courses
        </Button>
        <div
          onClick={() => navigate("/student-courses")}
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
        >
          <TvMinimalPlay className="w-6 h-6" />
          <span className="font-semibold text-[15px]">My Courses</span>
        </div>
        <Button onClick={handleLogout} className="text-sm px-4 py-2">
          Sign Out
        </Button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden focus:outline-none ml-auto"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-0 w-full bg-white shadow-lg p-4 flex flex-col items-center space-y-4 md:hidden z-50"
          >
            <Button
              variant="ghost"
              onClick={() => {
                setMenuOpen(false);
                if (!location.pathname.includes("/courses")) navigate("/courses");
              }}
              className="text-[15px] font-medium hover:text-blue-600 transition"
            >
              Explore Courses
            </Button>
            <div
              onClick={() => {
                setMenuOpen(false);
                navigate("/student-courses");
              }}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
            >
              <TvMinimalPlay className="w-6 h-6" />
              <span className="font-semibold text-[15px]">My Courses</span>
            </div>
            <Button onClick={handleLogout} className="w-full text-sm px-4 py-2">
              Sign Out
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default StudentViewCommonHeader;
