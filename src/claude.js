// ─── CLAUDE API CALL ─────────────────────────────────────────
async function callClaude(messages, systemPrompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
      stream: true,
    })
  });
  if (!res.ok) throw new Error("API error");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === "content_block_delta" && data.delta?.text) {
          full += data.delta.text;
          onChunk(full);
        }
      } catch {}
    }
  }
  return full;
}
// ─── QUIZ DATA GENERATOR (Claude API) ───────────────────────
// Bu fonksiyonu callClaude ile birlikte dosyanın üst kısmına ekle
async function generateQuiz(lesson, lang) {
  const sys = `Sen bir programlama eğitim uzmanısın. SADECE JSON döndür, markdown veya açıklama ekleme.
Format (tam olarak bu yapıda, 5 soru):
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A",
      "explanation": "Çünkü ..."
    },
    {
      "id": 2,
      "type": "true_false",
      "question": "...",
      "answer": "true",
      "explanation": "Çünkü ..."
    },
    {
      "id": 3,
      "type": "fill_blank",
      "question": "print(____) fonksiyonu ekrana yazı yazdırır.",
      "answer": "print",
      "explanation": "Çünkü ..."
    },
    {
      "id": 4,
      "type": "multiple_choice",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "B",
      "explanation": "Çünkü ..."
    },
    {
      "id": 5,
      "type": "true_false",
      "question": "...",
      "answer": "false",
      "explanation": "Çünkü ..."
    }
  ]
}`;

  const msgs = [{
    role: "user",
    content: `Dil: ${lang}\nDers: ${lesson.title}\nKonu: ${lesson.description}\nİçerik:\n${lesson.content.join("\n")}\n\nBu ders için 5 soruluk quiz hazırla (2 çoktan seçmeli, 2 doğru/yanlış, 1 boşluk doldurma). Türkçe.`
  }];

  let raw = "";
  await callClaude(msgs, sys, (t) => { raw = t; });
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// Simple JS sandbox
function runJS(code) {
  const logs = [];
  const fakeConsole = { log: (...args) => logs.push(args.map(String).join(" ")) };
  try {
    const fn = new Function("console", code);
    fn(fakeConsole);
    return { output: logs.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e.message };
  }
}

// Pyodide real Python runner
let pyodideInstance = null;
let pyodideLoading = false;

async function loadPyodideOnce() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) {
    while (pyodideLoading) await new Promise(r => setTimeout(r, 100));
    return pyodideInstance;
  }
  pyodideLoading = true;
  try {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
    pyodideLoading = false;
    return pyodideInstance;
  } catch (e) {
    pyodideLoading = false;
    throw e;
  }
}

async function runPythonReal(code) {
  try {
    const pyodide = await loadPyodideOnce();
    let output = "";
    pyodide.setStdout({ batched: (text) => { output += text + "\n"; } });
    pyodide.setStderr({ batched: (text) => { output += text + "\n"; } });
    await pyodide.runPythonAsync(code);
    return { output: output.trim(), error: null };
  } catch (e) {
    const msg = e.message || String(e);
    const clean = msg.includes("Error") ? msg.split("\n").filter(l => l.includes("Error") || l.includes("error")).join("\n") || msg : msg;
    return { output: "", error: clean };
  }
}

// Python simulation (basic) - fallback only
function runPython(code) {
  const logs = [];
  try {
    let c = code
      .replace(/print\((.*?)\)/g, (_, args) => `__LOG__(${args})`)
      .replace(/f"([^"]*)"/g, (_, s) => `\`${s.replace(/\{([^}]+)\}/g, "${$1}")}\``)
      .replace(/f'([^']*)'/g, (_, s) => `\`${s.replace(/\{([^}]+)\}/g, "${$1}")}\``)
      .replace(/elif /g, "else if ")
      .replace(/True/g, "true").replace(/False/g, "false").replace(/None/g, "null")
      .replace(/def (\w+)\((.*?)\):/g, "function $1($2) {")
      .replace(/for (\w+) in range\((\d+),\s*(\d+)\):/g, "for (let $1 = $2; $1 < $3; $1++) {")
      .replace(/for (\w+) in range\((\d+)\):/g, "for (let $1 = 0; $1 < $2; $1++) {")
      .replace(/for (\w+) in (\w+):/g, "for (const $1 of $2) {")
      .replace(/if (.+?):/g, "if ($1) {")
      .replace(/else:/g, "} else {")
      .replace(/^\s{4}/gm, "  ");
    // Add closing braces heuristically
    const lines = c.split("\n");
    const processed = [];
    lines.forEach((line, i) => {
      processed.push(line);
      if (line.includes("{") && !line.includes("}")) {
        const next = lines[i + 1];
        if (next !== undefined && !next.trim().startsWith("if") && !next.trim().startsWith("else") && !next.trim().startsWith("for") && !next.trim().startsWith("while") && !next.trim().startsWith("function") && !next.includes("{")) {
          // will close after
        }
      }
    });
    c = processed.join("\n");
    const fn = new Function("__LOG__", c);
    fn((...args) => logs.push(args.map(String).join(" ")));
    return { output: logs.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e.message };
  }
}
