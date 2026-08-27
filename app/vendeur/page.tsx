"use client";
import { useState, useRef, useEffect } from "react";

const TIRAGES = ["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Real 12h45","Primera dia 11h50","Suerte dia 12h20","Lote Dom 1h45","Ganamas 14h15","Suerte noche 17h50","Primera noche 19h50","Loteka 19h45","Nacional noche 20h50","Leidsa 20h45","Anguila 10h","Anguila 18h"];
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
    if(selected.length===0) return alert("Chwazi tiraj");
    if(parseInt(miz)>5000) return alert("Limite 5000");
    setFiches([...fiches,{id:Date.now(), jeu, boul, miz:parseInt(miz), tirages:selected, date:new Date().toISOString()}]);
    setBoul(""); setMiz(""); setTimeout(()=>boulRef.current?.focus(),50);
  };

  // PRINT SANTRE GWO LET - V2 PRO
  const printTicket=()=>{
    const cfg = JSON.parse(localStorage.getItem('cfg_antet') || '{"nom":"C&D VÉRITÉ LOTTO","vendeur":"Toto","showDate":true,"showTirage":true,"showVendeur":true,"showId":true}');
    const idTicket='CD'+Date.now().toString().slice(-6);
    const dateNow=new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString();
    const total=fiches.reduce((s,f)=>s+f.miz,0)*(selected.length||1);
    const lignes=fiches.map(f=>`<div style="display:flex;justify-content:space-between;font-size:32px;line-height:40px;font-weight:900;width:100%;"><span style="text-align:left;">${f.jeu} ${f.boul}</span><span style="text-align:right;min-width:50px;">${f.miz}</span></div>`).join('');

    const w=window.open('','','width=900,height=1200');
    w!.document.write(`
    <html><head><style>
      @page{size:A4;margin:0;}
      html,body{width:210mm;height:297mm;margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:#fff;}
     .ticket{width:85mm;border:4px solid #000;padding:8mm 6mm;text-align:center;font-family:monospace;font-weight:900;color:#000;background:#fff;}
     .title{font-size:36px;line-height:38px;}
     .info{font-size:22px;line-height:26px;}
      hr{border:none;border-top:4px dashed #000;margin:14px 0;}
     .total{font-size:40px;line-height:42px;}
    </style></head><body>
      <div class="ticket">
        <div class="title">${cfg.nom}</div>
        <div class="info">Dat: ${dateNow}</div>
        <div class="info" style="font-size:18px;">Tiraj: ${selected.join(', ')}</div>
        <div class="info">Vandè: ${cfg.vendeur}</div>
        <div class="info">Id ticket: ${idTicket}</div>
        <hr/>${lignes}<hr/>
        <div class="total">TOTAL: ${total} HTG</div>
        <hr/>
        <div style="font-size:22px;">BON CHANS!</div>
        <div style="font-size:12px;margin-top:6px;">${defP||'System'}</div>
      </div>
      <script>setTimeout(()=>{window.print();window.close()},500);<\/script>
    </body></html>`);
  };

  const printDirectV2=()=>{
    const txt=`C&D VERITE LOTTO
Dat: ${new Date().toLocaleString()}
Tiraj: ${selected.join(', ')}
Vande: ${JSON.parse(localStorage.getItem('cfg_antet')||'{"vendeur":"Toto"}').vendeur}
Id: CD${Date.now().toString().slice(-6)}

${fiches.map(f=>`${f.jeu} ${f.boul} ${f.miz}`).join('\n')}

TOTAL: ${fiches.reduce((s,f)=>s+f.miz,0)*(selected.length||1)} HTG
BON CHANS!`;
    window.location.href='rawbt:'+encodeURIComponent(txt);
  };

  const total=fiches.reduce((s,f)=>s+f.miz,0);
  const grand=total*(selected.length||1);

  return (
    <div style={{maxWidth:'500px',margin:'0 auto',background:'#fff',minHeight:'100vh',color:'#000',fontFamily:'Arial'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',padding:'10px'}}>
        {["VENDRE","COPIER","MES FICHES","RAPPORT","PARAMÈT","X FÈMEN"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'14px 2px',borderRadius:'12px',border:'2px solid #000',fontWeight:'900',fontSize:'11px',background:tab===t?"#4fb3ff":"#eee",color:'#000'}}>{t}</button>)}
      </div>
      <div style={{padding:'10px'}}>
        {tab==="VENDRE" && (<>
          <div style={{position:'relative'}}>
            <button onClick={()=>setOpenT(!openT)} style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'8px',background:'#fff',fontWeight:'900',color:'#000',textAlign:'left'}}>{selected.length===0?"▼ CHWAZI TIRAJ (1 KAZ)":`▼ ${selected.length}: ${selected.join(", ").slice(0,50)}`}</button>
            {openT && <div style={{position:'absolute',top:'48px',left:0,right:0,background:'#fff',border:'2px solid #000',borderRadius:'12px',zIndex:20,maxHeight:'320px',overflow:'auto',padding:'6px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>{TIRAGES.map(t=><label key={t} style={{border:'1px solid #000',padding:'10px 4px',borderRadius:'8px',background:selected.includes(t)?"#b3e5fc":"#fff",fontSize:'11px',fontWeight:'900',color:'#000'}}><input type="checkbox" checked={selected.includes(t)} onChange={()=>toggle(t)}/> {t}</label>)}<button onClick={()=>setOpenT(false)} style={{gridColumn:'1 / span 2',background:'#000',color:'#fff',padding:'12px',borderRadius:'8px',fontWeight:'900'}}>OK FÈMEN</button></div>}
          </div>
          <div style={{display:'flex',gap:'6px',marginTop:'12px'}}>
            <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{width:'26%',padding:'14px 4px',border:'2px solid #000',borderRadius:'12px',fontWeight:'900',background:'#fff',color:'#000',fontSize:'14px'}}>{JEUX.map(j=><option key={j}>{j}</option>)}</select>
            <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();mizRef.current?.focus()}}} placeholder="Boul" inputMode="numeric" style={{width:'32%',padding:'14px',border:'2px solid #000',borderRadius:'12px',color:'#000',background:'#fff',fontSize:'18px',fontWeight:'900'}}/>
            <input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,''))} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();ajouter()}}} placeholder="Miz" type="number" style={{width:'24%',padding:'14px',border:'2px solid #000',borderRadius:'12px',color:'#000',background:'#fff',fontSize:'18px',fontWeight:'900'}}/>
            <button onClick={ajouter} style={{width:'18%',background:'#0d7a3e',color:'#fff',border:'2px solid #000',borderRadius:'12px',fontWeight:'900',fontSize:'18px'}}>OK</button>
          </div>
          <div style={{background:'#fff',border:'2px solid #000',borderRadius:'12px',minHeight:'140px',marginTop:'10px',padding:'6px'}}>
            {fiches.map((f,i)=><div key={f.id} style={{display:'flex',justifyContent:'center',gap:'20px',padding:'10px 4px',borderBottom:'1px solid #000',color:'#000',fontWeight:'900',fontSize:'16px'}}><span style={{width:'140px',textAlign:'left'}}>{f.jeu} {f.boul}</span><span style={{width:'50px',textAlign:'right'}}>{f.miz}</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red',marginLeft:'10px'}}>X</span></div>)}
          </div>
          <div style={{background:'#0d7a3e',color:'#fff',textAlign:'center',padding:'14px',borderRadius:'12px',marginTop:'8px',fontWeight:'900',border:'2px solid #000',fontSize:'18px'}}>Total {total} × {selected.length||1} = {grand} HTG</div>
          <button onClick={printTicket} style={{width:'100%',background:'#000',color:'#fff',padding:'18px',borderRadius:'12px',marginTop:'10px',fontWeight:'900',border:'2px solid #000',fontSize:'18px'}}>🖨️ IMPRIMER - MITAN PAJ GWO LÈT</button>
          <button onClick={printDirectV2} style={{width:'100%',background:'#2196F3',color:'#fff',padding:'16px',borderRadius:'12px',marginTop:'8px',fontWeight:'900',border:'2px solid #000'}}>⚡ PRINT DIRÈK V2 PRO 58mm (RawBT)</button>
        </>)}

        {tab==="RAPPORT" && <div><h3 style={{fontWeight:'900',margin:'0 0 10px'}}>RAPPORT</h3><div style={{display:'flex',gap:'6px'}}><div style={{flex:1}}><label style={{fontSize:'11px',fontWeight:'900'}}>Du.</label><input type="date" value={du} onChange={e=>setDu(e.target.value)} style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'8px'}}/></div><div style={{flex:1}}><label style={{fontSize:'11px',fontWeight:'900'}}>Au.</label><input type="date" value={au} onChange={e=>setAu(e.target.value)} style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'8px'}}/></div></div><select value={filtreT} onChange={e=>setFiltreT(e.target.value)} style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'8px',marginTop:'8px',fontWeight:'900'}}><option value="TOUT">TOUT TIRAJ</option>{TIRAGES.map(t=><option key={t}>{t}</option>)}</select>{(()=>{const v=fiches.filter(f=>filtreT==="TOUT"||f.tirages?.includes(filtreT)).reduce((s,f)=>s+f.miz,0); const k=Math.round(v*0.2); return <><div style={{border:'2px solid #000',borderRadius:'12px',marginTop:'10px',overflow:'hidden',fontWeight:'900'}}><div style={{display:'flex',justifyContent:'space-between',padding:'14px',borderBottom:'1px solid #000',background:'#eee'}}><span>Vant</span><span>{v} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',padding:'14px',borderBottom:'1px solid #000'}}><span>Komisyon</span><span>{k} HTG</span></div><div style={{display:'flex',justifyContent:'space-between',padding:'14px',borderBottom:'1px solid #000'}}><span>A Peye</span><span>0 HTG</span></div><div style={{display:'flex',justifyContent:'space-between',padding:'16px',background:'#000',color:'#fff',fontSize:'18px'}}><span>Balans Net</span><span>{v-k} HTG</span></div></div><button onClick={()=>window.print()} style={{width:'100%',marginTop:'10px',padding:'16px',background:'#0d7a3e',color:'#fff',borderRadius:'12px',fontWeight:'900',border:'2px solid #000'}}>ENPRIME</button></>})()}</div>}

        {tab==="PARAMÈT" && <div><h3 style={{fontWeight:'900'}}>PARAMÈT</h3><div style={{border:'2px solid #000',borderRadius:'12px',padding:'12px'}}><div style={{fontWeight:'900',background:'#f5f5f5',padding:'10px',borderRadius:'8px',border:'1px solid #000'}}>Pa defo: <span style={{color:'#0d7a3e'}}>{defP||'System'}</span></div><button onClick={async()=>{try{const d=await (navigator as any).bluetooth?.requestDevice({filters:[{namePrefix:'MPT'},{namePrefix:'POS'},{namePrefix:'Printer'}]}); const n=d.name||d.id; let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(n)) L.push(n); localStorage.setItem('printers_list',JSON.stringify(L)); setPrinters(L);}catch(e:any){alert(e.message)}} } style={{width:'100%',padding:'14px',background:'#2196F3',color:'#fff',border:'2px solid #000',borderRadius:'12px',fontWeight:'900',marginTop:'10px'}}>1- 🔍 RECHÈCH TOUT IMPRIMANTE</button><div style={{border:'1px solid #000',borderRadius:'8px',maxHeight:'120px',overflow:'auto',marginTop:'10px',padding:'4px'}}>{printers.map((p,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px',fontSize:'13px',fontWeight:'900',borderBottom:'1px solid #eee'}}><span>{p}</span><button onClick={()=>{localStorage.setItem('printer_default',p); setDefP(p)}} style={{background:defP===p?'#0d7a3e':'#000',color:'#fff',borderRadius:'6px',padding:'4px 8px',fontSize:'11px'}}>{defP===p?'✓ DEFO':'DEFO'}</button></div>)}</div><div style={{marginTop:'12px'}}><label style={{fontSize:'11px',fontWeight:'900'}}>2- AJOUTE IMPRIMANTE PA DEFO</label><div style={{display:'flex',gap:'6px',marginTop:'6px'}}><input id="mp" placeholder="MPT-II" style={{flex:1,padding:'12px',border:'2px solid #000',borderRadius:'8px',fontWeight:'900'}}/><button onClick={()=>{const v=(document.getElementById('mp') as any).value; if(v){localStorage.setItem('printer_default',v); setDefP(v); let L=JSON.parse(localStorage.getItem('printers_list')||'[]'); if(!L.includes(v)) L.push(v); localStorage.setItem('printers_list',JSON.stringify(L)); setPrinters(L);}}} style={{padding:'12px',background:'#000',color:'#fff',borderRadius:'8px',fontWeight:'900'}}>AJOUTE</button></div></div></div></div>}

        {tab==="MES FICHES" && <div style={{fontWeight:'900'}}><h3>MES FICHES - {fiches.length}</h3>{fiches.map(f=><div key={f.id} style={{border:'1px solid #000',padding:'10px',margin:'8px 0',borderRadius:'8px'}}>{new Date(f.date).toLocaleTimeString()} - {f.jeu} {f.boul} {f.miz} HTG</div>)}</div>}
        {tab==="COPIER" && <div><input placeholder="ID Ticket" style={{width:'100%',padding:'14px',border:'2px solid #000',borderRadius:'8px'}}/><button style={{width:'100%',padding:'14px',marginTop:'10px',background:'#4fb3ff',border:'2px solid #000',borderRadius:'10px',fontWeight:'900'}}>Kopye</button></div>}
        {tab==="X FÈMEN" && <div><h3 style={{color:'red',fontWeight:'900'}}>FÈMEN CAISSE</h3><button onClick={()=>{if(confirm("Fèmen caisse?")){localStorage.removeItem('cd_fiches'); setFiches([]); alert("Fèmen!");}}} style={{width:'100%',padding:'16px',background:'red',color:'#fff',borderRadius:'12px',fontWeight:'900',border:'2px solid #000'}}>Konfime Fèmen</button></div>}
      </div>
    </div>
  );
}
