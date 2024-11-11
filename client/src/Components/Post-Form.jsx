/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Select } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { createPost, updatePost } from "../AppWrite/Apibase";

export default function PostForm({ post }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active", 
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.Auth.userData);
  const movie = useSelector((state) => state.Auth.movie);
  const token = localStorage.getItem("authToken");


  useEffect(() => {
    if (post) {
        
      setValue("title", post.title); 
      setValue("content", post.content);
      setValue("status", post.status ? "Public" : "Private");
    }
  }, [post, setValue]);

  const submit = async (data) => {
   let  postData
    if(post){

        postData = {
        title: data.title,
        content: data.content,
        status: data.status === "Public" ? true : false,
      };
    }else{
        postData = {
        title: movie.Title,
        content: data.content,
        status: data.status === "Public" ? true : false,
        userId: userData._id,
        image:movie.Poster
      }
    }
      console.log("Post data", postData);
      
      try {
        let response;
  
      
        if (post) {
          response = await updatePost(post._id, postData, token);
          toast.success("Post updated successfully!");
        } else {
         
          response = await createPost(postData, token);
          toast.success("Post created successfully!");
        }
  
        navigate(`/post/${response.data._id}`);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        console.error(error);
      }
  };
  

  return (
    <form onSubmit={handleSubmit(submit)} className="flex w-full bg-black text-white flex-wrap flex-col justify-center items-center">
      <div className="sm:w-full flex flex-col justify-center items-center w-full overflow-hidden">
        <label className="text-2xl font-semibold" htmlFor="">Post Content:</label>
        <div className="">
          <textarea
            className="w-[50rem] h-[28rem] rounded-lg mt-2 p-5 font-semibold text-black"
            {...register("content", { required: true })}
          />
        </div>
      </div>

      <div className="sm:w-1/3 w-full px-2 justify-center items-center">
        <Select
          options={["Public", "Private"]}
          label="Status"
          className="mb-4 sm:w-full w-[21rem]"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor="bg-white text-black" className="sm:w-full w-[5rem]">
          Update
        </Button>
      </div>
    </form>
  );
}
