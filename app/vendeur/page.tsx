"use client";
import { useState, useRef } from "react";

const TIRAGES = ["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Primera 11h50","Suerte 12h20","Lote Dom","Ganamas 14h15","Suerte noche","Primera noche","Loteka","Nacional","Leidsa","Anguila 10h","Anguila 18h"];

export default function Page(){
  const [tab, setTab] = useState("VENDRE");
  const [selected, setSelected] = useState<string[]>(["FL midi","NY soir"]);
  const [openTirage, setOpenTirage] = useState(false);
  const [jeu, setJeu] = useState("Loto3");
  const [boul, setBoul] = useState("");
  const [miz, setMiz] = useState("");
  const [fiches, setFiches] = useState<any[]>([{jeu:"Loto3", boul:"55", miz:5}]);

  const boulRef = useRef<HTMLInputElement>(null);
  const mizRef = useRef<HTMLInputElement>(null);

  const toggleT = (t:string) => {
    setSelected(s=> s.includes(t)? s.filter(x=>x!==t) : [...s,t]);
  };

  const ajouter = () => {
    if(!boul || !miz) return;
    if(selected.length===0) return alert("Chwazi tiraj yo nan kaz la anwo");
    const finalBoul = jeu==="Maryaj" ? boul.split(/x|×/).map(s=>s.trim()).sort().join("×") : boul;
    setFiches([...fiches, {jeu, boul:finalBoul, miz:parseInt(miz)}]);
    setBoul(""); setMiz("");
    setTimeout(()=>boulRef.current?.focus(), 50);
  };

  const handleKey = (e:any, next:"miz"|"ok") => {
    if(e.key==="ArrowRight" || e.key==="ArrowDown" || e.key==="Enter"){
      e.preventDefault();
      if(next==="miz") mizRef.current?.focus();
      else ajouter();
    }
  };

  const total = fiches.reduce((s,f)=>s+f.miz,0);

  return (
    <div style={{maxWidth:'480px', margin:'0 auto', background:'#fff', minHeight:'100vh', fontFamily:'Arial', color:'#000'}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', padding:'10px'}}>
        {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMÈT","X FÈMEN"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:'14px 2px', borderRadius:'12px', border:'2px solid #000', fontWeight:'900', fontSize:'12px', background: tab===t? "#4fb3ff":"#e9e9e9", color:'#000'}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{padding:'10px'}}>
        {tab==="VENDRE" && (
          <>
            {/* 1 SEL KAZ POU TOUT TIRAJ */}
            <div style={{position:'relative'}}>
              <button onClick={()=>setOpenTirage(!openTirage)} style={{width:'100%', padding:'12px', border:'2px solid #000', borderRadius:'8px', background:'#fff', textAlign:'left', fontWeight:'bold', color:'#000'}}>
                {selected.length===0 ? "▼ Chwazi Tiraj yo" : `▼ ${selected.length} tiraj: ${selected.join(", ").slice(0,40)}`}
              </button>
              {openTirage && (
                <div style={{position:'absolute', top:'46px', left:0, right:0, background:'#fff', border:'2px solid #000', borderRadius:'8px', zIndex:10, maxHeight:'260px', overflow:'auto', padding:'6px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
                  {TIRAGES.map(t=>(
                    <label key={t} style={{border:'1px solid #000', padding:'8px 4px', borderRadius:'6px', background:selected.includes(t)?"#b3e5fc":"#fff", fontSize:'11px', fontWeight:'bold', color:'#000'}}>
                      <input type="checkbox" checked={selected.includes(t)} onChange={()=>toggleT(t)} /> {t}
                    </label>
                  ))}
                  <button onClick={()=>setOpenTirage(false)} style={{gridColumn:'1 / span 2', background:'#000', color:'#fff', padding:'10px', borderRadius:'6px'}}>OK FÈMEN</button>
                </div>
              )}
            </div>

            {/* KAZ KOUT YO - DIMANSYON BON OU TE RENMEN AN */}
            <div style={{display:'flex', gap:'6px', marginTop:'10px'}}>
              <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%', padding:'12px 4px', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', background:'#fff', color:'#000'}}>
                <option>Bolet</option><option>Maryaj</option><option>Loto3</option><option>Loto4</option><option>Loto5</option>
              </select>
              <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>handleKey(e,"miz")} placeholder="Boul" style={{width:'32%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'bold'}}/>
              <input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value)} onKeyDown={e=>handleKey(e,"ok")} placeholder="Miz" type="number" style={{width:'24%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'bold'}}/>
              <button onClick={ajouter} style={{width:'18%', background:'#0d7a3e', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900'}}>OK</button>
            </div>

            {/* LIS FICH - TÈKS LIZIB KOUNYA (NOIR SOU BLANC) */}
            <div style={{background:'#fff', border:'2px solid #000', borderRadius:'10px', minHeight:'130px', marginTop:'10px', padding:'6px'}}>
              {fiches.map((f,i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 4px', borderBottom:'1px solid #000', color:'#000', fontWeight:'bold', fontSize:'15px'}}>
                  <span style={{color:'#000'}}>{f.jeu} {f.boul}</span>
                  <span style={{color:'#000'}}>{f.miz} HTG</span>
                  <span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red', cursor:'pointer', fontWeight:'900'}}>X</span>
                </div>
              ))}
            </div>

            <div style={{background:'#0d7a3e', color:'#fff', textAlign:'center', padding:'12px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', fontSize:'16px', border:'2px solid #000'}}>
              Total {total} × {selected.length} = {total*selected.length} HTG
            </div>
            <button onClick={()=>window.print()} style={{width:'100%', background:'#000', color:'#fff', padding:'14px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', border:'2px solid #000'}}>IMPRIMER</button>
          </>
        )}

        {/* ONGLÈ YO KOUNYA AP OUVÈ */}
        {tab==="COPIER" && <div style={{color:'#000'}}><h3 style={{color:'#000'}}>COPIER</h3><input placeholder="ID Ticket" style={{width:'100%', padding:'14px', border:'2px solid #000', borderRadius:'8px', color:'#000'}}/><button style={{width:'100%', padding:'12px', marginTop:'8px', background:'#4fb3ff', border:'2px solid #000', borderRadius:'8px', fontWeight:'bold'}}>Chèche</button></div>}
        {tab==="MES FICHES" && <div style={{color:'#000', fontWeight:'bold'}}><h3>MES FICHES</h3>{fiches.map((f,i)=><div key={i} style={{borderBottom:'1px solid #000', padding:'6px'}}>{f.jeu} {f.boul} - {f.miz} HTG</div>)}</div>}
        {tab==="RAPPORT" && <div style={{color:'#000', fontWeight:'bold'}}><h3>RAPPORT</h3><div>Total Vant: {total*selected.length} HTG<br/>Nb Fich: {fiches.length}<br/>Tiraj: {selected.join(", ")}</div></div>}
        {tab==="PARAMÈT" && <div style={{color:'#000', fontWeight:'bold'}}><h3>PARAMÈT</h3><p>Antet Ticket<br/>Pye Ticket<br/>Limit Global: vendeur1+2...<br/>Fèmti otomatik</p></div>}
        {tab==="X FÈMEN" && <div style={{color:'red', fontWeight:'bold'}}><h3>FÈMEN CAISSE</h3><button style={{width:'100%', padding:'14px', background:'red', color:'#fff', borderRadius:'8px'}}>Konfime Fèmen</button></div>}
      </div>
    </div>
  );
}
