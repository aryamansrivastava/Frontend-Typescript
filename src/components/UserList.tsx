import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/api";
import { toast } from "react-toastify";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  start_time?: string | null;
}

interface UserListProps {
  onEdit: (user: User) => void;
}

const toastStyle: React.CSSProperties = {
  userSelect: "none",
};

const UserList = ({ onEdit }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data: User[] = await getAllUsers();
      setUsers(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to load users ", {
          style: toastStyle,
        });
      }
    }
  };

  const handleEdit = (user: User) => {
    onEdit(user);
    setEditingUserId(user.id);
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  const handleDelete = async (userId: string) => {
    if (editingUserId === userId) {
      handleCancel();
      return;
    }
    try {
      const userExists = users.find((user) => user.id === userId);
      if (!userExists) {
        toast.error("User not found! ", {
          style: toastStyle,
        });
        return;
      }

      await deleteUser(userId);
      toast.success("User deleted successfully! 🗑️", {
        style: toastStyle,
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting user:", error.message);
        toast.error(error.message || "Error deleting user ", {
          style: toastStyle,
        });
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.start_time
                    ? new Date(user.start_time).toLocaleString()
                    : "No active session"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className={`px-3 py-1 rounded mr-2 text-white ${
                      editingUserId === user.id
                        ? "bg-yellow-700"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {editingUserId === user.id ? "Editing" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className={`px-3 py-1 rounded text-white ${
                      editingUserId === user.id
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {editingUserId === user.id ? "Cancel" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;