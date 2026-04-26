"use client";
import { useEffect, useState } from "react";
import { PatternSkeleton } from "@/components/ui/SkeletonLoader";
import { getTrend, formatShortDate } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
interface Entry{id:string;createdAt:string;moodScore:number;keywords:string[];}
export default function PatternsPage() {
  const [entries,setEntries]=useState<Entry[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    async function load(){try{const res=await fetch("/api/entries?limit=100");const d=await res.json();setEntries((d.entries??[]).filter((e:Entry)=>typeof e.moodScore==="number"));}catch{}finally{setLoading(false);}}
    load();
  },[]);
  if(loading)return<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:20}}><h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:500,color:P.plum}}>Patterns</h1><PatternSkeleton/></div>;
  if(entries.length<2)return(
    <div className="fade-up">
      <p style={{fontSize:11,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Insights</p>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:500,color:P.plum,marginBottom:20}}>Patterns</h1>
      <div style={{background:"white",borderRadius:16,border:`1.5px dashed ${P.blush}`,padding:"60px 24px",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:14,background:`${P.blush}22`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22}}>📊</div>
        <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",color:P.mauve,fontSize:16,marginBottom:8}}>Not enough data yet.</p>
        <p style={{fontSize:13,color:P.blush}}>Write at least 2 entries to see your emotional patterns emerge.</p>
      </div>
    </div>
  );
  const scores=entries.map(e=>e.moodScore);
  const avg=Math.round((scores.reduce((a,b)=>a+b,0)/scores.length)*10)/10;
  const best=Math.max(...scores),worst=Math.min(...scores);
  const trend=getTrend(scores);
  const trendConf={improving:{label:"↑ Improving",color:"#166534"},declining:{label:"↓ Declining",color:"#9A3412"},stable:{label:"→ Stable",color:P.plum}}[trend];
  const kwCount:Record<string,number>={};
  entries.forEach(e=>e.keywords?.forEach(k=>{kwCount[k]=(kwCount[k]??0)+1;}));
  const topKw=Object.entries(kwCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const chartData=[...entries].reverse().slice(-14).map(e=>({date:formatShortDate(e.createdAt),score:e.moodScore}));
  return(
    <div className="fade-up" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <p style={{fontSize:11,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Insights</p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:500,color:P.plum}}>Patterns</h1>
        <p style={{fontSize:12,color:P.mauve,marginTop:4}}>Based on {entries.length} journal {entries.length===1?"entry":"entries"}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{label:"Average mood",value:avg,sub:"out of 10",color:P.plum},{label:"Trend",value:trendConf.label,sub:"recent vs. earlier",color:trendConf.color},{label:"Best score",value:`${best}/10`,sub:"your peak",color:P.plum},{label:"Lowest score",value:`${worst}/10`,sub:"your low point",color:P.plum}].map(s=>(
          <div key={s.label} style={{background:"white",borderRadius:12,border:`1px solid ${P.blush}44`,padding:"16px 18px"}}>
            <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{s.label}</p>
            <p style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:500,color:s.color,lineHeight:1,marginBottom:4}}>{s.value}</p>
            <p style={{fontSize:11,color:P.mauve}}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{background:"white",borderRadius:16,border:`1px solid ${P.blush}44`,padding:20}}>
        <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16}}>Mood over time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{top:5,right:5,left:-15,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${P.blush}33`} vertical={false}/>
            <XAxis dataKey="date" tick={{fontSize:11,fill:P.mauve}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,10]} tick={{fontSize:11,fill:P.mauve}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"white",border:`1px solid ${P.blush}`,borderRadius:10,fontSize:12,color:P.plum}} cursor={{stroke:P.blush,strokeWidth:1,strokeDasharray:"4 4"}}/>
            <Line type="monotone" dataKey="score" stroke={P.plum} strokeWidth={2.5} dot={{r:4,fill:P.plum,strokeWidth:0}} activeDot={{r:6,fill:P.mauve}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      {topKw.length>0&&<div style={{background:"white",borderRadius:16,border:`1px solid ${P.blush}44`,padding:20}}>
        <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Recurring themes</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {topKw.map(([kw,count])=>(
            <div key={kw} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12,fontWeight:500,color:P.plum,width:100,flexShrink:0,textTransform:"capitalize"}}>{kw}</span>
              <div style={{flex:1,height:6,borderRadius:999,background:`${P.blush}33`,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:999,width:`${(count/topKw[0][1])*100}%`,background:`linear-gradient(90deg,${P.plum},${P.mauve})`}}/>
              </div>
              <span style={{fontSize:11,color:P.mauve,width:20,textAlign:"right",flexShrink:0}}>{count}×</span>
            </div>
          ))}
        </div>
      </div>}
      <div style={{background:"linear-gradient(135deg,#F4F1F6,#FDF8F8)",borderRadius:16,border:`1px solid ${P.blush}44`,padding:20}}>
        <p style={{fontSize:10,fontWeight:700,color:P.blush,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Summary</p>
        <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",color:P.plum,fontSize:14,lineHeight:1.8}}>
          Across your {entries.length} entries, your average mood sits at {avg}/10 and is {trend==="improving"?"on an upward trajectory — something positive seems to be building":trend==="declining"?"trending downward — it may be worth reflecting on what has been weighing on you":"holding steady"}.
          {topKw.length>0?` Topics like "${topKw[0][0]}"${topKw[1]?` and "${topKw[1][0]}"`:"" } appear most often in your writing.`:""} Keep journaling to reveal deeper cycles over time.
        </p>
      </div>
    </div>
  );
}
