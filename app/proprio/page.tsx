"use client";
import { useState, useEffect } from "react";
import { loadDB, saveDB, GlobalDB, TIRAGES } from "../lib/db";

export default function Proprio(){
  const [db,setDb]=useState<GlobalDB|null>(null);
  const [tab,setTab]=useState("Vendeurs");
  const [selTiraj,setSelTiraj]=useState("GA midi");
  const [selVendeur,setSelVendeur]=useState("");
  const [newV,setNewV]=useState({nom:"",modpas:"",serie:"",pou:"20"});
  const [boulInput,setBoulInput]=useState("");
  const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

  useEffect(()=>{ setDb(loadDB()); },[]);
  if(!db) return <div>Loading baz...</div>;
  const up=(fn:(d:GlobalDB)=>void)=>{ const nd={...db}; fn(nd); setDb(nd); saveDB(nd); };

  return (
  <div style={{maxWidth:560,margin:'0 auto',background:'#fff',minHeight:'100vh',color:'#000',padding:10}}>
    <h2 style={{fontWeight:900,textAlign:'center',border:'3px solid #000',padding:12,borderRadius:12}}>PROPRIO - 8 ONGLÈ - {db.antet.nom}</h2>
    <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:8,marginTop:10}}>
      {["Vendeurs","Limite","Fermeture","Prix","Rapport","Résultats","Entête","Paramètres"].map(t=>
        <button key={t} onClick={()=>setTab(t)} style={{padding:'10px 14px',borderRadius:20,border:'2px solid #000',fontWeight:900,whiteSpace:'nowrap',background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>
      )}
    </div>

    {tab==="Vendeurs" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>1- Gestion Vendeurs => Non - modpas - % - ouvert/fermé - X</b>
      <div style={{display:'flex',gap:6,marginTop:10}}>
        <input value={newV.nom} onChange={e=>setNewV({...newV,nom:e.target.value})} placeholder="Non vendeur" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/>
        <input value={newV.modpas} onChange={e=>setNewV({...newV,modpas:e.target.value})} placeholder="Modpas" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/>
        <input value={newV.pou} onChange={e=>setNewV({...newV,pou:e.target.value})} placeholder="%" style={{width:60,padding:10,border:'2px solid #000',borderRadius:8}}/>
        <button onClick={()=>{ if(!newV.nom) return; up(d=>d.vendeurs.push({id:Date.now(),proprioId:d.proprios[0].id,nom:newV.nom,modpas:newV.modpas,serie:newV.serie||"SERIE-"+Date.now().toString().slice(-4),pou:newV.pou,statut:"Aktif"})); setNewV({nom:"",modpas:"",serie:"",pou:"20"}); }} style={{background:'#0d7a3e',color:'#fff',padding:10,borderRadius:8,fontWeight:900}}>Ajouter nouveau vendeur</button>
      </div>
      {db.vendeurs.map(v=><div key={v.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #000',padding:8,marginTop:6,fontWeight:900,fontSize:12}}>
        <span>{v.nom} | {v.modpas} | {v.pou}% | {v.serie} | {v.statut}</span>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>up(d=>{ const f=d.vendeurs.find(x=>x.id===v.id); if(f) f.statut=f.statut==="Aktif"?"Bloke":"Aktif" })} style={{background:v.statut==="Aktif"?"#ff9800":"green",color:'#fff',padding:'4px 8px',borderRadius:6,border:'none'}}>{v.statut==="Aktif"?"Fermé":"Ouvert"}</button>
          <button onClick={()=>up(d=>d.vendeurs=d.vendeurs.filter(x=>x.id!==v.id))} style={{background:'red',color:'#fff',padding:'4px 8px',borderRadius:6,border:'none'}}>X</button>
        </div>
      </div>)}
    </div>}

    {tab==="Limite" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>2- Limite Mise (global modifiable) - Vendeurs (chwazi)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
        <div>Borlettes <input type="number" value={db.limits.global.bolet} onChange={e=>up(d=>d.limits.global.bolet=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Mariage <input type="number" value={db.limits.global.maryaj} onChange={e=>up(d=>d.limits.global.maryaj=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto3 <input type="number" value={db.limits.global.loto3} onChange={e=>up(d=>d.limits.global.loto3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto4 <input type="number" value={db.limits.global.loto4} onChange={e=>up(d=>d.limits.global.loto4=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto5 <input type="number" value={db.limits.global.loto5} onChange={e=>up(d=>d.limits.global.loto5=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
      </div>
      <select value={selVendeur} onChange={e=>setSelVendeur(e.target.value)} style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8,marginTop:10}}><option value="">Vendeurs (chwazi)</option>{db.vendeurs.map(v=><option key={v.id} value={v.nom}>{v.nom}</option>)}</select>
      {selVendeur && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginTop:8}}>
        <input type="number" placeholder="Bolet" value={db.limits.parVendeur[selVendeur]?.bolet||""} onChange={e=>up(d=>{ if(!d.limits.parVendeur[selVendeur]) d.limits.parVendeur[selVendeur]={}; d.limits.parVendeur[selVendeur].bolet=parseInt(e.target.value)||0 })} style={{padding:10,border:'2px solid #000',borderRadius:8}}/>
        <input type="number" placeholder="Maryaj" value={db.limits.parVendeur[selVendeur]?.maryaj||""} onChange={e=>up(d=>{ if(!d.limits.parVendeur[selVendeur]) d.limits.parVendeur[selVendeur]={}; d.limits.parVendeur[selVendeur].maryaj=parseInt(e.target.value)||0 })} style={{padding:10,border:'2px solid #000',borderRadius:8}}/>
        <input type="number" placeholder="Loto3" value={db.limits.parVendeur[selVendeur]?.loto3||""} onChange={e=>up(d=>{ if(!d.limits.parVendeur[selVendeur]) d.limits.parVendeur[selVendeur]={}; d.limits.parVendeur[selVendeur].loto3=parseInt(e.target.value)||0 })} style={{padding:10,border:'2px solid #000',borderRadius:8}}/>
      </div>}
    </div>}

    {tab==="Fermeture" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>3- L'heure fermeture modifiable</b>
      {TIRAGES.map(t=><div key={t} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #ccc'}}><span style={{fontWeight:900,fontSize:12}}>{t}</span><input type="time" value={db.fermetures[t]||""} onChange={e=>up(d=>d.fermetures[t]=e.target.value)} style={{padding:6,border:'2px solid #000',borderRadius:8}}/></div>)}
    </div>}

    {tab==="Prix" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>4- Prix paiements (modifiable) - Vendeurs (chwazi)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:10}}>
        <div>1er lot 50 <input type="number" value={db.prix.global.lot1} onChange={e=>up(d=>d.prix.global.lot1=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>2e lot 20 <input type="number" value={db.prix.global.lot2} onChange={e=>up(d=>d.prix.global.lot2=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>3e lot 10 <input type="number" value={db.prix.global.lot3} onChange={e=>up(d=>d.prix.global.lot3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Mariage1 1000 <input type="number" value={db.prix.global.m1} onChange={e=>up(d=>d.prix.global.m1=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Mariage2 1000 <input type="number" value={db.prix.global.m2} onChange={e=>up(d=>d.prix.global.m2=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Mariage3 1000 <input type="number" value={db.prix.global.m3} onChange={e=>up(d=>d.prix.global.m3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto3 500 <input type="number" value={db.prix.global.l3} onChange={e=>up(d=>d.prix.global.l3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto4 5000 <input type="number" value={db.prix.global.l4} onChange={e=>up(d=>d.prix.global.l4=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
        <div>Loto5 25000 <input type="number" value={db.prix.global.l5} onChange={e=>up(d=>d.prix.global.l5=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}/></div>
      </div>
      <select value={selVendeur} onChange={e=>setSelVendeur(e.target.value)} style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8,marginTop:10}}><option value="">Vendeurs (chwazi)</option>{db.vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
    </div>}

    {tab==="Rapport" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>5- Rapport : Du... Au.... Vendeurs(...,tous) Tirages(...,tous)</b>
      <div style={{display:'flex',gap:6,marginTop:8}}><input type="date" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><input type="date" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/></div>
      <div style={{marginTop:8}}>Vente: {db.tickets.reduce((s,f)=>s+f.miz,0)} HTG<br/>Commission<br/>Gain (kliyan)<br/>Balance net<br/>Si yon fich gen plizyè tiraj, chak tiraj kalkile separeman</div>
      <button style={{width:'100%',padding:14,background:'#000',color:'#fff',borderRadius:12,marginTop:10,fontWeight:900}}>IMPRIMER RAPPORT</button>
    </div>}

    {tab==="Résultats" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>6- Résultats : 9 cases - Tirage (.....)</b>
      <select value={selTiraj} onChange={e=>setSelTiraj(e.target.value)} style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8,marginTop:8}}>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginTop:12}}>
        <div>1er <input value={db.resultats[selTiraj]?.p1||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].p1=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>2e <input value={db.resultats[selTiraj]?.p2||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].p2=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>3e <input value={db.resultats[selTiraj]?.p3||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].p3=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>M1 <input value={db.resultats[selTiraj]?.m1||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].m1=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>M2 <input value={db.resultats[selTiraj]?.m2||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].m2=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>M3 <input value={db.resultats[selTiraj]?.m3||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].m3=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>L3 <input value={db.resultats[selTiraj]?.l3||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].l3=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>L4 <input value={db.resultats[selTiraj]?.l4||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].l4=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
        <div>L5 <input value={db.resultats[selTiraj]?.l5||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; d.resultats[selTiraj].l5=e.target.value })} style={{width:'100%',padding:14,border:'3px solid #000',borderRadius:8,fontWeight:900,textAlign:'center'}}/></div>
      </div>
      <div style={{marginTop:12,border:'2px solid #000',borderRadius:8,padding:8,background:'#f5f5f5'}}>
        <div style={{fontWeight:900,fontSize:12,display:'grid',gridTemplateColumns:'1.2fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr',gap:4}}><span>Tir</span><span>1e</span><span>2e</span><span>3e</span><span>M1</span><span>M2</span><span>M3</span><span>L3</span><span>L4</span><span>L5</span></div>
        {Object.entries(db.resultats).map(([t,r])=><div key={t} style={{display:'grid',gridTemplateColumns:'1.2fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr',gap:4,fontSize:11,fontWeight:900,borderTop:'1px solid #ccc',padding:'4px 0'}}><span>{t.slice(0,4)}</span><span>{r.p1}</span><span>{r.p2}</span><span>{r.p3}</span><span>{r.m1}</span><span>{r.m2}</span><span>{r.m3}</span><span>{r.l3}</span><span>{r.l4}</span><span>{r.l5}</span></div>)}
      </div>
      <div style={{marginTop:8,fontSize:11}}>Mariage dans l'ordre ou en désordre bon: 12×34=34×12 pri 1000</div>
    </div>}

    {tab==="Entête" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>7- Entête C&D VÉRITÉ LOTTO</b>
      <input value={db.antet.nom} onChange={e=>up(d=>d.antet.nom=e.target.value)} placeholder="Non antrepriz" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:8}}/>
      <input value={db.antet.adr} onChange={e=>up(d=>d.antet.adr=e.target.value)} placeholder="Adresse" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
      <input value={db.antet.tel} onChange={e=>up(d=>d.antet.tel=e.target.value)} placeholder="Téléphone" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
      <input value={db.proprios[0]?.resp||""} onChange={e=>up(d=>d.proprios[0].resp=e.target.value)} placeholder="Responsable" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
      <input value={db.proprios[0]?.modpas||""} onChange={e=>up(d=>d.proprios[0].modpas=e.target.value)} placeholder="Modepas proprio modifiable" style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}/>
    </div>}

    {tab==="Paramètres" && <div style={{border:'2px solid #000',borderRadius:12,padding:10,marginTop:10}}>
      <b>8- Paramètres</b>
      <div style={{marginTop:10}}><b>Tiraj (chwazi)</b><select value={selTiraj} onChange={e=>setSelTiraj(e.target.value)} style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8}}>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select></div>
      <div style={{marginTop:10,border:'1px solid #000',borderRadius:8,padding:8}}>
        <b>1- Horaires tirages => lundi à dimanche de... à...</b>
        {JOURS.map(j=><div key={j} style={{display:'flex',gap:6,marginTop:6}}><span style={{width:80,fontSize:12}}>{j}</span><input type="time" style={{flex:1,padding:6,border:'1px solid #000',borderRadius:6}}/><span>a</span><input type="time" style={{flex:1,padding:6,border:'1px solid #000',borderRadius:6}}/></div>)}
      </div>
      <div style={{marginTop:10}}><b>2- Bloke boul (00...99)</b><div style={{display:'flex',gap:6,marginTop:6}}><input value={boulInput} onChange={e=>setBoulInput(e.target.value)} placeholder="Ex: 12" style={{flex:1,padding:10,border:'2px solid #000',borderRadius:8}}/><button onClick={()=>{ if(!boulInput) return; up(d=>{ if(!d.boulBloke.includes(boulInput)) d.boulBloke.push(boulInput)}); setBoulInput(""); }} style={{padding:10,background:'#000',color:'#fff',borderRadius:8}}>Bloke</button></div><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{db.boulBloke.map(b=><span key={b} style={{background:'#000',color:'#fff',padding:'4px 8px',borderRadius:12,fontSize:12}} onClick={()=>up(d=>d.boulBloke=d.boulBloke.filter(x=>x!==b))}>{b} X</span>)}</div></div>
      <div style={{marginTop:10}}><b>3- Bloke vandè (chwazi)</b><select style={{width:'100%',padding:10,border:'2px solid #000',borderRadius:8,marginTop:6}}><option>Tous</option>{db.vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select></div>
    </div>}

    <button onClick={()=>{ saveDB(db); alert("✅ Anrejistre nan menm baz!"); }} style={{width:'100%',padding:18,background:'#000',color:'#fff',borderRadius:12,fontWeight:900,marginTop:14}}>💾 ANREJISTRE TOUT - MENM BAZ</button>
  </div>);
}
