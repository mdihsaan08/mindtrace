"use client";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html><body style={{ margin:0, fontFamily:"system-ui,sans-serif", background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <div style={{ textAlign:"center", padding:40 }}>
        <p style={{ fontSize:40, marginBottom:16 }}>💜</p>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:24, color:P.plum, marginBottom:10 }}>MindTrace encountered an error</h1>
        <p style={{ fontSize:14, color:P.mauve, marginBottom:24 }}>Something went critically wrong. Your data is safe.</p>
        <button onClick={reset} style={{ padding:"10px 28px", borderRadius:10, background:P.plum, color:P.cream, fontSize:13, border:"none", cursor:"pointer" }}>
          Reload app
        </button>
      </div>
    </body></html>
  );
}
