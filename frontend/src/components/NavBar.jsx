import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getUser, isAuthenticated, logout } from '../utils/auth';

export default function NavBar() {
  const navigate = useNavigate();
  const user = getUser();
  const signedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4 max-w-6xl">
        <Link to="/" className="text-xl font-bold tracking-tight text-cyan-300">AuroraDocs</Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          <Link to="/">Home</Link>
          {signedIn && <Link to="/dashboard">Dashboard</Link>}
          {signedIn && <Link to="/upload">Upload</Link>}
          {signedIn && <Link to="/chat">Chat</Link>}
        </nav>
        <div className="flex items-center gap-3">
          {signedIn ? (
            <>
              <span className="text-sm text-white/70">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700">Login</Link>
              <Link to="/register" className="rounded bg-cyan-500 px-4 py-2 text-sm text-slate-950 hover:bg-cyan-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
