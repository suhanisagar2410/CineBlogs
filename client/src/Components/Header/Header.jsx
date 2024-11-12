/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '.././../App.css';

function Header() {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const authStatus = useSelector((state) => state.Auth.status);
  const userData = useSelector((state) => state.Auth.userData);
  const navigate = useNavigate();
  const mobileNavRef = useRef(null);

  const categories = ['All', 'Tech', 'Lifestyle', 'Travel', 'Food'];
  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "My Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  // Close mobile nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setIsMobileNavVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileNavRef]);

  return (
    <header className="py-3 px-6 lg:px-16 shadow bg-black text-white">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="mr-4">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dbmn2pyi4/image/upload/v1730130777/Mega-Blogs-Header_b8myrb.png"
              alt="Logo"
              className="w-[6rem]"
            />
          </Link>
        </div>
        
        {/* <div className="sm:flex items-center space-x-4 flex-1 hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="px-4 py-2 text-black rounded-full outline-none w-full sm:w-auto"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white text-black rounded-full outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div> */}

        {/* Mobile Navbar Toggle */}
        <button
          className="lg:hidden ml-auto text-[2rem] text-white hover:text-blue-500"
          onClick={() => setIsMobileNavVisible(!isMobileNavVisible)}
        >
          ☰
        </button>

        {/* Desktop Navbar Links */}
        <ul className="hidden lg:flex space-x-4 ml-auto">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="inline-block px-6 py-2 duration-200 hover:text-blue-500 rounded-full"
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <>
              <li>
                <LogoutBtn />
              </li>
              <li className="mr-4">
                <span className="inline-block px-6 py-2 duration-200 hover:text-blue-500 rounded-full">
                  Hello, {userData?.username}
                </span>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      {isMobileNavVisible && (
        <ul
          ref={mobileNavRef}
          className="flex flex-col lg:hidden bg-gray-900 p-4 space-y-2 rounded-md slide-down"
        >
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setIsMobileNavVisible(false);
                    navigate(item.slug);
                  }}
                  className="w-full text-left z-30 px-4 py-2 duration-200 hover:text-blue-500 rounded-md"
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <>
              <li>
                <LogoutBtn />
              </li>
              <li className="mr-4">
                <span className="inline-block px-4 py-2 duration-200 hover:text-blue-500 rounded-md">
                  Hello, {userData?.username}
                </span>
              </li>
            </>
          )}
        </ul>
      )}
    </header>
  );
}

export default Header;
