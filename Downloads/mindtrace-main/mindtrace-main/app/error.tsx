"use client";
import { useEffect } from "react";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[app error]", error); }, [error]);
  return (
    <div style={{ minHeight:"100vh", background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"white", borderRadius:20, border:`1px solid ${P.blush}55`, padding:"48px 40px", maxWidth:440, width:"100%", textAlign:"center", boxShadow:`0 4px 24px ${P.plum}08` }}>
        <div style={{ width:56, height:56, borderRadius:14, background:`${P.blush}22`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:24 }}>⚠️</div>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, color:P.plum, marginBottom:10 }}>Something went wrong</h2>
        <p style={{ fontSize:13, color:P.mauve, lineHeight:1.7, marginBottom:28 }}>
          An unexpected error occurred. Your journal data is safe — this is just a display issue.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p style={{ fontSize:11, color:"#c0392b", background:"#fdf0ef", borderRadius:8, padding:"10px 14px", marginBottom:20, textAlign:"left", wordBreak:"break-word" }}>
            {error.message}
          </p>
        )}
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={reset}
            style={{ padding:"10px 24px", borderRadius:10, background:P.plum, color:P.cream, fontSize:13, fontWeight:500, border:"none", cursor:"pointer", boxShadow:`0 2px 8px ${P.plum}30` }}>
            Try again
          </button>
          <a href="/"
            style={{ padding:"10px 24px", borderRadius:10, border:`1px solid ${P.blush}`, color:P.mauve, fontSize:13, fontWeight:500, textDecoration:"none" }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
