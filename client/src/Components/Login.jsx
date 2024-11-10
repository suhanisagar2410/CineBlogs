import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login as authlogin } from "../Store/AuthSlice";
import { Button } from "./index";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ScaleLoader } from "react-spinners";
import MuiInput from "../utility/CustomeInput";
import { toast } from "react-toastify";
import { loginUser } from "../AppWrite/Apibase";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        ),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);

      try {
        const { userData, token } = await loginUser(values);
        dispatch(authlogin({ user: userData, token }));

        navigate("/");
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const inputFields = [
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
    <div className="flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 border border-white/10">
        <h2 className="text-center text-2xl font-bold leading-tight sm:text-3xl mb-3">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don't have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={formik.handleSubmit} className="mt-8">
          <div className="space-y-5">
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
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
