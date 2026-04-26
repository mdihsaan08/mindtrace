import Link from "next/link";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
export default function NotFound() {
  return (
    <div style={{ minHeight:"100vh", background:"#FEF6EC", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <p style={{ fontFamily:"Georgia,serif", fontSize:80, fontWeight:300, color:P.blush, lineHeight:1, marginBottom:16 }}>404</p>
        <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, color:P.plum, marginBottom:10 }}>Page not found</h2>
        <p style={{ fontSize:13, color:P.mauve, marginBottom:28, lineHeight:1.7 }}>The page you're looking for doesn't exist. Maybe it was moved or you typed the wrong address.</p>
        <Link href="/" style={{ padding:"11px 28px", borderRadius:10, background:P.plum, color:P.cream, fontSize:13, fontWeight:500, textDecoration:"none", boxShadow:`0 2px 12px ${P.plum}30` }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
