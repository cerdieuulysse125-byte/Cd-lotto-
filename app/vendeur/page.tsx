"use client";
import { useState, useEffect, useRef } from "react";
const TIRAGES=[{id:"ga-midi",nom:"GA midi",h:"11:30"},{id:"fl-midi",nom:"FL midi",h:"12:30"},{id:"ny-midi",nom:"NY midi",h:"13:20"},{id:"real",nom:"Real",h:"13:00"},{id:"real-1245",nom:"Real 12h45",h:"12:45"},{id:"ga-soir",nom:"GA soir",h:"18:30"},{id:"fl-soir",nom:"FL soir",h:"18:00"},{id:"ny-soir",nom:"NY soir",h:"20:20"},{id:"primera-dia",nom:"Primera dia 11h50",h:"11:50"},{id:"suerte-dia",nom:"Suerte dia 12h20",h:"12:20"},{id:"lote-dom",nom:"Lote Dom 1h45",h:"13:45"},{id:"ganamas",nom:"Ganamas 14h15",h:"14:15"},{id:"suerte-noche",nom:"Suerte noche 17h50",h:"17:50"},{id:"primera-noche",nom:"Primera noche 19h50",h:"19:50"},{id:"loteka",nom:"Loteka 19h45",h:"19:45"},{id:"nacional",nom:"Nacional noche",h:"20:50"},{id:"leidsa",nom:"Leidsa",h:"20:45"},{id:"anguila-10h",nom:"Anguila 10h",h:"10:00"},{id:"anguila-18h",nom:"Anguilla 18h",h:"18:00"}];

