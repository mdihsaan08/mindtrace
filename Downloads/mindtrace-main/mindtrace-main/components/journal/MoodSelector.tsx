"use client";
const P = { plum:"#524660", mauve:"#9F8383", blush:"#CEAEB0", cream:"#FDDCB0" };
const MOODS = [
  {label:"calm",emoji:"😌"},{label:"happy",emoji:"😊"},{label:"sad",emoji:"😔"},
  {label:"anxious",emoji:"😰"},{label:"frustrated",emoji:"😤"},{label:"tired",emoji:"😴"},
  {label:"overwhelmed",emoji:"🫠"},{label:"excited",emoji:"🤩"},{label:"neutral",emoji:"😐"},{label:"lonely",emoji:"😢"},
];
export function MoodSelector({ value, onChange }: { value:string; onChange:(m:string)=>void }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {MOODS.map(m => {
        const active = value === m.label;
        return (
          <button key={m.label} type="button" onClick={() => onChange(active ? "" : m.label)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:999,
              border:`1px solid ${active ? P.plum : P.blush}`,
              background: active ? P.plum : "white",
              color: active ? P.cream : P.mauve,
              fontSize:12, fontWeight:500, cursor:"pointer",
              boxShadow: active ? `0 2px 8px ${P.plum}30` : "none",
              transition:"all 0.15s",
            }}>
            <span style={{ fontSize:14 }}>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
