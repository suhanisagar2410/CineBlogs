import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm } from '../Components';  
import { toast } from 'react-toastify';
import { getPostById } from '../AppWrite/Apibase';
import { ScaleLoader } from "react-spinners";
import { AddMovie } from '../Store/AuthSlice';
import { useDispatch } from 'react-redux';

function EditPost() {
  const [post, setPost] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  useEffect(() => {
    
    if (postId) {
      getPostById(postId)
        .then((fetchedPost) => {
          dispatch(AddMovie(fetchedPost))
          setPost(fetchedPost); 
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          toast.error("Failed to fetch the post. Please try again.");
          navigate('/');  
        });
    }
  }, [postId, navigate]);

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

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <h2 className="text-2xl text-red-600">{error}</h2>
      </div>
    );
  }

  return post ? (
      <PostForm post={post} />
  ) : null;
}

export default EditPost;
