import axios from "axios";

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
      const response = await axios.post(`${apiBaseUrl}/api/v1/users/login`, values);
  
      if (response.data) {
        const userData = response.data.data;
        const token = userData.token;
  
        localStorage.setItem("authToken", token);
  
        return { userData, token };
      }
  
      throw new Error("Unexpected response from server");
    } catch (error) {
      throw new Error(error.response?.data?.message || "An error occurred during login");
    }
  };