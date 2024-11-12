/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import {Login, Logout} from "./Store/AuthSlice"
import { Footer, Header } from './Components'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

function App() {
  const [loading, setLoading] = useState(false)
  
  const dispatch = useDispatch()
    
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get(`${apiBaseUrl}/api/v1/users/current-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data && response.data.data) {
            dispatch(Login({ user: response.data.data, token: token }));
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // dispatch(Logout());
        })
        .finally(() => setLoading(false));
    } else {
      dispatch(Logout());
      setLoading(false);
    }
  }, [dispatch]);
  
  return !loading ? (
    <div className='min-h-screen overflow-hidden overflow-x-hidden flex flex-wrap content-between bg-black text-black w-full'>
      <div className='w-full min-h-screen mb-5'>
        <Header />
        <ToastContainer/>
        <main>
        <Outlet />
        </main>
        
      </div>
    </div>
  ) : null
}

export default App