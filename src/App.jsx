import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./AppWrite/Appwrite"
import {Login, Logout} from "./Store/AuthSlice"
import { Footer, Header } from './Components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getUser()
    .then((userData) => {
      if (userData) {
        dispatch(Login({userData}))
      } else {
        dispatch(Logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className='mix-h-screen flex flex-wrap content-between bg-black text-black w-full'>
      <div className='w-full h-screen '>
        <Header />
        <main>
        <Outlet />
        </main>
        
      </div>
    </div>
  ) : null
}

export default App