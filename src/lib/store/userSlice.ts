import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  userData: any; // Replace 'any' with your user data type
}

const initialState: UserState = {
  isLoggedIn: false,
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
