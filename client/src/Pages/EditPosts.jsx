import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm } from '../Components';  
import { toast } from 'react-toastify';
import { getPostById } from '../AppWrite/Apibase';

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (postId) {
      getPostById(postId)
        .then((fetchedPost) => {
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

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <h2 className="text-2xl text-white">Loading...</h2>
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
    <div className="py-10 bg-gradient-to-b from-black via-purple-900 to-black min-h-screen flex flex-col items-center">
      <PostForm post={post} />
    </div>
  ) : null;
}

export default EditPost;
