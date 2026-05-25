import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { saveAuth } from '../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', form);
      saveAuth(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
        {error && <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" placeholder="Full name" />
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" placeholder="Email address" />
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" placeholder="Password" />
          <button className="w-full rounded bg-indigo-600 py-3 text-white hover:bg-indigo-500">Register</button>
        </form>
        <p className="mt-4 text-sm text-white/70">Already have an account? <Link to="/login" className="text-cyan-300">Sign in</Link></p>
      </div>
    </div>
  );
}
