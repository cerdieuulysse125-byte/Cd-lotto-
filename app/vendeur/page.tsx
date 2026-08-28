"use client";
import {useState,useEffect} from "react";
const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];

export default function Vendeur(){
 const [tab,setTab]=useState("VENDRE"); const [sel,setSel]=useState<string[]>([]); const [jeu,setJeu]=useState("Bolet"); const [boul,setBoul]=useState(""); const [miz,setMiz]=useState(""); const [fiches,setFiches]=useState<any[]>([]);
 useEffect(()=>{ const s=localStorage.getItem("CD_VENDEUR_V9"); if(s){ try{ setFiches(JSON.parse(s)); }catch{} } },[]);
 useEffect(()=>{ localStorage.setItem("CD_VENDEUR_V9",JSON.stringify(fiches)); },[fiches]);
 const toggle=(t:string)=>setSel(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t]);
 const ajouter=()=>{ if(!boul||!miz||!sel.length) return alert("Chwazi tiraj + boul + miz"); const f={id:Date.now(),jeu,boul,miz:parseInt(miz),tirages:sel,heure:new Date().toLocaleTimeString(),ticket:"CD"+Date.now().toString().slice(-6)}; setFiches([...fiches,f]); };
 const total=fiches.reduce((s,f)=>s+f.miz,0);

 const printTicket=()=>{ if(fiches.length===0) return alert("Pa gen fich pou enprime! Ajoute fich dabo"); const el=document.getElementById("print-ticket"); if(!el) return; el.style.display="block"; document.body.classList.add("printing-ticket"); setTimeout(()=>{ window.print(); el.style.display="none"; document.body.classList.remove("printing-ticket"); },200); };
 const printRapport=()=>{ const el=document.getElementById("print-rapport"); if(!el) return; el.style.display="block"; document.body.classList.add("printing-rapport"); setTimeout(()=>{ window.print(); el.style.display="none"; document.body.classList.remove("printing-rapport"); },200); };

 return (<>
  <style>{`
    @media print {
      body.printing-ticket * { visibility: hidden!important; }
      body.printing-ticket #print-ticket, body.printing-ticket #print-ticket * { visibility: visible!important; }
      body.printing-ticket #print-ticket { position: absolute!important; left:0; top:0; width:58mm!important; display:block!important; background:#fff!important; color:#000!important; font-weight:900!important; padding:2mm!important; }

      body.printing-rapport * { visibility: hidden!important; }
      body.printing-rapport #print-rapport, body.printing-rapport #print-rapport * { visibility: visible!important; }
      body.printing-rapport #print-rapport { position: absolute!important; left:0; top:0; width:58mm!important; display:block!important; background:#fff!important; color:#000!important; font-weight:900!important; padding:2mm!important; }

      @page { size:58mm auto; margin:0; }
    }
    #print-ticket, #print-rapport { display:none; }
  `}</style>

  <div style={{maxWidth:480,margin:'0 auto',background:'#fff',color:'#000',minHeight:'100vh',padding:8}}>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>{["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMET","X FEMEN"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:12,border:'2px solid #000',borderRadius:10,fontWeight:900,fontSize:10,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}</div>

   {tab==="VENDRE"&&<>
    <div style={{border:'2px solid #000',borderRadius:10,padding:8,marginTop:8}}><b>Tiraj (chwazi plizye)</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginTop:6,maxHeight:140,overflow:'auto'}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000',padding:6,borderRadius:6,fontSize:10,fontWeight:900,background:sel.includes(t)?"#b3e5fc":"#fff"}}><input type="checkbox" checked={sel.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}</div></div>
    <div style={{display:'flex',gap:6,marginTop:8}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}><option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option></select><input value={boul} onChange={e=>setBoul(e.target.value)} placeholder="Boul" style={{width:'27%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><input value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} placeholder="Miz" style={{width:'20%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><button onClick={ajouter} style={{width:'27%',background:'#0d7a3e',color:'#fff',borderRadius:8,fontWeight:900}}>OK</button></div>
    <div style={{border:'2px solid #000',minHeight:80,marginTop:8,borderRadius:8,padding:6}}>{fiches.length===0?"Pa gen fich":fiches.map((f,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontWeight:900,fontSize:12,borderBottom:'1px solid #ccc'}}><span>{f.jeu} {f.boul} {f.miz} - {f.tirages.join(',')}</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span></div>)}</div>
    <div style={{background:'#0d7a3e',color:'#fff',padding:12,borderRadius:8,marginTop:6,textAlign:'center',fontWeight:900}}>Total {total} x {sel.length||1} = {total*(sel.length||1)} HTG - {fiches.length} fich</div>
    <button onClick={printTicket} style={{width:'100%',padding:16,background:'#000',color:'#fff',borderRadius:8,marginTop:6,fontWeight:900,fontSize:14}}>🖨️ IMPRIMER FICH VANN YO - 58mm GWO</button>
   </>}

   {tab==="RAPPORT"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}><b>RAPPORT - Vente Komisyon A Peye Balans</b><div style={{marginTop:8,border:'1px solid #000',borderRadius:8}}><div style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #000',fontWeight:900}}><span>Vant</span><span>{total} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #000',fontWeight:900}}><span>Komisyon 20%</span><span>{Math.round(total*0.2)} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',padding:8,fontWeight:900,background:'#eee'}}><span>Balans Net</span><span>{Math.round(total*0.8)} HTG</span></div></div><button onClick={printRapport} style={{width:'100%',padding:12,background:'#333',color:'#fff',borderRadius:8,marginTop:8,fontWeight:900}}>IMPRIMER RAPPORT SELMAN</button></div>}
   {tab==="MES FICHES"&&<div style={{marginTop:10,border:'2px solid #000',borderRadius:10,padding:8}}>{fiches.map((f,i)=><div key={i} style={{padding:6,borderBottom:'1px solid #000',fontWeight:900}}>{f.ticket} - {f.jeu} {f.boul} {f.miz}HTG {f.heure}</div>)}</div>}
  </div>

  {/* PRINT 1: FICH VANN - GWO SANTRE */}
  <div id="print-ticket">
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'18px',fontWeight:900}}>C&D VERITE LOTTO</div>
      <div style={{fontSize:'12px'}}>Petion-Ville - Tel:...</div>
      <div style={{borderTop:'2px dashed #000',borderBottom:'2px dashed #000',margin:'3mm 0',padding:'2mm 0',fontSize:'12px'}}>TICKET: {fiches[0]?.ticket||"CD"}<br/>{new Date().toLocaleString()}<br/>Vendeur: Toto SERIE-001</div>
      {fiches.map((f,i)=><div key={i} style={{textAlign:'left',fontSize:'15px',fontWeight:900,borderBottom:'1px dashed #000',padding:'2mm 0'}}>{f.jeu.toUpperCase()}<br/>{f.boul} - {f.miz} HTG<br/><span style={{fontSize:'11px'}}>{f.tirages.join(', ')}</span></div>)}
      <div style={{fontSize:'18px',fontWeight:900,borderTop:'3px solid #000',marginTop:'3mm',paddingTop:'2mm'}}>TOTAL: {total*(sel.length||1)} HTG</div>
      <div style={{fontSize:'14px',marginTop:'4mm',fontWeight:900}}>BON CHANS!</div>
      <div style={{fontSize:'9px',marginTop:'3mm'}}>Mariage 12x34=34x12 bon<br/>Chak tiraj kalkile separeman</div>
    </div>
  </div>

  {/* PRINT 2: RAPPORT - SEPARE */}
  <div id="print-rapport">
    <div style={{textAlign:'center',fontSize:'14px',fontWeight:900}}>
      <div>RAPPORT</div><div>{new Date().toLocaleDateString()}</div>
      <div style={{borderTop:'1px solid #000',marginTop:'2mm',textAlign:'left'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><span>Vant</span><span>{total} HTG</span></div>
        <div style={{display:'flex',justifyContent:'space-between'}}><span>Komisyon</span><span>{Math.round(total*0.2)} HTG</span></div>
        <div style={{display:'flex',justifyContent:'space-between'}}><span>A Peye</span><span>0 HTG</span></div>
        <div style={{display:'flex',justifyContent:'space-between',borderTop:'2px solid #000',marginTop:'2mm',paddingTop:'2mm'}}><span>Balans Net</span><span>{Math.round(total*0.8)} HTG</span></div>
      </div>
    </div>
  </div>
 </>);
}
