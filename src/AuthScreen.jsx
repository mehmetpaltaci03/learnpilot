// ─── AUTH SCREEN ─────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    if (!email || !password) { setError("Email ve şifre gerekli."); setLoading(false); return; }
    if (password.length < 6) { setError("Şifre en az 6 karakter olmalı."); setLoading(false); return; }

    if (mode === "register") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); }
      else { setSuccess("Kayıt başarılı! Email onayı gerekebilir."); }
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("Email veya şifre hatalı."); }
      else { onAuth(data.user); }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>LearnPilot AI</h1>
        <p style={{ color: "#64748b", marginBottom: 32, fontSize: 14 }}>AI destekli kişisel programlama öğretmeni</p>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#0d0d14", borderRadius: 10, padding: 4, marginBottom: 24, border: "1px solid #1e1e2e" }}>
          {(["login", "register"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                background: mode === m ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "transparent",
                color: mode === m ? "#fff" : "#64748b" }}>
              {m === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          <input
            type="email" placeholder="Email adresiniz" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ ...S.input, fontSize: 15, padding: "12px 16px" }}
          />
          <input
            type="password" placeholder="Şifre (min. 6 karakter)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ ...S.input, fontSize: 15, padding: "12px 16px" }}
          />
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "#1a0a0a", borderRadius: 8, border: "1px solid #7f1d1d" }}>{error}</div>}
        {success && <div style={{ color: "#34d399", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "#0a1a12", borderRadius: 8, border: "1px solid #064e3b" }}>{success}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...S.btn(), width: "100%", padding: "12px 0", fontSize: 15 }}>
          {loading ? "⏳ Lütfen bekleyin..." : mode === "login" ? "Giriş Yap →" : "Hesap Oluştur →"}
        </button>
      </div>
    </div>
  );
}
