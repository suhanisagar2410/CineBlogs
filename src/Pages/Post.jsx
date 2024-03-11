import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postServices from "../AppWrite/CreatePost";
import { Button } from "../Components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import authService from "../AppWrite/Appwrite";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  


  useEffect(() => {
    if (slug) {
      postServices.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    postServices.deletePost(post.$id).then((status) => {
      if (status) {
        postServices.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };
  

//   const currentUser = postServices.getPost(slug);
  const userData = useSelector((state) => state.Auth.userData);

  let isAuthor = post && userData ? post.userId === userData.$id : false;
  console.log(userData);

  console.log(post);
  
  
  

  return post ? (
    <div className="py-8">
      <>
        <div className="text-white w-full flex justify-center mb-4 relative  rounded-xl p-2">
          <img
            src={postServices.getImage(post.featuredImage)}
            alt={post.title}
            className="rounded-xl w-[20rem ] h-[20rem] border p-2"
          />

          {isAuthor ? (
            <div className="absolute right-6 top-6 text-black">
              <Link to={`/edit-post/${post.$id}`}>
                <Button  className="mr-3 bg-white text-black">
                  Edit
                </Button>
              </Link>
              <Button  className="bg-white text-black" onClick={deletePost}>
                Delete
              </Button>
            </div>
          ) : null}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold text-white text-center">{post.title}</h1>
        </div>
        <div className="browser-css text-white text-center">{parse(post.content)}</div>
      </>
    </div>
  ) : null;
}
