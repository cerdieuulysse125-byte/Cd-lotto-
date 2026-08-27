"use client";
import {useState,useEffect} from "react";
import {loadDB,saveDB,TIRAGES,GlobalDB} from "./lib/db";
export default function Vendeur(){
 const [db,setDb]=useState<GlobalDB|null>(null); const [tab,setTab]=useState("VENDRE"); const [sel,setSel]=useState<string[]>([]); const [jeu,setJeu]=useState("Bolet"); const [boul,setBoul]=useState(""); const [miz,setMiz]=useState(""); const [fiches,setFiches]=useState<any[]>([]);
 useEffect(()=>{ const d=loadDB(); setDb(d); setFiches(d.tickets||[]); },[]);
 if(!db) return <div style={{padding:20}}>Loading V4...</div>;
 const toggle=(t:string)=>setSel(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t]);
 const ajouter=()=>{ if(!boul||!miz) return alert("Mete boul+miz"); if(!sel.length) return alert("Chwazi tiraj"); if(db.boulBloke?.includes(boul)) return alert("Boul bloke"); const f={id:Date.now(),jeu,boul,miz:parseInt(miz),tirages:sel,date:new Date().toISOString(),idTicket:"CD"+Date.now().toString().slice(-6)}; const nl=[...fiches,f]; setFiches(nl); const nd={...db,tickets:nl}; setDb(nd); saveDB(nd); setBoul(""); setMiz(""); };
 const total=fiches.reduce((s,f)=>s+f.miz,0);
 return (<div style={{maxWidth:480,margin:'0 auto',background:'#fff',color:'#000',minHeight:'100vh',padding:8}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6}}>{["VENDRE","COPIER","MES FICHES","RAPPORT"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:12,border:'2px solid #000',borderRadius:10,fontWeight:900,fontSize:9,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}</div>
  {tab==="VENDRE"&&<div><div style={{border:'2px solid #000',borderRadius:10,padding:8,marginTop:8}}><b>Tout tiraj yo nan Yon sèl Kaz (a chwazi) - Tiraj miltip</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:8,maxHeight:160,overflow:'auto'}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000',padding:8,borderRadius:6,fontSize:10,fontWeight:900,background:sel.includes(t)?"#b3e5fc":"#fff"}}><input type="checkbox" checked={sel.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}</div></div>
  <div style={{display:'flex',gap:6,marginTop:8}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}><option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option></select><input value={boul} onChange={e=>setBoul(e.target.value)} placeholder="Boul" style={{width:'28%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><input value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} placeholder="Miz" style={{width:'20%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><button onClick={ajouter} style={{width:'26%',background:'#0d7a3e',color:'#fff',borderRadius:8,fontWeight:900}}>OK</button></div>
  <div style={{border:'2px solid #000',borderRadius:8,minHeight:100,marginTop:8,padding:6}}>{fiches.map((f,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontWeight:900,fontSize:12,borderBottom:'1px solid #ccc',padding:4}}><span>{f.jeu} {f.boul} - {f.miz} - {f.tirages.join(',')}</span><span onClick={()=>{ const nl=fiches.filter((_,idx)=>idx!==i); setFiches(nl); const nd={...db,tickets:nl}; setDb(nd); saveDB(nd); }} style={{color:'red'}}>X</span></div>)}</div>
  <div style={{background:'#0d7a3e',color:'#fff',padding:12,borderRadius:8,marginTop:6,fontWeight:900,textAlign:'center'}}>Total {total} x {sel.length||1} = {total*(sel.length||1)} HTG</div>
  <button onClick={()=>window.print()} style={{width:'100%',padding:14,background:'#000',color:'#fff',borderRadius:8,marginTop:8,fontWeight:900}}>IMPRIMER SANTRE GWO LET</button></div>}
  {tab==="COPIER"&&<div style={{padding:10}}>Mete Id ticket pou kopye: {fiches.map(f=><div key={f.id}>{f.idTicket}</div>)}</div>}
  {tab==="MES FICHES"&&<div style={{padding:10}}>{fiches.map(f=><div key={f.id} style={{borderBottom:'1px solid #000',padding:6}}>{f.jeu} {f.boul} {f.miz}HTG</div>)}</div>}
  {tab==="RAPPORT"&&<div style={{padding:10}}><b>Rapport</b><div>Vente {total} HTG</div><div>Commission</div><div>Gain kliyan</div><div>Balance net - chak tiraj kalkile separeman</div></div>}
 </div>);
}
