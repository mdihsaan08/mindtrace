"use client";
import { AnalysisResult } from "@/lib/groq";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
function ss(s:number){
  if(s>=8)return{bg:"#F0FDF4",border:"#BBF7D0",text:"#166534",label:"✦ Positive"};
  if(s>=6)return{bg:"#F7FEE7",border:"#D9F99D",text:"#3F6212",label:"◎ Good"};
  if(s>=4)return{bg:"#FFFBEB",border:"#FDE68A",text:"#92400E",label:"◐ Mixed"};
  if(s>=2)return{bg:"#FFF7ED",border:"#FDBA74",text:"#9A3412",label:"▾ Low"};
  return{bg:"#FFF1F2",border:"#FECDD3",text:"#9F1239",label:"▼ Very low"};
}
export function AnalysisCard({analysis,onStartChat}:{analysis:AnalysisResult;onStartChat:()=>void}) {
  const s=ss(analysis.moodScore);
  return (
    <div className="fade-up" style={{background:"white",borderRadius:16,border:`1px solid ${P.blush}55`,padding:24,boxShadow:`0 2px 16px ${P.plum}08`}}>
      <div style={{display:"flex",alignItems:"center",gap:16,paddingBottom:18,borderBottom:`1px solid ${P.blush}33`,marginBottom:18}}>
        <div style={{width:60,height:60,borderRadius:14,background:s.bg,border:`1.5px solid ${s.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:600,color:s.text,lineHeight:1}}>{analysis.moodScore}</span>
          <span style={{fontSize:10,color:s.text,opacity:0.6}}>/10</span>
        </div>
        <div style={{flex:1}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:500,color:P.plum,textTransform:"capitalize",marginBottom:3}}>{analysis.moodLabel}</p>
          <p style={{fontSize:12,color:P.mauve}}>Today&apos;s mood score</p>
        </div>
        <span style={{fontSize:11,fontWeight:600,padding:"5px 12px",borderRadius:999,background:s.bg,border:`1px solid ${s.border}`,color:s.text}}>{s.label}</span>
      </div>
      <div style={{marginBottom:16}}>
        <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Detected</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {analysis.emotions.map(e=><span key={e} style={{fontSize:11,padding:"4px 10px",borderRadius:999,background:`${P.blush}22`,border:`1px solid ${P.blush}55`,color:P.mauve}}>{e}</span>)}
          {analysis.themes.map(t=><span key={t} style={{fontSize:11,padding:"4px 10px",borderRadius:999,background:`${P.plum}0D`,border:`1px solid ${P.plum}22`,color:P.plum,fontStyle:"italic"}}>{t}</span>)}
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#F4F1F6,#FDF8F8)",borderRadius:12,padding:16,border:`1px solid ${P.blush}33`,marginBottom:16}}>
        <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>AI Insight</p>
        <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",color:P.plum,fontSize:14,lineHeight:1.7}}>{analysis.insight}</p>
      </div>
      <button onClick={onStartChat} style={{width:"100%",padding:"11px",borderRadius:10,border:`1.5px dashed ${P.blush}`,background:"transparent",color:P.mauve,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        💬 Talk to AI about this entry
      </button>
      <p style={{textAlign:"center",fontSize:11,color:P.blush,marginTop:10}}>Entry saved to your history ✓</p>
    </div>
  );
}
