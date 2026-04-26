import Link from "next/link";

const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0", bg:"#FEF6EC" };

export default function LandingPage() {
  return (
    <main style={{ minHeight:"100vh", background:`linear-gradient(135deg, #F4F1F6 0%, ${P.bg} 60%, #FDF8F8 100%)`, display:"flex", flexDirection:"column", overflow:"auto" }}>
      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 40px", borderBottom:`1px solid ${P.blush}33`, background:"rgba(255,253,249,0.8)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:P.plum, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:P.cream, fontSize:13, fontFamily:"Georgia,serif", fontWeight:600 }}>M</span>
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:600, color:P.plum, letterSpacing:"-0.3px" }}>MindTrace</span>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Link href="/login" style={{ padding:"8px 18px", borderRadius:10, border:`1px solid ${P.blush}`, color:P.mauve, fontSize:13, fontWeight:500, textDecoration:"none", background:"white" }}>
            Sign in
          </Link>
          <Link href="/register" style={{ padding:"8px 18px", borderRadius:10, background:P.plum, color:P.cream, fontSize:13, fontWeight:500, textDecoration:"none", boxShadow:`0 4px 14px ${P.plum}40` }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"80px 24px 60px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"white", border:`1px solid ${P.blush}`, borderRadius:999, padding:"6px 16px", marginBottom:32, boxShadow:`0 2px 8px ${P.blush}40` }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:P.blush, display:"inline-block" }} />
          <span style={{ fontSize:12, color:P.mauve, fontWeight:500 }}>AI-powered emotional insight</span>
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:64, fontWeight:400, color:P.plum, lineHeight:1.1, marginBottom:20, letterSpacing:"-1px", maxWidth:640 }}>
          Write freely.<br />
          <span style={{ fontStyle:"italic", fontWeight:300, color:P.mauve }}>Understand yourself.</span>
        </h1>
        <p style={{ fontSize:15, color:P.mauve, maxWidth:440, lineHeight:1.7, marginBottom:40 }}>
          MindTrace uses AI to analyze your journal entries, detect emotional patterns, and deliver compassionate insights — so you can know yourself better over time.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <Link href="/register" style={{ padding:"13px 32px", borderRadius:12, background:P.plum, color:P.cream, fontSize:14, fontWeight:500, textDecoration:"none", boxShadow:`0 4px 20px ${P.plum}40` }}>
            Start journaling free →
          </Link>
          <Link href="/login" style={{ padding:"13px 24px", borderRadius:12, border:`1px solid ${P.blush}`, color:P.mauve, fontSize:14, fontWeight:500, textDecoration:"none", background:"white" }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ maxWidth:860, margin:"0 auto", padding:"0 24px 80px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { icon:"✦", title:"AI Analysis", desc:"Every entry is analyzed for mood, emotions, and themes with a personal, compassionate insight." },
          { icon:"◎", title:"Pattern Detection", desc:"See your mood trends and emotional cycles revealed across all your entries over time." },
          { icon:"◈", title:"Private & Safe", desc:"Your entries are encrypted and stored securely. Your thoughts stay yours, always." },
        ].map(f => (
          <div key={f.title} style={{ background:"white", borderRadius:16, border:`1px solid ${P.blush}44`, padding:20, boxShadow:`0 2px 12px ${P.plum}08` }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${P.blush}33`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12, color:P.mauve, fontSize:13 }}>{f.icon}</div>
            <p style={{ fontWeight:600, color:P.plum, marginBottom:6, fontSize:13 }}>{f.title}</p>
            <p style={{ fontSize:12, color:P.mauve, lineHeight:1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer style={{ textAlign:"center", padding:"20px", fontSize:12, color:P.blush, borderTop:`1px solid ${P.blush}33` }}>
        MindTrace — AI Application Challenge · Built with 💜
      </footer>
    </main>
  );
}
