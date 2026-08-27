"use client";
import {useState,useEffect} from "react";
const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];
const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

export default function Proprio(){
 const [tab,setTab]=useState("Vendeurs");
 const [vendeurs,setVendeurs]=useState<any[]>([{id:1,nom:"Toto",modpas:"1234",pou:"20",statut:"Aktif",serie:"SERIE-001"}]);
 const [nv,setNv]=useState({nom:"",modpas:"",pou:"20",serie:""});
 const [lim,setLim]=useState({bolet:1500,maryaj:100,loto3:100,loto4:20,loto5:5});
 const [ferm,setFerm]=useState<any>({"GA midi":"12:15","FL midi":"13:15","NY midi":"14:15","GA soir":"18:15","FL soir":"21:15","NY soir":"22:15","Real 12h45":"12:45","Primera dia":"11:50","Suerte dia":"12:20","Lote Dom":"01:45","Ganamas":"14:15","Suerte noche":"17:50","Primera noche":"19:50","Loteka":"19:45","Nacional noche":"20:50","Leidsa":"20:45","Anguila 10h":"09:55","Anguila 18h":"17:55"});
 const [prix,setPrix]=useState({lot1:50,lot2:20,lot3:10,m1:1000,m2:1000,m3:1000,l3:500,l4:5000,l5:25000});
 const [selTiraj,setSelTiraj]=useState("GA midi");
 const [resultats,setResultats]=useState<any>({});
 const [entete,setEntete]=useState({nom:"C&D VÉRITÉ LOTTO",adr:"Adresse....",tel:"Téléphone....",resp:"Responsable...",modpas:"1234"});
 const [boulBloke,setBoulBloke]=useState<string[]>([]);
 const [boulInput,setBoulInput]=useState("");

 useEffect(()=>{ const s=localStorage.getItem("CD_PROPRIO_V7"); if(s){ try{ const p=JSON.parse(s); setVendeurs(p.vendeurs||vendeurs); setLim(p.lim||lim); setFerm(p.ferm||ferm); setPrix(p.prix||prix); setResultats(p.resultats||{}); setEntete(p.entete||entete); setBoulBloke(p.boulBloke||[]); }catch{} } },[]);
 const save=()=>{ localStorage.setItem("CD_PROPRIO_V7",JSON.stringify({vendeurs,lim,ferm,prix,resultats,entete,boulBloke})); alert("✅ Anrejistre!"); };

 return (
 <div style={{maxWidth:560,margin:'0 auto',background:'#fff',color:'#000',minHeight:'100vh',padding:10,fontFamily:'sans-serif'}}>
  <div style={{border:'3px solid #000',borderRadius:12,padding:12,textAlign:'center',fontWeight:900}}>PROPRIO - 7 ONGLÈ - {entete.nom}</div>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6,marginTop:10}}>
   {["Vendeurs","Limite","Fermeture","Prix","Rapport","Resultats","Parametres"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:11,border:'2px solid #000',borderRadius:10,fontWeight:900,fontSize:10,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}
  </div>

  {tab==="Vendeurs"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Gestion Vendeurs => Non vendeur - modpas - % - ouvert/fermé - X - Ajouter nouveau vendeur - 4- ajoute vandè - nimewo seri - modpas - %</b>
   <div style={{display:'flex',gap:6,marginTop:10}}><input value={nv.nom} onChange={e=>setNv({...nv,nom:e.target.value})} placeholder="Non vendeur" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><input value={nv.modpas} onChange={e=>setNv({...nv,modpas:e.target.value})} placeholder="Modpas" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><input value={nv.pou} onChange={e=>setNv({...nv,pou:e.target.value})} placeholder="%" style={{width:50,padding:10,border:'2px solid #000',borderRadius:8}}/><input value={nv.serie} onChange={e=>setNv({...nv,serie:e.target.value})} placeholder="Serie" style={{width:70,padding:10,border:'2px solid #000',borderRadius:8}}/></div>
   <button onClick={()=>{ if(!nv.nom) return; setVendeurs([...vendeurs,{id:Date.now(),nom:nv.nom,modpas:nv.modpas,pou:nv.pou,serie:nv.serie||"SERIE-"+Date.now().toString().slice(-4),statut:"Aktif"}]); setNv({nom:"",modpas:"",pou:"20",serie:""}); }} style={{width:'100%',padding:12,background:'#0d7a3e',color:'#fff',borderRadius:8,marginTop:8,fontWeight:900}}>＋ Ajouter nouveau vendeur</button>
   {vendeurs.map((v:any)=><div key={v.id} style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #000',fontWeight:900,fontSize:11}}><span>{v.nom} | {v.modpas} | {v.pou}% | {v.serie} | {v.statut}</span><div><button onClick={()=>setVendeurs(vendeurs.map(x=>x.id===v.id?{...x,statut:x.statut==="Aktif"?"Bloke":"Aktif"}:x))} style={{marginRight:6,fontSize:10,padding:'4px 6px'}}>{v.statut==="Aktif"?"Fermé":"Ouvert"}</button><button onClick={()=>setVendeurs(vendeurs.filter(x=>x.id!==v.id))} style={{background:'red',color:'#fff',border:'none',borderRadius:6,padding:'4px 8px'}}>X</button></div></div>)}
  </div>}

  {tab==="Limite"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Limite Mise (global) modifiable - Proprio (chwazi) - Vendeurs (chwazi)</b>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:8}}><option>Proprio (chwazi)</option></select>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}><option>Vendeurs (chwazi)</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}><div>Borlettes 1500<input type="number" value={lim.bolet} onChange={e=>setLim({...lim,bolet:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Mariage 100<input type="number" value={lim.maryaj} onChange={e=>setLim({...lim,maryaj:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto3 100<input type="number" value={lim.loto3} onChange={e=>setLim({...lim,loto3:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto4 20<input type="number" value={lim.loto4} onChange={e=>setLim({...lim,loto4:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto5 5<input type="number" value={lim.loto5} onChange={e=>setLim({...lim,loto5:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div></div>
  </div>}

  {tab==="Fermeture"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>L'heure fermeture modifiable</b>
   {TIRAGES.map(t=><div key={t} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #ccc'}}><span style={{fontSize:11,fontWeight:900}}>{t}</span><input type="time" value={ferm[t]||""} onChange={e=>setFerm({...ferm,[t]:e.target.value})} style={{padding:5,border:'2px solid #000',borderRadius:6}}/></div>)}
  </div>}

  {tab==="Prix"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Prix paiements modifiable - Proprio (chwazi) - Vendeurs (chwazi)</b>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:8}}><option>Proprio (chwazi)</option></select>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}><option>Vendeurs (chwazi)</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginTop:10}}><div>1er lot 50<input type="number" value={prix.lot1} onChange={e=>setPrix({...prix,lot1:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>2e lot 20<input type="number" value={prix.lot2} onChange={e=>setPrix({...prix,lot2:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>3e lot 10<input type="number" value={prix.lot3} onChange={e=>setPrix({...prix,lot3:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Mariage1 1000<input type="number" value={prix.m1} onChange={e=>setPrix({...prix,m1:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Mariage2 1000<input type="number" value={prix.m2} onChange={e=>setPrix({...prix,m2:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Mariage3 1000<input type="number" value={prix.m3} onChange={e=>setPrix({...prix,m3:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto3 500<input type="number" value={prix.l3} onChange={e=>setPrix({...prix,l3:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto4 5000<input type="number" value={prix.l4} onChange={e=>setPrix({...prix,l4:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div><div>Loto5 25000<input type="number" value={prix.l5} onChange={e=>setPrix({...prix,l5:parseInt(e.target.value)||0})} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div></div>
  </div>}

  {tab==="Rapport"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Rapport : Du... Au.... Vendeurs (...., tous) Tirages(...., tous) - Vente - Commission - Gain (kliyan) - Balance net - Imprimer - Si fich gen plizye titaj, chak tiraj kalkile separeman</b>
   <div style={{display:'flex',gap:6,marginTop:8}}><input type="date" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><input type="date" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/></div>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}><option>Vendeurs (...., tous)</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
   <select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}><option>Tirages(...., tous)</option>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>
   <div style={{marginTop:8}}>Vente<br/>Commission<br/>Gain (kliyan)<br/>Balance net</div>
   <button style={{width:'100%',padding:12,background:'#000',color:'#fff',borderRadius:8,marginTop:8,fontWeight:900}}>Imprimer</button>
  </div>}

  {tab==="Resultats"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Resultats : 9 cases pour ecrire les resultats - Tirage(.....) - 1er 2e 3e M1 / M2 M3 L3 L4 L5 - Kaz yo</b>
   <select value={selTiraj} onChange={e=>setSelTiraj(e.target.value)} style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8,marginTop:8}}>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginTop:10}}>
    {["p1:1er","p2:2e","p3:3e","m1:M1","m2:M2","m3:M3","l3:L3","l4:L4","l5:L5"].map(k=>{ const [f,l]=k.split(':'); return <div key={f}>{l}<input value={resultats[selTiraj]?.[f]||""} onChange={e=>setResultats({...resultats,[selTiraj]:{...(resultats[selTiraj]||{}),[f]:e.target.value}})} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div> })}
   </div>
   <div style={{marginTop:12,border:'2px solid #000',borderRadius:8,padding:8,background:'#f5f5f5'}}>
    <div style={{fontWeight:900,fontSize:10,display:'grid',gridTemplateColumns:'1fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr',gap:2}}><span>Tir</span><span>1e</span><span>2e</span><span>3e</span><span>M1</span><span>M2</span><span>M3</span><span>L3</span><span>L4</span><span>L5</span></div>
    {Object.entries(resultats).map(([t,r]:any)=><div key={t} style={{display:'grid',gridTemplateColumns:'1fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr',gap:2,fontSize:10,fontWeight:900,borderTop:'1px solid #ccc',padding:'4px 0'}}><span style={{fontSize:9}}>{t.slice(0,6)}</span><span>{r.p1}</span><span>{r.p2}</span><span>{r.p3}</span><span>{r.m1}</span><span>{r.m2}</span><span>{r.m3}</span><span>{r.l3}</span><span>{r.l4}</span><span>{r.l5}</span></div>)}
   </div>
   <div style={{fontSize:10,marginTop:6}}>Mariage dans l'ordre ou en desordre (bon) Ex:12×34=34×12 pri 1000 - Apre rezilta yo fin anrejistre nan Kaz yo, yo dwe afiche otomatikman nan tablo a selon Chak tiraj</div>
  </div>}

  {tab==="Parametres"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}>
   <b>Entête - C&D VÉRITÉ LOTTO - Adresse - Téléphone - Responsable - Modepas proprio modifiable - Parametres</b>
   <input value={entete.nom} onChange={e=>setEntete({...entete,nom:e.target.value})} placeholder="C&D VÉRITÉ LOTTO" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:8}}/>
   <input value={entete.adr} onChange={e=>setEntete({...entete,adr:e.target.value})} placeholder="Adresse...." style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
   <input value={entete.tel} onChange={e=>setEntete({...entete,tel:e.target.value})} placeholder="Téléphone...." style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
   <input value={entete.resp} onChange={e=>setEntete({...entete,resp:e.target.value})} placeholder="Responsable..." style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
   <input value={entete.modpas} onChange={e=>setEntete({...entete,modpas:e.target.value})} placeholder="Modepas proprio modifiable" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
   <div style={{marginTop:12,border:'1px solid #000',borderRadius:8,padding:8}}>
    <b>Tiraj (chwazi)</b><select value={selTiraj} onChange={e=>setSelTiraj(e.target.value)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:4}}>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>
    <div style={{marginTop:8}}><b>1- Horaires tirages => tirages (...,tous)=> lundi de... Heures à... Heures...</b>{JOURS.map(j=><div key={j} style={{display:'flex',gap:4,marginTop:4,alignItems:'center'}}><span style={{width:70,fontSize:10}}>{j}</span><input type="time" style={{flex:1,padding:4,border:'1px solid #000',borderRadius:4}}/><span style={{fontSize:10}}>à</span><input type="time" style={{flex:1,padding:4,border:'1px solid #000',borderRadius:4}}/></div>)}</div>
    <div style={{marginTop:10}}><b>2- Bloke boul: (00......99)</b><div style={{display:'flex',gap:6,marginTop:4}}><input value={boulInput} onChange={e=>setBoulInput(e.target.value)} placeholder="Ex: 12" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><button onClick={()=>{ if(!boulInput) return; if(!boulBloke.includes(boulInput)) setBoulBloke([...boulBloke,boulInput]); setBoulInput(""); }} style={{padding:10,background:'#000',color:'#fff',borderRadius:8}}>Bloke</button></div><div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>{boulBloke.map(b=><span key={b} onClick={()=>setBoulBloke(boulBloke.filter(x=>x!==b))} style={{background:'#000',color:'#fff',padding:'4px 8px',borderRadius:12,fontSize:11}}>{b} X</span>)}</div></div>
    <div style={{marginTop:10}}><b>3- bloke vandè (....,tous)</b><select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:4}}><option>....,tous</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select></div>
   </div>
  </div>}

  <button onClick={save} style={{width:'100%',padding:16,background:'#000',color:'#fff',borderRadius:12,fontWeight:900,marginTop:12}}>💾 ANREJISTRE TOUT - 7 ONGLÈ</button>
 </div>);
}
