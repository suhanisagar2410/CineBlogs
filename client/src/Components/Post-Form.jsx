/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Select } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
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
    const token = localStorage.getItem('authToken')
    const submit = async (data) => {
        try {
            const post = await axios.post(
                `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/create`,
                {
                    userId: "673095e331505be871075859",
                    title: movie.Title,
                    content: data.content,
                    status: data.status == 'Public' ? true : false ,
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

    return (
        <form onSubmit={handleSubmit(submit)} className="flex w-full bg-black text-white flex-wrap flex-col justify-center items-center">
            <div className="sm:w-full flex flex-col justify-center items-center w-full overflow-hidden">
                <label className="text-2xl font-semibold" htmlFor="">Your Content Goes Here for {movie?.Title} :</label>
                <div className="">
                    <textarea
                        className="w-[50rem] h-[28rem] rounded-lg mt-2 p-5 font-semibold text-black"
                        {...register("content", { required: true })}
                    />
                </div>
            </div>

            <div className="sm:w-1/3 w-full px-2 justify-center items-center">
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    defaultValue={post?.status ? "active" : "inactive"}
                    className="mb-4 sm:w-full w-[21rem]"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-white text-black" : undefined} className="sm:w-full w-[5rem]">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
