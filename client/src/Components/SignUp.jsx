import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../Store/AuthSlice"; 
import { Button } from "./index";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScaleLoader } from "react-spinners";
import MuiInput from "../utility/CustomeInput"; 
import { toast } from "react-toastify"; 
import { signupUser } from "../AppWrite/Apibase";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Full name is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        )
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);

      try {
        const { userData, token } = await signupUser(values);

        dispatch(Login({ user: userData, token }));

        localStorage.setItem("authToken", token);

        toast.success("User created successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
        setError(error.message || "An error occurred!");
        toast.error(error.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const inputFields = [
    {
      label: "Full Name",
      name: "username",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="mt-[10rem]">
          <ScaleLoader color="#ffffff" height={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <h2 className="text-center text-2xl font-bold leading-tight sm:text-3xl mb-3">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-5 mt-5">
            {inputFields.map(({ label, name, type }) => (
              <MuiInput
                key={name}
                label={label}
                type={type}
                {...formik.getFieldProps(name)}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
              />
            ))}
            <Button
              type="submit"
              bgColor="black"
              className="w-full bg-black text-white font-semibold text-[1.2rem] py-3"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
