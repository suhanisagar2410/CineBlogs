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
import { lazy } from "react";

const HomePage = lazy(() => import("./Pages/HomePage.jsx"));
const Login = lazy(() => import("./Components/Login.jsx"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage.jsx"));
const SearchMovie = lazy(() => import("./Pages/SearchMovie.jsx"));
const AddPost = lazy(() => import("./Pages/AddPost.jsx"));
const EditPosts = lazy(() => import("./Pages/EditPosts.jsx"));
const Post = lazy(() => import("./Pages/Post.jsx"));
const AllPosts = lazy(() => import("./Pages/AllPosts.jsx"));
const UserProfile = lazy(() => import("./Pages/UserProfile.jsx"));
const MyFollowers = lazy(() => import("./Pages/MyFollowers.jsx"));
const MyFollowings = lazy(() => import("./Pages/MyFollowings.jsx"));
const ProtectRoute = lazy(() => import("./utility/ProtectRoute.jsx"));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectRoute />}>
      <Route path="/" element={<HomePage />} />
        <Route path="/add-post" element={<SearchMovie />} />
        <Route path="/all-posts" element={<AllPosts />} />
        <Route path="/edit-post/:postId" element={<EditPosts />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/add-content" element={<AddPost />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/followers/:userId" element={<MyFollowers />} />
        <Route path="/followings/:userId" element={<MyFollowings />} />
      </Route>
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
