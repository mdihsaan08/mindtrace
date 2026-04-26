"use client";
import { useState, useRef, useEffect } from "react";
import { AnalysisResult } from "@/lib/groq";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
interface Msg { role:"user"|"assistant"; content:string; }
export function ChatPanel({entryContent,analysis,onClose}:{entryContent:string;analysis:AnalysisResult;onClose:()=>void}) {
  const [messages,setMessages]=useState<Msg[]>([{role:"assistant",content:`I've read your entry and noticed you're feeling ${analysis.moodLabel}. ${analysis.insight} What would you like to explore further?`}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const bottomRef=useRef<HTMLDivElement>(null);
  const inputRef=useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  useEffect(()=>{inputRef.current?.focus();},[]);
  async function send() {
    const text=input.trim(); if(!text||loading) return;
    const msgs:Msg[]=[...messages,{role:"user",content:text}];
    setMessages(msgs); setInput(""); setLoading(true); setError("");
    try {
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:msgs,entryContent,analysis})});
      const data=await res.json();
      if(!res.ok){setError(res.status===429?"Rate limit reached. Wait 30 seconds.":data.error??"Something went wrong.");return;}
      setMessages([...msgs,{role:"assistant",content:data.reply}]);
    } catch {setError("Could not reach server.");} finally {setLoading(false);}
  }
  return (
    <div className="fade-up" style={{background:"white",borderRadius:16,border:`1px solid ${P.blush}55`,display:"flex",flexDirection:"column",height:520}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${P.blush}33`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:P.plum,display:"flex",alignItems:"center",justifyContent:"center",color:P.cream,fontSize:14}}>💬</div>
          <div>
            <p style={{fontSize:13,fontWeight:600,color:P.plum,lineHeight:1}}>AI Companion</p>
            <p style={{fontSize:11,color:P.mauve,marginTop:2}}>Reflecting on your entry</p>
          </div>
        </div>
        <button onClick={onClose} style={{width:28,height:28,borderRadius:7,background:`${P.blush}22`,border:"none",color:P.mauve,cursor:"pointer",fontSize:12}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-start"}}>
            {m.role==="assistant"&&<div style={{width:24,height:24,borderRadius:6,background:P.plum,display:"flex",alignItems:"center",justifyContent:"center",color:P.cream,fontSize:10,fontFamily:"Georgia,serif",fontWeight:700,flexShrink:0,marginTop:2}}>M</div>}
            <div style={{maxWidth:"78%",padding:"10px 14px",fontSize:13,lineHeight:1.6,background:m.role==="user"?P.plum:"linear-gradient(135deg,#F4F1F6,#FDF8F8)",color:m.role==="user"?P.cream:P.plum,fontFamily:m.role==="assistant"?"Georgia,serif":"inherit",fontStyle:m.role==="assistant"?"italic":"normal",border:m.role==="assistant"?`1px solid ${P.blush}33`:"none",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
          <div style={{width:24,height:24,borderRadius:6,background:P.plum,display:"flex",alignItems:"center",justifyContent:"center",color:P.cream,fontSize:10,fontFamily:"Georgia,serif",fontWeight:700,flexShrink:0}}>M</div>
          <div style={{padding:"12px 16px",borderRadius:"14px 14px 14px 4px",background:"linear-gradient(135deg,#F4F1F6,#FDF8F8)",border:`1px solid ${P.blush}33`,display:"flex",gap:5,alignItems:"center"}}>
            {[0,1,2].map(i=><span key={i} className="pulse-dot" style={{width:6,height:6,borderRadius:"50%",background:P.mauve,display:"inline-block",animationDelay:`${i*0.2}s`}}/>)}
          </div>
        </div>}
        {error&&<p style={{fontSize:12,color:"#c0392b",background:"#fdf0ef",borderRadius:8,padding:"8px 12px"}}>{error} <button onClick={()=>setError("")} style={{background:"none",border:"none",color:"#c0392b",cursor:"pointer",textDecoration:"underline",fontSize:12}}>Dismiss</button></p>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${P.blush}33`}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea ref={inputRef} rows={1} value={input} onChange={e=>setInput(e.target.value)} disabled={loading}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Reply... (Enter to send)"
            style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1px solid ${P.blush}`,background:"#FEF6EC",color:P.plum,fontSize:13,outline:"none",resize:"none",lineHeight:1.5,fontFamily:"inherit"}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{width:38,height:38,borderRadius:10,background:P.plum,border:"none",color:P.cream,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,opacity:loading||!input.trim()?0.4:1}}>↑</button>
        </div>
        <p style={{fontSize:11,color:P.blush,textAlign:"right",marginTop:6}}>{input.length}/500 · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
