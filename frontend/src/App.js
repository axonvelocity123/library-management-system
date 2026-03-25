import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';
import Fines from './pages/Fines';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import api from './api/axios';

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/login" />;
  return children;
}

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [offline, setOffline] = useState(false);

  useEffect(() => {
fetch('http://localhost:3000').then(() => setOffline(false)).catch(() => setOffline(true));  }, []);

  return (
    <Router>
      {offline && <div className="offline-banner">⚠️ Backend server is unavailable. Please start the server and refresh.</div>}
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={token ? (role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/librarian" />) : <Navigate to="/login" />} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/librarian" element={<PrivateRoute roles={['admin','librarian']}><LibrarianDashboard /></PrivateRoute>} />
        <Route path="/books" element={<PrivateRoute roles={['admin','librarian']}><Books /></PrivateRoute>} />
        <Route path="/members" element={<PrivateRoute roles={['admin','librarian']}><Members /></PrivateRoute>} />
        <Route path="/loans" element={<PrivateRoute roles={['admin','librarian']}><Loans /></PrivateRoute>} />
        <Route path="/fines" element={<PrivateRoute roles={['admin','librarian']}><Fines /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute roles={['admin']}><Analytics /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
