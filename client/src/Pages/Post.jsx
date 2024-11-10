import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../Components";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deletePost, getPostById } from "../AppWrite/Apibase";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  
  const { postId } = useParams(); 
  const navigate = useNavigate();
  const userData = useSelector((state) => state.Auth.userData); 

  useEffect(() => {
    if (postId) {
      getPostById(postId)
        .then((fetchedPost) => {
          setPost(fetchedPost);
          checkIsAuthor(fetchedPost);
        })
        .catch(() => {
          toast.error("Post not found");
          navigate("/");
        });
    }
  }, [postId, navigate]);

  const checkIsAuthor = (fetchedPost) => {
    setIsAuthor(fetchedPost.userId === userData._id);
  };

  const handleDeletePost = () => {
    deletePost(post._id)
      .then(() => {
        toast.success("Post Deleted Successfully...", {
          autoClose: 1000,
          style: {
            backgroundColor: "#2e1065",
            color: "#ffffff",
          },
          hideProgressBar: true,
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message || "Error deleting post");
      });
  };

  return post ? (
    <div className="py-8 bg-black">
      <div className="text-white w-full h-full flex justify-center mb-4 relative rounded-xl p-2">
        <img
          src={post.image}
          alt={post.title}
          className="rounded-xl w-[20rem ] h-[20rem] border p-2"
        />
        {isAuthor && (
          <div className="absolute right-6 top-6 text-black">
            <Link to={`/edit-post/${post._id}`}>
              <Button className="mr-3 bg-white text-black">Edit</Button>
            </Link>
            <Button className="bg-white text-black" onClick={handleDeletePost}>
              Delete
            </Button>
          </div>
        )}
      </div>
      <div className="w-full mb-6 text-white">
        <h1 className="text-3xl font-bold text-white text-center">{post.title}</h1>
      </div>
      <p className="text-center text-white px-[5rem]">{post.content}</p>
    </div>
  ) : null;
}
