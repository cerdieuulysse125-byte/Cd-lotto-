"use client";
import {useState} from "react";
const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];
export default function Page(){
 const [tab,setTab]=useState("VENDRE"); const [sel,setSel]=useState<string[]>([]); const [jeu,setJeu]=useState("Bolet"); const [boul,setBoul]=useState(""); const [miz,setMiz]=useState(""); const [fiches,setFiches]=useState<any[]>([]);
 const toggle=(t:string)=>setSel(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t]);
 const ajouter=()=>{ if(!boul||!miz||!sel.length) return alert("Mete boul+miz+tiraj"); const f={jeu,boul,miz:parseInt(miz),tirages:sel}; setFiches([...fiches,f]); setBoul(""); setMiz(""); };
 const total=fiches.reduce((s,f)=>s+f.miz,0);
 return (
 <div style={{maxWidth:480,margin:'0 auto',background:'#fff',color:'#000',minHeight:'100vh',padding:8,fontFamily:'sans-serif'}}>
  <h3 style={{textAlign:'center',border:'3px solid #000',borderRadius:12,padding:10}}>C&D VERITE - VANDÈ V4 FINAL</h3>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginTop:10}}>
   {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMET","X FEMEN"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:14,border:'2px solid #000',borderRadius:12,fontWeight:900,fontSize:11,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}
  </div>

  {tab==="VENDRE"&&<>
   <div style={{border:'2px solid #000',borderRadius:10,padding:8,marginTop:10}}><b>Tout tiraj nan yon sel kaz - chwazi plizye</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginTop:6,maxHeight:150,overflow:'auto'}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000',padding:7,borderRadius:6,fontSize:10,fontWeight:900,background:sel.includes(t)?"#b3e5fc":"#fff"}}><input type="checkbox" checked={sel.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}</div></div>
   <div style={{display:'flex',gap:6,marginTop:8}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%',padding:12,border:'2px solid #000',borderRadius:8}}><option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option></select><input value={boul} onChange={e=>setBoul(e.target.value)} placeholder="Boul 00" style={{width:'27%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><input value={miz} onChange={e=>setMiz(e.target.value)} placeholder="Miz" style={{width:'20%',padding:12,border:'2px solid #000',borderRadius:8}}/><button onClick={ajouter} style={{width:'27%',background:'#0d7a3e',color:'#fff',borderRadius:8,fontWeight:900}}>OK</button></div>
   <div style={{border:'2px solid #000',minHeight:80,marginTop:8,borderRadius:8,padding:6}}>{fiches.map((f,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontWeight:900,borderBottom:'1px solid #ccc'}}><span>{f.jeu} {f.boul} {f.miz} - {f.tirages.join(',')}</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span></div>)}</div>
   <div style={{background:'#0d7a3e',color:'#fff',padding:12,borderRadius:8,marginTop:6,textAlign:'center',fontWeight:900}}>Total {total} x {sel.length||1} = {total*(sel.length||1)} HTG - Limite Global = Som Vendeurs</div>
   <button onClick={()=>window.print()} style={{width:'100%',padding:14,background:'#000',color:'#fff',borderRadius:8,marginTop:6,fontWeight:900}}>IMPRIMER SANTRE GWO LET 58mm</button>
  </>}

  {tab==="RAPPORT"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}><b>RAPPORT - Li pa vid ankò</b><div>Vente: {total} HTG</div><div>Commission: {total*0.2} HTG</div><div>Gain kliyan: 0</div><div>Balance net: {total*0.8} HTG</div><div style={{fontSize:11,marginTop:6}}>Si fich gen plizye tiraj, chak tiraj kalkile separeman selon rezilta yo - Mariage 12x34=34x12 bon</div><button style={{width:'100%',padding:12,background:'#000',color:'#fff',borderRadius:8,marginTop:8}}>IMPRIMER RAPPORT</button></div>}

  {tab==="MES FICHES"&&<div style={{padding:10,marginTop:10,border:'2px solid #000',borderRadius:10}}>{fiches.length===0?"Pa gen fich":fiches.map((f,i)=><div key={i} style={{borderBottom:'1px solid #000',padding:6}}>{f.jeu} {f.boul} - {f.miz}HTG</div>)}</div>}

  {tab==="COPIER"&&<div style={{padding:10,marginTop:10,border:'2px solid #000',borderRadius:10}}><input placeholder="Mete ID CD..." style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8}}/></div>}
  {tab==="PARAMET"&&<div style={{padding:10,marginTop:10,border:'2px solid #000',borderRadius:10}}>Paramèt vandè</div>}
 </div>);
}
