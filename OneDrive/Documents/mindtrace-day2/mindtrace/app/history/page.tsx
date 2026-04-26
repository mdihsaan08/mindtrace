"use client";
import { useEffect, useState } from "react";
import { EntryCard } from "@/components/journal/EntryCard";
import { EntryCardSkeleton } from "@/components/ui/SkeletonLoader";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
interface Entry{id:string;createdAt:string;content:string;selectedMood?:string|null;moodScore?:number|null;moodLabel?:string|null;emotions:string[];themes:string[];insight?:string|null;}
export default function HistoryPage() {
  const [entries,setEntries]=useState<Entry[]>([]);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const [total,setTotal]=useState(0);
  async function load(p:number){
    setLoading(true);
    try{const res=await fetch(`/api/entries?page=${p}&limit=10`);const d=await res.json();setEntries(d.entries??[]);setTotalPages(d.pagination?.pages??1);setTotal(d.pagination?.total??0);}
    catch{}finally{setLoading(false);}
  }
  useEffect(()=>{load(page);},[page]);
  return (
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <p style={{fontSize:11,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Your journal</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:500,color:P.plum}}>History</h1>
        </div>
        {total>0&&<span style={{fontSize:11,fontWeight:600,color:P.mauve,background:`${P.blush}22`,border:`1px solid ${P.blush}55`,borderRadius:999,padding:"4px 12px"}}>{total} {total===1?"entry":"entries"}</span>}
      </div>
      {loading?<div style={{display:"flex",flexDirection:"column",gap:12}}>{[1,2,3].map(i=><EntryCardSkeleton key={i}/>)}</div>
      :entries.length===0?<div style={{background:"white",borderRadius:16,border:`1.5px dashed ${P.blush}`,padding:"60px 24px",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:14,background:`${P.blush}22`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22}}>📓</div>
        <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",color:P.mauve,fontSize:16,marginBottom:8}}>No entries yet.</p>
        <p style={{fontSize:13,color:P.blush}}>Head to <a href="/dashboard" style={{color:P.plum,fontWeight:600,textDecoration:"none"}}>Write</a> to begin your journey.</p>
      </div>
      :<div style={{display:"flex",flexDirection:"column",gap:12}}>
        {entries.map(e=><EntryCard key={e.id} entry={e}/>)}
        {totalPages>1&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,paddingTop:8}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:"7px 16px",borderRadius:9,border:`1px solid ${P.blush}`,background:"white",color:P.mauve,fontSize:12,cursor:"pointer",opacity:page===1?0.4:1}}>← Previous</button>
          <span style={{fontSize:13,color:P.mauve}}>Page {page} of {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{padding:"7px 16px",borderRadius:9,border:`1px solid ${P.blush}`,background:"white",color:P.mauve,fontSize:12,cursor:"pointer",opacity:page===totalPages?0.4:1}}>Next →</button>
        </div>}
      </div>}
    </div>
  );
}
