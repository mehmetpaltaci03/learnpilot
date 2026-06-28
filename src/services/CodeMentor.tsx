// ─── CODE MENTOR ─────────────────────────────────────────────
function CodeMentor() {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState("// Kodunu buraya yaz\nconsole.log('Merhaba Dünya!');");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const [pyLoading, setPyLoading] = useState(false);

  const run = async () => {
    if (lang === "python") {
      setPyLoading(true);
      setOutput("");
      setError("");
      const result = await runPythonReal(code);
      setPyLoading(false);
      setOutput(result.output);
      setError(result.error || "");
      if (result.error) analyzeError(result.error);
    } else {
      const result = runJS(code);
      setOutput(result.output);
      setError(result.error || "");
      if (result.error) analyzeError(result.error);
    }
  };

  const analyzeError = async (err) => {
    setLoading(true);
    setAnalysis("");
    const sys = `Sen bir kod mentor asistanısın. Türkçe, kısa ve net cevap ver.
Hataları basitçe açıkla ve 2 farklı çözüm öner. Emoji kullan.`;
    const msgs = [{ role: "user", content: `Dil: ${lang}\nKod:\n${code}\nHata: ${err}\n\nHatayı açıkla ve 2 çözüm öner.` }];
    try {
      await callClaude(msgs, sys, (t) => setAnalysis(t));
    } catch { setAnalysis("API bağlantısı kurulamadı."); }
    setLoading(false);
  };

  const analyzeManual = async () => {
    setLoading(true);
    setAnalysis("");
    const sys = `Sen bir kod mentor asistanısın. Türkçe, kısa ve net cevap ver.
Kodu incele, potansiyel sorunları ve iyileştirme önerilerini belirt.`;
    const msgs = [{ role: "user", content: `Dil: ${lang}\nKod:\n${code}\n\nBu kodu incele ve geri bildirim ver.` }];
    try {
      await callClaude(msgs, sys, (t) => setAnalysis(t));
    } catch { setAnalysis("API bağlantısı kurulamadı."); }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={S.h2}>🔍 Kod Mentor</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["javascript", "python"].map(l => (
          <button key={l} onClick={() => { setLang(l); setCode(l === "python" ? "# Python kodunu buraya yaz\nprint('Merhaba Dünya!')" : "// JS kodunu buraya yaz\nconsole.log('Merhaba Dünya!');"); setOutput(""); setError(""); setAnalysis(""); }} style={S.navTab(lang === l)}>
            {l === "python" ? "🐍 Python" : "✨ JavaScript"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ ...S.h3, margin: 0 }}>✏️ Editör</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={analyzeManual} disabled={loading} style={S.btn("outline")}>🔍 Analiz Et</button>
                <button onClick={run} disabled={pyLoading} style={S.btn("success")}>{pyLoading ? "⏳ Çalışıyor..." : "▶ Çalıştır"}</button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ ...S.input, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 240, resize: "vertical", lineHeight: 1.6 }}
            />
          </div>
        </div>
        <div>
          <div style={{ ...S.card, marginBottom: 12 }}>
            <h3 style={S.h3}>🖥️ Çıktı</h3>
            {error
              ? <div style={{ background: "#1a0a0a", border: "1px solid #dc262644", borderRadius: 8, padding: 12, fontSize: 13, color: "#f87171", fontFamily: "monospace", minHeight: 60 }}>❌ {error}</div>
              : output
                ? <div style={{ background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, padding: 12, fontSize: 13, color: "#86efac", fontFamily: "monospace", whiteSpace: "pre", minHeight: 60 }}>{output}</div>
                : <div style={{ color: "#374151", fontSize: 13, padding: 12 }}>Kod çalıştırılmadı.</div>
            }
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>🤖 AI Mentor Analizi</h3>
            {loading && <div style={{ color: "#7c3aed", fontSize: 13 }}>Analiz ediliyor●●●</div>}
            {analysis
              ? <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</div>
              : !loading && <div style={{ color: "#374151", fontSize: 13 }}>Kodu çalıştır veya "Analiz Et"e bas.</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

