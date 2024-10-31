import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { Login as authlogin  } from '../Store/AuthSlice'
import {Button, Input} from "./index"
import {useDispatch, useSelector} from "react-redux"
import authService from "../AppWrite/Appwrite"
import {useForm} from "react-hook-form"
import { ScaleLoader } from "react-spinners";
import { toast } from 'react-toastify'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")
    const [isLoading, setLoading] = useState(false)

    const login = async(data) => {
        setError("")

        try {
            setLoading(true)
            let session = await authService.login(data)
            if (session) {
                const userData = await authService.getUser()
                if(userData)
                {
                    dispatch(authlogin(userData));
                }
                console.log(userData);
                console.log(myUserData);
                setLoading(false)
                navigate("/")
                toast.success("Login Successfully...", {
                    autoClose: 1000,
                    style: {
                        backgroundColor: "#2e1065",
                        color: "#ffffff",
                      },
                      hideProgressBar: true,
                  });

            }
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    const myUserData = useSelector((state)=> state.Auth.status)
  
    if (isLoading) {
        return (
          <div className="flex items-center justify-center">
            <div className="mt-[10rem]">
            <ScaleLoader color='#ffffff' height={50} />
            </div>
    
          </div>
        )
      }

  return (
    <div
    className='flex items-center justify-center w-full'
    >
        <div className={`mx-auto w-full max-w-lg shadow shadow-white bg-white rounded-xl p-10 border border-white/5`}>
        <div className="mb-2 flex justify-center">
                    
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight mb-3">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
            <div className='space-y-5'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                className="ml-2"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                className="ml-2"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                bgColor="black"
                className="w-full bg-black text-white font-semibold text-[1.2rem]"
                >Sign in</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login