import React from "react";
import { useDispatch } from "react-redux";
import Appwrite from "../../AppWrite/Appwrite";
import { Logout } from "../../Store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const handleLogout = () =>
    Appwrite.logOut().then(() => {
      dispatch(Logout());
      navigate("/")
      toast.success("Logout Successfully...", {
        autoClose: 1000,
        style: {
            backgroundColor: "#2e1065",
            color: "#ffffff",
          },
          hideProgressBar: true,
      });
    });

  return (
    <button
      className="inline-bock px-6 py-2 duration-200 text-white hover:text-blue-500 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
