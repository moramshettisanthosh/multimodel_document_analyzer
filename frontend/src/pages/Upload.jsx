import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Upload(){
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const upload = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!file) {
      setMessage('Please select a file to upload.')
      return
    }

    const fd = new FormData()
    fd.append('file', file)
    setLoading(true)

    try {
      await api.post('/documents/upload', fd)
      setMessage('Upload successful. Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 900)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
      <form onSubmit={upload} className="glass space-y-4 p-6 max-w-xl">
        <input type="file" onChange={e => setFile(e.target.files?.[0])} className="w-full rounded border border-white/10 bg-transparent p-3 outline-none" />
        <button type="submit" disabled={loading} className="w-full rounded bg-indigo-600 py-3 text-white hover:bg-indigo-500 disabled:opacity-60">
          {loading ? 'Uploading…' : 'Upload Document'}
        </button>
        {message && <p className="text-sm text-white/80">{message}</p>}
      </form>
    </div>
  )
}
