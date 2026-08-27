import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAuuxJB1G1hdJUyMaKucgiNsFO-teYvri4",
  authDomain: "cd-lotto.firebaseapp.com",
  databaseURL: "https://cd-lotto-default-rtdb.firebaseio.com",
  projectId: "cd-lotto",
  appId: "1:671091732195:web:51bcfe8df83bc58fc75fd6"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const TIRAGES = [
  {n:"GA midi", f:"12:00"}, {n:"FL midi", f:"12:30"}, {n:"NY midi", f:"13:15"},
  {n:"Real", f:"12:30"}, {n:"GA soir", f:"19:30"}, {n:"FL soir", f:"20:30"},
  {n:"NY soir", f:"21:30"}, {n:"Real 12h45", f:"12:35"},
  {n:"Primera dia 11h50", f:"11:40"}, {n:"Suerte dia 12h20", f:"12:10"},
  {n:"Lote Dom 1h45", f:"13:35"}, {n:"Ganamas 14h15", f:"14:05"},
  {n:"Suerte noche 17h50", f:"17:40"}, {n:"Primera noche 19h50", f:"19:40"},
  {n:"Loteka 19h45", f:"19:35"}, {n:"Nacional noche 20h50", f:"20:40"},
  {n:"Leidsa 20h45", f:"20:35"}, {n:"Anguila 10h", f:"09:55"}, {n:"Anguilla 18h", f:"17:55"}
];

