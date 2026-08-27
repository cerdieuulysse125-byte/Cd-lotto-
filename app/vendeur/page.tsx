"use client";
import {useState,useEffect,useRef} from "react";
import {loadDB,saveDB,TIRAGES} from "./lib/db";
export default function Vendeur(){
 const [tab,setTab]=useState("VENDRE"); const [sel,setSel]=useState<string[]>([]); const [open,setOpen]=useState(false);
 const [jeu,setJeu]=useState("Bolet"); const [boul,setBoul]=useState(""); const [miz,setMiz]=useState(""); const [fiches,setFiches]=useState<any[]>([]); const [searchId,setSearchId]=useState("");
 const boulRef=useRef<HTMLInputElement>(null); const mizRef=useRef<HTMLInputElement>(null);
 useEffect(()=>setFiches(loadDB().tickets||[]),[]);
 const toggle=(t:string)=>setSel(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t]);
 const ajouter=()=>{
  const db=loadDB(); if(!boul||!miz) return alert("Mete boul+miz"); if(!sel.length) return alert("Chwazi tiraj");
  if(db.boulBloke.includes(boul)) return alert("Boul bloke");
  let b=boul; if(jeu==="Maryaj"){ b=boul.split(/x|X|×/).map((x:string)=>x.trim().padStart(2,'0')).sort().join('×'); }
  const f={id:Date.now(),jeu,boul:b,miz:parseInt(miz),tirages:sel,date:new Date().toISOString(),idTicket:"CD"+Date.now().toString().slice(-6)};
  const nl=[...fiches,f]; setFiches(nl); db.tickets=nl; saveDB(db); setBoul(""); setMiz(""); boulRef.current?.focus();
 };
 const total=fiches.reduce((s,f)=>s+f.miz,0); const grand=total*(sel.length||1);
 const print=()=>{
  const db=loadDB(); const lignes=fiches.map(f=>`<div style="display:flex;justify-content:space-between;font-size:32px;font-weight:900;line-height:38px"><span>${f.jeu} ${f.boul}</span><span>${f.miz}</span></div>`).join('');
  const w=window.open('','','width=400,height=800'); w!.document.write(`<html><head><style>@page{size:80mm auto;margin:0}body{margin:0;padding:0;display:flex;justify-content:center}.t{width:72mm;margin-top:4mm;text-align:center;font-family:monospace;font-weight:900;color:#000}.ttl{font-size:34px;line-height:36px}hr{border:none;border-top:3px dashed #000;margin:8px 0}</style></head><body><div class="t"><div class="ttl">${db.antet.nom}</div><div>${new Date().toLocaleString()}</div><div>${sel.join(',')}</div><div>${db.antet.vendeur}</div><hr/>${lignes}<hr/><div style="font-size:36px">TOTAL ${grand} HTG</div><hr/>${db.antet.pied}</div><script>setTimeout(()=>{window.print();window.close()},300)</script></body></html>`);
 };
 return (<div style={{maxWidth:480,margin:'0 auto',background:'#fff',minHeight:'100vh',color:'#000'}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6,padding:8}}>{["VENDRE","COPIER","MES FICHES","RAPPORT"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:14,borderRadius:12,border:'2px solid #000',fontWeight:900,fontSize:10,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}</div>
  {tab==="VENDRE"&&<div style={{padding:8}}>
   <div style={{position:'relative'}}><button onClick={()=>setOpen(!open)} style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:10,fontWeight:900,textAlign:'left',background:'#fff'}}>{sel.length?`▼ ${sel.length}: ${sel.join(', ')}`:"▼ CHWAZI TIRAJ - TOUT TIRAJ YO NAN YON SEL KAZ"}</button>
   {open&&<div style={{position:'absolute',top:48,left:0,right:0,background:'#fff',border:'2px solid #000',borderRadius:12,zIndex:9,maxHeight:320,overflow:'auto',padding:6,display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000',padding:10,borderRadius:8,background:sel.includes(t)?"#b3e5fc":"#fff",fontSize:11,fontWeight:900}}><input type="checkbox" checked={sel.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}<button onClick={()=>setOpen(false)} style={{gridColumn:'1 / span 2',background:'#000',color:'#fff',padding:12,borderRadius:8}}>OK FÈMEN</button></div>}</div>
   <div style={{display:'flex',gap:6,marginTop:12}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'28%',padding:14,border:'2px solid #000',borderRadius:12,fontWeight:900}}><option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option></select>
   <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault(); mizRef.current?.focus();}}} placeholder="Boul" style={{width:'30%',padding:14,border:'2px solid #000',borderRadius:12,fontWeight:900}}/>
   <input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} onKeyDown={e=>{if(e.key==='Enter') ajouter()}} placeholder="Miz" style={{width:'22%',padding:14,border:'2px solid #000',borderRadius:12,fontWeight:900}}/>
   <button onClick={ajouter} style={{width:'20%',background:'#0d7a3e',color:'#fff',border:'2px solid #000',borderRadius:12,fontWeight:900}}>OK</button></div>
   <div style={{border:'2px solid #000',borderRadius:12,minHeight:140,marginTop:10,padding:6}}>{fiches.map((f,i)=><div key={f.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 4px',borderBottom:'1px solid #ccc',fontWeight:900}}><span>{f.jeu} {f.boul} - {f.miz}</span><span onClick={()=>{const nl=fiches.filter((_,idx)=>idx!==i); setFiches(nl); const db=loadDB(); db.tickets=nl; saveDB(db)}} style={{color:'red'}}>X</span></div>)}</div>
   <div style={{background:'#0d7a3e',color:'#fff',textAlign:'center',padding:14,borderRadius:12,marginTop:8,fontWeight:900}}>Total {total} × {sel.length||1} = {grand} HTG - Limite Global = Som Vendeurs</div>
   <button onClick={print} style={{width:'100%',background:'#000',color:'#fff',padding:18,borderRadius:12,marginTop:10,fontWeight:900,fontSize:18}}>🖨️ IMPRIMER SANTRE GWO LET - SAN BODI MONTE ANLE</button>
  </div>}
  {tab==="COPIER"&&<div style={{padding:10}}><input value={searchId} onChange={e=>setSearchId(e.target.value)} placeholder="Mete Id ticket CD..." style={{width:'100%',padding:14,border:'2px solid #000',borderRadius:12}}/><div style={{marginTop:10}}>{fiches.filter(f=>f.idTicket?.includes(searchId)).map(f=><div key={f.id} style={{border:'1px solid #000',padding:10,marginBottom:6,borderRadius:8}}>{f.idTicket} - {f.jeu} {f.boul} {f.miz} HTG - {f.tirages.join(',')}</div>)}</div></div>}
  {tab==="MES FICHES"&&<div style={{padding:10}}><h3>Mes fiches - {new Date().toLocaleDateString()}</h3>{fiches.map(f=><div key={f.id} style={{borderBottom:'1px solid #000',padding:8}}>{new Date(f.date).toLocaleString()} - {f.jeu} {f.boul} - {f.tirages.join(',')} - {f.miz} HTG</div>)}</div>}
  {tab==="RAPPORT"&&<div style={{padding:10}}><b>Rapport - chak tiraj kalkile separeman</b><div>Vente: {grand} HTG</div><div>Commission 20%: {grand*0.2} HTG</div><div>Balance Net: {grand*0.8} HTG</div><button style={{width:'100%',padding:14,background:'#000',color:'#fff',borderRadius:12,marginTop:10}}>IMPRIMER RAPPORT</button></div>}
 </div>);
}
