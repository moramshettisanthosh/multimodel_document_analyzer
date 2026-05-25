const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt, options = {}) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 500
  }, { headers: { Authorization: `Bearer ${OPENAI_KEY}` } });
  return res.data;
}

function simpleSummaryFromText(text) {
  // crude fallback: split by sentence-like punctuation and return up to 3 bullets
  const parts = text.replace(/\s+/g, ' ').split(/(?<=[\.\!\?])\s+/).filter(Boolean);
  const bullets = parts.slice(0, 3).map(s => s.trim()).filter(Boolean);
  return bullets.map(b => `- ${b}`).join('\n');
}

function simpleInsightsFromText(text) {
  // crude fallback: take first 5 short phrases (split by line or sentence)
  const parts = text.replace(/\s+/g, ' ').split(/(?<=[\.\!\?])\s+|\n+/).filter(Boolean);
  return parts.slice(0, 5).map(s => s.trim()).filter(Boolean);
}

exports.simpleSummaryFromText = simpleSummaryFromText;
exports.simpleInsightsFromText = simpleInsightsFromText;

exports.summarizeText = async (text) => {
  if (!text) return '';
  if (!OPENAI_KEY) return simpleSummaryFromText(text);
  const prompt = `Summarize the following text in 3 concise bullet points:\n\n${text}`;
  const r = await callOpenAI(prompt, { maxTokens: 300 });
  return r.choices?.[0]?.message?.content || '';
};

exports.extractInsights = async (text) => {
  if (!text) return [];
  if (!OPENAI_KEY) return simpleInsightsFromText(text);
  const prompt = `Extract 5 key insights from the text as short phrases:\n\n${text}`;
  const r = await callOpenAI(prompt, { maxTokens: 300 });
  const raw = r.choices?.[0]?.message?.content || '';
  return raw.split('\n').map(s => s.replace(/^\d+\.?\s*/, '').trim()).filter(Boolean);
};

exports.chatQuestion = async (context, question) => {
  if (!OPENAI_KEY) {
    // Fallback: if context contains the answer, return a substring, else say key missing
    if (context && context.toLowerCase().includes(question.toLowerCase().split(' ').slice(0,5).join(' '))) {
      return context.split('\n').slice(0,3).join('\n');
    }
    return 'OPENAI_API_KEY not set — cannot generate AI answer. Provide OPENAI_API_KEY to enable advanced responses.';
  }

  const prompt = context
    ? `Use the following document text to answer the question. If the text does not contain the answer, provide the best response based on general knowledge.\n\nDocument text:\n${context}\n\nQuestion:\n${question}`
    : `Answer the following question concisely:\n\n${question}`;

  const r = await callOpenAI(prompt, { maxTokens: 400 });
  return r.choices?.[0]?.message?.content || 'No answer available.';
};
