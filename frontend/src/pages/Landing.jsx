import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <main className="p-8">
      <section className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/80 p-10 text-center shadow-2xl shadow-slate-950/30">
        <h1 className="text-5xl font-bold tracking-tight text-white">AuroraDocs</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200">Intelligent multimodal document analysis with OCR, AI summarization, and insights for every upload.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Get started</Link>
          <Link to="/login" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white hover:bg-white/5">Sign in</Link>
        </div>
      </section>
    </main>
  )
}
