import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Chat from './pages/Chat'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <NavBar />
      <main className="pb-10">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload/></ProtectedRoute>} />
          <Route path="/analysis/:id" element={<ProtectedRoute><Analysis/></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}
