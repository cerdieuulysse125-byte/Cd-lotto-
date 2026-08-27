"use client";
import { useState, useEffect } from "react";
import { loadDB, saveDB, GlobalDB, TIRAGES } from "../lib/db";

export default function SuperAdmin(){
  const [db,setDb]=useState<GlobalDB|null>(null);
  const [tab,setTab]=useState("Dashboard");
  const [selTiraj,setSelTiraj]=useState("GA midi");
  const [selProprio,setSelProprio]=useState("");
  const [selVendeur,setSelVendeur]=useState("");
  const [newProprio,setNewProprio]=useState({nom:"",modpas:"",tel:"",adr:"",resp:""});
  const [newVendeur,setNewVendeur]=useState({proprioId:"1",nom:"",modpas:"",serie:"",pou:"20"});
  const [msgProprio,setMsgProprio]=useState({id:0,msg:""});

  useEffect(()=>{ setDb(loadDB()); },[]);
  if(!db) return <div>Loading baz...</div>;
  const up=(fn:(d:GlobalDB)=>void)=>{ const nd={...db}; fn(nd); setDb(nd); saveDB(nd); };

  return (
  <div style={{background:'#000',minHeight:'100vh',color:'#fff',padding:10}}>
    <h1 style={{color:'red',textAlign:'center',fontWeight:900,fontSize:28,border:'3px solid red',padding:10,borderRadius:12}}>🔴 SUPER-ADMIN C&D - MENM BAZ</h1>

    <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:10,marginTop:12}}>
      {["Dashboard","Vendeurs","Proprios","Résultats","Limite","Fermeture","Prix","Paramètres"].map(t=>
        <button key={t} onClick={()=>setTab(t)} style={{padding:'12px 18px',borderRadius:24,border:'none',fontWeight:900,whiteSpace:'nowrap',background:tab===t?'red':'#333',color:'#fff'}}>{t}</button>
      )}
    </div>

    {tab==="Dashboard" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <h3 style={{color:'red'}}>Mesaj pou avèti proprio yo avan kont yo bloke + Bloke - Debloke Kont proprio</h3>
      {db.proprios.map(p=><div key={p.id} style={{border:'1px solid #444',borderRadius:12,padding:12,marginTop:10,background:'#222'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontWeight:900,fontSize:18}}>{p.nom} - {p.tel}</div><div style={{fontSize:12,color:'#aaa'}}>Vendeur: {db.vendeurs.filter(v=>v.proprioId===p.id).length} | Statut: <span style={{color:p.statut==="Aktif"?"#0f0":"red"}}>{p.statut}</span></div><div style={{fontSize:12,color:'#ff0',marginTop:4}}>Msg: {p.msg||"Pa gen mesaj"}</div></div>
          <button onClick={()=>up(d=>{ const pr=d.proprios.find(x=>x.id===p.id); if(pr) pr.statut=pr.statut==="Aktif"?"Bloke":"Aktif" })} style={{padding:'10px 16px',borderRadius:10,border:'none',fontWeight:900,background:p.statut==="Aktif"?"red":"#0d7a3e",color:'#fff'}}>{p.statut==="Aktif"?"BLOKE":"DEBLOKE"}</button>
        </div>
        <div style={{display:'flex',gap:6,marginTop:10}}>
          <input value={msgProprio.id===p.id?msgProprio.msg:p.msg} onChange={e=>{ if(msgProprio.id!==p.id) setMsgProprio({id:p.id,msg:e.target.value}); else setMsgProprio({...msgProprio,msg:e.target.value}); up(d=>{ const pr=d.proprios.find(x=>x.id===p.id); if(pr) pr.msg=e.target.value }); }} placeholder="Mesaj avètisman avan bloke..." style={{flex:1,padding:10,borderRadius:8,background:'#000',color:'#ff0',border:'1px solid #555'}}/>
          <button onClick={()=>{ up(d=>{ const pr=d.proprios.find(x=>x.id===p.id); if(pr) pr.msg=msgProprio.msg }); alert("Mesaj voye bay "+p.nom); }} style={{background:'#ff0',color:'#000',padding:'8px 12px',borderRadius:8,fontWeight:900,border:'none'}}>VOYE MESAJ</button>
        </div>
      </div>)}
    </div>}

    {tab==="Vendeurs" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>a) Vandè (kreye nouvo vandè => Pou ki proprio => non vandè => modpas => nimewo seri Terminal)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
        <select value={newVendeur.proprioId} onChange={e=>setNewVendeur({...newVendeur,proprioId:e.target.value})} style={{padding:12,borderRadius:10,background:'#333',color:'#fff',border:'1px solid #555'}}><option value="">Pou ki proprio</option>{db.proprios.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}</select>
        <input value={newVendeur.nom} onChange={e=>setNewVendeur({...newVendeur,nom:e.target.value})} placeholder="Non vendeur" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newVendeur.modpas} onChange={e=>setNewVendeur({...newVendeur,modpas:e.target.value})} placeholder="Modpas" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newVendeur.serie} onChange={e=>setNewVendeur({...newVendeur,serie:e.target.value})} placeholder="Nimewo seri Terminal" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newVendeur.pou} onChange={e=>setNewVendeur({...newVendeur,pou:e.target.value})} placeholder="%" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <button onClick={()=>{ if(!newVendeur.nom||!newVendeur.proprioId) return alert("Chwazi proprio ak non"); up(d=>d.vendeurs.push({id:Date.now(),proprioId:parseInt(newVendeur.proprioId),nom:newVendeur.nom,modpas:newVendeur.modpas,serie:newVendeur.serie,pou:newVendeur.pou,statut:"Aktif"})); setNewVendeur({proprioId:"1",nom:"",modpas:"",serie:"",pou:"20"}); }} style={{gridColumn:'1 / span 2',padding:14,background:'#0d7a3e',color:'#fff',borderRadius:10,fontWeight:900,border:'none'}}>＋ KREYE NOUVO VANDÈ</button>
      </div>
      <div style={{marginTop:14}}>{db.vendeurs.map(v=><div key={v.id} style={{display:'flex',justifyContent:'space-between',padding:10,borderBottom:'1px solid #333',fontSize:12}}><span>{db.proprios.find(p=>p.id===v.proprioId)?.nom} → {v.nom} | {v.serie} | {v.pou}%</span><button onClick={()=>up(d=>d.vendeurs=d.vendeurs.filter(x=>x.id!==v.id))} style={{background:'red',color:'#fff',border:'none',borderRadius:6,padding:'4px 8px'}}>X</button></div>)}</div>
    </div>}

    {tab==="Proprios" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>b) Proprio : (kreye nouvo proprio => non proprio => modpas => lis vandè proprio)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
        <input value={newProprio.nom} onChange={e=>setNewProprio({...newProprio,nom:e.target.value})} placeholder="Non proprio" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newProprio.modpas} onChange={e=>setNewProprio({...newProprio,modpas:e.target.value})} placeholder="Modpas" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newProprio.tel} onChange={e=>setNewProprio({...newProprio,tel:e.target.value})} placeholder="Tel" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <input value={newProprio.adr} onChange={e=>setNewProprio({...newProprio,adr:e.target.value})} placeholder="Adresse" style={{padding:12,borderRadius:10,background:'#000',color:'#fff',border:'1px solid #555'}}/>
        <button onClick={()=>{ if(!newProprio.nom) return; up(d=>d.proprios.push({id:Date.now(),nom:newProprio.nom,modpas:newProprio.modpas,tel:newProprio.tel,adr:newProprio.adr,resp:"",logo:"",statut:"Aktif",msg:""})); setNewProprio({nom:"",modpas:"",tel:"",adr:"",resp:""}); }} style={{gridColumn:'1 / span 2',padding:14,background:'red',color:'#fff',borderRadius:10,fontWeight:900,border:'none'}}>＋ KREYE NOUVO PROPRIO</button>
      </div>
      <div style={{marginTop:14}}>{db.proprios.map(p=><div key={p.id} style={{border:'1px solid #333',borderRadius:10,padding:10,marginTop:8}}><div style={{fontWeight:900}}>{p.nom} - {p.tel} - {p.statut}</div><div style={{fontSize:11,color:'#aaa'}}>Vandè: {db.vendeurs.filter(v=>v.proprioId===p.id).map(v=>v.nom).join(', ')||"Aucun"}</div></div>)}</div>
    </div>}

    {tab==="Résultats" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>Résultats - 9 cases - Tirage (.....)</b>
      <select value={selTiraj} onChange={e=>setSelTiraj(e.target.value)} style={{width:'100%',padding:14,borderRadius:12,background:'#333',color:'#fff',marginTop:8}}>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginTop:12}}>
        {["p1:1er","p2:2e","p3:3e","m1:M1","m2:M2","m3:M3","l3:L3","l4:L4","l5:L5"].map(k=>{
          const [field,label]=k.split(':');
          return <div key={field}>{label}<input value={(db.resultats[selTiraj] as any)?.[field]||""} onChange={e=>up(d=>{ if(!d.resultats[selTiraj]) d.resultats[selTiraj]={p1:"",p2:"",p3:"",m1:"",m2:"",m3:"",l3:"",l4:"",l5:""}; (d.resultats[selTiraj] as any)[field]=e.target.value })} style={{width:'100%',padding:16,borderRadius:10,background:'#000',color:'#0f0',border:'2px solid #555',fontWeight:900,textAlign:'center',fontSize:18}}/></div>
        })}
      </div>
      <div style={{marginTop:14,border:'2px solid #444',borderRadius:10,padding:8,background:'#000'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr',gap:4,fontWeight:900,fontSize:11,color:'#ff0'}}><span>Tir</span><span>1e</span><span>2e</span><span>3e</span><span>M1</span><span>M2</span><span>M3</span><span>L3</span><span>L4</span><span>L5</span></div>
        {Object.entries(db.resultats).map(([t,r])=><div key={t} style={{display:'grid',gridTemplateColumns:'1fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr',gap:4,fontSize:12,borderTop:'1px solid #333',padding:'6px 0'}}><span style={{fontSize:10}}>{t}</span><span>{r.p1}</span><span>{r.p2}</span><span>{r.p3}</span><span>{r.m1}</span><span>{r.m2}</span><span>{r.m3}</span><span>{r.l3}</span><span>{r.l4}</span><span>{r.l5}</span></div>)}
      </div>
    </div>}

    {tab==="Limite" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>Limite Mise (global)/Par proprio/vendeur (modifiable)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:10}}>
        <div>Borlettes<input type="number" value={db.limits.global.bolet} onChange={e=>up(d=>d.limits.global.bolet=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>Mariage<input type="number" value={db.limits.global.maryaj} onChange={e=>up(d=>d.limits.global.maryaj=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>Loto3<input type="number" value={db.limits.global.loto3} onChange={e=>up(d=>d.limits.global.loto3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
      </div>
      <select value={selProprio} onChange={e=>setSelProprio(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#333',color:'#fff',marginTop:10}}><option>Proprio (chwazi)</option>{db.proprios.map(p=><option key={p.id}>{p.nom}</option>)}</select>
      <select value={selVendeur} onChange={e=>setSelVendeur(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#333',color:'#fff',marginTop:8}}><option>Vendeurs (chwazi)</option>{db.vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
    </div>}

    {tab==="Fermeture" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>L'heure fermeture modifiable</b>
      {TIRAGES.map(t=><div key={t} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #333'}}><span style={{fontSize:12}}>{t}</span><input type="time" value={db.fermetures[t]||""} onChange={e=>up(d=>d.fermetures[t]=e.target.value)} style={{background:'#000',color:'#fff',border:'1px solid #555',borderRadius:8,padding:6}}/></div>)}
    </div>}

    {tab==="Prix" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>Prix paiement (global)/par proprio/vendeur (modifiable)</b>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:10}}>
        <div>1er lot<input type="number" value={db.prix.global.lot1} onChange={e=>up(d=>d.prix.global.lot1=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>2e lot<input type="number" value={db.prix.global.lot2} onChange={e=>up(d=>d.prix.global.lot2=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>3e lot<input type="number" value={db.prix.global.lot3} onChange={e=>up(d=>d.prix.global.lot3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>M1<input type="number" value={db.prix.global.m1} onChange={e=>up(d=>d.prix.global.m1=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>M2<input type="number" value={db.prix.global.m2} onChange={e=>up(d=>d.prix.global.m2=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>M3<input type="number" value={db.prix.global.m3} onChange={e=>up(d=>d.prix.global.m3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>Loto3<input type="number" value={db.prix.global.l3} onChange={e=>up(d=>d.prix.global.l3=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>Loto4<input type="number" value={db.prix.global.l4} onChange={e=>up(d=>d.prix.global.l4=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
        <div>Loto5<input type="number" value={db.prix.global.l5} onChange={e=>up(d=>d.prix.global.l5=parseInt(e.target.value)||0)} style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff'}}/></div>
      </div>
      <select value={selProprio} onChange={e=>setSelProprio(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#333',color:'#fff',marginTop:10}}><option>Proprio (chwazi)</option>{db.proprios.map(p=><option key={p.id}>{p.nom}</option>)}</select>
      <select value={selVendeur} onChange={e=>setSelVendeur(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#333',color:'#fff',marginTop:8}}><option>Vendeurs (chwazi)</option>{db.vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
    </div>}

    {tab==="Paramètres" && <div style={{background:'#1a1a1a',borderRadius:16,padding:14,marginTop:10}}>
      <b>Paramètres: Modpas super-admin + Ajoute logo + Modifye antèt + Tèks pye paj</b>
      <div style={{marginTop:12}}>
        <label>Modpas super-admin (modifiable)</label>
        <input type="password" value={db.supModpas} onChange={e=>up(d=>d.supModpas=e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#000',color:'#fff',marginTop:4,border:'1px solid #555'}}/>
      </div>
      <div style={{marginTop:12}}>
        <label>Ajoute logo (foto logo) => pou ki proprio</label>
        <select value={selProprio} onChange={e=>setSelProprio(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,background:'#333',color:'#fff',marginTop:4}}><option value="">Chwazi proprio</option>{db.proprios.map(p=><option key={p.id} value={p.nom}>{p.nom}</option>)}</select>
        <input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ up(d=>{ const pr=d.proprios.find(x=>x.nom===selProprio); if(pr) pr.logo=reader.result as string; if(!selProprio) d.antet.logo=reader.result as string; }); }; reader.readAsDataURL(file); }} style={{width:'100%',marginTop:8}}/>
        {db.antet.logo && <img src={db.antet.logo} style={{width:80,height:80,objectFit:'contain',marginTop:8,background:'#fff',borderRadius:8}}/>}
      </div>
      <div style={{marginTop:14,border:'1px solid #444',borderRadius:12,padding:12}}>
        <b>Modifye antèt => Proprio (chwazi)</b>
        <div>Logo {db.antet.logo?"✅":"❌"}</div>
        <input value={db.antet.nom} onChange={e=>up(d=>d.antet.nom=e.target.value)} placeholder="Non antrepriz la" style={{width:'100%',padding:10,borderRadius:8,background:'#000',color:'#fff',marginTop:6}}/>
        <div style={{display:'flex',gap:8,marginTop:8}}><label><input type="checkbox" checked={db.antet.showDat} onChange={e=>up(d=>d.antet.showDat=e.target.checked)}/> Dat</label><label><input type="checkbox" checked={db.antet.showTiraj} onChange={e=>up(d=>d.antet.showTiraj=e.target.checked)}/> Tiraj</label><label><input type="checkbox" checked={db.antet.showVande} onChange={e=>up(d=>d.antet.showVande=e.target.checked)}/> Vandè</label><label><input type="checkbox" checked={db.antet.showId} onChange={e=>up(d=>d.antet.showId=e.target.checked)}/> Id ticket</label></div>
      </div>
      <div style={{marginTop:12}}>
        <label>Tèks pye paj la:</label>
        <textarea value={db.antet.pied} onChange={e=>up(d=>d.antet.pied=e.target.value)} placeholder="Ex: BON CHANS! Jwe Responsab..." style={{width:'100%',padding:12,borderRadius:10,background:'#000',color:'#fff',marginTop:4,minHeight:80,border:'1px solid #555'}}/>
      </div>
    </div>}

    <button onClick={()=>{ saveDB(db); alert("✅ SUPER-ADMIN anrejistre nan menm baz v3!"); }} style={{width:'100%',padding:18,background:'red',color:'#fff',borderRadius:12,fontWeight:900,marginTop:16,border:'none',fontSize:16}}>💾 ANREJISTRE TOUT - MENM BAZ V3</button>
  </div>);
}
