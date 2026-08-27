"use client";
import { useState, useRef, useEffect } from "react";
const TIRAGES = ["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Primera dia 11h50","Suerte dia 12h20","Lote Dom 1h45","Ganamas 14h15","Suerte noche 17h50","Primera noche 19h50","Loteka 19h45","Nacional noche 20h50","Leidsa 20h45","Anguila 10h","Anguila 18h"];
const JEUX = ["Bolet","Maryaj","Loto3","Loto4","Loto5"];

export default function Page(){
  const [tab,setTab]=useState("VENDRE");
  const [selected,setSelected]=useState<string[]>([]);
  const [openT,setOpenT]=useState(false);
  const [jeu,setJeu]=useState("Loto3");
  const [boul,setBoul]=useState("");
  const [miz,setMiz]=useState("");
  const [fiches,setFiches]=useState<any[]>([]);
  const [du,setDu]=useState(new Date().toISOString().slice(0,10));
  const [au,setAu]=useState(new Date().toISOString().slice(0,10));
  const [filtreT,setFiltreT]=useState("TOUT");
  const [printers,setPrinters]=useState<string[]>([]);
  const [defP,setDefP]=useState("");
  const boulRef=useRef<HTMLInputElement>(null);
  const mizRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    try{
      setPrinters(JSON.parse(localStorage.getItem('printers_list')||'[]'));
      setDefP(localStorage.getItem('printer_default')||"");
      const s=localStorage.getItem('cd_fiches'); if(s) setFiches(JSON.parse(s));
    }catch{}
  },[]);
  useEffect(()=>{localStorage.setItem('cd_fiches',JSON.stringify(fiches))},[fiches]);

  const toggle=(t:string)=>setSelected(s=>s.includes(t)?s.filter(x=>x!==t):[...s,t]);
  const ajouter=()=>{
    if(!boul||!miz) return alert("Mete Boul ak Miz");
    if(selected.length===0) return alert("Chwazi tiraj nan 1 KAZ la");
    if(parseInt(miz)>5000) return alert("Limite 5000");
    const nb=jeu==="Maryaj"? boul.split(/x|×/).map(s=>s.trim()).sort().join('×') : boul;
    setFiches([...fiches,{id:Date.now(), jeu, boul:nb, miz:parseInt(miz), tirages:selected, date:new Date().toISOString()}]);
    setBoul(""); setMiz(""); setTimeout(()=>boulRef.current?.focus(),50);
  };
  const handleKey=(e:any,next:string)=>{ if(e.key==="ArrowRight"||e.key==="ArrowDown"||e.key==="Enter"){ e.preventDefault(); if(next==="miz") mizRef.current?.focus(); else ajouter(); } };

  // FONCTION PRINT - SANTRE + MIZ SOU MENM KOLON
  const printTicket=()=>{
    const cfg = JSON.parse(localStorage.getItem('cfg_antet') || '{"nom":"C&D VÉRITÉ LOTTO","vendeur":"Vendeur1","showDate":true,"showTirage":true,"showVendeur":true,"showId":true}');
    const idTicket='CD'+Date.now().toString().slice(-6);
    const dateNow=new Date().toLocaleString('fr-HT');
    const tirageStr=selected.join(', ');
    const total=fiches.reduce((s,f)=>s+f.miz,0)*(selected.length||1);
    const lignes=fiches.map(f=>{
      return `<div style="display:flex; justify-content:center; gap:18px;"><span style="width:130px; text-align:left;">${f.jeu} ${f.boul}</span><span style="width:45px; text-align:right;">${f.miz}</span></div>`;
    }).join('');
    const w=window.open('','','width=400,height=700');
    w!.document.write(`<html><head><style>@page{size:58mm auto;margin:0} body{width:58mm;margin:0;padding:5mm 3mm;font-family:monospace;font-weight:900;color:#000;text-align:center;} hr{border:none;border-top:1px dashed #000;margin:6px 8px;}</style></head><body>
      <div style="text-align:center;">
        <div style="font-size:19px;">${cfg.nom}</div>
        ${cfg.showDate?`<div>Dat: ${dateNow}</div>`:''}
        ${cfg.showTirage?`<div style="font-size:12px;">Tiraj: ${tirageStr}</div>`:''}
        ${cfg.showVendeur?`<div>Vandè: ${cfg.vendeur}</div>`:''}
        ${cfg.showId?`<div>Id ticket: ${idTicket}</div>`:''}
        <hr/>
        <div style="margin:6px 0;">${lignes}</div>
        <hr/>
        <div style="font-size:18px;">TOTAL: ${total} HTG</div>
        <hr/>
        <div style="font-size:10px;">Imprimante: ${defP||'System'}</div>
        <div>BON CHANS!</div>
      </div><script>window.print();window.close();<\/script></body></html>`);
  };

  const total=fiches.reduce((s,f)=>s+f.miz,0);
  const grand=total*(selected.length||1);

  return (
    <div style={{maxWidth:'480px', margin:'0 auto', background:'#fff', minHeight:'100vh', color:'#000', fontFamily:'Arial'}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', padding:'10px'}}>
        {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMÈT","X FÈMEN"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'14px 2px', borderRadius:'12px', border:'2px solid #000', fontWeight:'900', fontSize:'11px', background:tab===t?"#4fb3ff":"#eee", color:'#000'}}>{t}</button>)}
      </div>
      <div style={{padding:'10px'}}>
        {tab==="VENDRE" && (<>
          <div style={{position:'relative'}}><button onClick={()=>setOpenT(!openT)} style={{width:'100%', padding:'12px', border:'2px solid #000', borderRadius:'8px', background:'#fff', fontWeight:'900', color:'#000', textAlign:'left'}}>{selected.length===0?"▼ CHWAZI TIRAJ (1 KAZ)":`▼ ${selected.length}: ${selected.join(", ").slice(0,45)}`}</button>
            {openT && <div style={{position:'absolute', top:'46px', left:0, right:0, background:'#fff', border:'2px solid #000', borderRadius:'10px', zIndex:20, maxHeight:'300px', overflow:'auto', padding:'6px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000', padding:'8px 4px', borderRadius:'6px', background:selected.includes(t)?"#b3e5fc":"#fff", fontSize:'11px', fontWeight:'900', color:'#000'}}><input type="checkbox" checked={selected.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}<button onClick={()=>setOpenT(false)} style={{gridColumn:'1 / span 2', background:'#000', color:'#fff', padding:'12px', borderRadius:'8px', fontWeight:'900'}}>OK</button></div>}
          </div>
          <div style={{display:'flex', gap:'6px', marginTop:'12px'}}>
            <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%', padding:'12px 4px', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', background:'#fff', color:'#000'}}>{JEUX.map(j=><option key={j}>{j}</option>)}</select>
            <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>handleKey(e,"miz")} placeholder="Boul" inputMode="numeric" style={{width:'32%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'900'}}/>
            <input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKey(e,"ok")} placeholder="Miz" type="number" style={{width:'24%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'900'}}/>
            <button onClick={ajouter} style={{width:'18%', background:'#0d7a3e', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900'}}>OK</button>
          </div>
          <div style={{background:'#fff', border:'2px solid #000', borderRadius:'10px', minHeight:'120px', marginTop:'10px', padding:'6px', textAlign:'center'}}>
            {fiches.map((f,i)=><div key={f.id} style={{display:'flex', justifyContent:'center', gap:'18px', padding:'8px 4px', borderBottom:'1px solid #000', color:'#000', fontWeight:'900', fontSize:'15px'}}><span style={{width:'130px', textAlign:'left'}}>{f.jeu} {f.boul}</span><span style={{width:'45px', textAlign:'right'}}>{f.miz}</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span></div>)}
          </div>
          <div style={{background:'#0d7a3e', color:'#fff', textAlign:'center', padding:'12px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', border:'2px solid #000'}}>Total {total} × {selected.length||1} = {grand} HTG</div>
          <button onClick={printTicket} style={{width:'100%', background:'#000', color:'#fff', padding:'14px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', border:'2px solid #000'}}>IMPRIMER - {defP||'SYSTEM'}</button>
        </>)}

        {tab==="MES FICHES" && <div style={{fontWeight:'900'}}><h3>MES FICHES</h3>{fiches.map(f=><div key={f.id} style={{border:'1px solid #000', padding:'8px', margin:'6px 0', borderRadius:'8px'}}>{f.jeu} {f.boul} - {f.miz} HTG</div>)}</div>}
        {tab==="RAPPORT" && <div><h3 style={{fontWeight:'900'}}>RAPPORT</h3><div style={{display:'flex', gap:'6px'}}><div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:'900'}}>Du.</label><input type="date" value={du} onChange={e=>setDu(e.target.value)} style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/></div><div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:'900'}}>Au.</label><input type="date" value={au} onChange={e=>setAu(e.target.value)} style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/></div></div><select value={filtreT} onChange={e=>setFiltreT(e.target.value)} style={{width:'100%', padding:'12px', border:'2px solid #000', borderRadius:'8px', marginTop:'8px', fontWeight:'900'}}><option value="TOUT">TOUT TIRAJ</option>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>{(()=>{const v=fiches.filter(f=>filtreT==="TOUT"||f.tirages?.includes(filtreT)).reduce((s,f)=>s+f.miz,0); const k=Math.round(v*0.2); return <><div style={{border:'2px solid #000', borderRadius:'10px', marginTop:'10px', overflow:'hidden', fontWeight:'900'}}><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000', background:'#eee'}}><span>Vant</span><span>{v}</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000'}}><span>Komisyon</span><span>{k}</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000'}}><span>A Peye</span><span>0</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'14px', background:'#000', color:'#fff'}}><span>Balans Net</span><span>{v-k}</span></div></div><button onClick={()=>window.print()} style={{width:'100%', marginTop:'10px', padding:'14px', background:'#0d7a3e', color:'#fff', borderRadius:'10px', fontWeight:'900'}}>ENPRIME</button></>})()}</div>}

        {tab==="PARAMÈT" && <div><h3 style={{fontWeight:'900'}}>PARAMÈT</h3><div style={{border:'2px solid #000', borderRadius:'10px', padding:'12px'}}><div style={{fontWeight:'900'}}>Def: {defP||'System'}</div><button onClick={async()=>{try{const d=await (navigator as any).bluetooth?.requestDevice({filters:[{namePrefix:'MPT'},{namePrefix:'POS'}]}); const n=d.name||d.id; let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(n)) L.push(n); localStorage.setItem('printers_list',JSON.stringify(L)); setPrinters(L);}catch(e:any){alert(e.message)}} } style={{width:'100%', padding:'12px', background:'#2196F3', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', marginTop:'8px'}}>1- RECHÈCH IMPRIMANTE</button><div style={{border:'1px solid #000', borderRadius:'8px', maxHeight:'100px', overflow:'auto', marginTop:'8px'}}>{printers.map((p,i)=><div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px', fontSize:'12px', fontWeight:'900'}}><span>{p}</span><button onClick={()=>{localStorage.setItem('printer_default',p); setDefP(p)}} style={{background:defP===p?'#0d7a3e':'#000', color:'#fff', borderRadius:'6px', padding:'2px 6px'}}>{defP===p?'✓':'DEFO'}</button></div>)}</div><div style={{marginTop:'10px'}}><label style={{fontSize:'11px', fontWeight:'900'}}>2- AJOUTE PA DEFO</label><div style={{display:'flex', gap:'6px'}}><input id="mp" placeholder="MPT-II" style={{flex:1, padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/><button onClick={()=>{const v=(document.getElementById('mp') as any).value; if(v){localStorage.setItem('printer_default',v); setDefP(v); let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(v)) L.push(v); localStorage.setItem('printers_list',JSON.stringify(L)); setPrinters(L);}}} style={{padding:'10px', background:'#000', color:'#fff', borderRadius:'8px'}}>AJOUTE</button></div></div></div></div>}
        {tab==="COPIER" && <div><input placeholder="ID" style={{width:'100%', padding:'14px', border:'2px solid #000', borderRadius:'8px'}}/><button style={{width:'100%', padding:'12px', marginTop:'8px', background:'#4fb3ff', border:'2px solid #000', borderRadius:'8px', fontWeight:'900'}}>Kopye</button></div>}
        {tab==="X FÈMEN" && <div><button onClick={()=>{if(confirm("Fèmen?")){localStorage.removeItem('cd_fiches'); setFiches([])}}} style={{width:'100%', padding:'14px', background:'red', color:'#fff', borderRadius:'10px', fontWeight:'900'}}>Fèmen Caisse</button></div>}
      </div>
    </div>
  );
}
