"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };

function validate(email: string, password: string): string {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return "";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
const callbackUrl = "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(form.email, form.password);
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        redirect: false,
      });
      if (result?.error) setError("Incorrect email or password. Please try again.");
      else if (result?.ok) { router.push(callbackUrl); router.refresh(); }
      else setError("Something went wrong. Please try again.");
    } catch {
      setError("Could not connect to server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <div style={{ width:"42%", background:P.plum, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:48, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:P.cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:P.plum, fontSize:12, fontFamily:"Georgia,serif", fontWeight:700 }}>M</span>
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:600, color:P.cream }}>MindTrace</span>
        </div>
        <div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:300, fontStyle:"italic", color:P.cream, lineHeight:1.4, marginBottom:20 }}>
            "Every entry is a step toward understanding yourself."
          </p>
          <p style={{ fontSize:13, color:`${P.blush}99` }}>Your AI journaling companion</p>
        </div>
        <p style={{ fontSize:11, color:`${P.blush}55` }}>mindtrace.app</p>
      </div>

      <div style={{ flex:1, background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", padding:48, overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, color:P.plum, marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:13, color:P.mauve, marginBottom:32 }}>Sign in to your journal</p>

          <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:P.mauve, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.08em" }}>Email</label>
              <input type="email" placeholder="you@example.com" required autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onBlur={() => setTouched({ ...touched, email: true })}
                onFocus={e => { e.target.style.borderColor = P.mauve; }}
                onBlurCapture={e => { e.target.style.borderColor = P.blush; }}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${touched.email && !form.email ? "#f5c6c2" : P.blush}`, background:"white", color:P.plum, fontSize:14, outline:"none" }} />
            </div>

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:P.mauve, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.08em" }}>Password</label>
              <input type="password" placeholder="••••••••" required autoComplete="current-password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onBlur={() => setTouched({ ...touched, password: true })}
                onFocus={e => { e.target.style.borderColor = P.mauve; }}
                onBlurCapture={e => { e.target.style.borderColor = P.blush; }}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${touched.password && !form.password ? "#f5c6c2" : P.blush}`, background:"white", color:P.plum, fontSize:14, outline:"none" }} />
            </div>

            {error && (
              <div style={{ fontSize:13, color:"#c0392b", background:"#fdf0ef", border:"1px solid #f5c6c2", borderRadius:10, padding:"11px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
                <span>&#9888;</span><span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding:"13px", borderRadius:11, background:P.plum, color:P.cream, fontSize:14, fontWeight:500, border:"none", cursor:loading ? "not-allowed" : "pointer", boxShadow:`0 4px 14px ${P.plum}40`, opacity:loading ? 0.7 : 1, marginTop:4 }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:P.mauve }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color:P.plum, fontWeight:600, textDecoration:"none" }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"#FEF6EC" }} />}>
      <LoginForm />
    </Suspense>
  );
}
