import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { saveAuth } from '../utils/auth'

export default function Login(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      saveAuth(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        {error && <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" placeholder="Email" />
          <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" placeholder="Password" />
          <button className="w-full py-3 rounded bg-indigo-600 text-white hover:bg-indigo-500">Sign in</button>
        </form>
        <p className="mt-4 text-sm text-white/70">New here? <Link to="/register" className="text-cyan-300">Create an account</Link></p>
      </div>
    </div>
  )
}
