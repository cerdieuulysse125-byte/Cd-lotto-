"use client";
import {useState,useEffect} from "react";
const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];

export default function Vendeur(){
 const [tab,setTab]=useState("VENDRE"); const [sel,setSel]=useState<string[]>([]); const [jeu,setJeu]=useState("Bolet"); const [boul,setBoul]=useState(""); const [miz,setMiz]=useState(""); const [fiches,setFiches]=useState<any[]>([]); const [copieId,setCopieId]=useState(""); const [msg,setMsg]=useState("");
 const [ferm,setFerm]=useState<any>({"GA midi":"12:15","FL midi":"13:15","NY midi":"14:15","GA soir":"18:15","FL soir":"21:15","NY soir":"22:15","Real 12h45":"12:45","Primera dia":"11:50","Suerte dia":"12:20","Lote Dom":"01:45","Ganamas":"14:15","Suerte noche":"17:50","Primera noche":"19:50","Loteka":"19:45","Nacional noche":"20:50","Leidsa":"20:45","Anguila 10h":"09:55","Anguila 18h":"17:55"});
 const [lim,setLim]=useState({bolet:1500,maryaj:100,loto3:100,loto4:20,loto5:5}); const [boulBloke,setBoulBloke]=useState<string[]>([]); const [entete,setEntete]=useState({nom:"C&D VERITE LOTTO",adr:"Petion-Ville",tel:"+509 0000-0000",vendeur:"Toto",serie:"SERIE-001"});

 useEffect(()=>{
  const s=localStorage.getItem("CD_V12"); if(s){ try{ setFiches(JSON.parse(s)); }catch{} }
  const p=localStorage.getItem("CD_PROPRIO_V7"); if(p){ try{ const d=JSON.parse(p); if(d.ferm) setFerm(d.ferm); if(d.lim) setLim(d.lim); if(d.boulBloke) setBoulBloke(d.boulBloke); if(d.entete) setEntete(d.entete); }catch{} }
 },[]);
 useEffect(()=>{ localStorage.setItem("CD_V12",JSON.stringify(fiches)); },[fiches]);

 const nowHM=()=>{ const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
 const isOpen=(t:string)=>{ const f=ferm[t]; if(!f) return true; return nowHM() < f; };
 const getLimite=(j:string)=> j==="Bolet"?lim.bolet: j==="Maryaj"?lim.maryaj: j==="Loto3"?lim.loto3: j==="Loto4"?lim.loto4: lim.loto5;

 const ajouter=()=>{
  if(!sel.length) return setMsg("❌ Chwazi tiraj"); if(!boul) return setMsg("❌ Mete boul"); if(!miz) return setMsg("❌ Mete miz");
  if(boulBloke.includes(boul)) return setMsg(`❌ Boul ${boul} bloke`);
  const fermes=sel.filter(t=>!isOpen(t)); if(fermes.length) return setMsg(`❌ FERME: ${fermes.join(', ')} - ${nowHM()} > ${fermes.map(t=>ferm[t])}`);
  const limite=getLimite(jeu);
  for(const tiraj of sel){ const tot=fiches.filter(f=>f.jeu===jeu&&f.boul===boul&&f.tirages.includes(tiraj)).reduce((s,f)=>s+f.miz,0); if(tot+parseInt(miz)>limite) return setMsg(`❌ LIMITE ${jeu} ${boul} ${tiraj}: ${limite}HTG depase (ou gen ${tot})`); }
  const f={id:Date.now(),jeu,boul,miz:parseInt(miz),tirages:sel,heure:new Date().toLocaleString(),ticket:"CD"+Date.now().toString().slice(-6)};
  setFiches([...fiches,f]); setMsg(`✅ Ajoute ${jeu} ${boul} - ${sel.length} tiraj`); setBoul(""); setMiz(""); setTimeout(()=>setMsg(""),2500);
 };

 const total=fiches.reduce((s,f)=>s+f.miz,0);

 const doPrint=(id:string)=>{
  const content=document.getElementById(id)?.innerHTML; if(!content){ return alert("Pa gen anyen"); }
  const iframe=document.createElement("iframe"); iframe.style.width="0"; iframe.style.height="0"; iframe.style.border="0"; iframe.style.position="fixed"; document.body.appendChild(iframe);
  const doc=iframe.contentWindow?.document; if(!doc) return;
  doc.open(); doc.write(`<html><head><style>
   @page{size:58mm auto;margin:0} body{width:56mm;margin:0;padding:2mm;font-family:'Courier New',monospace;color:#000;font-size:12px;line-height:1.25}
  .c{text-align:center}.b{font-weight:900}.big{font-size:16px;font-weight:900}.mid{font-size:13px;font-weight:900}
  .dash{border-top:1.5px dashed #000;border-bottom:1.5px dashed #000;margin:2.5mm 0;padding:2mm 0}
  .line{border-bottom:1px dashed #999;padding:1.2mm 0}.tot{border-top:2px solid #000;margin-top:2mm;padding-top:2mm;font-size:15px}
   table{width:100%;border-collapse:collapse} td{padding:1mm 0;font-size:11px}.r{text-align:right}
  </style></head><body>${content}</body></html>`); doc.close();
  setTimeout(()=>{ iframe.contentWindow?.focus(); iframe.contentWindow?.print(); setTimeout(()=>document.body.removeChild(iframe),1200); },300);
 };

 return (
 <div style={{maxWidth:480,margin:'0 auto',background:'#fff',color:'#000',minHeight:'100vh',padding:8}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6}}>{["VENDRE","COPIER","MES FICHES","RAPPORT"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:13,border:'2px solid #000',borderRadius:10,fontWeight:900,fontSize:11,background:tab===t?"#4fb3ff":"#eee"}}>{t}</button>)}</div>
  {msg && <div style={{background:msg.includes("❌")?"#d00":"#0a7a3e",color:'#fff',padding:10,borderRadius:8,marginTop:8,fontWeight:900,textAlign:'center',fontSize:12}}>{msg}</div>}

  {tab==="VENDRE"&&<>
   <div style={{border:'2px solid #000',borderRadius:10,padding:8,marginTop:8}}><div style={{display:'flex',justifyContent:'space-between',fontWeight:900,fontSize:10}}><span>TIRAJ - {nowHM()} - FÈMTI RESPEKTE</span><span>LIMITE: B{lim.bolet} M{lim.maryaj}</span></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginTop:6,maxHeight:150,overflow:'auto'}}>{TIRAGES.map(t=>{ const open=isOpen(t); return <label key={t} style={{border:open?'1px solid #000':'1px solid #d00',padding:6,borderRadius:6,fontSize:10,fontWeight:900,background:!open?"#fcc":sel.includes(t)?"#b3e5fc":"#fff"}}><input type="checkbox" disabled={!open} checked={sel.includes(t)} onChange={()=>setSel(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t])}/> {t} {ferm[t]} {!open?" 🔒":""}</label>})}</div></div>
   <div style={{display:'flex',gap:6,marginTop:8}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'24%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}><option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option></select><input value={boul} onChange={e=>setBoul(e.target.value)} placeholder={jeu==="Maryaj"?"12x34":"Boul"} style={{width:'28%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><input value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} placeholder="Miz" style={{width:'20%',padding:12,border:'2px solid #000',borderRadius:8,fontWeight:900}}/><button onClick={ajouter} style={{width:'28%',background:'#0d7a3e',color:'#fff',borderRadius:8,fontWeight:900}}>OK +</button></div>
   <div style={{border:'2px solid #000',borderRadius:8,padding:6,marginTop:8,minHeight:60}}>{fiches.length?fiches.slice(-5).map((f,i)=><div key={i} style={{fontSize:11,fontWeight:900,borderBottom:'1px solid #ccc',padding:'3px 0'}}>{f.jeu} {f.boul} {f.miz}HTG x{f.tirages.length} - {f.ticket}</div>):"Pa gen fich"}</div>
   <div style={{background:'#000',color:'#fff',padding:10,borderRadius:8,marginTop:6,textAlign:'center',fontWeight:900}}>{fiches.length} fich - TOTAL {total} x {sel.length||1} = {total*(sel.length||1)} HTG</div>
   <button onClick={()=>doPrint("ticket-propre")} style={{width:'100%',padding:16,background:'#000',color:'#fff',borderRadius:10,marginTop:6,fontWeight:900}}>🖨️ IMPRIMER FICH PWÒP 58mm</button>
  </>}

  {tab==="MES FICHES"&&<div style={{border:'2px solid #000',borderRadius:10,padding:8,marginTop:10}}><b>MES FICHES - {fiches.length}</b>{fiches.map((f,i)=><div key={i} style={{padding:'5px 0',borderBottom:'1px solid #000',fontSize:11,fontWeight:900}}>{f.ticket} | {f.jeu} {f.boul} {f.miz}HTG | {f.tirages.join(',')} | {f.heure}</div>)}</div>}

  {tab==="COPIER"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}><b>COPIER FICH</b><input value={copieId} onChange={e=>setCopieId(e.target.value)} placeholder="CD..." style={{width:'100%',padding:12,border:'2px solid #000',borderRadius:8,marginTop:8}}/><button onClick={()=>{ const f=fiches.find(x=>x.ticket===copieId.trim()); if(!f) return alert("Pa jwenn"); setFiches([...fiches,{...f,id:Date.now(),ticket:"CD"+Date.now().toString().slice(-6)}]); alert("Kopye"); }} style={{width:'100%',padding:12,background:'#000',color:'#fff',borderRadius:8,marginTop:8,fontWeight:900}}>KOPIYE</button></div>}

  {tab==="RAPPORT"&&<div style={{border:'2px solid #000',borderRadius:10,padding:10,marginTop:10}}><b>RAPPORT PWÒP - Du Au - Tous - Chak tiraj separeman</b><div style={{marginTop:8,border:'2px solid #000',borderRadius:8,padding:8}}><div style={{display:'flex',justifyContent:'space-between',fontWeight:900}}><span>Vente</span><span>{total} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',fontWeight:900}}><span>Commission 20%</span><span>{Math.round(total*0.2)} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',fontWeight:900,borderTop:'2px solid #000',marginTop:6,paddingTop:6}}><span>BALANCE NET</span><span>{Math.round(total*0.8)} HTG</span></div></div><button onClick={()=>doPrint("rapport-propre")} style={{width:'100%',padding:14,background:'#000',color:'#fff',borderRadius:10,marginTop:10,fontWeight:900}}>🖨️ IMPRIMER RAPPORT PWÒP</button></div>}

  {/* FICH PWÒP - MODÈL PWOFESYONÈL */}
  <div id="ticket-propre" style={{display:'none'}}>
   <div className="c">
    <div className="big">{entete.nom}</div>
    <div>{entete.adr}</div>
    <div>Tel: {entete.tel}</div>
    <div style={{fontSize:'10px'}}>Vendeur: {entete.vendeur} - {entete.serie}</div>
    <div className="dash">
     <div className="b">TICKET: {fiches[fiches.length-1]?.ticket || "CD000000"}</div>
     <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
    </div>
    <table>{fiches.slice(-10).map((f,i)=><tr key={i} className="line"><td style={{textAlign:'left'}}><span className="b">{f.jeu}</span> {f.boul}<br/><span style={{fontSize:'9px'}}>{f.tirages.join(', ')}</span></td><td className="r b">{f.miz} HTG</td></tr>)}</table>
    <div className="tot c"><div className="big">TOTAL: {total*(sel.length||1)} HTG</div><div style={{fontSize:'10px'}}>{fiches.length} fich - {sel.length||1} tiraj</div></div>
    <div style={{marginTop:'4mm'}} className="b c">BON CHANS!</div>
    <div style={{fontSize:'8px',marginTop:'2mm'}} className="c">Mariage 12x34=34x12 bon - Chak tiraj separeman<br/>Limite: B{lim.bolet} M{lim.maryaj} L3{lim.loto3}</div>
   </div>
  </div>

  {/* RAPÒ PWÒP - MODÈL PWOFESYONÈL */}
  <div id="rapport-propre" style={{display:'none'}}>
   <div className="c">
    <div className="big">{entete.nom}</div>
    <div className="b">RAPPORT VENTE</div>
    <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
    <div className="dash" style={{textAlign:'left'}}>
     <div>Vendeur: {entete.vendeur} ({entete.serie})</div>
     <div>Periode: Tous</div>
     <div>Tirages: Tous ({TIRAGES.length})</div>
     <div>Fiches: {fiches.length}</div>
    </div>
    <table>
     <tr><td>Vente Total</td><td className="r b">{total} HTG</td></tr>
     <tr><td>x Tirages ({sel.length||1})</td><td className="r b">{total*(sel.length||1)} HTG</td></tr>
     <tr><td>Commission 20%</td><td className="r">{Math.round(total*0.2)} HTG</td></tr>
     <tr><td>Gain Kliyan</td><td className="r">0 HTG</td></tr>
     <tr style={{borderTop:'2px solid #000'}}><td className="b big">BALANCE NET</td><td className="r b big">{Math.round(total*0.8)} HTG</td></tr>
    </table>
    <div className="dash" style={{textAlign:'left',fontSize:'10px'}}>
     Detail pa tiraj:<br/>
     {TIRAGES.slice(0,6).map(t=>{ const tot=fiches.filter(f=>f.tirages.includes(t)).reduce((s,f)=>s+f.miz,0); return tot>0?`${t}: ${tot} HTG\n`:""; }).join('')}
    </div>
    <div className="c" style={{fontSize:'9px',marginTop:'2mm'}}>Chak tiraj kalkile separeman - Mariage 12x34=34x12 bon</div>
   </div>
  </div>
 </div>);
}
