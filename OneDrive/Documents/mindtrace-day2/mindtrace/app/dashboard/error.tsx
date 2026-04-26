"use client";
import { useEffect } from "react";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
export default function DashboardError({ error, reset }: { error:Error; reset:()=>void }) {
  useEffect(()=>{console.error("[dashboard error]",error);},[error]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ background:"white", borderRadius:16, border:`1px solid ${P.blush}55`, padding:"36px 32px", maxWidth:380, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:14 }}>😔</div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:500, color:P.plum, marginBottom:8 }}>Something went wrong</h3>
        <p style={{ fontSize:13, color:P.mauve, marginBottom:20, lineHeight:1.6 }}>There was an issue loading this section. Your entries are safe.</p>
        <button onClick={reset} style={{ padding:"9px 22px", borderRadius:9, background:P.plum, color:P.cream, fontSize:13, fontWeight:500, border:"none", cursor:"pointer" }}>Try again</button>
      </div>
    </div>
  );
}
