import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    user: {id: string; firstName: string; lastName: string; email: string} | null;
}

const initialState: AuthState = {
    token : sessionStorage.getItem("token") || null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login : (state, action: PayloadAction<{token: string; user: AuthState["user"]}>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            sessionStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            sessionStorage.removeItem("token");
        },
    },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;