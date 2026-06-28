// ─── LESSONS ─────────────────────────────────────────────────
function Lessons({ state, onComplete, onStartLesson }) {
  const [lang, setLang] = useState("python");
  return (
    <div>
      <h2 style={S.h2}>📚 Dersler</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["python", "javascript"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={S.navTab(lang === l)}>
            {l === "python" ? "🐍 Python" : "✨ JavaScript"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LESSONS[lang].map((lesson, i) => {
          const done = state.completedLessons.includes(lesson.id);
          const locked = i > 0 && !state.completedLessons.includes(LESSONS[lang][i - 1].id);
          return (
            <div key={lesson.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16, opacity: locked ? 0.5 : 1, border: done ? "1px solid #10b98144" : "1px solid #1e1e2e" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? "#052e16" : locked ? "#0d0d14" : "#1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {done ? "✅" : locked ? "🔒" : "📖"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{lesson.title}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{lesson.description}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <span style={S.tag(lesson.difficulty === "beginner" ? "#10b981" : "#f59e0b")}>{lesson.difficulty}</span>
                  <span style={S.tag("#a78bfa")}>+{lesson.xp} XP</span>
                </div>
              </div>
              {!locked && (
                <button onClick={() => onStartLesson(lesson, lang)} style={S.btn(done ? "outline" : "primary")}>
                  {done ? "Tekrar Et" : "Başla →"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuizPanel({ lesson, lang, onQuizComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [fillInputs, setFillInputs] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [score, setScore] = useState(null);

  const loadQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setFillInputs({});
    setSubmitted(false);
    setAnalysis("");
    setScore(null);
    try {
      const q = await generateQuiz(lesson, lang);
      setQuiz(q);
    } catch {
      // Fallback basit quiz
      setQuiz({
        questions: [
          { id: 1, type: "true_false", question: `${lesson.title} dersi ${lang === "python" ? "Python" : "JavaScript"} diline aittir.`, answer: "true", explanation: "Evet, bu ders o dile aittir." },
          { id: 2, type: "multiple_choice", question: "Aşağıdakilerden hangisi bu dersin ana konusudur?", options: ["A) " + (lesson.content[0] || "Değişkenler"), "B) Dosya işlemleri", "C) Ağ programlama", "D) Veritabanı"], answer: "A", explanation: lesson.content[0] || "İlk konu bu dersin özüdür." },
          { id: 3, type: "fill_blank", question: "Bu ders '" + lesson.topic + "' konusunu kapsar. Konunun adı: ____", answer: lesson.topic, explanation: `Ders konusu: ${lesson.topic}` },
          { id: 4, type: "true_false", question: "Bu dersi tamamlamak " + lesson.xp + " XP kazandırır.", answer: "true", explanation: `Evet, bu ders ${lesson.xp} XP değerindedir.` },
          { id: 5, type: "multiple_choice", question: "Bu dersin zorluğu nedir?", options: ["A) " + lesson.difficulty, "B) expert", "C) legendary", "D) impossible"], answer: "A", explanation: `Ders zorluk seviyesi: ${lesson.difficulty}` }
        ]
      });
    }
    setLoading(false);
  };

  const handleAnswer = (qId, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleFill = (qId, val) => {
    if (submitted) return;
    setFillInputs(prev => ({ ...prev, [qId]: val }));
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    // Merge fill_blank answers into answers
    const allAnswers = { ...answers };
    quiz.questions.forEach(q => {
      if (q.type === "fill_blank") {
        allAnswers[q.id] = (fillInputs[q.id] || "").trim().toLowerCase();
      }
    });

    let correct = 0;
    const results = quiz.questions.map(q => {
      const userAns = (allAnswers[q.id] || "").toString().toLowerCase().trim();
      const correctAns = q.answer.toLowerCase().trim();
      const isCorrect = q.type === "fill_blank"
        ? userAns === correctAns || userAns.includes(correctAns) || correctAns.includes(userAns)
        : userAns === correctAns || userAns === correctAns[0]?.toLowerCase();
      if (isCorrect) correct++;
      return { ...q, userAnswer: allAnswers[q.id] || "", isCorrect };
    });

    const scoreVal = Math.round((correct / quiz.questions.length) * 100);
    setScore({ correct, total: quiz.questions.length, pct: scoreVal, results });
    setSubmitted(true);

    // AI analiz
    setAnalysisLoading(true);
    const wrongOnes = results.filter(r => !r.isCorrect);
    const sys = `Sen bir programlama öğretmenisin. Türkçe, kısa ve net cevap ver. Öğrenciyi motive et.`;
    const msgs = [{
      role: "user",
      content: `Öğrenci "${lesson.title}" dersinin quizinde ${correct}/${quiz.questions.length} aldı (%${scoreVal}).
${wrongOnes.length > 0 ? `Yanlış sorular:\n${wrongOnes.map(r => `- "${r.question}" (Doğru: ${r.answer}, Öğrenci: ${r.userAnswer})`).join("\n")}` : "Tüm soruları doğru yaptı!"}

Kısa analiz yap (3-4 cümle): Hangi konular eksik, ne çalışmalı, genel değerlendirme.`
    }];
    try {
      await callClaude(msgs, sys, (t) => setAnalysis(t));
    } catch { setAnalysis("Analiz yüklenemedi."); }
    setAnalysisLoading(false);

    if (scoreVal >= 60 && onQuizComplete) onQuizComplete(scoreVal);
  };

  const allAnswered = quiz && quiz.questions.every(q => {
    if (q.type === "fill_blank") return (fillInputs[q.id] || "").trim().length > 0;
    return answers[q.id] !== undefined;
  });

  // ── RESULT SCREEN ──
  if (submitted && score) {
    return (
      <div>
        {/* Skor Kartı */}
        <div style={{
          ...S.card,
          textAlign: "center",
          marginBottom: 20,
          border: `1px solid ${score.pct >= 80 ? "#10b98144" : score.pct >= 60 ? "#f59e0b44" : "#dc262644"}`
        }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>
            {score.pct >= 80 ? "🎉" : score.pct >= 60 ? "👍" : "📚"}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: score.pct >= 80 ? "#10b981" : score.pct >= 60 ? "#f59e0b" : "#ef4444" }}>
            %{score.pct}
          </div>
          <div style={{ fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
            {score.correct}/{score.total} doğru
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
            {score.pct >= 80 ? "Mükemmel! Konuyu çok iyi öğrendin." : score.pct >= 60 ? "İyi iş! Birkaç noktayı tekrar et." : "Konuyu tekrar gözden geçirmeyi dene."}
          </div>
        </div>

        {/* Soru Analizi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {score.results.map((r, i) => (
            <div key={r.id} style={{
              ...S.card,
              border: `1px solid ${r.isCorrect ? "#10b98133" : "#dc262633"}`,
              background: r.isCorrect ? "#052e1611" : "#1a0a0a11"
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{r.isCorrect ? "✅" : "❌"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#e2e8f0" }}>
                    <span style={{ color: "#64748b", fontSize: 12, marginRight: 6 }}>S{i + 1}</span>
                    {r.question}
                  </div>
                  {r.type === "multiple_choice" && r.options && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                      {r.options.map((opt, oi) => {
                        const letter = ["A", "B", "C", "D"][oi];
                        const isUserChoice = r.userAnswer?.toString().toUpperCase() === letter ||
                          r.userAnswer === opt || r.userAnswer?.toString().toUpperCase() === r.answer?.toUpperCase() && letter === r.answer?.toUpperCase();
                        const isCorrectOpt = letter.toLowerCase() === r.answer.toLowerCase() || opt.toLowerCase().startsWith(r.answer.toLowerCase() + ")");
                        return (
                          <div key={oi} style={{
                            padding: "4px 10px", borderRadius: 6, fontSize: 13,
                            background: isCorrectOpt ? "#052e16" : (isUserChoice && !r.isCorrect) ? "#1a0a0a" : "transparent",
                            color: isCorrectOpt ? "#10b981" : (isUserChoice && !r.isCorrect) ? "#f87171" : "#64748b",
                            border: `1px solid ${isCorrectOpt ? "#10b98133" : (isUserChoice && !r.isCorrect) ? "#dc262633" : "transparent"}`
                          }}>
                            {opt} {isCorrectOpt ? "✓" : (isUserChoice && !r.isCorrect) ? "✗" : ""}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {r.type === "true_false" && (
                    <div style={{ fontSize: 13, marginBottom: 6, color: "#64748b" }}>
                      Senin cevabın: <span style={{ color: r.isCorrect ? "#10b981" : "#f87171", fontWeight: 600 }}>
                        {r.userAnswer === "true" ? "Doğru ✓" : "Yanlış ✗"}
                      </span>
                      {!r.isCorrect && <span style={{ color: "#10b981", marginLeft: 8 }}>
                        → Doğru cevap: {r.answer === "true" ? "Doğru ✓" : "Yanlış ✗"}
                      </span>}
                    </div>
                  )}
                  {r.type === "fill_blank" && !r.isCorrect && (
                    <div style={{ fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "#f87171" }}>Senin cevabın: "{r.userAnswer}"</span>
                      <span style={{ color: "#10b981", marginLeft: 8 }}>→ Doğru: "{r.answer}"</span>
                    </div>
                  )}
                  <div style={{
                    fontSize: 12, color: "#94a3b8", background: "#0a0a0f",
                    padding: "6px 10px", borderRadius: 6, border: "1px solid #1e1e2e", lineHeight: 1.6
                  }}>
                    💡 {r.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Analizi */}
        <div style={{ ...S.card, border: "1px solid #7c3aed33", marginBottom: 16 }}>
          <h3 style={{ ...S.h3, color: "#a78bfa" }}>🤖 AI Öğretmen Analizi</h3>
          {analysisLoading
            ? <div style={{ color: "#7c3aed", fontSize: 13 }}>Analiz ediliyor●●●</div>
            : <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</div>
          }
        </div>

        {/* Tekrar butonu */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={loadQuiz} style={S.btn("outline")}>🔄 Quizi Tekrar Çöz</button>
        </div>
      </div>
    );
  }
// ── QUIZ FORM ──
  return (
    <div>
      {!quiz && !loading && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <h3 style={{ ...S.h3, color: "#e2e8f0" }}>Konu Testi</h3>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>"{lesson.title}" konusunu ne kadar öğrendin?</p>
          <button onClick={loadQuiz} style={S.btn()}>✨ Testi Başlat</button>
        </div>
      )}
      {loading && (
        <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ color: "#a78bfa", fontSize: 15 }}>AI soruları hazırlıyor...</div>
        </div>
      )}
      {quiz && !submitted && (
        <div>
          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ ...S.h3, margin: 0, color: "#a78bfa" }}>📝 {lesson.title} — Quiz</h3>
              <span style={S.tag("#7c3aed")}>5 Soru</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {quiz.questions.map((q, i) => (
              <div key={q.id} style={{ ...S.card }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#1e1e3a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#a78bfa", flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={S.tag(q.type === "multiple_choice" ? "#06b6d4" : q.type === "true_false" ? "#10b981" : "#f59e0b")}>
                        {q.type === "multiple_choice" ? "Çoktan Seçmeli" : q.type === "true_false" ? "Doğru / Yanlış" : "Boşluk Doldurma"}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "#e2e8f0", margin: 0 }}>{q.question}</p>
                  </div>
                </div>
                {q.type === "multiple_choice" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 36 }}>
                    {q.options.map((opt, oi) => {
                      const letter = ["A","B","C","D"][oi];
                      const selected = answers[q.id] === letter;
                      return (
                        <button key={oi} onClick={() => handleAnswer(q.id, letter)}
                          style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${selected ? "#7c3aed" : "#1e1e2e"}`, background: selected ? "#1e1e3a" : "#0a0a0f", color: selected ? "#a78bfa" : "#94a3b8", cursor: "pointer", textAlign: "left", fontSize: 13 }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
                {q.type === "true_false" && (
                  <div style={{ display: "flex", gap: 10, paddingLeft: 36 }}>
                    {[{ val: "true", label: "✓ Doğru" }, { val: "false", label: "✗ Yanlış" }].map(opt => (
                      <button key={opt.val} onClick={() => handleAnswer(q.id, opt.val)}
                        style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${answers[q.id] === opt.val ? (opt.val === "true" ? "#10b981" : "#ef4444") : "#1e1e2e"}`, background: answers[q.id] === opt.val ? (opt.val === "true" ? "#052e16" : "#1a0a0a") : "#0a0a0f", color: answers[q.id] === opt.val ? (opt.val === "true" ? "#10b981" : "#ef4444") : "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
                {q.type === "fill_blank" && (
                  <div style={{ paddingLeft: 36 }}>
                    <input style={{ ...S.input, maxWidth: 300 }} placeholder="Cevabını yaz..." value={fillInputs[q.id] || ""} onChange={e => handleFill(q.id, e.target.value)} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button onClick={submitQuiz} disabled={!allAnswered}
              style={{ ...S.btn(allAnswered ? "primary" : "outline"), opacity: allAnswered ? 1 : 0.5, fontSize: 15, padding: "10px 28px" }}>
              Testi Bitir & Analiz Et →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function LessonDetail({ lesson, lang, onComplete, onBack, state }) {
  const [tab, setTab] = useState("learn");
  const [code, setCode] = useState(lesson.exercise.starter);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [passed, setPassed] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [pyLoading, setPyLoading] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const runCode = async () => {
    if (lang === "python") {
      setPyLoading(true);
      setOutput("");
      setError("");
      const result = await runPythonReal(code);
      setPyLoading(false);
      setOutput(result.output);
      setError(result.error || "");
      if (!result.error) {
        const allPass = lesson.exercise.tests.every(t => result.output.includes(t));
        if (allPass) { setPassed(true); }
        else { setAttempts(a => a + 1); setError("Beklenen çıktı alınamadı. Egzersiz koşulunu kontrol et."); }
      } else {
        setAttempts(a => a + 1);
      }
    } else {
      const result = runJS(code);
      setOutput(result.output);
      setError(result.error || "");
      if (result.error) {
        setAttempts(a => a + 1);
      } else {
        const allPass = lesson.exercise.tests.every(t => result.output.includes(t));
        if (allPass) { setPassed(true); }
        else { setAttempts(a => a + 1); setError("Beklenen çıktı alınamadı. Egzersiz koşulunu kontrol et."); }
      }
    }
  };

  const getHint = async () => {
    setLoadingHint(true);
    setAiHint("");
    const sys = `Sen LearnPilot AI'ın öğretmen asistanısın. Öğrenciye ASLA direkt cevap verme. Sadece ipucu ver ve yönlendir. Kısa, Türkçe cevap ver.`;
    const msgs = [{ role: "user", content: `Egzersiz: ${lesson.exercise.prompt}\nÖğrencinin kodu:\n${code}\nHata: ${error || "yok"}\nDeneme sayısı: ${attempts}\n\nBana bir ipucu ver.` }];
    try {
      await callClaude(msgs, sys, (t) => setAiHint(t));
    } catch { setAiHint("API bağlantısı kurulamadı."); }
    setLoadingHint(false);
  };

  const tabs = [
    { id: "learn", label: "📖 Öğren" },
    { id: "exercise", label: "💻 Egzersiz" },
    { id: "quiz", label: `📝 Quiz${quizDone ? ` ✅` : ""}` },
  ];

  return (
    <div>
      <button onClick={onBack} style={{ ...S.btn("outline"), marginBottom: 16 }}>← Geri</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h2 style={{ ...S.h2, margin: 0 }}>{lesson.title}</h2>
        <span style={S.tag("#a78bfa")}>+{lesson.xp} XP</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={S.navTab(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* LEARN TAB */}
      {tab === "learn" && (
        <div style={S.card}>
          <h3 style={S.h3}>Ders İçeriği</h3>
          {lesson.content.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px 14px", background: "#0a0a0f", borderRadius: 8, border: "1px solid #1e1e2e" }}>
              <span style={{ color: "#7c3aed", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 14, color: "#cbd5e1" }}>{c}</span>
            </div>
          ))}
          <button onClick={() => setTab("exercise")} style={{ ...S.btn(), marginTop: 12 }}>Egzersize Geç →</button>
        </div>
      )}

      {/* EXERCISE TAB */}
      {tab === "exercise" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ ...S.card, marginBottom: 12 }}>
              <h3 style={S.h3}>📝 Görev</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{lesson.exercise.prompt}</p>
            </div>
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ ...S.h3, margin: 0 }}>💡 AI Yardımı</h3>
                <button onClick={getHint} disabled={loadingHint} style={S.btn("outline")}>
                  {loadingHint ? "Düşünüyor..." : "İpucu Al"}
                </button>
              </div>
              {aiHint && <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, background: "#0a0a0f", padding: 12, borderRadius: 8, border: "1px solid #1e1e3a" }}>{aiHint}</div>}
              {!aiHint && <p style={{ fontSize: 13, color: "#374151" }}>Takılırsan AI'dan ipucu al. Direkt cevap vermez, seni yönlendirir.</p>}
            </div>
          </div>
          <div>
            <div style={{ ...S.card, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ ...S.h3, margin: 0 }}>✏️ Kod Editörü ({lang})</h3>
                <button onClick={runCode} disabled={pyLoading} style={S.btn("success")}>{pyLoading ? "⏳ Çalışıyor..." : "▶️ Çalıştır"}</button>
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ ...S.input, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, minHeight: 160, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
            <div style={S.card}>
              <h3 style={S.h3}>🖥️ Çıktı</h3>
              {error
                ? <div style={{ background: "#1a0a0a", border: "1px solid #dc262644", borderRadius: 8, padding: 12, fontSize: 13, color: "#f87171", fontFamily: "monospace" }}>❌ {error}</div>
                : output
                  ? <div style={{ background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, padding: 12, fontSize: 13, color: "#86efac", fontFamily: "monospace", whiteSpace: "pre" }}>{output}</div>
                  : <div style={{ color: "#374151", fontSize: 13 }}>Henüz kod çalıştırılmadı.</div>
              }
              {passed && (
                <div style={{ marginTop: 12, background: "#052e16", border: "1px solid #10b981", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🎉 Başardın!</div>
                  <div style={{ fontSize: 13, color: "#86efac", marginBottom: 10 }}>Egzersizi tamamladın! Şimdi quizi çözerek konuyu pekiştir.</div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={() => setTab("quiz")} style={S.btn()}>📝 Quize Geç →</button>
                    <button onClick={() => onComplete(lesson)} style={S.btn("success")}>Quizsiz Tamamla</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {tab === "quiz" && (
        <div>
          {quizDone && (
            <div style={{ ...S.card, marginBottom: 16, background: "#052e16", border: "1px solid #10b98144", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✅ Quiz Tamamlandı!</div>
              <div style={{ fontSize: 13, color: "#86efac", marginBottom: 10 }}>
                Puanın: %{quizScore} — Artık dersi tamamlayabilirsin!
              </div>
              <button onClick={() => onComplete(lesson)} style={S.btn("success")}>
                Dersi Tamamla & XP Kazan →
              </button>
            </div>
          )}
          <QuizPanel
            lesson={lesson}
            lang={lang}
            onQuizComplete={(score) => {
              setQuizDone(true);
              setQuizScore(score);
            }}
          />
        </div>
      )}
    </div>
  );
}
