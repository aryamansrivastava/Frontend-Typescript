import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const getTokenFromSession = (): string | null => {
  return sessionStorage.getItem("token");
};

const getUserFromSession = (): User | null => {
  const userData = sessionStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const initialState: AuthState = {
  token: getTokenFromSession(),
  user: getUserFromSession(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;