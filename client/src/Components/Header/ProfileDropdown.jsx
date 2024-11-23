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
          className="w-11 h-11 cursor-pointer bg-cover bg-center rounded-full border-[1px] border-white hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: `url(${userData?.profileImage || 'https://via.placeholder.com/150'})`,
          }}
        ></div>
      </div>

      {isDropdownOpen && (
        <ul className="absolute top-12 right-[1rem] w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-50 text-white divide-y divide-gray-700">
          {/* Profile Link */}
          <li
            className="px-5 py-3 flex items-center space-x-2 hover:bg-gray-700 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-t-xl"
            onClick={closeDropdown}
          >
            <span>🧑‍💻</span>
            <Link to={`/profile/${userData?._id}`} className="text-sm font-medium">
              My Profile
            </Link>
          </li>

          {/* Followers Link */}
          <li
            className="px-5 py-3 flex items-center space-x-2 hover:bg-gray-700 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-b-xl"
            onClick={closeDropdown}
          >
            <span>👥</span>
            <Link to={`/followers/${userData?._id}`} className="text-sm font-medium">
              My Followers
            </Link>
          </li>
        </ul>
      )}

    </li>
  );
};

export default ProfileDropdown;
