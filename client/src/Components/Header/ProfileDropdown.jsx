import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <li className="relative flex items-center mr-4 space-x-2" ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        <div
          className="w-10 h-10 cursor-pointer bg-cover bg-center rounded-full border-2 border-blue-500 hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: `url(${userData?.profileImage || 'https://res.cloudinary.com/dbmn2pyi4/image/upload/v1731603507/johncena_qthmut.jpg'})`,
          }}
        ></div>
      </div>

      {isDropdownOpen && (
        <ul className="absolute top-12 right-[1rem] w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 text-white">
          <li
            className="px-4 py-2 hover:bg-gray-700 hover:scale-105 transition-transform duration-150 cursor-pointer rounded-t-lg"
            onClick={closeDropdown}
          >
            <Link to={`/profile/${userData?._id}`}>🧑‍💻 My Profile</Link>
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 hover:scale-105 transition-transform duration-150 cursor-pointer"
            onClick={closeDropdown}
          >
            <Link to={`/followers/${userData?._id}`}>👥 My Followers</Link>
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-700 hover:scale-105 transition-transform duration-150 cursor-pointer rounded-b-lg"
            onClick={closeDropdown}
          >
            <Link to={`/profile/${userData?._id}/followings`}>🔗 My Followings</Link>
          </li>
        </ul>
      )}
    </li>
  );
};

export default ProfileDropdown;
