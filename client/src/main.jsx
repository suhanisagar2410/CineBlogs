import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Store/Store.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import { Login, PostForm } from "./Components/index.js";
import SearchMovie from "./Pages/SearchMovie.jsx";
import AddPost from "./Pages/AddPost.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import EditPosts from "./Pages/EditPosts.jsx";
import Post from "./Pages/Post.jsx";
import AllPosts from "./Pages/AllPosts.jsx";
import UserProfile from "./Pages/UserProfile.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/add-post" element={<SearchMovie />} />
      <Route path="/all-posts" element={<AllPosts />} />
      <Route path="/edit-post/:postId" element={<EditPosts />} />
      <Route path="/post/:postId" element={<Post />} />
      <Route path="/add-content" element={<AddPost />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>
);
