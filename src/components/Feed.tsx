import { useState, useEffect, useMemo, useCallback } from "react";
import { createUser, getAllUsers, updateUser } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import ExportUserDataButton from "./ExportUserDataButton";
import useAuthCheck from "../hooks/authCheck";
import AddUser from "./AddUser";

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

  const [users, setUsers] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination, globalFilter]);

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
        await updateUser(editingUser.id, formData);
        toast.success("User updated successfully! ", { style: toastStyle });
      } else {
        await createUser(formData);
        toast.success("User Created successfully! ", { style: toastStyle });
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      setEditingUser(null);
      // setShowUsers(false);
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
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
    setEditingUser(null);
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await getAllUsers(1, totalUsers);
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Failed to load all users for PDF");
      return [];
    }
  }, [totalUsers]);

  return (
    <div className="relative bg-gray-900 text-white min-h-screen w-full flex flex-col items-center pt-20">
      <ToastContainer position="top-right" autoClose={3000} />

      {!showAddUser && (
        <div className="w-full justify-start">
          <h2 className="text-4xl">Total Users: {totalUsers || 0}</h2>
        </div>
      )}

      <div className="absolute top-5 right-5 flex items-center gap-3">
        <div className="text-white font-semibold mb-1">
          {/* Welcome, {localStorage.getItem("loggedInUser")} */}
        </div>
        {showAddUser && (
          <button
            onClick={() => {
              setShowAddUser(false);
              handleCancel();
            }}
            className="bg-gray-700 px-6 py-3 text-lg rounded text-white hover:bg-gray-600 transition duration-300"
          >
            Back
          </button>
        )}
      </div>

      {showAddUser ? (
        <AddUser
          editingUser={editingUser}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddUser(false);
            handleCancel();
          }}
        />
      ) : (
        <>
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-500 px-6 py-3 text-lg rounded text-white hover:bg-blue-600 transition duration-300 mb-3"
            >
              Add User
            </button>
          </div>

          <div className="w-full">
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
              onGlobalFilterChange={(val) => {
                setGlobalFilter(val);
              }}
              onPaginationChange={setPagination}
              pageCount={Math.ceil(totalUsers / pagination.pageSize)}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: "#1a2332",
                  color: "white",
                  "& .MuiTableSortLabel-icon": {
                    color: "white !important",
                  },
                  "& .MuiIconButton-root": {
                    color: "white !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  backgroundColor: "#1a2332",
                  color: "white",
                },
              }}
              muiTopToolbarProps={{
                sx: {
                  backgroundColor: "#1a2332",
                  color: "white",
                  "& .MuiIconButton-root": {
                    color: "white",
                  },
                },
              }}
              muiBottomToolbarProps={{
                sx: {
                  backgroundColor: "#1a2332",
                  color: "white",
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                  "& .MuiInputBase-root": {
                    color: "white",
                  },
                  "& .MuiFormLabel-root": {
                    color: "white",
                  },
                },
              }}
            />
            <div className="mt-6">
              <ExportUserDataButton fetchPromise={fetchAllUsers} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;
