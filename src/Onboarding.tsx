"use client";

import { useState } from "react";
// ─── ONBOARDING ──────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState("");
  const [style, setStyle] = useState("");

  const levels = [
    { id: "beginner", label: "Yeni Başlayan", emoji: "🌱", desc: "Hiç kod yazmadım" },
    { id: "intermediate", label: "Orta Seviye", emoji: "⚡", desc: "Temel bilgim var" },
    { id: "advanced", label: "İleri Seviye", emoji: "🔥", desc: "Deneyimliyim" },
  ];
  const styles = [
    { id: "visual", label: "Görsel Öğrenen", emoji: "👁️", desc: "Örneklerle öğrenirim" },
    { id: "practice", label: "Pratik Yapan", emoji: "💻", desc: "Yaparak öğrenirim" },
    { id: "theory", label: "Teorik", emoji: "📚", desc: "Önce mantığı anlarım" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>LearnPilot AI</h1>
        <p style={{ color: "#64748b", marginBottom: 32 }}>AI destekli kişisel programlama öğretmeni</p>

        {step === 0 && (
          <div>
            <h2 style={{ ...S.h2, marginBottom: 20 }}>Seviyeni seç</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {levels.map(l => (
                <button key={l.id} onClick={() => setLevel(l.id)}
                  style={{ padding: "14px 20px", borderRadius: 10, border: `2px solid ${level === l.id ? "#7c3aed" : "#1e1e2e"}`, background: level === l.id ? "#1e1e3a" : "#0d0d14", color: "#e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{l.emoji}</span>
                  <div><div style={{ fontWeight: 600 }}>{l.label}</div><div style={{ fontSize: 12, color: "#64748b" }}>{l.desc}</div></div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!level} style={S.btn()}>Devam →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ ...S.h2, marginBottom: 20 }}>Öğrenme tarzın?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {styles.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  style={{ padding: "14px 20px", borderRadius: 10, border: `2px solid ${style === s.id ? "#06b6d4" : "#1e1e2e"}`, background: style === s.id ? "#0e2830" : "#0d0d14", color: "#e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <div><div style={{ fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: 12, color: "#64748b" }}>{s.desc}</div></div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setStep(0)} style={S.btn("outline")}>← Geri</button>
              <button onClick={() => onDone(level, style)} disabled={!style} style={S.btn()}>Başla! 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function PlanScreen({ level, learningStyle, onDone }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const levelLabels = {
    beginner: { label: "Yeni Başlayan", emoji: "🌱", color: "#10b981" },
    intermediate: { label: "Orta Seviye", emoji: "⚡", color: "#f59e0b" },
    advanced: { label: "İleri Seviye", emoji: "🔥", color: "#ef4444" },
  };
  const styleLabels = {
    visual: "Görsel Öğrenen",
    practice: "Pratik Yapan",
    theory: "Teorik",
  };

  const lv = levelLabels[level] || levelLabels.beginner;

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    setError(false);
    setPlan(null);

    const sys = `Sen bir programlama eğitim uzmanısın. SADECE JSON döndür, başka hiçbir şey yazma. Markdown veya açıklama ekleme.
Format (tam olarak bu yapıda):
{
  "weekly_goal": "...",
  "weekly_summary": "...",
  "days": [
    { "day": "Pazartesi", "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Salı",      "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Çarşamba",  "focus": "...", "tasks": ["...", "..."], "duration": "45 dk" },
    { "day": "Perşembe",  "focus": "...", "tasks": ["...", "..."], "duration": "30 dk" },
    { "day": "Cuma",      "focus": "...", "tasks": ["...", "..."], "duration": "45 dk" },
    { "day": "Cumartesi", "focus": "...", "tasks": ["...", "...", "..."], "duration": "60 dk" },
    { "day": "Pazar",     "focus": "...", "tasks": ["...", "..."], "duration": "20 dk" }
  ],
  "focus_topics": ["...", "...", "..."],
  "first_lesson": "...",
  "motivation": "..."
}`;

    const levelContext = {
      beginner: "Hiç programlama bilmiyorlar. Python ile başlamalılar. Değişkenler, print, temel işlemler, if/else, for döngüsü konularına odaklan. Çok basit görevler ver.",
      intermediate: "Temel programlama bilgileri var. Fonksiyonlar, listeler, sözlükler, hata yönetimi konularını pekiştirmeye odaklan. Orta zorlukta görevler.",
      advanced: "Deneyimli programcı. OOP, dosya işlemleri, async, modüller gibi ileri konulara odaklan. Proje bazlı görevler ver.",
    };
    const styleContext = {
      visual: "Görsel öğreniyor: örnekler ve adım adım açıklamalar öner.",
      practice: "Yaparak öğreniyor: bol egzersiz ve mini projeler öner.",
      theory: "Teorik öğreniyor: kavramsal açıklamalar ve mantık soruları öner.",
    };

    const msgs = [{
      role: "user",
      content: `Öğrenci seviyesi: ${level} (${levelContext[level]})
Öğrenme tarzı: ${learningStyle} (${styleContext[learningStyle]})

Bu öğrenci için 1 haftalık kişisel programlama planı oluştur. Türkçe yaz. Her görev somut ve yapılabilir olsun.`
    }];

    try {
      let raw = "";
      await callClaude(msgs, sys, (t) => { raw = t; });
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPlan(parsed);
    } catch {
      // Fallback plan
      const fallbacks = {
        beginner: {
          weekly_goal: "Python'a giriş yap ve temel kavramları öğren",
          weekly_summary: "Bu hafta programlamaya ilk adımını atıyorsun. Adım adım, sabırla ilerle.",
          days: [
            { day: "Pazartesi", focus: "Değişkenler & Print", tasks: ["py1 dersini aç ve oku", "print() ile kendi adını yazdır"], duration: "30 dk" },
            { day: "Salı", focus: "Sayısal İşlemler", tasks: ["py2 dersini tamamla", "Hesap makinesi kodu yaz"], duration: "30 dk" },
            { day: "Çarşamba", focus: "String İşlemleri", tasks: ["py3 dersini bitir", "Kendi adını büyük harfle yazdır"], duration: "45 dk" },
            { day: "Perşembe", focus: "Koşullar", tasks: ["py5 dersini oku", "Not hesaplama kodu yaz"], duration: "30 dk" },
            { day: "Cuma", focus: "Döngüler", tasks: ["py6 dersini tamamla", "1-100 arası sayıları yazdır"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Mini Proje", tasks: ["Öğrendiklerini kullan", "Basit bir quiz programı yaz", "AI Tutor'a sor"], duration: "60 dk" },
            { day: "Pazar", focus: "Tekrar", tasks: ["Hataları gözden geçir", "Sonraki haftayı planla"], duration: "20 dk" },
          ],
          focus_topics: ["Değişkenler", "Koşullar", "Döngüler"],
          first_lesson: "Değişkenler & Veri Tipleri",
          motivation: "Her uzman birer zamanlar başlangıç noktasındaydı. Bugün attığın adım, yarının temeli!",
        },
        intermediate: {
          weekly_goal: "Fonksiyonlar ve veri yapılarında ustalaş",
          weekly_summary: "Bu hafta Python'un güçlü özelliklerini keşfedeceksin.",
          days: [
            { day: "Pazartesi", focus: "Fonksiyonlar", tasks: ["py8 ve py9 derslerini oku", "3 farklı fonksiyon yaz"], duration: "30 dk" },
            { day: "Salı", focus: "Listeler", tasks: ["py10 dersini tamamla", "List comprehension egzersizi"], duration: "30 dk" },
            { day: "Çarşamba", focus: "Sözlükler", tasks: ["py11 dersini bitir", "Adres defteri kodu yaz"], duration: "45 dk" },
            { day: "Perşembe", focus: "Hata Yönetimi", tasks: ["py13 dersini oku", "try/except egzersizi yap"], duration: "30 dk" },
            { day: "Cuma", focus: "JS Temelleri", tasks: ["js1 ve js6 derslerini aç", "Arrow function yaz"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Proje", tasks: ["Öğrenci not sistemi yaz", "Dict ve listeler kullan", "Hata yönetimi ekle"], duration: "60 dk" },
            { day: "Pazar", focus: "Tekrar", tasks: ["Projeyi gözden geçir", "AI Tutor'dan feedback al"], duration: "20 dk" },
          ],
          focus_topics: ["Fonksiyonlar", "Veri Yapıları", "Hata Yönetimi"],
          first_lesson: "Fonksiyon Temelleri",
          motivation: "Temel bilgilerin var — şimdi onları gerçek projelere dönüştür!",
        },
        advanced: {
          weekly_goal: "OOP ve ileri JavaScript kavramlarını pekiştir",
          weekly_summary: "Bu hafta yazılım mimarisi odaklı çalışacaksın.",
          days: [
            { day: "Pazartesi", focus: "Python OOP", tasks: ["py15 dersini oku", "Kendi class'ını tasarla"], duration: "45 dk" },
            { day: "Salı", focus: "JS Closure", tasks: ["js13 dersini bitir", "3 farklı closure yaz"], duration: "30 dk" },
            { day: "Çarşamba", focus: "JS Class & Miras", tasks: ["js14 tamamla", "Hayvan hiyerarşisi kur"], duration: "45 dk" },
            { day: "Perşembe", focus: "Async/Generator", tasks: ["js11 ve js15 oku", "Generator ile Fibonacci"], duration: "30 dk" },
            { day: "Cuma", focus: "Hata & Refactor", tasks: ["Mevcut kodlarını gözden geçir", "Hata yönetimi ekle"], duration: "45 dk" },
            { day: "Cumartesi", focus: "Büyük Proje", tasks: ["OOP ile mini kütüphane sistemi yaz", "Hata yönetimi ile sardır", "Test et"], duration: "90 dk" },
            { day: "Pazar", focus: "Kod İncelemesi", tasks: ["Kod Mentor ile analiz et", "İyileştirmeler yap"], duration: "30 dk" },
          ],
          focus_topics: ["OOP", "Closure", "Generator"],
          first_lesson: "OOP: Sınıflar & Nesneler",
          motivation: "Gerçek usta sürekli öğrenir. Bu haftaki hedefin: sadece kod yazmak değil, güzel kod yazmak!",
        },
      };
      setPlan(fallbacks[level] || fallbacks.beginner);
    }
    setLoading(false);
  };

  const dayColors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0",
      fontFamily: "'Inter', system-ui, sans-serif", padding: "24px",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            Kişisel Planın Hazırlanıyor
          </h1>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ background: lv.color + "22", color: lv.color, border: `1px solid ${lv.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
              {lv.emoji} {lv.label}
            </span>
            <span style={{ background: "#06b6d422", color: "#06b6d4", border: "1px solid #06b6d444", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
              {styleLabels[learningStyle]}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⏳</div>
            <p style={{ color: "#64748b", fontSize: 15 }}>AI senin için özel plan hazırlıyor...</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#7c3aed",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
          </div>
        )}

        {/* Plan */}
        {!loading && plan && (
          <div>
            {/* Haftalık Hedef */}
            <div style={{ background: "#0d0d14", border: "1px solid #7c3aed44", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>HAFTALIK HEDEF</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{plan.weekly_goal}</div>
                  {plan.weekly_summary && <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{plan.weekly_summary}</div>}
                </div>
              </div>
            </div>

            {/* Günlük Program */}
            <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                📅 7 Günlük Program
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.days.map((day, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "12px 14px", borderRadius: 10,
                    background: "#0a0a0f", border: `1px solid ${dayColors[i]}22`,
                    borderLeft: `3px solid ${dayColors[i]}`,
                  }}>
                    <div style={{ flexShrink: 0, minWidth: 90 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: dayColors[i] }}>{day.day}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>⏱ {day.duration}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 4 }}>{day.focus}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {day.tasks.map((task, j) => (
                          <div key={j} style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 6, alignItems: "flex-start" }}>
                            <span style={{ color: dayColors[i], flexShrink: 0, marginTop: 1 }}>›</span>
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt Bilgiler */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#0d0d14", border: "1px solid #06b6d444", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>ODAK KONULARI</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {plan.focus_topics.map(t => (
                    <span key={t} style={{ background: "#06b6d422", color: "#06b6d4", border: "1px solid #06b6d444", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#0d0d14", border: "1px solid #f59e0b44", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>💡 MOTİVASYON</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{plan.motivation}</div>
              </div>
            </div>

            {/* İlk Ders Önerisi */}
            {plan.first_lesson && (
              <div style={{ background: "#1e1e3a", border: "1px solid #7c3aed44", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🚀</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 2 }}>BUGÜN BAŞLA</div>
                  <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{plan.first_lesson}</div>
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={generatePlan} style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #2d2d4e",
                background: "#1e1e2e", color: "#a78bfa", cursor: "pointer",
                fontSize: 13, fontWeight: 600,
              }}>
                🔄 Yeniden Oluştur
              </button>
              <button onClick={onDone} style={{
                padding: "12px 32px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 700,
              }}>
                Platforma Gir! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Onboarding;
