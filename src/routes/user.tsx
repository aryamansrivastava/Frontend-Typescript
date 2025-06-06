import { Routes, Route, Navigate } from 'react-router-dom';
import Feed from "../components/Feed";
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserRoutes = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    setToken(savedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
  }, []);

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/feed" />: <Navigate to="/login" />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <SignUp />} />
      <Route path="/feed" element={token ? <Feed setToken={setToken} /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default UserRoutes;