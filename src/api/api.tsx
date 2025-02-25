import axios from "axios";

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  start_time?: string|null;
}

export const createUser = async (userData: User): Promise<User> => {
  try {
    const response = await axios.post<User>(`${import.meta.env.VITE_API_URL}/create`, userData);
    return response.data;
  } catch (err: any) {
    if (err && err.response) {
      throw err.response.data?.message || "Failed to create user";
    }
    throw "Failed to create user";
  }
};

export const getAllUsers = async () => {
  console.log('Default Axios Headers:', axios.defaults.headers.common);
  const response:any = await axios.get(`${import.meta.env.VITE_API_URL}/getallusers`);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/getuser/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: User): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/update/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`);
};