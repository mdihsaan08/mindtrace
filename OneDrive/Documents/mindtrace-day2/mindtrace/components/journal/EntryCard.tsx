const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0" };
function ss(s:number){
  if(s>=8)return{bg:"#F0FDF4",border:"#BBF7D0",text:"#166534"};
  if(s>=6)return{bg:"#F7FEE7",border:"#D9F99D",text:"#3F6212"};
  if(s>=4)return{bg:"#FFFBEB",border:"#FDE68A",text:"#92400E"};
  if(s>=2)return{bg:"#FFF7ED",border:"#FDBA74",text:"#9A3412"};
  return{bg:"#FFF1F2",border:"#FECDD3",text:"#9F1239"};
}
interface EntryCardProps { entry:{id:string;createdAt:string|Date;content:string;selectedMood?:string|null;moodScore?:number|null;moodLabel?:string|null;emotions:string[];themes:string[];insight?:string|null}; }
export function EntryCard({entry}:EntryCardProps) {
  const preview=entry.content.length>130?entry.content.slice(0,130)+"…":entry.content;
  const d=new Date(entry.createdAt).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  const s=entry.moodScore?ss(entry.moodScore):null;
  return (
    <article style={{background:"white",borderRadius:14,border:`1px solid ${P.blush}44`,padding:"18px 20px",boxShadow:`0 1px 8px ${P.plum}06`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:11,color:P.mauve}}>{d}</span>
          {entry.selectedMood&&<span style={{fontSize:11,color:P.blush}}>· {entry.selectedMood}</span>}
        </div>
        {s&&entry.moodScore&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,background:s.bg,border:`1px solid ${s.border}`,color:s.text}}>{entry.moodScore}/10{entry.moodLabel&&<span style={{fontWeight:400,opacity:0.7}}> · {entry.moodLabel}</span>}</span>}
      </div>
      <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",color:P.plum,fontSize:13,lineHeight:1.7,marginBottom:10}}>&ldquo;{preview}&rdquo;</p>
      {(entry.emotions.length>0||entry.themes.length>0)&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {[...entry.emotions,...entry.themes].slice(0,5).map(t=><span key={t} style={{fontSize:11,padding:"3px 9px",borderRadius:999,background:`${P.blush}22`,border:`1px solid ${P.blush}44`,color:P.mauve}}>{t}</span>)}
        </div>
      )}
      {entry.insight&&<p style={{fontSize:11,color:P.mauve,lineHeight:1.6,paddingTop:10,borderTop:`1px solid ${P.blush}33`}}>{entry.insight}</p>}
    </article>
  );
}
