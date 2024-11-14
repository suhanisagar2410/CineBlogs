import axios from "axios";
import { Logout } from "../Store/AuthSlice";

const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

export const signupUser = async (values) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/v1/users/create`,
      values
    );

    if (response.data && response.data.data) {
      const userData = response.data.data;
      const token = userData.token;

      localStorage.setItem("authToken", token);

      return { userData, token };
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "An error occurred during signup"
    );
  }
};

export const loginUser = async (values) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/v1/users/login`,
      values
    );
    if (response.data) {
      const userData = response.data.data;
      const token = userData.token;

      localStorage.setItem("authToken", token);

      return { userData, token };
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "An error occurred during login"
    );
  }
};

export const getAllPostsInHomePage = async (authToken, search, page) => {
  try {
    const params = {
      search: search || "",
      page: page || 1,
      limit: 10,
    };
    

    const response = await axios.get(`${apiBaseUrl}/api/v1/posts/get-posts`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: params,
    });

    if (response.data?.posts) {
      return response.data;
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    console.error("Error fetching posts:", error);

    throw new Error(
      error.response?.data?.message || "An error occurred while fetching posts."
    );
  }
};

export const getAllPostsByUser = async (authToken) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/api/v1/posts/get-userposts`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.data) {
      return response.data.data;
    }

    throw new Error("Unexpected response from server");
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response?.data?.message || "An error occurred during getting Post"
    );
  }
};

export const logout = async (dispatch, navigate) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      dispatch(Logout());
      navigate("/");
      return;
    }

    const response = await axios.post(
      `${apiBaseUrl}/api/v1/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      localStorage.removeItem("authToken");
      dispatch(Logout());
      navigate("/");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Error logging out. Please try again.");
  }
};

export const getPosts = async (
  page = 1,
  limit = 10,
  search = "",
  category = ""
) => {
  try {
    console.log("Search from API base ",search);
    
    const response = await axios.get(`${apiBaseUrl}/api/v1/posts/get-posts`, {
      params: {
        page,
        limit,
        search,
        category,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts");
  }
};

export const getPostById = async (postId) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
      `${apiBaseUrl}/api/v1/posts/get-post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch post");
  }
};

export const deletePost = async (postId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(
      `${apiBaseUrl}/api/v1/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete the post"
    );
  }
};

export const updatePost = async (postId, postData, token) => {
  try {
    const response = await axios.put(
      `${apiBaseUrl}/api/v1/posts/update-post/${postId}`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update post");
  }
};

export const createPost = async (postData, token) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/v1/posts/create`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create post");
  }
};