export default function VendeurV11(){
  const [tab, setTab] = useState('vendre');
  const [selectedT, setSelectedT] = useState([]);
  const [jeu, setJeu] = useState('Loto3');
  const [boul, setBoul] = useState('');
  const [mise, setMise] = useState('');
  const [fiches, setFiches] = useState([]);
  const [limites, setLimites] = useState({});

  useEffect(()=>{
    onValue(ref(db,'limitesGlobales'), s=> setLimites(s.val()||{}));
  },[]);

  const toggleT = (nom) => {
    const now = new Date();
    const t = TIRAGES.find(x=>x.n===nom);
    const [h,m] = t.f.split(':').map(Number);
    const ferm = new Date(); ferm.setHours(h,m,0);
    if(now > ferm) return alert(`⛔ ${nom} FÈMEN depi ${t.f}`);
    setSelectedT(prev=> prev.includes(nom)? prev.filter(x=>x!==nom) : [...prev, nom]);
  };

  const normalizeMariage = (b) => {
    if(b.includes('x')||b.includes('×')){
      return b.split(/x|×/).map(s=>s.trim().padStart(2,'0')).sort().join('×');
    }
    return b;
  };

  const ajouter = async () => {
    if(!boul||!mise) return alert('Mete boul/mise');
    if(selectedT.length===0) return alert('Chwazi tiraj');

    const finalBoul = jeu==='Mariage'? normalizeMariage(boul) : boul.padStart(2,'0');
    const LIMITE = jeu==='Loto3'?5000: jeu==='Mariage'?10000:2000;
    const totalGlobal = limites[finalBoul]||0;

    if(totalGlobal + parseInt(mise) > LIMITE){
      return alert(`⛔ LIMITE GLOBAL\n${finalBoul}: ${totalGlobal}/${LIMITE} HTG\nTout vendeur yo konbine`);
    }

    setFiches([...fiches, {jeu, boul: finalBoul, mise: parseInt(mise), id: Date.now()}]);
    setBoul(''); setMise('');
    setTimeout(()=>document.getElementById('boul')?.focus(),50);
  };

  const total = fiches.reduce((s,f)=>s+f.mise,0);
  const grand = total * selectedT.length;

  const imprimer = async () => {
    if(fiches.length===0) return;
    const id = 'T'+Date.now();
    // Update limite global pou tout vendeur
    for(let f of fiches){
      const snap = await get(ref(db,`limitesGlobales/${f.boul}`));
      await set(ref(db,`limitesGlobales/${f.boul}`), (snap.val()||0)+f.mise);
    }
    const ticket = {id, tirages:selectedT, fiches, total:grand, date:new Date().toISOString()};
    await set(ref(db,`fiches/${id}`), ticket);

    const win = window.open('','','width=300,height=600');
    win.document.write(`
      <html><head><style>
        @media print{body{width:58mm; margin:0}}
       .ticket{width:58mm; text-align:center; font-family:monospace; font-weight:bold; font-size:18px; text-transform:uppercase}
       .ligne{display:flex; justify-content:space-between; font-size:20px; border-bottom:1px dashed #000; padding:4px 0}
      </style></head>
      <body><div class=ticket>
        <div>C&D VERITE LOTTO<br>${new Date().toLocaleString()}<br>${selectedT.join(', ')}</div><hr>
        ${fiches.map(f=>`<div class=ligne><span>${f.jeu} ${f.boul}</span><span>${f.mise}</span></div>`).join('')}
        <hr><div style=font-size:24px>TOTAL: ${grand} HTG</div>
        <div>ID: ${id}</div><br><div>BON CHANS!</div>
      </div><script>window.print();window.close()<\/script></body></html>
    `);
    setFiches([]);
  };

  return (
    <div style={{fontFamily:'Arial', background:'#f2f2f2', minHeight:'100vh'}}>
      <div style={{display:'flex', background:'#0b5d2e', position:'sticky', top:0}}>
        {['vendre','copier','fiches','rapport','param'].map(t=>
          <button key={t} onClick={()=>setTab(t)} style={{flex:1, padding:'14px 4px', background:tab===t?'#ffcc00':'transparent', color:tab===t?'#000':'#fff', border:'none', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        )}
      </div>

      {tab==='vendre' && <>
        <div style={{padding:'8px'}}>
          <div>Chwazi Tiraj yo ({selectedT.length}) - youn sel kaz pou tout tiraj:</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px', maxHeight:'200px', overflow:'auto', background:'#fff', padding:'6px', borderRadius:'8px'}}>
            {TIRAGES.map(t=>(
              <label key={t.n} style={{border:'1px solid #ddd', padding:'6px', borderRadius:'4px', background:selectedT.includes(t.n)?'#d4edda':'#fff', fontSize:'12px'}}>
                <input type="checkbox" checked={selectedT.includes(t.n)} onChange={()=>toggleT(t.n)}/> {t.n} ({t.f})
              </label>
            ))}
          </div>

          <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
            <select value={jeu} onChange={e=>setJeu(e.target.value)} style={{flex:1, padding:'14px'}}><option>Loto3</option><option>Mariage</option><option>Loto4</option><option>Gratis</option></select>
            <input id="boul" value={boul} onChange={e=>setBoul(e.target.value)} onKeyDown={e=>e.key==='Enter'&&document.getElementById('mise').focus()} inputMode="numeric" placeholder="Boul" style={{flex:1, padding:'14px'}}/>
            <input id="mise" value={mise} onChange={e=>setMise(e.target.value.replace(/\D/g,''))} onKeyDown={e=>{if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault(); ajouter()}}} inputMode="numeric" placeholder="Mise" style={{flex:1, padding:'14px'}}/>
          </div>

          <div style={{background:'#fff', minHeight:'150px', marginTop:'8px', borderRadius:'8px'}}>
            {fiches.map((f,i)=><div key={f.id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #eee'}}><span>{f.jeu}</span><b>{f.boul}</b><span>{f.mise} HTG</span><span onClick={()=>setFiches(fiches.filter((_,idx)=>idx!==i))} style={{color:'red'}}>X</span></div>)}
          </div>

          <div style={{background:'#0b5d2e', color:'#fff', padding:'12px', textAlign:'center', fontSize:'20px', fontWeight:'bold', borderRadius:'8px', marginTop:'8px'}}>
            Total {total} × {selectedT.length} = {grand} HTG
          </div>
          <button onClick={ajouter} style={{width:'100%', padding:'14px', background:'#0b5d2e', color:'#fff', fontSize:'18px', fontWeight:'bold', border:'none', borderRadius:'8px', marginTop:'6px'}}>↓ AJOUTE (Flèche ↓→ conserve jeu)</button>
          <button onClick={imprimer} style={{width:'100%', padding:'16px', background:'#000', color:'#fff', fontSize:'20px', fontWeight:'bold', border:'none', borderRadius:'8px', marginTop:'6px'}}>IMPRIMER 58mm SANTRE</button>
        </div>
      </>}

      {tab==='copier' && <div style={{padding:'20px'}}><input placeholder="ID Ticket" style={{width:'100%', padding:'14px'}}/><button style={{width:'100%', padding:'14px', marginTop:'10px'}}>Rechèch & Kopi</button></div>}
      {tab==='fiches' && <div style={{padding:'20px'}}>Lis Fiches yo (date)</div>}
      {tab==='rapport' && <div style={{padding:'20px'}}>Rapport - Separe pa tiraj (si 1 fich 3 tiraj = 3 liy nan rapò)</div>}
      {tab==='param' && <div style={{padding:'20px'}}>Antet, Pye Ticket, Imprimante</div>}
    </div>
  );
}
