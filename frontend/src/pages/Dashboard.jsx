import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function Dashboard(){
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const res = await api.get('/documents')
        setDocuments(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load documents')
      } finally {
        setLoading(false)
      }
    }
    loadDocuments()
  }, [])

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
          <p className="text-white/70">Your recent documents and AI insights in one place.</p>
        </div>
        <Link to="/upload" className="inline-flex rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Upload new document</Link>
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-3">
        <div className="glass p-6">
          <p className="text-sm uppercase text-white/60">Documents uploaded</p>
          <p className="mt-3 text-4xl font-semibold">{documents.length}</p>
        </div>
        <div className="glass p-6">
          <p className="text-sm uppercase text-white/60">Latest upload</p>
          <p className="mt-3 text-lg font-medium">{documents[0]?.originalName || 'No uploads yet'}</p>
        </div>
        <div className="glass p-6">
          <p className="text-sm uppercase text-white/60">Review</p>
          <p className="mt-3 text-lg font-medium">{documents.length ? 'Continue analyzing documents' : 'Upload a document'}</p>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your documents</h3>
          <span className="text-sm text-white/60">{documents.length} items</span>
        </div>

        {loading ? (
          <div className="glass p-6">Loading documents...</div>
        ) : error ? (
          <div className="glass p-6 text-red-200">{error}</div>
        ) : documents.length === 0 ? (
          <div className="glass p-6">
            <p>No documents uploaded yet.</p>
            <Link to="/upload" className="mt-4 inline-flex rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Upload one now</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc._id} className="glass p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{doc.originalName}</p>
                    <p className="text-sm text-white/60">{doc.mimeType} • {(doc.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Link to={`/analysis/${doc._id}`} className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">View analysis</Link>
                </div>
                <p className="mt-3 text-sm text-white/70">Uploaded {new Date(doc.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
