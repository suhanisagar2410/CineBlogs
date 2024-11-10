import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Select } from "./index";
import postServices from "../AppWrite/CreatePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, errors } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const navigate = useNavigate();
    const movie = useSelector((state) => state.Auth.movie);
    useEffect(() => {
        if (!movie) navigate('/add-post')
    }, [movie])
    if (!movie) navigate('/add-post')
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByc2xrdmZmbmZmZiIsImVtYWlsIjoicHJhdGlrZnZkdmR2c3N2dnZAZ21haWwuY29tIiwiaWF0IjoxNzMwOTk5NzY1LCJleHAiOjE3MzE0MzE3NjV9.1qfRo_g7Vit3jGyXhCMvLRkOmuZjgBBj6sj8OBS2KRU'
    const userData = useSelector((state) => state.Auth.userData);
    console.log(userData)
    console.log(movie)
    const submit = async (data) => {
        try {
            const post = await axios.post(
                `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/create`,
                {
                    userId: "6724998a782abbc307bf8e94",
                    title: movie.Title,
                    content: data.content,
                    status: true,
                    image: movie.Poster
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log(post.data.data._id)
            if(post.status == 200){
                navigate(`/post/${post.data.data._id}`)
            }
        } catch (error) {
            console.log(error.response.data)
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="min-w-screen flex justify-center items-center">
            <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col items-center max-w-4xl p-8 space-y-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl text-white">
                <div className="flex flex-col items-center w-full space-y-4">
                    <label className="text-2xl font-semibold tracking-wide text-center text-gray-300" htmlFor="">
                        Share your thoughts on <span className="text-indigo-400">{movie?.Title}</span>:
                    </label>
                    <textarea
                        className="w-full max-w-3xl h-72 p-5 mt-2 text-lg font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-lg resize-none shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 ease-in-out"
                        placeholder="Type your content here..."
                        {...register("content", { required: true })}
                    />
                </div>

                <div className="flex flex-col items-center w-full space-y-4 sm:w-1/3">
                    <Select
                        options={["Public", "Private"]}
                        label="Status"
                        placeholder="Select status"
                        error={errors?.status}
                        className="w-full max-w-sm mb-4 rounded-md shadow-md focus:ring-2 focus:ring-indigo-500/50 transition-transform transform hover:scale-105"
                        {...register("status", { required: "Status is required" })}
                    />
                    <Button
                        type="submit"
                        bgColor={post ? "bg-white text-black" : undefined}
                        className={`w-full max-w-xs py-3 font-semibold text-center rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 ${post ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-indigo-500 text-white hover:bg-indigo-600"
                            }`}
                    >
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
} 