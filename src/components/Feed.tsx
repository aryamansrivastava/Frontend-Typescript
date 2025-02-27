import { useState, useEffect } from "react";
import { createUser, getAllUsers, deleteUser, updateUser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

const toastStyle = { userSelect: "none" as const };

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  start_time?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FeedProps {
  setToken: (token: string | null) => void;
}

const Feed = ({ setToken }: FeedProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showUsers, setShowUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(5);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChangePage = async (page: number) => {
    try {
      const response: { data: { data: any[] }; totalUsers: number } =
        await getAllUsers(page, rowPerPage);
      console.log(response);
      setUsers((prev) => [...prev, ...(response.data as any)]);
      setTotalUsers(response.totalUsers);
    } catch (err: any) {
      console.error(err);
    }
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const currentUsers = users.slice(
    (currentPage - 1) * rowPerPage,
    currentPage * rowPerPage
  );

  const start = (currentPage - 1) * rowPerPage + 1;
  const end = Math.min(currentPage * rowPerPage, users.length);

  const fetchUsers = async () => {
    try {
      const response: { data: { data: any[] }; totalUsers: number } =
        await getAllUsers();
      console.log(response);
      setUsers(response.data as any);
      setTotalUsers(response.totalUsers);
      console.log(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id.toString(), formData);
        toast.success("User updated successfully! ✅", { style: toastStyle });
      } else {
        await createUser(formData);
        toast.success("User Created successfully! 🎉", { style: toastStyle });
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      setEditingUser(null);
      setShowUsers(false);
      fetchUsers();
    } catch (error: any) {
      toast.error("Error saving user ❌", { style: toastStyle });
      console.error(
        "Error saving user:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleCancel = () => {
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
    setEditingUser(null);
    setShowUsers(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id.toString());
      toast.success("User deleted successfully! ✅", { style: toastStyle });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id.toString())
      );
    } catch (error: any) {
      toast.error("Error deleting user ❌", { style: toastStyle });
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // const totalPages = Math.ceil(users?.length ?? 0 / usersPerPage);
  // const currentUsers = users?.slice(
  //   (currentPage - 1) * usersPerPage,
  //   currentPage * usersPerPage
  // );

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [setToken]);

  useEffect(() => {
    const fetchUsersOnPageChange = async () => {
      try {
        const response: { data: { data: any[] }; totalUsers: number } = await getAllUsers(currentPage, rowPerPage);
        setUsers(response.data as any);
        setTotalUsers(response.totalUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsersOnPageChange();
  }, [rowPerPage]);

  return (
    <div className="relative p-5 bg-gray-900 text-white min-h-screen flex flex-col items-center pt-20">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="absolute top-5 right-5 flex flex-col items-end">
        <div className="text-white font-semibold mb-1">
          Welcome, {localStorage.getItem("loggedInUser")}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 p-2 rounded text-white hover:bg-red-600 transition duration-300 z-10"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-5 text-center">CRUD Sequelize</h1>

      <div className="mb-5 bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg">
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

      {!editingUser && (
        <>
          <h2 className="text-xl mb-3">Users Created: {totalUsers || 0}</h2>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="bg-green-500 p-2 rounded text-white hover:bg-green-600 transition duration-300"
          >
            {showUsers ? "Hide Users" : "View All Users"}
          </button>

          {showUsers && (
            <div className="overflow-x-auto w-full max-w-4xl mt-5">
              <table className="w-full bg-gray-800 border border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Last Login Time</th>
                    <th className="border p-2">Last Device Used</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-700 text-center"
                    >
                      <td className="p-2">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        {user.Sessions[0]?.start_time ? (
                          <>
                            <div>
                              {format(new Date(user.Sessions[0]?.start_time), "h:mm a")}
                            </div>
                            <div>
                              {format(new Date(user.Sessions[0]?.start_time), "MMMM d, ")}
                            </div>
                            <div>
                              {formatDistanceToNow(new Date(user.Sessions[0]?.start_time), {
                                addSuffix: true,
                              })}
                            </div>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="p-2">
                        {user.Devices[0]?.name ? (
                          user.Devices[0]?.name
                        ) : "NA"}
                      </td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              password: "",
                            });
                            setShowUsers(false);
                          }}
                          className="bg-yellow-500 p-1 rounded text-black hover:bg-yellow-600 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 p-1 rounded text-white hover:bg-red-600 transition duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <div>
                  Rows per page:
                  <select
                    value={rowPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="ml-2 p-1 rounded bg-gray-800 text-white border border-gray-600"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
                <div>
                  {start}–{end} of {totalUsers}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={end >= totalUsers}
                    className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
