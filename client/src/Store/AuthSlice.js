// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   status: false,
//   userData: null,
// };

// export const AuthSlice = createSlice({
//   name: "Auth",
//   initialState,
//   reducers: {
    
//         Login: (state, action) => {
//           (state.status = true), (state.userData = action.payload);
//         },
      
    
//         Logout: (state, action) => {
//         (state.status = false),
//           (state.userData = null),
//           console.log(action.payload);
//       },
//   }
// });

// export default AuthSlice.reducer;
// export const { Logout, Login } = AuthSlice.actions;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        Login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        Logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})

export const {Login, Logout} = AuthSlice.actions;

export default AuthSlice.reducer;