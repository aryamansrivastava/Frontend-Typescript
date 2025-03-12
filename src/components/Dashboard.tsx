import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import Graph from "../components/Graph";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MaterialReactTable,
//   MRT_PaginationState,
//   type MRT_ColumnDef,
} from "material-react-table";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalNonActiveUsers, setTotalNonActiveUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState<
    { id: number; Sessions: { start_time: string }[] }[]
  >([]);
  const [activeUserStats, setActiveUserStats] = useState<
    { date: string; value: number }[]
  >([]);
  const [totalUserStats, setTotalUserStats] = useState<{ date: string; value: number }[]>([]);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; Sessions: { start_time: string }[] }[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState("active");

  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getAllUsers(1, 1000);
        const users = response.data;

        const activeUsers = users.filter(
          (user: any) => user.Sessions?.length > 0
        );
        const nonActiveUsers = users.length - activeUsers.length;

        setTotalUsers(users.length);
        setTotalActiveUsers(activeUsers.length);
        setTotalNonActiveUsers(nonActiveUsers);
      } catch (err) {
        console.error("Error fetching Users", err);
      }
    };

    const fetchUsers = async () => {
        try {
          const response = await getAllUsers(1, totalUsers);
          const users = response.data;
          const activeUsers = users.filter(
            (user) => user.Sessions && user.Sessions.length > 0
          );
          setAllUsers(users);
          setActiveUsers(activeUsers);
          setFilteredUsers(users);

          const activeStats = activeUsers.reduce((acc, user) => {
            user.Sessions.forEach((session) => {
              const date = format(new Date(session.start_time), "yyyy-MM-dd");
              acc[date] = (acc[date] || 0) + 1;
            });
            return acc;
          }, {});
  
          const chartData = Object.keys(activeStats).map((date) => ({
            date,
            value: activeStats[date],
          }));
  
          setActiveUserStats(chartData);

          const totalStats = users.reduce((acc, user) => {
            if (user.createdAt) {  
              const date = format(new Date(user.createdAt), "yyyy-MM-dd");
              acc[date] = (acc[date] || 0) + 1;
            }
            return acc;
          }, {});

          const totalChartData = Object.keys(totalStats).map((date) => ({
            date,
            value: totalStats[date],
          }));
    
          setTotalUserStats(totalChartData); 

        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to load users");
        }
      };

    fetchUserStats();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
      setActiveUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "Sessions",
      header: "Last Active Time",
      Cell: ({ row }) => {
        const sessions = row.original.Sessions;
        return sessions.length > 0
          ? format(new Date(sessions[0].start_time), "dd/MM/yyyy HH:mm")
          : "No Session";
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="bg-red-500 px-3 py-1 rounded text-white"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleShowTotalUsers = () => {
    setFilteredUsers(allUsers);
    setChartType("total");
    setShowChart(true);
  };

  const handleShowActiveUsers = () => {
    setFilteredUsers(activeUsers);
    setChartType("active");
    setShowChart(true);
  };

  const handleShowNonActiveUsers = () => {
    const nonActiveUsers = allUsers.filter((user: { Sessions: { start_time: string }[] }) => user.Sessions.length === 0);
    setFilteredUsers(nonActiveUsers);
    setShowChart(false); 
  };

  return (
    <div className="p-5 bg-gray-900 text-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => navigate("/feed")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Back to Feed
        </button>
      </div>

      <div className="mt-5 p-5 bg-gray-800 rounded">
        <div className="flex gap-4">
          <button className="bg-blue-500 px-4 py-2 rounded" onClick={handleShowTotalUsers}>
            Total Users: {allUsers.length}
          </button>
          <button className="bg-green-500 px-4 py-2 rounded" onClick={handleShowActiveUsers}>
            Total Active Users: {activeUsers.length}
          </button>
          <button className="bg-red-500 px-4 py-2 rounded" onClick={handleShowNonActiveUsers}>
            Total Non-Active Users: {allUsers.length - activeUsers.length}
          </button>
        </div>

        {showChart && (
          <div className="mt-5">
            <h2 className="text-xl font-semibold">
                {chartType==="active" ? "Active Users Over Time" : "Total Users Over Time"}</h2>
                <Graph chartData={chartType === "active" ? activeUserStats : totalUserStats} />
          </div>
        )}
      </div>

      <div className="mt-5 p-5 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold">Users</h2>
        <MaterialReactTable columns={columns} data={filteredUsers} 
         muiTableHeadCellProps={{
                  sx: {
                    color: "white",
                    backgroundColor: "#1f2937",
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    color: "white",
                    backgroundColor: "#1f2937",
                  },
                }}/>
        
      </div>
    </div>
  );
};

export default Dashboard;