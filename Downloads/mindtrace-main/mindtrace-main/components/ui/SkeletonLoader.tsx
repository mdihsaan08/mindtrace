"use client";
const P = { blush:"#CEAEB0" };
export function Sk({ w="100%", h=16, r=8 }: { w?:string|number; h?:number; r?:number }) {
  return <div className="shimmer" style={{ width:w, height:h, borderRadius:r }} />;
}
export function EntryCardSkeleton() {
  return (
    <div style={{ background:"white", borderRadius:14, border:`1px solid ${P.blush}44`, padding:"18px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <Sk w={120} h={12} r={6}/><Sk w={60} h={20} r={999}/>
      </div>
      <Sk h={13} r={6}/><div style={{marginTop:6}}/><Sk w="80%" h={13} r={6}/>
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        <Sk w={60} h={20} r={999}/><Sk w={70} h={20} r={999}/><Sk w={50} h={20} r={999}/>
      </div>
    </div>
  );
}
export function AnalysisSkeleton() {
  return (
    <div style={{ background:"white", borderRadius:16, border:`1px solid ${P.blush}55`, padding:24 }}>
      <div style={{ display:"flex", gap:16, paddingBottom:18, borderBottom:`1px solid ${P.blush}33`, marginBottom:18 }}>
        <Sk w={60} h={60} r={14}/><div style={{ flex:1 }}><Sk w={120} h={18} r={6}/><div style={{marginTop:8}}/><Sk w={90} h={12} r={6}/></div>
      </div>
      <Sk w={60} h={12} r={6}/><div style={{marginTop:8}}/><div style={{ display:"flex", gap:6 }}><Sk w={70} h={24} r={999}/><Sk w={80} h={24} r={999}/><Sk w={60} h={24} r={999}/></div>
      <div style={{ marginTop:16, borderRadius:12, padding:16, background:"#F4F1F6" }}>
        <Sk w={60} h={12} r={6}/><div style={{marginTop:10}}/><Sk h={14} r={6}/><div style={{marginTop:6}}/><Sk w="85%" h={14} r={6}/><div style={{marginTop:6}}/><Sk w="70%" h={14} r={6}/>
      </div>
      <div style={{marginTop:16}}><Sk h={44} r={10}/></div>
    </div>
  );
}
export function PatternSkeleton() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[1,2,3,4].map(i=><div key={i} style={{ background:"white", borderRadius:12, padding:16 }}><Sk w={80} h={12} r={6}/><div style={{marginTop:8}}/><Sk w={60} h={22} r={6}/><div style={{marginTop:6}}/><Sk w={90} h={11} r={6}/></div>)}
      </div>
      <div style={{ background:"white", borderRadius:16, padding:20 }}><Sk w={100} h={12} r={6}/><div style={{marginTop:14}}/><Sk h={200} r={10}/></div>
    </div>
  );
}
