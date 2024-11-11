import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null,
    movie: null
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        Login: (state, action) => {
            console.log(action.payload.token)
            state.status = true;
            state.userData = action.payload.user;
            localStorage.setItem("authToken", action.payload.token);
        },
        Logout: (state) => {
            state.status = false;
            state.userData = null;
            // localStorage.removeItem("authToken");
        },
        AddMovie: (state, action ) => {
            state.movie = action.payload;
        },
        RemoveMovie: (state)=>{
            state.movie = null;
        }
     }
})

export const {Login, Logout, AddMovie, RemoveMovie} = AuthSlice.actions;

export default AuthSlice.reducer;