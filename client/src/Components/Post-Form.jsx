import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Select } from "./index";
import postServices from "../AppWrite/CreatePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
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
                `${import.meta.env.VITE_SERVER_URI}/api/v1/posts/create`,
                {
                    userId: "6724998a782abbc307bf8e94",
                    title: movie.Title,
                    content: data.content,
                    status: true ,
                    image: movie.Poster
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log(post)
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
        <form onSubmit={handleSubmit(submit)} className="flex w-full bg-black text-white flex-wrap flex-col justify-center items-center">
            <div className="sm:w-full flex flex-col justify-center items-center w-full overflow-hidden">

                <label className="text-2xl font-semibold" htmlFor="">Your Content Goes Here for {movie?.Title} :</label>
                <div className="">
                    <textarea className="w-[50rem] h-[28rem] rounded-lg mt-2 p-5 font-semibold text-black" type="textarea" name="" id=""  {...register("content", { required: true })} />
                </div>
            </div>

            <div className="sm:w-1/3 w-full px-2 justify-center items-center">

                <Select
                    options={["Public", "Private"]}
                    label="Status"
                    defaultValue="public"
                    className="mb-4 sm:w-full w-[21rem] "
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-white text-black" : undefined} className="sm:w-full w-[5rem]">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
} 