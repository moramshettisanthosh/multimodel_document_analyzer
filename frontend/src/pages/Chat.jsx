import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Chat(){
  const [documents, setDocuments] = useState([])
  const [question, setQuestion] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const res = await api.get('/documents')
        setDocuments(res.data)
        if (res.data.length) setDocumentId(res.data[0]._id)
      } catch (err) {
        setError('Could not load documents')
      }
    }
    loadDocuments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAnswer('')
    setError('')
    if (!question.trim()) {
      setError('Please enter a question.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/chat', { question, documentId: documentId || undefined })
      setAnswer(res.data.answer)
    } catch (err) {
      setError(err.response?.data?.message || 'Chat request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">AI Chat</h2>
        <p className="text-white/70">Ask questions about your uploaded documents or chat with the assistant.</p>
      </div>

      <div className="glass p-6 space-y-4 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            Select document
            <select value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="w-full rounded border border-white/10 bg-slate-950/80 p-3 outline-none">
              <option value="">General</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>{doc.originalName}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/80">
            Your question
            <input value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full rounded border border-white/10 bg-slate-950/80 p-3 outline-none" placeholder="What would you like to know?" />
          </label>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="rounded bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
          {loading ? 'Asking…' : 'Ask AuroraDocs'}
        </button>
        {error && <div className="rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
        {answer && (
          <div className="rounded border border-white/10 bg-slate-950/70 p-4 text-white/80">
            <h3 className="mb-3 text-lg font-semibold">Answer</h3>
            <p className="whitespace-pre-line">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
