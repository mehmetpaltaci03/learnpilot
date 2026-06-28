// ─── MAIN APP ────────────────────────────────────────────────
export default function LearnPilotAI() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(true);
  const [planShown, setPlanShown] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [tab, setTab] = useState(() => localStorage.getItem("lp_tab") || "dashboard");
  const changeTab = (newTab) => {
  setTab(newTab);
  localStorage.setItem("lp_tab", newTab);
};
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeLang, setActiveLang] = useState("python");
  const [state, setState] = useState({
    xp: 0, streak: 1, level: "beginner", learningStyle: "practice",
    completedLessons: [], weakTopics: [],
  });

  // Oturum kontrolü ve veri yükleme
useEffect(() => {
  const loadSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const u = session?.user ?? null;

    setUser(u);

    if (!u) {
      setProfileLoaded(true);
      setAuthLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", u.id)
      .maybeSingle();

    if (error) {
      console.error("Profile okunamadı:", error);
      setOnboarded(false);
      setPlanShown(false);
      setProfileLoaded(true);
      setAuthLoading(false);
      return;
    }

    if (profile) {
      setState(s => ({
        ...s,
        xp: profile.xp || 0,
        streak: profile.streak || 1,
        completedLessons: profile.completed_lessons || [],
        weakTopics: profile.weak_topics || [],
        level: profile.level || "beginner",
        learningStyle: profile.learning_style || "practice",
      }));

      setOnboarded(Boolean(profile.onboarded));
      setPlanShown(Boolean(profile.onboarded));
    } else {
      setOnboarded(false);
      setPlanShown(false);
    }

    setProfileLoaded(true);
    setAuthLoading(false);
  };

  loadSession();
}, []);
  
  const handleOnboard = async (level, style) => {
  const { data: { user: u } } = await supabase.auth.getUser();
  if (!u) return;

  const { error } = await supabase.from("profiles").upsert({
    id: u.id,
    onboarded: true,
    level,
    learning_style: style,
    xp: state.xp || 0,
    streak: state.streak || 1,
    completed_lessons: state.completedLessons || [],
    weak_topics: state.weakTopics || [],
  }, { onConflict: "id" });

  if (error) {
    console.error("Profile kaydedilemedi:", error);
    alert("Profil kaydedilemedi: " + error.message);
    return;
  }

  setState(s => ({ ...s, level, learningStyle: style }));
  setOnboarded(true);
  setPlanShown(false);
};
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOnboarded(false);
  };

 const handleComplete = async (lesson) => {
  const already = state.completedLessons.includes(lesson.id);

  const nextXp = already ? state.xp : state.xp + lesson.xp;
  const nextCompletedLessons = already
    ? state.completedLessons
    : [...state.completedLessons, lesson.id];

  setState(s => ({
    ...s,
    xp: nextXp,
    completedLessons: nextCompletedLessons,
  }));

  const { data: { user: u } } = await supabase.auth.getUser();

  if (u) {
    const { error } = await supabase.from("profiles").upsert({
      id: u.id,
      xp: nextXp,
      completed_lessons: nextCompletedLessons,
      onboarded: true,
      level: state.level,
      learning_style: state.learningStyle,
      streak: state.streak || 1,
      weak_topics: state.weakTopics || [],
    }, { onConflict: "id" });

    if (error) {
      console.error("Ders kaydedilemedi:", error);
      alert("Ders kaydedilemedi: " + error.message);
      return;
    }
  }

  setActiveLesson(null);
  changeTab("lessons");
};

  if (authLoading || (user && !profileLoaded)) return (
  <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ color: "#7c3aed", fontSize: 18 }}>Yükleniyor...</div>
  </div>
);

if (!user) return <AuthScreen onAuth={setUser} />;

if (!onboarded) return <Onboarding onDone={handleOnboard} />;

if (!planShown) {
  return (
    <PlanScreen
      level={state.level}
      learningStyle={state.learningStyle}
      onDone={() => setPlanShown(true)}
    />
  );
}
  const level = getLevel(state.xp);
  const navItems = [
    { id: "dashboard", label: "📊 Kontrol Paneli" },
    { id: "lessons", label: "📚 Dersler" },
    { id: "tutor", label: "🤖 AI Tutor" },
    { id: "mentor", label: "🔍 Kod Mentor" },
    { id: "path", label: "🗺️ Yol Haritası" },
  ];

  return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.navLogo}>LearnPilot AI</div>
        <div style={S.navTabs}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setActiveLesson(null); }} style={S.navTab(tab === n.id && !activeLesson)}>
              {n.label}
            </button>
          ))}
        </div>
        <div style={S.navRight}>
          <span style={S.xpBadge}>Lv.{level} • {state.xp} XP</span>
          <span style={{ fontSize: 13, color: "#f59e0b" }}>{state.streak}🔥</span>
          <button onClick={handleLogout} style={{ ...S.btn("outline"), padding: "4px 12px", fontSize: 12 }}>Çıkış</button>
        </div>
      </nav>
      <main style={S.main}>
        {activeLesson
          ? <LessonDetail lesson={activeLesson} lang={activeLang} onComplete={handleComplete} onBack={() => setActiveLesson(null)} state={state} />
          : tab === "dashboard" ? <Dashboard state={state} />
          : tab === "lessons" ? <Lessons state={state} onComplete={handleComplete} onStartLesson={(l, lang) => { setActiveLesson(l); setActiveLang(lang); }} />
          : tab === "tutor" ? <AITutor state={state} />
          : tab === "mentor" ? <CodeMentor />
          : <LearningPath state={state} onNavigate={(t) => setTab(t)} />
        }
      </main>
    </div>
  );
}
