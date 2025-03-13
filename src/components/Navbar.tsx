import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="space-x-6">
        <Link to="/feed" className="hover:text-blue-400">
          Feed
        </Link>
        <Link to="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
