import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups/Groups";
import GroupDetail from "./pages/Groups/GroupDetail";
import Sessions from "./pages/Sessions/Sessions";
import Articles from "./pages/Articles/Articles";
import Admin from "./pages/Admin/Admin";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      <Route path="/groups" element={user ? <Groups /> : <Navigate to="/login" />} />
      <Route path="/groups/:id" element={user ? <GroupDetail /> : <Navigate to="/login" />} />
      <Route path="/sessions" element={user ? <Sessions /> : <Navigate to="/login" />} />
      <Route path="/articles" element={user ? <Articles /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user?.is_admin ? <Admin /> : <Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
