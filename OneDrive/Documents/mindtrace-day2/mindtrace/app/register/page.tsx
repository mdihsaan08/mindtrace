"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function strength() {
    const p=form.password; if(!p) return 0;
    let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++;
    return s;
  }
  const sc = strength();
  const scColors = ["","#FECDD3","#FDE68A","#D9F99D","#BBF7D0"];
  const scLabels = ["","Weak","Fair","Good","Strong"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name||!form.email||!form.password){setError("Please fill in all fields.");return;}
    if(form.password.length<8){setError("Password must be at least 8 characters.");return;}
    if(!/[A-Z]/.test(form.password)){setError("Password must contain an uppercase letter.");return;}
    if(!/[0-9]/.test(form.password)){setError("Password must contain a number.");return;}
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data = await res.json();
      if(!res.ok){setError(data.error??"Registration failed.");setLoading(false);return;}
      const r = await signIn("credentials",{email:form.email.toLowerCase().trim(),password:form.password,redirect:false});
      if(r?.ok) window.location.href="/dashboard"; else router.push("/login");
    } catch {setError("Could not connect. Check your connection.");setLoading(false);}
  }

  return (
    <div style={{ display:"flex", height:"100vh" }}>
      <div style={{ width:"42%", background:P.plum, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:48, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:P.cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:P.plum, fontSize:12, fontFamily:"Georgia,serif", fontWeight:700 }}>M</span>
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:600, color:P.cream }}>MindTrace</span>
        </div>
        <div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:300, fontStyle:"italic", color:P.cream, lineHeight:1.4, marginBottom:20 }}>"Begin the journey of knowing yourself — one entry at a time."</p>
          {["AI mood analysis on every entry","Emotional pattern detection","Private & encrypted journal"].map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:P.cream, flexShrink:0 }}/>
              <span style={{ fontSize:13, color:`${P.blush}cc` }}>{f}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:11, color:`${P.blush}55` }}>mindtrace.app</p>
      </div>
      <div style={{ flex:1, background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", padding:48, overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, color:P.plum, marginBottom:6 }}>Create account</h1>
          <p style={{ fontSize:13, color:P.mauve, marginBottom:32 }}>Your journal awaits — it&apos;s free</p>
          <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[{id:"name",label:"Your name",type:"text",ph:"Alex"},{id:"email",label:"Email",type:"email",ph:"you@example.com"},{id:"password",label:"Password",type:"password",ph:"Min 8 chars, 1 uppercase, 1 number"}].map(f=>(
              <div key={f.id}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:P.mauve, marginBottom:7, textTransform:"uppercase" as const, letterSpacing:"0.08em" }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} required value={form[f.id as keyof typeof form]}
                  onChange={e=>setForm({...form,[f.id]:e.target.value})}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${P.blush}`, background:"white", color:P.plum, fontSize:14, outline:"none" }}/>
                {f.id==="password"&&form.password&&(
                  <div style={{ marginTop:8 }}>
                    <div style={{ height:3, borderRadius:999, background:`${P.blush}33`, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:999, width:`${(sc/4)*100}%`, background:scColors[sc], transition:"all 0.3s" }}/>
                    </div>
                    <p style={{ fontSize:11, color:P.mauve, marginTop:4 }}>Strength: {scLabels[sc]}</p>
                  </div>
                )}
              </div>
            ))}
            {error && <div style={{ fontSize:13, color:"#c0392b", background:"#fdf0ef", border:"1px solid #f5c6c2", borderRadius:10, padding:"11px 14px" }}>⚠ {error}</div>}
            <button type="submit" disabled={loading} style={{ padding:"13px", borderRadius:11, background:P.plum, color:P.cream, fontSize:14, fontWeight:500, border:"none", cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, boxShadow:`0 4px 14px ${P.plum}40`, marginTop:4 }}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>
          <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:P.mauve }}>
            Already have an account? <Link href="/login" style={{ color:P.plum, fontWeight:600, textDecoration:"none" }}>Sign in</Link>
          </p>
          <p style={{ textAlign:"center", marginTop:10, fontSize:11, color:P.blush }}>Your entries are private and encrypted. We never sell your data.</p>
        </div>
      </div>
    </div>
  );
}
