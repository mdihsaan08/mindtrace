"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };

interface FormErrors { name?:string; email?:string; password?:string; }

function validateAll(form: { name:string; email:string; password:string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!form.email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8) errors.password = "Must be at least 8 characters.";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Must contain at least one uppercase letter.";
  else if (!/[0-9]/.test(form.password)) errors.password = "Must contain at least one number.";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name:false, email:false, password:false });

  function handleBlur(field: keyof typeof touched) {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validateAll(form);
    setErrors(errs);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name:true, email:true, password:true });
    const errs = validateAll(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setServerError("Could not connect to the server. Please check your connection.");
      setLoading(false);
    }
  }

  const inputStyle = (field: keyof FormErrors) => ({
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1px solid ${touched[field] && errors[field] ? "#f5c6c2" : P.blush}`,
    background:"white", color:P.plum, fontSize:14, outline:"none",
    transition:"border-color 0.15s",
  });

  const fields = [
    { key:"name" as const, label:"Your name", type:"text", ph:"Alex", autoComplete:"name" },
    { key:"email" as const, label:"Email", type:"email", ph:"you@example.com", autoComplete:"email" },
    { key:"password" as const, label:"Password", type:"password", ph:"Min 8 chars, 1 uppercase, 1 number", autoComplete:"new-password" },
  ];

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = passwordStrength();
  const strengthColors = ["", "#f5c6c2", "#FDE68A", "#D9F99D", "#BBF7D0"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      {/* Left panel */}
      <div style={{ width:"42%", background:P.plum, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:48, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:P.cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:P.plum, fontSize:12, fontFamily:"Georgia,serif", fontWeight:700 }}>M</span>
          </div>
          <span style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:600, color:P.cream }}>MindTrace</span>
        </div>
        <div>
          <p style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:300, fontStyle:"italic", color:P.cream, lineHeight:1.4, marginBottom:24 }}>
            "Begin the journey of knowing yourself — one entry at a time."
          </p>
          {["AI mood analysis on every entry", "Emotional pattern detection", "Private & encrypted journal"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:P.cream, flexShrink:0 }} />
              <span style={{ fontSize:13, color:`${P.blush}cc` }}>{f}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:11, color:`${P.blush}55` }}>mindtrace.app</p>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", padding:48, overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, color:P.plum, marginBottom:6 }}>Create account</h1>
          <p style={{ fontSize:13, color:P.mauve, marginBottom:32 }}>Your journal awaits — it&apos;s free</p>

          <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:P.mauve, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} autoComplete={f.autoComplete}
                  value={form[f.key]}
                  onChange={e => { setForm({ ...form, [f.key]: e.target.value }); if (touched[f.key]) { const errs = validateAll({ ...form, [f.key]: e.target.value }); setErrors(errs); } }}
                  onBlur={() => handleBlur(f.key)}
                  onFocus={e => { e.target.style.borderColor = P.mauve; }}
                  style={inputStyle(f.key)} />
                {touched[f.key] && errors[f.key] && (
                  <p style={{ fontSize:11, color:"#c0392b", marginTop:5 }}>⚠ {errors[f.key]}</p>
                )}
                {/* Password strength bar */}
                {f.key === "password" && form.password && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ height:3, borderRadius:999, background:`${P.blush}33`, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:999, width:`${(strength/4)*100}%`, background:strengthColors[strength], transition:"all 0.3s" }}/>
                    </div>
                    <p style={{ fontSize:11, color:P.mauve, marginTop:4 }}>Strength: {strengthLabels[strength]}</p>
                  </div>
                )}
              </div>
            ))}

            {serverError && (
              <div style={{ fontSize:13, color:"#c0392b", background:"#fdf0ef", border:"1px solid #f5c6c2", borderRadius:10, padding:"11px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
                <span style={{ flexShrink:0 }}>⚠</span><span>{serverError}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding:"13px", borderRadius:11, background:P.plum, color:P.cream, fontSize:14, fontWeight:500, border:"none", cursor: loading ? "not-allowed" : "pointer", boxShadow:`0 4px 14px ${P.plum}40`, opacity: loading ? 0.7 : 1, transition:"opacity 0.15s", marginTop:4 }}>
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:P.mauve }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color:P.plum, fontWeight:600, textDecoration:"none" }}>Sign in</Link>
          </p>
          <p style={{ textAlign:"center", marginTop:10, fontSize:11, color:P.blush }}>
            Your entries are private and encrypted. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  );
}
