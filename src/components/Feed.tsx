import { useState, useEffect, useMemo, useCallback } from "react";
import { createUser, getAllUsers, deleteUser, updateUser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ExportUserDataButton from "./ExportUserDataButton";
import useAuthCheck from "../hooks/authCheck";
import { useDispatch, useSelector } from "react-redux"; 
import {fetchAllUsers, deleteUserThunk, setUsers, setTotalUsers} from "../redux/slices/userSlice"
import { RootState, AppDispatch } from "../redux/store"; 
import { logout } from "../redux/slices/authSlice";
import useUsers from "../hooks/useUsers";
import { debounce } from "lodash";

import {
  MaterialReactTable,
  MRT_PaginationState,
  type MRT_ColumnDef,
} from "material-react-table";

const toastStyle = { userSelect: "none" as const };

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
  useAuthCheck();
  
  // const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  // const [totalUsers, setTotalUsers] = useState(0);
  const [showUsers, setShowUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  // const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { users, totalUsers, isLoading, fetchUsers } = useUsers(pagination, globalFilter, showUsers);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",

        size: 150,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "Sessions",
        header: "Last Login Time",
        size: 200,
        Cell: ({ row }) => {
          const sessions = row.original.Sessions;
          if (sessions && sessions.length > 0) {
            return format(new Date(sessions[0].start_time), "dd/MM/yyyy HH:mm");
          }
          return "No Session";
        },
      },
      {
        accessorKey: "Devices",
        header: "Last Device Used",
        size: 200,
        Cell: ({ row }) => {
          const devices = row.original.Devices;
          if (devices && devices.length > 0) {
            return devices[0].name || "Unknown Device";
          }
          return "No Device";
        },
      },
    ],
    []
  );

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

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUserThunk(id)).unwrap();
      toast.success("User deleted successfully! ✅", { style: toastStyle });
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
    dispatch(logout());
  };

  const debouncedSetFilter = useCallback(
    debounce((value) => {
      setGlobalFilter(value); 
    }, 500), 
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchTerm(event.target.value);
    debouncedSetFilter(event.target.value); 
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      const page = pagination.pageIndex + 1;
      const pageSize = pagination.pageSize;

      // dispatch(setLoading(true));

      const response = await getAllUsers(page, pageSize, globalFilter); 
      await dispatch(setUsers(response.data));
      await dispatch(setTotalUsers(response.totalUsers));
      return response.data || [];
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Failed to load all users for PDF");
    }
  }, [totalUsers, pagination, globalFilter, dispatch]);

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    if (showUsers) {
      fetchAllUsers();
    }
  }, [pagination.pageIndex, setToken, getAllUsers]);

  useEffect(() => {
    const fetchUsersOnPageChange = async () => {
      try {
        dispatch(setUsers(await getAllUsers(currentPage, rowPerPage)));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsersOnPageChange();
  }, [dispatch, currentPage, rowPerPage]); 

  return (
    <div className="relative p-5 bg-gray-900 text-white min-h-screen flex flex-col items-center pt-20">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="absolute top-5 right-5 flex flex-col items-end">
        <div className="text-white font-semibold mb-1">
          Welcome, {localStorage.getItem("loggedInUser")}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition duration-300 z-10"
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
          <h2 className="text-xl mb-3">Users Created: {totalUsers}</h2>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="bg-green-500 p-2 rounded text-white hover:bg-green-600 transition duration-300"
          >
            {showUsers ? "Hide Users" : "View All Users"}
          </button>

          {showUsers && (
            <>
             <ExportUserDataButton fetchPromise={fetchAllUsers} />

              <MaterialReactTable
                columns={columns}
                data={users}
                rowCount={totalUsers}
                enableSorting
                enableGlobalFilter
                manualFiltering
                manualPagination
                state={{
                  pagination,
                  isLoading,
                  globalFilter,
                }}
                onGlobalFilterChange={(val)=>{
                  setGlobalFilter(val)
                }}
                onPaginationChange={setPagination}
                // onPaginationChange={(newPagination) => {
                //   if((newPagination as MRT_PaginationState).pageSize !== pagination.pageSize) {
                //     setPagination({ pageIndex: 0, pageSize: (newPagination as MRT_PaginationState).pageSize });
                //     fetchUsers();
                //   }else{
                //     setPagination(newPagination);
                //   }
                // }}
                pageCount={Math.ceil(totalUsers / pagination.pageSize)}

                // muiTablePaperProps={{
                //   sx: {
                //     backgroundColor: "#1f2937",
                //     color: "white",
                //   },
                // }}

                muiTableHeadCellProps={{
                  sx: {
                    color: "white",
                    backgroundColor: "#1f2937",
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    color: "white",
                    backgroundColor: "#1f2937"
                  },
                }}
                // muiPaginationProps={{
                //   color: "primary",
                //   sx: {
                //     color: "white",
                //   },
                // }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;