import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'

export default function Analysis(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/documents/${id}`)
        setDocument(res.data.doc)
        setAnalysis(res.data.analysis)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analysis')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const runAnalysis = async () => {
    setError('')
    setRunning(true)
    try {
      const res = await api.post(`/documents/${id}/analyze`)
      setAnalysis(res.data.analysis)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return <div className="p-6 glass">Loading analysis...</div>
  }

  if (error) {
    return <div className="p-6 glass text-red-200">{error}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{document?.originalName || 'Document Analysis'}</h2>
          <p className="text-sm text-white/70">Uploaded {document ? new Date(document.createdAt).toLocaleString() : ''}</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="rounded bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">Back to dashboard</button>
      </div>

      {!analysis ? (
        <div className="glass p-6 space-y-4">
          <p className="text-lg font-medium">No analysis found yet for this document.</p>
          <button onClick={runAnalysis} disabled={running} className="rounded bg-cyan-500 px-4 py-3 text-white hover:bg-cyan-400 disabled:opacity-60">
            {running ? 'Analyzing…' : 'Run AI Analysis'}
          </button>
          <p className="text-sm text-white/70">Analysis will extract summary and AI insights from the uploaded document.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass p-6">
            <h3 className="text-xl font-semibold mb-3">Summary</h3>
            <p className="whitespace-pre-line text-white/80">{analysis.summary || 'No summary available.'}</p>
          </div>
          <div className="glass p-6">
            <h3 className="text-xl font-semibold mb-3">Insights</h3>
            <ul className="space-y-2 list-disc pl-5 text-white/80">
              {analysis.insights?.length ? analysis.insights.map((item, index) => (<li key={index}>{item}</li>)) : <li>No insights available.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
