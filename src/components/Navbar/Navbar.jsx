import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DarkMode from "./DarkMode";
import { FaBars, FaTimes, FaLeaf } from "react-icons/fa";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Plant Locator", link: "/locator" },
  { id: 3, name: "AI Hub", link: "/ml-hub" },
  { id: 4, name: "Farmer AI", link: "/farmer-ai" },
  { id: 5, name: "Enterprise ML", link: "/enterprise-ml" },
  { id: 6, name: "GIS Command", link: "/command-center" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2 items-center text-green-600 dark:text-green-400">
              <FaLeaf className="text-3xl" />
              <span className="text-gray-900 dark:text-white tracking-tight">ECOSHIELD</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DarkMode />
            {/* Mobile hamburger */}
            <button
              className="sm:hidden text-2xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div data-aos="zoom-in" className="hidden sm:flex justify-center">
        <ul className="flex items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              {data.external ? (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-4 py-2 hover:text-primary duration-200 font-medium`}
                >
                  {data.name}
                </a>
              ) : (
                <Link
                  to={data.link}
                  className={`inline-block px-4 py-2 hover:text-primary duration-200 font-medium border-b-2 transition-all ${
                    location.pathname === data.link
                      ? "border-primary text-primary"
                      : "border-transparent"
                  }`}
                >
                  {data.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 shadow-lg border-t dark:border-gray-700">
          <ul className="flex flex-col items-start px-6 py-4 gap-3">
            {Menu.map((data) => (
              <li key={data.id} className="w-full">
                {data.external ? (
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-base font-medium hover:text-primary duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    {data.name}
                  </a>
                ) : (
                  <Link
                    to={data.link}
                    className={`block py-2 text-base font-medium hover:text-primary duration-200 ${
                      location.pathname === data.link ? "text-primary font-bold" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {data.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
