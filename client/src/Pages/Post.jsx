import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postServices from "../AppWrite/CreatePost";
import { Button } from "../Components";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setAuthor] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();

  const getPost = async ()=>{
    if(id){
        await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/v1/posts/get-post/${id}`)
        .then((data)=> setPost(data.data.data)).catch((error)=> console.log(error))
    }}
  useEffect(() => {
    getPost()
  }, []);

  console.log(post?.image)
  // const checkIsAuthor = async ()=>{
  //   const userData = await useSelector((state) => state.Auth.userData);
  //   let author = post?.userId === userData.$id ? true : false;
  //   setAuthor(author)
  // }
  // checkIsAuthor()
  // const deletePost = () => {
  //   postServices.deletePost(post._id).then((status) => {
  //     if (status) {
  //       postServices.deleteFile(post.image);
  //       toast.success("Post Deleted Successfully...", {
  //         autoClose: 1000,
  //         style: {
  //             backgroundColor: "#2e1065",
  //             color: "#ffffff",
  //           },
  //           hideProgressBar: true,
  //       });
  //       navigate("/");
  //     }
  //   });
  // };

  return post ? (
    <div className="py-8 bg-black">
      <>
        <div className="text-white w-full  h-full flex justify-center mb-4 relative  rounded-xl p-2">
          <img
            src={post?.image}
            alt={post?.title}
            className="rounded-xl w-[20rem ] h-[20rem] border p-2"
          />

          {isAuthor && (
            <div className="absolute right-6 top-6 text-black">
              <Link to={`/edit-post/${post.$id}`}>
                <Button className="mr-3 bg-white text-black">Edit</Button>
              </Link>
              <Button className="bg-white text-black" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6 text-white">
          <h1 className="text-3xl font-bold text-white text-center">
            {post.title}
          </h1>
        </div>
        <p className="text-center text-white px-[5rem]">{post.content}</p>
      </>
    </div>
  ) : null;
}
