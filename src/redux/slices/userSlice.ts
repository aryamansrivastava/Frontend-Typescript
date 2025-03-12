import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {getAllUsers} from "../../api/api";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  interface UserState {
    users: User[];
    totalUsers: number;
    loading: boolean;
    error: string | null;
    pages: {};
  }
  
  const initialState: UserState = {
    users: [],
    totalUsers: 0,
    loading: false,
    error: null,
    pages: {}
  };

  export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async ({ page, pageSize, globalFilter }: { page: number; pageSize: number; globalFilter: string }, { rejectWithValue }) => {
      try {
        const response = await getAllUsers(page, pageSize, globalFilter);
        return response; 
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch users");
      }
    }
  );

  export const deleteUserThunk = createAsyncThunk(
    "users/deleteUser",
    async (id: string, { rejectWithValue }) => {
      try {
        await DeleteUser(id);
        return id; 
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to delete user");
      }
    }
  );

  const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
          state.users = action.payload;
        },
        setTotalUsers: (state, action: PayloadAction<number>) => {
          state.totalUsers = action.payload;
        },
        addUser: (state, action: PayloadAction<User>) => {
          state.users.push(action.payload);
        },
        UpdateUser: (state, action: PayloadAction<User>) => {
          state.users = state.users.map(user =>
            user.id === action.payload.id ? action.payload : user
          );
        },
        DeleteUser: (state, action: PayloadAction<string>) => {
          state.users = state.users.filter(user => user.id !== action.payload);
        },
        setUsersByPage: (state, action) => {
          const { page, users } = action.payload;
          state.pages[page] = users; 
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch users";
        })
        .addCase(deleteUserThunk.fulfilled, (state, action: PayloadAction<string>) => {
          state.users = state.users.filter((user) => user.id !== action.payload);
          state.totalUsers -= 1;
        })
        .addCase(deleteUserThunk.rejected, (state, action) => {
          state.error = action.payload as string;
        });
    },
  });

  export const{setUsers, setTotalUsers, UpdateUser, DeleteUser} = userSlice.actions;

  export default userSlice.reducer;