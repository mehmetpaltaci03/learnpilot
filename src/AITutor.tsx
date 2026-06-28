// ─── AI TUTOR ────────────────────────────────────────────────
function AITutor({ state }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben LearnPilot AI'ın öğretmen asistanıyım. 🎓\n\nSana programlamayı öğretmek için buradayım. Ama dikkat — direkt cevap vermem! Seni düşündürerek öğreteceğim.\n\nHangi konuda yardım istiyorsun?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const SYSTEM = `Sen LearnPilot AI'ın Sokratik öğretmen asistanısın. Türkçe konuş.

KURALLAR:
- ASLA direkt cevap verme. Önce düşündür, ipucu ver.
- Sorular sor: "Sence ne olur?", "Bu mantıklı mı?"
- Hataları açıkla ama çözümü söyleme, yönlendir.
- Öğrencinin seviyesi: ${state.level}
- Tamamlanan dersler: ${state.completedLessons.length} ders
- Kısa ve net cevaplar ver (maks 3-4 cümle)
- Kod örnekleri ver ama eksik bırak, tamamlamasını iste`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const usage = getDailyUsage();
    if (usage.count >= DAILY_LIMIT) {
      setMessages(m => [...m, { role: "assistant", content: `⛔ Günlük ${DAILY_LIMIT} mesaj limitine ulaştınız! Yarın tekrar kullanabilirsiniz. 🌙` }]);
      setInput("");
      return;
    }
    incrementDailyUsage();
    const userMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    const aiMsg = { role: "assistant", content: "" };
    setMessages(m => [...m, aiMsg]);
    try {
      const apiMsgs = newMsgs.map(m => ({ role: m.role, content: m.content }));
      await callClaude(apiMsgs, SYSTEM, (t) => {
        setMessages(m => [...m.slice(0, -1), { role: "assistant", content: t }]);
      });
    } catch (e) {
      setMessages(m => [...m.slice(0, -1), { role: "assistant", content: "⚠️ Bağlantı hatası. Lütfen tekrar dene." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <h2 style={S.h2}>🤖 AI Tutor</h2>
      <div style={{ ...S.card, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "#1e1e2e", color: m.role === "user" ? "#fff" : "#e2e8f0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {m.content || <span style={{ color: "#64748b" }}>●●●</span>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ borderTop: "1px solid #1e1e2e", paddingTop: 12 }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, textAlign: "right" }}>
            🔋 Günlük kalan: {Math.max(0, DAILY_LIMIT - getDailyUsage().count)}/{DAILY_LIMIT} mesaj
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={S.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Soruyu yaz... (Enter ile gönder)"
              disabled={loading}
            />
            <button onClick={send} disabled={loading} style={{ ...S.btn(), flexShrink: 0 }}>
              {loading ? "⏳" : "Gönder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
