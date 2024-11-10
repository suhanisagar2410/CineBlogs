/* eslint-disable no-unused-vars */
import React from 'react';
import { LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const authStatus = useSelector((state) => state.Auth.status);
  const userData = useSelector((state) => state.Auth.userData);
  const navigate = useNavigate();
  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className='py-3 px-16 shadow bg-black text-white'>
      <nav className='flex'>
        <div className='mr-4'>
          <Link to='/'>
            <img src="https://res.cloudinary.com/dbmn2pyi4/image/upload/v1730130777/Mega-Blogs-Header_b8myrb.png" alt="Logo" className='w-[6rem]' />
          </Link>
        </div>
        <ul className='flex ml-auto'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className='inline-block px-6 py-2 duration-200 hover:text-blue-500 rounded-full'
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
    </header>
  );
}

export default Header;
