/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '.././../App.css';
import ProfileDropdown from './ProfileDropdown';

function Header() {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const authStatus = useSelector((state) => state.Auth.status);
  const userData = useSelector((state) => state.Auth.userData);
  const navigate = useNavigate();
  const mobileNavRef = useRef(null);

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Create Account", slug: "/signup", active: !authStatus },
    { name: "My Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

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
    <header className="py-3 px-6 lg:px-16 shadow bg-black text-white relative">
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
              <ProfileDropdown userData={userData}/>
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
              <li>
                <Link
                  to={`/profile/${userData?._id}`}
                  onClick={() => setIsMobileNavVisible(false)}
                >
                  <button className="flex items-center space-x-2">
                    <img
                      src="https://res.cloudinary.com/dbmn2pyi4/image/upload/v1731603507/johncena_qthmut.jpg"
                      alt="User Profile"
                      className=" ml-5 w-[3.5rem] cursor-pointer rounded-full border-2 border-blue-500 hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </header>
  );
}

export default Header;
