import axios from "axios";

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  start_time?: string | null;
}

export const createUser = async (userData: User): Promise<User> => {
  try {
    const response = await axios.post<User>(
      `${import.meta.env.VITE_API_URL}/create`,
      userData
    );
    return response.data;
  } catch (err: any) {
    if (err && err.response) {
      console.error("Create User Error:", err);
      throw new Error(err.response.data?.message || "Failed to create user");
    }
    throw "Failed to create user";
  }
};

export const getAllUsers = async (
  page?: number,
  size?: number,
  searchQuery = ""
) => {
  const currentPage = page || 1;
  const totalSize = size || 5;
  try {
    const response: any = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/getallusers?page=${currentPage}&size=${totalSize}&search=${searchQuery}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Get All Users Error:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch users");
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get<User>(
      `${import.meta.env.VITE_API_URL}/getuser/${id}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Get User by ID Error:", err);
    throw new Error(err.response?.data?.message || "User not Found");
  }
};

export const updateUser = async (id: string, userData: User): Promise<User> => {
  try {
    const response = await axios.put<User>(
      `${import.meta.env.VITE_API_URL}/update/${id}`,
      userData
    );
    return response.data;
  } catch (err: any) {
    console.error("Update User Error:", err);
    throw new Error(err.response?.data?.message || "Failed to Update User");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`);
  } catch (err: any) {
    console.error("Delete User Error:", err);
    throw new Error(err.response?.data?.message || "Failed to Delete User");
  }
};