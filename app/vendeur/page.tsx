"use client";
import { useState } from "react";

const TIRAGES = ["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Primera 11h50","Suerte 12h20","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional","Leidsa","Anguila 10h","Anguila 18h"];

export default function VendeurPage(){
  const [tab, setTab] = useState("VENDRE");
  const [selected, setSelected] = useState<string[]>([]);
  const [jeu, setJeu] = useState("Loto3");
  const [boul, setBoul] = useState("");
  const [miz, setMiz] = useState("");
  const [fiches, setFiches] = useState<any[]>([]);

  const toggle = (t:string) => {
    setSelected(s=> s.includes(t)? s.filter(x=>x!==t) : [...s, t]);
  };

  const ajouter = () => {
    if(!boul || !miz) return;
    // LIMITE + FEMTI ap tcheke isit
    if(selected.length===0) return alert("Chwazi tiraj");
    setFiches([...fiches, {jeu, boul, miz: parseInt(miz)}]);
    setBoul(""); setMiz("");
  };

  const total = fiches.reduce((a,b)=>a+b.miz,0);

  return (
    <div style={{maxWidth:'480px', margin:'0 auto', background:'#fff', minHeight:'100vh'}}>
      {/* ONGLE YO - KORIJE */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', padding:'10px'}}>
        {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMÈT","X FÈMEN"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{
              padding:'14px 4px', borderRadius:'12px', border:'2px solid #000',
              fontWeight:'bold', fontSize:'13px',
              background: tab===t ? (t==="X FÈMEN" ? "#ff3b30" : t==="PARAMÈT" ? "#ff9500" : "#5ac8fa") : "#eee",
              color: tab===t && t==="X FÈMEN" ? "#fff" : "#000"
            }}>{t}</button>
        ))}
      </div>

      {/* KONTNI - SA KI TE VID LA KOUNYA AP OUVÈ */}
      <div style={{padding:'10px'}}>
        {tab==="VENDRE" && (
          <>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', maxHeight:'180px', overflow:'auto', border:'1px solid #ddd', padding:'6px', borderRadius:'8px'}}>
              {TIRAGES.map(t=>(
                <label key={t} style={{fontSize:'12px', background:selected.includes(t)?'#d4edda':'#fff', padding:'5px', borderRadius:'4px', border:'1px solid #ccc'}}>
                  <input type="checkbox" checked={selected.includes(t)} onChange={()=>toggle(t)}/> {t}
                </label>
              ))}
            </div>

            {/* FIX: KAZ JEUX-BOUL-MIZ PA DWE TWÒ LONG - 3 TI KAZ KOUT */}
            <div style={{display:'flex', gap:'6px', marginTop:'12px'}}>
              <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'28%', padding:'12px 6px', border:'2px solid #000', borderRadius:'8px', fontSize:'13px', fontWeight:'bold'}}>
                <option>Loto3</option><option>Mariage</option><option>Loto4</option><option>Gratis</option>
              </select>
              <input value={boul} onChange={e=>setBoul(e.target.value)} placeholder="Boul" inputMode="numeric"
                style={{width:'32%', padding:'12px 6px', border:'2px solid #000', borderRadius:'8px', fontSize:'16px'}}/>
              <input value={miz} onChange={e=>setMiz(e.target.value)} placeholder="Miz" inputMode="numeric" type="number"
                style={{width:'25%', padding:'12px 6px', border:'2px solid #000', borderRadius:'8px', fontSize:'16px'}}/>
              <button onClick={ajouter} style={{width:'15%', background:'#0b5d2e', color:'#fff', borderRadius:'8px', border:'2px solid #000', fontWeight:'bold'}}>OK</button>
            </div>

            <div style={{background:'#f5f5f5', minHeight:'120px', marginTop:'10px', borderRadius:'8px', padding:'6px'}}>
              {fiches.map((f,i)=><div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px', borderBottom:'1px solid #ddd'}}><span>{f.jeu} {f.boul}</span><span>{f.miz} HTG</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span></div>)}
            </div>

            <div style={{background:'#0b5d2e', color:'#fff', textAlign:'center', padding:'12px', borderRadius:'8px', marginTop:'8px', fontWeight:'bold'}}>
              Total {total} x {selected.length} = {total*selected.length} HTG
            </div>
            <button onClick={()=>window.print()} style={{width:'100%', background:'#000', color:'#fff', padding:'14px', borderRadius:'8px', marginTop:'8px', fontWeight:'bold'}}>IMPRIMER</button>
          </>
        )}

        {tab==="COPIER" && <div><h3>COPIER</h3><input placeholder="ID Ticket" style={{width:'100%', padding:'14px', borderRadius:'8px', border:'2px solid #000'}}/><button style={{width:'100%', padding:'12px', marginTop:'8px', background:'#5ac8fa', borderRadius:'8px'}}>Chèche</button></div>}
        {tab==="MES FICHES" && <div><h3>MES FICHES</h3><p>Lis fich ou yo ap parèt la...</p></div>}
        {tab==="RAPPORT" && <div><h3>RAPPORT</h3><p>Rapò pa tiraj...</p></div>}
        {tab==="PARAMÈT" && <div><h3>PARAMÈT</h3><p>Antet / Pye ticket / Imprimante...</p></div>}
        {tab==="X FÈMEN" && <div><h3 style={{color:'red'}}>FÈMEN CAISSE</h3><p>Ou vle fèmen?</p></div>}
      </div>
    </div>
  )
}
