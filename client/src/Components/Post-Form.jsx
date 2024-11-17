import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Select } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

export default function PostForm({ post }) {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "Public",
        },
    });

    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const movie = useSelector((state) => state.Auth.movie);
    console.log(movie, '/////')
    const userData = useSelector((state) => state.Auth.userData);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!movie) navigate('/add-post');
    }, [movie, navigate]);

    useEffect(() => {
        if (post) {
            setValue("title", post?.title); 
            setValue("content", post?.content);
            setValue("status", post?.status ? "Public" : "Private");
        }
    }, [post, setValue]);

    const submit = async (data) => {
        setLoading(true);
        try {
            const postData = post
            ? {
                  title: data?.title,
                  content: data?.content,
                  status: data?.status === "Public" ? true : false,
              }
            : { 
                  userId: userData?._id,
                  title: movie?.Title,
                  content: data?.content,
                  status: data?.status === "Public" ? true : false,
                  image: movie?.Poster,
              };

            let response;
            if (post) {
                // Update existing post
                response = await axios.put(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/update-post/${post._id}`,
                    postData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                toast.success("Post updated successfully!");
            } else {
                // Create new post
                response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/create`,
                    postData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                toast.success("Post created successfully!");
            }

            setLoading(false);
            navigate(`/post/${response.data.data._id}`);
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-purple-950 to-black py-12">
                <div className="p-4 w-full flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-semibold text-white">
                        "Patience, the Best Stories Are Worth the Wait."
                    </h1>
                    <p className="text-lg mt-2 text-gray-300">
                        We’re brewing something great! Check back soon for fresh content.
                    </p>
                </div>
                <div className='mt-[5rem]'>
                    <ScaleLoader color="#ffffff" height={50} />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="w-full bg-gradient-to-b from-black via-purple-950 to-black text-white py-12 px-6 rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Add Content for <span className="text-teal-400">{movie?.Title || movie.title}</span>
                </h2>
                <p className="text-xl text-gray-300 mt-4">
                    Share your thoughts and reviews in a place that matters.
                </p>
            </div>

            <div className="flex flex-col items-center gap-8 sm:gap-6">
                <div className="w-full sm:w-[50rem]">
                    <textarea
                        className="w-full h-[20rem] p-5 rounded-lg text-gray-800 bg-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                        placeholder="Write your content here..."
                        {...register("content", { required: true })}
                    />
                </div>

                <div className="flex flex-col sm:flex-row w-full sm:w-3/4 gap-6 sm:gap-8 justify-center items-center">
                    <div className="w-full sm:w-[20rem]">
                        <Select
                            options={["Public", "Private"]}
                            label="Status"
                            defaultValue="Public"
                            className="w-ful text-black font-medium rounded-lg shadow-md py-3 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
                            {...register("status", { required: true })}
                        />
                    </div>

                    <div className="w-full sm:w-[20rem]">
                        <Button
                            type="submit"
                            bgColor={post ? "bg-purple-950 text-gray-800 hover:bg-teal-500" : "bg-gray-700 text-gray-800 hover:bg-gray-600"}
                            className="w-full bg-teal-400 py-4 mt-6 rounded-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            {post ? "Update" : "Submit"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
