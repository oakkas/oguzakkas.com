// Calls Gemini's generateContent endpoint and sorts the outcome into ok / busy /
// blocked / error, so each Netlify Function only decides what to tell the visitor.

export type GeminiOutcome =
  | { kind: 'ok'; text: string; ms: number; inputTokens: number; outputTokens: number }
  | { kind: 'busy'; retryAfter: number }
  | { kind: 'blocked' }
  | { kind: 'error' };

export const callGemini = async (apiKey: string, model: string, body: unknown, timeoutMs = 20_000): Promise<GeminiOutcome> => {
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    console.error('Gemini request failed', error);
    return { kind: 'error' };
  }

  if (res.status === 429) {
    // Gemini says how long to wait in a RetryInfo detail, e.g. "retryDelay": "23s"
    const delay = (await res.text()).match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
    return { kind: 'busy', retryAfter: delay ? Math.max(1, Math.ceil(Number(delay[1]))) : 60 };
  }
  if (!res.ok) {
    console.error('Gemini error', res.status, await res.text());
    return { kind: 'error' };
  }

  const data = await res.json();
  if (data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason === 'SAFETY') {
    return { kind: 'blocked' };
  }
  const parts: { text?: string; thought?: boolean }[] = data?.candidates?.[0]?.content?.parts ?? [];
  const usage = data?.usageMetadata ?? {};
  return {
    kind: 'ok',
    text: parts.filter(p => !p.thought).map(p => p.text ?? '').join(''),
    ms: Date.now() - started,
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0),
  };
};

export const busyResponse = (error: string, retryAfter: number) =>
  Response.json({ error, retryAfter }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
