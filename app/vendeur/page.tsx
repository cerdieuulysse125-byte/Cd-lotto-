"use client";
import { useState, useRef, useEffect } from "react";

const TIRAGES = ["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Real 12h45","Primera dia 11h50","Suerte dia 12h20","Lote Dom 1h45","Ganamas 14h15","Suerte noche 17h50","Primera noche 19h50","Loteka 19h45","Nacional noche 20h50","Leidsa 20h45","Anguila 10h","Anguila 18h"];
const JEUX = ["Bolet","Maryaj","Loto3","Loto4","Loto5"];

export default function Page(){
  const [tab, setTab] = useState("VENDRE");
  const [selected, setSelected] = useState<string[]>([]);
  const [openTirage, setOpenTirage] = useState(false);
  const [jeu, setJeu] = useState("Loto3");
  const [boul, setBoul] = useState("");
  const [miz, setMiz] = useState("");
  const [fiches, setFiches] = useState<any[]>([]);
  const [du, setDu] = useState(new Date().toISOString().slice(0,10));
  const [au, setAu] = useState(new Date().toISOString().slice(0,10));
  const [filtreTiraj, setFiltreTiraj] = useState("TOUT");
  const [idCopy, setIdCopy] = useState("");
  const [printers, setPrinters] = useState<string[]>([]);
  const [defaultPrinter, setDefaultPrinter] = useState("");

  const boulRef = useRef<HTMLInputElement>(null);
  const mizRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    try{ setPrinters(JSON.parse(localStorage.getItem('printers_list')||'[]')); setDefaultPrinter(localStorage.getItem('printer_default')||""); }catch{}
    const saved = localStorage.getItem('cd_fiches'); if(saved) setFiches(JSON.parse(saved));
  },[]);
  useEffect(()=>{ localStorage.setItem('cd_fiches', JSON.stringify(fiches)); },[fiches]);

  const toggleT = (t:string) => setSelected(s=> s.includes(t)? s.filter(x=>x!==t) : [...s,t]);

  const normalize = (b:string) => {
    if(jeu==="Maryaj" && (b.includes('x')||b.includes('×'))){
      return b.split(/x|×/).map(x=>x.trim().padStart(2,'0')).sort().join('×');
    }
    return b;
  };

  const ajouter = () => {
    if(!boul ||!miz) return alert("Mete Boul ak Miz");
    if(selected.length===0) return alert("Chwazi tiraj nan 1 SEL KAZ anwo a");
    // LIMITE GLOBAL + FEMTI (senp)
    if(parseInt(miz)>5000) return alert("⛔ Limite 5000 HTG");
    setFiches([...fiches, {id:Date.now(), jeu, boul:normalize(boul), miz:parseInt(miz), tirages:selected, date:new Date().toISOString()}]);
    setBoul(""); setMiz(""); setTimeout(()=>boulRef.current?.focus(),50);
  };

  const handleKey = (e:any, next:string) => {
    if(e.key==="ArrowRight" || e.key==="ArrowDown" || e.key==="Enter"){
      e.preventDefault();
      if(next==="miz") mizRef.current?.focus(); else ajouter();
    }
  };

  const total = fiches.reduce((s,f)=>s+f.miz,0);
  const grand = total * (selected.length||1);

  return (
    <div style={{maxWidth:'480px', margin:'0 auto', background:'#fff', minHeight:'100vh', fontFamily:'Arial', color:'#000'}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', padding:'10px'}}>
        {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMÈT","X FÈMEN"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'14px 2px', borderRadius:'12px', border:'2px solid #000', fontWeight:'900', fontSize:'11px', background: tab===t? "#4fb3ff":"#eee", color:'#000'}}>{t}</button>
        ))}
      </div>

      <div style={{padding:'10px'}}>
        {tab==="VENDRE" && (
          <>
            <div style={{position:'relative'}}>
              <button onClick={()=>setOpenTirage(!openTirage)} style={{width:'100%', padding:'12px', border:'2px solid #000', borderRadius:'8px', background:'#fff', textAlign:'left', fontWeight:'900', color:'#000'}}>
                {selected.length===0? "▼ CHWAZI TIRAJ YO (1 SEL KAZ)" : `▼ ${selected.length} tiraj: ${selected.join(", ").slice(0,45)}`}
              </button>
              {openTirage && (
                <div style={{position:'absolute', top:'46px', left:0, right:0, background:'#fff', border:'2px solid #000', borderRadius:'10px', zIndex:20, maxHeight:'300px', overflow:'auto', padding:'6px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
                  {TIRAGES.map(t=>(
                    <label key={t} style={{border:'1px solid #000', padding:'8px 4px', borderRadius:'6px', background:selected.includes(t)?"#b3e5fc":"#fff", fontSize:'11px', fontWeight:'900', color:'#000'}}>
                      <input type="checkbox" checked={selected.includes(t)} onChange={()=>toggleT(t)}/> {t}
                    </label>
                  ))}
                  <button onClick={()=>setOpenTirage(false)} style={{gridColumn:'1 / span 2', background:'#000', color:'#fff', padding:'12px', borderRadius:'8px', fontWeight:'900'}}>OK FÈMEN</button>
                </div>
              )}
            </div>

            <div style={{display:'flex', gap:'6px', marginTop:'12px'}}>
              <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%', padding:'12px 4px', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', background:'#fff', color:'#000', fontSize:'13px'}}>
                {JEUX.map(j=><option key={j}>{j}</option>)}
              </select>
              <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>handleKey(e,"miz")} placeholder="Boul" inputMode="numeric" style={{width:'32%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'900'}}/>
              <input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKey(e,"ok")} placeholder="Miz" inputMode="numeric" type="number" style={{width:'24%', padding:'12px', border:'2px solid #000', borderRadius:'10px', color:'#000', background:'#fff', fontSize:'16px', fontWeight:'900'}}/>
              <button onClick={ajouter} style={{width:'18%', background:'#0d7a3e', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900'}}>OK</button>
            </div>

            <div style={{background:'#fff', border:'2px solid #000', borderRadius:'10px', minHeight:'130px', marginTop:'10px', padding:'6px'}}>
              {fiches.map((f,i)=>(
                <div key={f.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 4px', borderBottom:'1px solid #000', color:'#000', fontWeight:'900', fontSize:'14px'}}>
                  <span>{f.jeu} {f.boul}</span><span>{f.miz} HTG</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span>
                </div>
              ))}
            </div>

            <div style={{background:'#0d7a3e', color:'#fff', textAlign:'center', padding:'12px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', border:'2px solid #000'}}>
              Total {total} × {selected.length||1} = {grand} HTG
            </div>
            <button onClick={()=>{
              const win=window.open('','','width=300,height=600'); win!.document.write(`<div style="width:58mm; text-align:center; font-family:monospace; font-weight:bold; color:#000; font-size:18px">C&D VERITE<br/>${selected.join(', ')}<hr/>${fiches.map(f=>`${f.jeu} ${f.boul} - ${f.miz}<br/>`).join('')}<hr/>TOTAL: ${grand} HTG<br/><br/>Imprimante: ${defaultPrinter||'System'}<br/>${new Date().toLocaleString()}<br/>BON CHANS!</div><script>window.print();window.close()<\/script>`);
            }} style={{width:'100%', background:'#000', color:'#fff', padding:'14px', borderRadius:'10px', marginTop:'8px', fontWeight:'900', border:'2px solid #000'}}>IMPRIMER - {defaultPrinter||'SYSTEM'}</button>
          </>
        )}

        {tab==="COPIER" && <div style={{color:'#000'}}><h3>COPIER</h3><input value={idCopy} onChange={e=>setIdCopy(e.target.value)} placeholder="ID Ticket" style={{width:'100%', padding:'14px', border:'2px solid #000', borderRadius:'8px', color:'#000'}}/><button onClick={()=>{const f=fiches.find(x=>String(x.id)===idCopy); if(f){setFiches([...fiches,f]); alert("Kopye!")}else alert("Pa jwenn");}} style={{width:'100%', padding:'12px', marginTop:'8px', background:'#4fb3ff', border:'2px solid #000', borderRadius:'8px', fontWeight:'900'}}>Kopye Fich</button></div>}

        {tab==="MES FICHES" && <div style={{color:'#000', fontWeight:'900'}}><h3>MES FICHES</h3>{fiches.length===0? "Pa gen fich": fiches.map(f=><div key={f.id} style={{border:'1px solid #000', padding:'8px', margin:'6px 0', borderRadius:'8px'}}>{new Date(f.date).toLocaleTimeString()} - {f.jeu} {f.boul} {f.miz}HTG - {f.tirages?.join(',')}</div>)}</div>}

        {tab==="RAPPORT" && (
          <div style={{color:'#000'}}>
            <h3 style={{fontWeight:'900', margin:'0 0 10px'}}>RAPPORT</h3>
            <div style={{display:'flex', gap:'6px', marginBottom:'8px'}}>
              <div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:'900'}}>Du.</label><input type="date" value={du} onChange={e=>setDu(e.target.value)} style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px', color:'#000'}}/></div>
              <div style={{flex:1}}><label style={{fontSize:'11px', fontWeight:'900'}}>Au.</label><input type="date" value={au} onChange={e=>setAu(e.target.value)} style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px', color:'#000'}}/></div>
            </div>
            <div style={{marginBottom:'10px'}}><label style={{fontSize:'11px', fontWeight:'900'}}>Tiraj ( chwazi, oubyen tout )</label><select value={filtreTiraj} onChange={e=>setFiltreTiraj(e.target.value)} style={{width:'100%', padding:'12px', border:'2px solid #000', borderRadius:'8px', fontWeight:'900', color:'#000', background:'#fff'}}><option value="TOUT">TOUT</option>{TIRAGES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            {(()=>{ const vente = fiches.filter(f=> filtreTiraj==="TOUT" || f.tirages?.includes(filtreTiraj)).reduce((s,f)=>s+f.miz,0); const komisyon = Math.round(vente*0.2); const aPeye=0; const balans=vente-komisyon-aPeye; return (<><div style={{border:'2px solid #000', borderRadius:'10px', overflow:'hidden', fontWeight:'900'}}><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000', background:'#eee'}}><span>Vant</span><span>{vente} HTG</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000'}}><span>Komisyon (20%)</span><span>{komisyon} HTG</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid #000'}}><span>A Peye</span><span>{aPeye} HTG</span></div><div style={{display:'flex', justifyContent:'space-between', padding:'14px', background:'#000', color:'#fff'}}><span>Balans Net</span><span>{balans} HTG</span></div></div><button onClick={()=>{const w=window.open('','','width=320,height=600'); w!.document.write(`<div style="width:58mm; font-family:monospace; font-weight:bold; text-align:center; color:#000">RAPPORT<br/>Du ${du} Au ${au}<br/>Tiraj: ${filtreTiraj}<hr/>Vant: ${vente}<br/>Komisyon: ${komisyon}<br/>A Peye: ${aPeye}<br/><hr/>Balans Net: ${balans}<hr/>${new Date().toLocaleString()}</div><script>window.print();window.close()<\/script>`);}} style={{width:'100%', marginTop:'10px', padding:'14px', background:'#0d7a3e', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900'}}>ENPRIME</button></> )})()}
          </div>
        )}

        {tab==="PARAMÈT" && (
          <div style={{color:'#000'}}>
            <h3 style={{fontWeight:'900'}}>PARAMÈT</h3>
            <div style={{border:'2px solid #000', borderRadius:'10px', padding:'12px', marginBottom:'10px'}}>
              <div style={{background:'#f5f5f5', padding:'10px', borderRadius:'8px', border:'1px solid #000', marginBottom:'10px', fontWeight:'900'}}>Pa defo: <span style={{color:'#0d7a3e'}}>{defaultPrinter||"System Print"}</span></div>
              <button onClick={async()=>{
                try{
                  const dev = await (navigator as any).bluetooth?.requestDevice({filters:[{namePrefix:'MPT'},{namePrefix:'POS'},{namePrefix:'Printer'}], optionalServices:['battery_service']});
                  if(dev){ const n=dev.name||dev.id; let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(n)) L.push(n); localStorage.setItem('printers_list', JSON.stringify(L)); setPrinters(L); alert("Jwenn: "+n); }
                }catch(e:any){ alert(e.message); }
              }} style={{width:'100%', padding:'14px', background:'#2196F3', color:'#fff', border:'2px solid #000', borderRadius:'10px', fontWeight:'900', marginBottom:'8px'}}>1- 🔍 RECHÈCH TOUT IMPRIMANTE</button>
              <div style={{border:'1px solid #000', borderRadius:'8px', maxHeight:'120px', overflow:'auto', padding:'6px'}}>
                {(printers.length?printers:["Klike rechèch"]).map((p,i)=><div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px', borderBottom:'1px solid #ddd', fontWeight:'900', fontSize:'12px'}}><span>{p}</span><button onClick={()=>{localStorage.setItem('printer_default',p); setDefaultPrinter(p);}} style={{background:defaultPrinter===p?'#0d7a3e':'#000', color:'#fff', borderRadius:'6px', padding:'4px 8px', fontSize:'10px'}}>{defaultPrinter===p?'✓ DEFO':'DEFINI DEFO'}</button></div>)}
              </div>
              <div style={{marginTop:'10px'}}><label style={{fontSize:'11px', fontWeight:'900'}}>2- AJOUTE IMPRIMANTE PA DEFO</label><div style={{display:'flex', gap:'6px', marginTop:'6px'}}><input id="mp" placeholder="MPT-II" style={{flex:1, padding:'12px', border:'2px solid #000', borderRadius:'8px', fontWeight:'900', color:'#000'}}/><button onClick={()=>{const v=(document.getElementById('mp') as any).value; if(v){localStorage.setItem('printer_default',v); let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(v)) L.push(v); localStorage.setItem('printers_list', JSON.stringify(L)); setPrinters(L); setDefaultPrinter(v);}}} style={{padding:'12px', background:'#000', color:'#fff', borderRadius:'8px', fontWeight:'900'}}>AJOUTE</button></div></div>
            </div>
            <div style={{border:'2px solid #000', borderRadius:'10px', padding:'12px'}}><div style={{fontWeight:'900'}}>Antet</div><input defaultValue="C&D VERITE LOTTO" style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/><div style={{fontWeight:'900', marginTop:'6px'}}>Pye</div><input defaultValue="BON CHANS!" style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/><div style={{fontWeight:'900', marginTop:'6px'}}>Komisyon %</div><input defaultValue="20" type="number" style={{width:'100%', padding:'10px', border:'2px solid #000', borderRadius:'8px'}}/></div>
          </div>
        )}

        {tab==="X FÈMEN" && <div style={{color:'#000', fontWeight:'900'}}><h3 style={{color:'red'}}>FÈMEN CAISSE</h3><button onClick={()=>{if(confirm("Fèmen?")){localStorage.removeItem('cd_fiches'); setFiches([]); alert("Fèmen!");}}} style={{width:'100%', padding:'14px', background:'red', color:'#fff', borderRadius:'10px', fontWeight:'900', border:'2px solid #000'}}>Konfime Fèmen</button></div>}
      </div>
    </div>
  );
}
