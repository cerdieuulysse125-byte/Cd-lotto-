"use client";
import { useState, useEffect } from "react";
const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real","Loteka","Nacional noche"];

export default function Page(){
 const [tab,setTab]=useState("VENDRE");
 const [sel,setSel]=useState<string[]>([]);
 const [fiches,setFiches]=useState<any[]>([]);
 const [boul,setBoul]=useState(""); const [miz,setMiz]=useState("");

 useEffect(()=>{ const s=localStorage.getItem("FICH"); if(s) setFiches(JSON.parse(s)); },[]);
 useEffect(()=>{ localStorage.setItem("FICH",JSON.stringify(fiches)); },[fiches]);

 const add=()=>{
  if(!sel.length) return alert("Chwazi tiraj");
  if(!boul||!miz) return alert("Mete boul ak miz");
  const f={boul,miz:parseInt(miz),tirages:sel,ticket:"CD"+Date.now().toString().slice(-6),heure:new Date().toLocaleTimeString()};
  setFiches([...fiches,f]); setBoul(""); setMiz("");
 };

 const total=fiches.reduce((a,b)=>a+b.miz,0);

 return (
 <div style={{padding:10,maxWidth:450,margin:"0 auto",fontFamily:"sans-serif"}}>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
   <button onClick={()=>setTab("VENDRE")} style={{padding:14,borderRadius:12,border:"2px solid #000",background:tab==="VENDRE"?"#4fb3ff":"#eee",fontWeight:900}}>VENDRE</button>
   <button onClick={()=>setTab("COPIER")} style={{padding:14,borderRadius:12,border:"2px solid #000",background:tab==="COPIER"?"#4fb3ff":"#eee",fontWeight:900}}>COPIER</button>
   <button onClick={()=>setTab("FICHES")} style={{padding:14,borderRadius:12,border:"2px solid #000",background:tab==="FICHES"?"#4fb3ff":"#eee",fontWeight:900}}>MES FICHES</button>
  </div>
  <button onClick={()=>setTab("RAPPORT")} style={{width:"100%",marginTop:8,padding:14,borderRadius:12,border:"2px solid #000",background:tab==="RAPPORT"?"#4fb3ff":"#eee",fontWeight:900}}>RAPPORT</button>

  {tab==="VENDRE" && (
   <div style={{marginTop:15}}>
    <div style={{border:"2px solid #000",padding:8,borderRadius:10}}>
     {TIRAGES.map(t=><label key={t} style={{border:"1px solid #000",display:"inline-block",margin:4,padding:6,borderRadius:6,fontSize:12}}><input type="checkbox" checked={sel.includes(t)} onChange={()=>setSel(sel.includes(t)?sel.filter(x=>x!==t):[...sel,t])}/> {t}</label>)}
    </div>
    <div style={{display:"flex",gap:6,marginTop:10}}>
     <input value={boul} onChange={e=>setBoul(e.target.value)} placeholder="Boul 12" style={{flex:1,padding:12,border:"2px solid #000",borderRadius:8}}/>
     <input value={miz} onChange={e=>setMiz(e.target.value)} placeholder="Miz" style={{flex:1,padding:12,border:"2px solid #000",borderRadius:8}}/>
     <button onClick={add} style={{padding:12,background:"#0a0",color:"#fff",borderRadius:8,fontWeight:900}}>OK</button>
    </div>
    <div style={{background:"#000",color:"#fff",padding:12,marginTop:10,textAlign:"center",borderRadius:8}}>TOTAL {total*(sel.length||1)} HTG - {fiches.length} fich</div>
    <div style={{border:"2px solid #000",marginTop:8,padding:6,minHeight:80}}>{fiches.map((f,i)=><div key={i} style={{fontSize:12,borderBottom:"1px solid #ccc"}}>{f.ticket} {f.boul} {f.miz}HTG x {f.tirages.length}</div>)}</div>
    <div id="print" style={{display:"none"}}><div style={{textAlign:"center",width:"58mm",fontFamily:"monospace"}}><b>C&D VERITE LOTTO</b><br/>{new Date().toLocaleString()}<hr/>{fiches.map((f,i)=><div key={i}>{f.boul} {f.miz}HTG - {f.tirages.join(",")}</div>)}<hr/><b>TOTAL {total} HTG</b></div></div>
    <button onClick={()=>{const c=document.getElementById("print")?.innerHTML; const w=window.open("","","width=300"); w?.document.write(c||""); w?.print();}} style={{width:"100%",padding:15,background:"#000",color:"#fff",marginTop:8,borderRadius:10}}>IMPRIMER FICH PWÒP</button>
   </div>
  )}

  {tab==="COPIER" && <div style={{marginTop:20,border:"2px solid #000",padding:15,borderRadius:10}}><b>COPIER</b><p style={{fontSize:12,marginTop:10}}>Antre nimewo ticket pou kopye. Onglè sa ap ouvè kounya!</p><input placeholder="CD..." style={{width:"100%",padding:12,border:"2px solid #000",marginTop:10}}/><button style={{width:"100%",padding:12,background:"#000",color:"#fff",marginTop:8}}>KOPIYE</button></div>}
  {tab==="FICHES" && <div style={{marginTop:20,border:"2px solid #000",padding:10,borderRadius:10}}><b>MES FICHES ({fiches.length})</b>{fiches.map((f,i)=><div key={i} style={{borderBottom:"1px solid #000",padding:5,fontSize:12}}>{f.ticket} | {f.boul} | {f.miz} HTG</div>)}</div>}
  {tab==="RAPPORT" && <div style={{marginTop:20,border:"2px solid #000",padding:15,borderRadius:10}}><b>RAPPORT</b><div style={{marginTop:10}}>Vente: {total} HTG<br/>Comm 20%: {total*0.2} HTG<br/><b>NET: {total*0.8} HTG</b></div><div id="print2" style={{display:"none"}}><div style={{width:"58mm",textAlign:"center"}}><b>RAPPORT</b><br/>Vente {total} HTG<br/>NET {total*0.8} HTG</div></div><button onClick={()=>{const c=document.getElementById("print2")?.innerHTML; const w=window.open("","","width=300"); w?.document.write(c||""); w?.print();}} style={{width:"100%",padding:12,background:"#000",color:"#fff",marginTop:10}}>IMPRIMER RAPPORT PWÒP</button></div>}
 </div>
 );
}
