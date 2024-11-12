/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../AppWrite/Apibase";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(dispatch, navigate);
      toast.success("Logout Successfully...", {
        autoClose: 1000,
        style: {
          backgroundColor: "#2e1065",
          color: "#ffffff",
        },
        hideProgressBar: true,
      });
      navigate('/login')
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.", {
        autoClose: 2000,
        style: {
          backgroundColor: "#ff6347",
          color: "#ffffff",
        },
        hideProgressBar: true,
      });
    }
  };

  return (
    <button
      className="inline-block px-4 py-2 duration-200 text-white hover:text-blue-500 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
