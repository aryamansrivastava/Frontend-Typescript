import { useState, useEffect, useCallback } from "react";
import { createUser, getAllUsers, updateUser } from "../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = { userSelect: "none" as const };

import { MRT_PaginationState } from "material-react-table";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  start_time?: string;
  Sessions?: { start_time: string }[];
  Devices?: { name: string }[];
}

const AddUserComponent = ({ editingUser, onSubmit, onCancel }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  // const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = pagination.pageIndex + 1;
      const pageSize = pagination.pageSize;

      const response = await getAllUsers(page, pageSize, globalFilter);
      setUsers(response.data);
      setTotalUsers(response.totalUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [pagination, globalFilter]);

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast.success("User updated successfully! ", { style: toastStyle });
      } else {
        await createUser(formData);
        toast.success("User Created successfully! ", { style: toastStyle });
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      //  setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error("Error saving user ", { style: toastStyle });
      console.error(
        "Error saving user:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="mb-5 bg-gray-800 p-5 rounded-lg shadow-lg w-2/3 mt-20">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingUser ? "Edit User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600 transition duration-300 w-full"
        >
          {editingUser ? "Update" : "Create User"}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 p-2 rounded text-white hover:bg-gray-600 transition duration-300 w-full"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default AddUserComponent;
