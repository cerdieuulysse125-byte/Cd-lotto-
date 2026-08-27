"use client";
import { useState, useEffect } from "react";
export default function Proprio(){
  const [cfg,setCfg]=useState({nom:"C&D VÉRITÉ LOTTO", vendeur:"Vendeur1", showDate:true, showTirage:true, showVendeur:true, showId:true});
  useEffect(()=>{ const c=localStorage.getItem('cfg_antet'); if(c) setCfg(JSON.parse(c)); },[]);
  const save=()=>{ localStorage.setItem('cfg_antet', JSON.stringify(cfg)); alert("✅ Antèt anrejistre - Tout vandè ap wè l"); };
  return (
    <div style={{maxWidth:'480px', margin:'0 auto', padding:'12px', color:'#000'}}>
      <h2 style={{fontWeight:'900'}}>Konfigirasyon Antèt</h2>
      <input value={cfg.nom} onChange={e=>setCfg({...cfg, nom:e.target.value})} placeholder="C&D VÉRITÉ LOTTO" style={{width:'100%', padding:'14px', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', marginBottom:'10px'}}/>
      <input value={cfg.vendeur} onChange={e=>setCfg({...cfg, vendeur:e.target.value})} placeholder="Non Vandè" style={{width:'100%', padding:'14px', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', marginBottom:'10px'}}/>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', border:'2px solid #000', borderRadius:'10px', padding:'12px', fontWeight:'900'}}>
        <label><input type="checkbox" checked={cfg.showDate} onChange={e=>setCfg({...cfg, showDate:e.target.checked})}/> Dat</label>
        <label><input type="checkbox" checked={cfg.showTirage} onChange={e=>setCfg({...cfg, showTirage:e.target.checked})}/> Tiraj</label>
        <label><input type="checkbox" checked={cfg.showVendeur} onChange={e=>setCfg({...cfg, showVendeur:e.target.checked})}/> Vandè</label>
        <label><input type="checkbox" checked={cfg.showId} onChange={e=>setCfg({...cfg, showId:e.target.checked})}/> Id ticket</label>
      </div>
      <button onClick={save} style={{width:'100%', padding:'16px', background:'#0d7a3e', color:'#fff', border:'2px solid #000', borderRadius:'12px', fontWeight:'900', marginTop:'12px'}}>ANREJISTRE ANTÈT</button>
      <div style={{marginTop:'20px', border:'2px dashed #000', padding:'10px', textAlign:'center', fontFamily:'monospace'}}>
        <b>APÈSI TICKET:</b><br/>{cfg.nom}<br/>{cfg.showDate && <>Dat: {new Date().toLocaleString()}<br/></>}{cfg.showTirage && <>Tiraj: GA midi, NY midi<br/></>}{cfg.showVendeur && <>Vandè: {cfg.vendeur}<br/></>}{cfg.showId && <>Id ticket: CD123456<br/></>}<hr/>Bolet 55&nbsp;&nbsp;&nbsp;&nbsp;5<br/>Bolet 00&nbsp;&nbsp;&nbsp;&nbsp;5<br/>Maryaj 55×00&nbsp;5<hr/>TOTAL: 30 HTG
      </div>
    </div>
  );
}