export default function Vendeur(){
const [auth,setAuth]=useState(false);const [pass,setPass]=useState("");const [nom,setNom]=useState("Vendeur1");const [tab,setTab]=useState("vendre");const [tiragesSel,setTiragesSel]=useState<string[]>([]);const [showT,setShowT]=useState(false);const [jeux,setJeux]=useState("BO");const [boul,setBoul]=useState("");const [mise,setMise]=useState("");const [lignes,setLignes]=useState<any[]>([]);const [fiches,setFiches]=useState<any[]>([]);const [searchId,setSearchId]=useState("");
const bRef=useRef<HTMLInputElement>(null);const mRef=useRef<HTMLInputElement>(null);
useEffect(()=>{const c=localStorage.getItem("cd_current_vendeur");if(c){setAuth(true);setNom(JSON.parse(c).nom);}setFiches(JSON.parse(localStorage.getItem("cd_fiches")||"[]"));},[]);
const login=()=>{const vs=JSON.parse(localStorage.getItem("cd_vendeurs")||"[]");const f=vs.find((v:any)=>v.password===pass);if(vs.length===0&&pass.length>=3){localStorage.setItem("cd_current_vendeur",JSON.stringify({nom:"Vendeur1",password:pass}));setAuth(true);return;}if(f){localStorage.setItem("cd_current_vendeur",JSON.stringify(f));setAuth(true);setNom(f.nom);}else alert("Modpas pa bon");};
const isF=(t:any)=>{const now=new Date();const [hh,mm]=t.h.split(":").map(Number);const f=new Date();f.setHours(hh,mm,0);return now>f;};
const add=()=>{if(!boul||!mise)return;setLignes([...lignes,{jeux,boul,mise:parseInt(mise)}]);setBoul("");setMise("");bRef.current?.focus();};
const key=(e:any,n:string)=>{if(e.key==="ArrowRight"||e.key==="ArrowDown"||e.key==="Enter"){e.preventDefault();if(n==="mise")mRef.current?.focus();if(n==="add")add();}};
const total=lignes.reduce((s,l)=>s+l.mise,0)*(tiragesSel.length||1);
if(!auth)return(<div style={{minHeight:"100vh",background:"white",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"#f5f5f5",borderRadius:20,padding:24,width:"100%",maxWidth:350,border:"2px solid #ccc"}}><h1 style={{color:"#d97706",fontSize:24,fontWeight:900,textAlign:"center",marginBottom:20}}>VENDEUR</h1><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Modpas" style={{width:"100%",height:56,background:"white",border:"3px solid #facc15",borderRadius:12,textAlign:"center",fontSize:20,outline:"none"}} autoFocus/><button onClick={login} style={{width:"100%",background:"#facc15",color:"black",fontWeight:900,padding:16,borderRadius:12,marginTop:12,fontSize:18,border:"none"}}>ANTRE</button></div></div>);

return(
<div style={{minHeight:"100vh",background:"white",paddingBottom:30, fontFamily:"sans-serif"}}>
<div style={{display:"flex",flexWrap:"wrap",gap:6,padding:10}}>
<button onClick={()=>setTab("vendre")} style={{background:tab==="vendre"?"#facc15":"#e5e7eb",color:tab==="vendre"?"black":"black",fontWeight:900,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>VENDRE</button>
<button onClick={()=>setTab("copier")} style={{background:tab==="copier"?"#60a5fa":"#e5e7eb",color:"black",fontWeight:700,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>COPIER</button>
<button onClick={()=>setTab("fiches")} style={{background:tab==="fiches"?"#4ade80":"#e5e7eb",color:"black",fontWeight:700,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>MES FICHES</button>
<button onClick={()=>setTab("rapport")} style={{background:tab==="rapport"?"#c084fc":"#e5e7eb",color:"black",fontWeight:700,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>RAPPORT</button>
<button onClick={()=>setTab("paramet")} style={{background:"#fb923c",color:"black",fontWeight:700,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>PARAMÈT</button>
<button onClick={()=>{localStorage.removeItem("cd_current_vendeur");setAuth(false);}} style={{background:"#ef4444",color:"white",fontWeight:900,padding:"10px 14px",borderRadius:8,border:"1px solid black",fontSize:13}}>X FÈMEN</button>
</div>

{tab==="vendre"&&(
<div style={{margin:10,background:"white",border:"2px solid black",borderRadius:16,padding:12}}>
<div style={{position:"relative"}}>
<button onClick={()=>setShowT(!showT)} style={{width:"100%",background:"white",border:"2px solid black",borderRadius:10,padding:12,fontWeight:700,display:"flex",justifyContent:"space-between"}}><span style={{color:"#1d4ed8"}}>Tout tiraj yo nan yon sèl Kaz</span><span style={{color:"#dc2626"}}>({tiragesSel.length}) ▼</span></button>
{showT&&(<div style={{position:"absolute",zIndex:20,width:"100%",background:"black",borderRadius:12,marginTop:6,padding:10,maxHeight:250,overflow:"auto"}}><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{TIRAGES.map(t=>{const f=isF(t);const sel=tiragesSel.includes(t.id);return <button key={t.id} disabled={f} onClick={()=>setTiragesSel(p=>p.includes(t.id)?p.filter(x=>x!==t.id):[...p,t.id])} style={{padding:"6px 10px",borderRadius:20,fontSize:12,fontWeight:700,background:f?"#333":sel?"#facc15":"white",color:f?"#777":sel?"black":"black",textDecoration:f?"line-through":"none",border:"1px solid black"}}>{t.nom} {f?'🔒':''}</button>})}</div></div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:8,marginTop:12}}>
<select value={jeux} onChange={e=>setJeux(e.target.value)} style={{height:50,background:"#fef08a",border:"2px solid black",borderRadius:10,fontWeight:900,textAlign:"center",color:"#1d4ed8"}}><option>BO</option><option>MA</option><option>L3</option><option>L4</option><option>L5</option></select>
<input ref={bRef} value={boul} onChange={e=>setBoul(e.target.value.replace(/\D/g,''))} onKeyDown={e=>key(e,"mise")} placeholder="Boul" inputMode="numeric" style={{height:50,border:"2px solid black",borderRadius:10,textAlign:"center",fontWeight:700,fontSize:20,color:"#7c3aed",outline:"none"}}/>
</div>
<div style={{marginTop:8}}>
<input ref={mRef} value={mise} onChange={e=>setMise(e.target.value.replace(/\D/g,''))} onKeyDown={e=>key(e,"add")} placeholder="Mise" inputMode="numeric" style={{width:"100%",height:50,border:"2px solid black",borderRadius:10,textAlign:"center",fontWeight:700,fontSize:20,color:"#15803d",outline:"none"}}/>
</div>

<div style={{background:"black",borderRadius:12,marginTop:12,padding:10,minHeight:70,textAlign:"center"}}>
{lignes.length===0?<div style={{color:"#4ade80"}}>Pa gen liy - <span style={{color:"#facc15"}}>Tape Boul + Mise</span></div>:lignes.map((l,i)=><div key={i}><span style={{color:"#facc15"}}>{l.jeux}</span> <span style={{color:"#22d3ee"}}>{l.boul}</span> <span style={{color:"#4ade80"}}>- {l.mise}G</span></div>)}
</div>

<div style={{background:"#fef9c3",border:"2px solid black",borderRadius:12,marginTop:12,padding:12,textAlign:"center",fontWeight:900}}>
<span style={{color:"#1d4ed8"}}>Total:</span> <span style={{color:"#7c3aed"}}>{lignes.reduce((s,l)=>s+l.mise,0)}G</span> <span style={{color:"#dc2626"}}>x {tiragesSel.length||1} tiraj</span> <span style={{color:"#15803d"}}>= {total}G</span>
</div>

<button onClick={()=>{const id="CD"+Date.now().toString().slice(-6);const fich={id,date:new Date().toISOString(),vendeur:nom,tirages:tiragesSel,lignes,total};const all=[fich,...fiches];setFiches(all);localStorage.setItem("cd_fiches",JSON.stringify(all));setLignes([]);setTiragesSel([]);}} style={{width:"100%",background:"#15803d",color:"white",fontWeight:900,padding:16,borderRadius:12,marginTop:12,fontSize:16,border:"2px solid black"}}>IMPRIMER - <span style={{color:"#facc15"}}>Santre Gran Lèt V2 Pro</span></button>

<div style={{background:"white",color:"black",width:280,margin:"16px auto",padding:16,border:"2px dashed black",fontFamily:"monospace",fontSize:13,textAlign:"center"}}>
<div style={{fontWeight:900,fontSize:18,color:"#dc2626"}}>C&D VÉRITÉ LOTTO</div>
<div style={{color:"#1d4ed8"}}>Date {new Date().toLocaleString()}</div>
<div style={{color:"#7c3aed"}}>Tirages {tiragesSel.length}</div>
<div style={{color:"#15803d"}}>Responsabla {nom}</div>
<div style={{marginTop:8,borderTop:"1px solid black",paddingTop:8}}>{lignes.map((l,i)=><div key={i}><span style={{color:"#1d4ed8"}}>{l.jeux}</span> {l.boul} - {l.mise}G</div>)}</div>
<div style={{fontWeight:900,marginTop:8,borderTop:"1px solid black",paddingTop:8,color:"#dc2626"}}>TOTAL {total}G</div>
<div style={{marginTop:16,color:"#15803d",fontWeight:700}}>Bòn chans, lave chodyè w</div>
</div>
</div>
)}
</div>
);
}
