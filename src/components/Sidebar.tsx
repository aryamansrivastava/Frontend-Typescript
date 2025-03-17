import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, LayoutDashboard, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-5 left-5 z-30 text-white bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition"
      >
        <Menu size={28} />
      </button>

      <div
        className={`fixed left-0 top-0 h-screen bg-gray-800 text-white flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-72 p-6" : "w-0 overflow-hidden"
        }`}
      >
        {isOpen && (
          <>
            <div>
              <div className="flex flex-col justify-center items-center mx-12 my-4">
                <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
                  <img
                    src="https://media.glassdoor.com/sqll/5227723/tranzita-systems-squareLogo-1625555960815.png"
                    alt="Tranzita Logo"
                  />
                </div>
              </div>

              <nav className="mt-12 space-y-6">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-md text-lg"
                >
                  <LayoutDashboard size={28} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/feed"
                  className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-md text-lg"
                >
                  <Users size={28} />
                  <span>Users</span>
                </Link>
              </nav>
            </div>

            <div className="mt-auto">
              <div className="flex flex-col items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 p-3 bg-red-500 hover:bg-red-600 rounded-md text-lg"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
