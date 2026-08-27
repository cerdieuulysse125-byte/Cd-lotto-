"use client";
import { useState, useEffect, useRef } from "react";

const TIRAGES = [
  { id:"ga-midi", nom:"GA midi", h:"11:30" },
  { id:"fl-midi", nom:"FL midi", h:"12:30" },
  { id:"ny-midi", nom:"NY midi", h:"13:20" },
  { id:"real", nom:"Real", h:"13:00" },
  { id:"real-1245", nom:"Real 12h45", h:"12:45" },
  { id:"ga-soir", nom:"GA soir", h:"18:30" },
  { id:"fl-soir", nom:"FL soir", h:"18:00" },
  { id:"ny-soir", nom:"NY soir", h:"20:20" },
  { id:"primera-dia", nom:"Primera dia 11h50", h:"11:50" },
  { id:"suerte-dia", nom:"Suerte dia 12h20", h:"12:20" },
  { id:"lote-dom", nom:"Lote Dom 1h45", h:"13:45" },
  { id:"ganamas", nom:"Ganamas 14h15", h:"14:15" },
  { id:"suerte-noche", nom:"Suerte noche 17h50", h:"17:50" },
  { id:"primera-noche", nom:"Primera noche 19h50", h:"19:50" },
  { id:"loteka", nom:"Loteka 19h45", h:"19:45" },
  { id:"nacional", nom:"Nacional noche", h:"20:50", hDim:"17:50" },
  { id:"leidsa", nom:"Leidsa", h:"20:45", hDim:"15:45" },
  { id:"anguila-10h", nom:"Anguila 10h", h:"10:00", h2:"09:55" },
  { id:"anguila-18h", nom:"Anguilla 18h", h:"18:00", h2:"17:55" },
];

const DEFAULT_PRIX = { lot1:50, lot2:20, lot3:10, m1:1000, m2:1000, m3:1000, maryaj:1000, l3:500, l4:5000, l5:25000 };

export default function Vendeur() {
  const [auth,setAuth]=useState(false); const [pass,setPass]=useState(""); const [nom,setNom]=useState("Vendeur1");
  const [tab,setTab]=useState("vendre");
  const [tiragesSel,setTiragesSel]=useState<string[]>([]); const [showT,setShowT]=useState(false);
  const [jeux,setJeux]=useState("BO"); const [boul,setBoul]=useState(""); const [mise,setMise]=useState("");
  const [lignes,setLignes]=useState<any[]>([]); const [fiches,setFiches]=useState<any[]>([]);
  const [searchId,setSearchId]=useState(""); const [dateF,setDateF]=useState("");
  const [du,setDu]=useState(""); const [au,setAu]=useState(""); const [rapTiraj,setRapTiraj]=useState("tous");
  const [prix,setPrix]=useState(DEFAULT_PRIX); const [limiteG,setLimiteG]=useState(5000);
  const [impDef,setImpDef]=useState(true); const [printers,setPrinters]=useState<string[]>([]);
  const [entete,setEntete]=useState("C&D VÉRITÉ LOTTO");
  const bRef=useRef<HTMLInputElement>(null); const mRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const c=localStorage.getItem("cd_current_vendeur"); if(c){ setAuth(true); setNom(JSON.parse(c).nom); }
    setFiches(JSON.parse(localStorage.getItem("cd_fiches")||"[]"));
    setPrix(JSON.parse(localStorage.getItem("cd_prix")||JSON.stringify(DEFAULT_PRIX)));
    setLimiteG(parseInt(localStorage.getItem("cd_limite_global")||"5000"));
    setEntete(localStorage.getItem("cd_entete")||"C&D VÉRITÉ LOTTO");
    const sp=async()=>{ setPrinters(["V2 Pro","Bluetooth Printer","USB Printer"]); };
    sp(); const iv=setInterval(sp,8000); return()=>clearInterval(iv);
  },[]);

  const login=()=>{
    const vs=JSON.parse(localStorage.getItem("cd_vendeurs")||"[]");
    const f=vs.find((v:any)=>v.password===pass);
    if(vs.length===0 && pass.length>=3){ localStorage.setItem("cd_current_vendeur",JSON.stringify({nom:"Vendeur1",password:pass})); setAuth(true); return; }
    if(f){ localStorage.setItem("cd_current_vendeur",JSON.stringify(f)); setAuth(true); setNom(f.nom); } else alert("Modpas pa bon");
  };

  const getHeureFerm=(t:any)=>{
    const day=new Date().getDay(); if(t.id==="nacional" && day===0) return t.hDim; if(t.id==="leidsa" && day===0) return t.hDim; return t.h;
  };
  const isFerme=(t:any)=>{ const now=new Date(); const hf=getHeureFerm(t); const [hh,mm]=hf.split(":").map(Number); const f=new Date(); f.setHours(hh,mm,0); return now>f; };

  const add=()=>{
    if(!boul||!mise) return;
    const totalAct = JSON.parse(localStorage.getItem("cd_total_global")||"0") + parseInt(mise);
    if(totalAct>limiteG){ alert(`Limite Global ${limiteG}G depase!`); return; }
    setLignes([...lignes,{jeux,boul,mise:parseInt(mise)}]); setBoul(""); setMise(""); bRef.current?.focus();
  };

  const key=(e:any,n:string)=>{ if(e.key==="ArrowRight"||e.key==="ArrowDown"||e.key==="Enter"){ e.preventDefault(); if(n==="mise") mRef.current?.focus(); if(n==="add") add(); } };

  const imprimer=()=>{
    const id="CD"+Date.now().toString().slice(-6);
    const fich={ id, date:new Date().toISOString(), vendeur:nom, tirages:tiragesSel, lignes, total:lignes.reduce((s,l)=>s+l.mise,0)* (tiragesSel.length||1), entete };
    const all=[fich,...fiches]; setFiches(all); localStorage.setItem("cd_fiches",JSON.stringify(all));
    const totG=parseInt(localStorage.getItem("cd_total_global")||"0")+fich.total; localStorage.setItem("cd_total_global",String(totG));
    if(impDef && printers.length>0){ window.print(); }
    setLignes([]); setTiragesSel([]);
  };

  const checkMariage=(a:string,b:string,c:string,d:string)=>{ return (a===c && b===d) || (a===d && b===c); };

  const total = lignes.reduce((s,l)=>s+l.mise,0) * (tiragesSel.length||1);

  if(!auth) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border border-zinc-800">
        <h1 className="text-yellow-400 text-2xl font-black text-center mb-4">VENDEUR</h1>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Modpas" className="w-full h-14 bg-black border-2 border-yellow-400 rounded-xl text-center text-white text-xl outline-none mb-3" autoFocus/>
        <button onClick={login} className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl">ANTRE</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-4 gap-2 p-2">
        <button onClick={()=>setTab("vendre")} className={`${tab==="vendre"?"bg-yellow-400 text-black":"bg-zinc-700 text-white"} font-black py-3 rounded-2xl text-sm`}>VENDRE</button>
        <button onClick={()=>setTab("copier")} className={`${tab==="copier"?"bg-yellow-400 text-black":"bg-zinc-700 text-white"} font-bold py-3 rounded-2xl text-sm`}>COPIER</button>
        <button onClick={()=>setTab("fiches")} className={`${tab==="fiches"?"bg-yellow-400 text-black":"bg-zinc-700 text-white"} font-bold py-3 rounded-2xl text-sm`}>MES FICHES</button>
        <button onClick={()=>setTab("rapport")} className={`${tab==="rapport"?"bg-yellow-400 text-black":"bg-zinc-700 text-white"} font-bold py-3 rounded-2xl text-sm`}>RAPPORT</button>
      </div>
      <div className="px-2 grid grid-cols-2 gap-2">
        <button onClick={()=>setTab("paramet")} className={`${tab==="paramet"?"bg-orange-400 text-black":"bg-orange-600 text-white"} font-bold py-2 rounded-2xl text-sm`}>PARAMÈT</button>
        <button onClick={()=>{localStorage.removeItem("cd_current_vendeur"); setAuth(false);}} className="bg-red-600 font-black py-2 rounded-2xl text-sm">X FÈMEN</button>
      </div>

      {tab==="vendre" && (
        <div className="bg-white mx-2 mt-3 rounded-2xl p-3 text-black">
          <div className="relative">
            <button onClick={()=>setShowT(!showT)} className="w-full border-2 border-black rounded-xl py-3 px-3 font-bold flex justify-between">
              <span>Tout tiraj yo nan yon sèl Kaz ({tiragesSel.length})</span><span>▼</span>
            </button>
            {showT && (
              <div className="absolute z-20 w-full bg-zinc-900 rounded-xl mt-1 p-2 max-h-72 overflow-auto">
                <div className="flex flex-wrap gap-1">
                  {TIRAGES.map(t=>{
                    const ferme=isFerme(t); const sel=tiragesSel.includes(t.id);
                    return <button key={t.id} disabled={ferme} onClick={()=>setTiragesSel(p=>p.includes(t.id)?p.filter(x=>x!==t.id):[...p,t.id])} className={`px-2 py-1 rounded-full text-xs font-bold ${ferme?'bg-zinc-700 text-zinc-500 line-through':sel?'bg-yellow-400 text-black':'bg-white text-black'}`}>{t.nom} {ferme?'🔒':''}</button>
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[80px_1fr_1fr] gap-2 mt-3">
            <select value={jeux} onChange={e=>setJeux(e.target.value)} className="h-12 bg-yellow-200 border-2 border-black rounded-xl font-black text-center">{["BO","MA","L3","L4","L5"].map(j=><option key={j}>{j}</option>)}</select>
            <input ref={bRef} value={boul} onChange={e=>setBoul(e.target.value.replace(/\D/g,''))} onKeyDown={e=>key(e,"mise")} placeholder="Boul" inputMode="numeric" className="h-12 border-2 border-black rounded-xl text-center font-bold text-xl outline-none"/>
            <input ref={mRef} value={mise} onChange={e=>setMise(e.target.value.replace(/\D/g,''))} onKeyDown={e=>key(e,"add")} placeholder="Mise" inputMode="numeric" className="h-12 border-2 border-black rounded-xl text-center font-bold text-xl outline-none"/>
          </div>

          <div className="bg-black text-green-400 rounded-xl mt-3 p-2 min-h-[70px] font-mono text-sm text-center">
            {lignes.length===0?"Pa gen liy":lignes.map((l,i)=><div key={i}>{l.jeux} {l.boul} - {l.mise}G</div>)}
          </div>

          <div className="bg-yellow-100 border-2 border-black rounded-xl mt-3 py-3 text-center font-black">Total: {lignes.reduce((s,l)=>s+l.mise,0)}G x {tiragesSel.length||1} tiraj = {total}G</div>

          <button onClick={imprimer} className="w-full bg-green-800 text-white font-black py-4 rounded-xl mt-3 text-lg">IMPRIMER</button>

          <div id="ticket" className="bg-white text-black w-[280px] mx-auto mt-4 p-4 font-mono text-sm border border-dashed border-black">
            <div className="text-center font-black text-lg">{entete}</div>
            <div className="text-center">Date {new Date().toLocaleString()}</div>
            <div className="text-center">Tirages {tiragesSel.length}/{TIRAGES.length}</div>
            <div className="text-center">Responsable {nom}</div>
            <div className="text-center mt-2 border-t border-black pt-2">{tiragesSel.map(id=>TIRAGES.find(t=>t.id===id)?.nom).join(", ")}</div>
            <div className="mt-2">{lignes.map((l,i)=><div key={i} className="text-center">{l.jeux} {l.boul} - {l.mise}G</div>)}</div>
            <div className="text-center font-black mt-2 border-t border-black pt-2">TOTAL {total}G</div>
            <div className="text-center mt-4">Bòn chans, lave chodyè w</div>
          </div>
        </div>
      )}

      {tab==="copier" && (
        <div className="bg-white mx-2 mt-3 rounded-2xl p-4 text-black">
          <h2 className="font-black text-center mb-3">COPIER FICH</h2>
          <input value={searchId} onChange={e=>setSearchId(e.target.value)} placeholder="Mete Id ticket a" className="w-full h-12 border-2 border-black rounded-xl text-center font-bold"/>
          <button onClick={()=>{
            const f=fiches.find((x:any)=>x.id===searchId); if(f){ setLignes(f.lignes); setTiragesSel(f.tirages); setTab("vendre"); } else alert("Ticket pa jwenn");
          }} className="w-full bg-yellow-400 text-black font-black py-3 rounded-xl mt-3">KOPIYE</button>
        </div>
      )}

      {tab==="fiches" && (
        <div className="bg-white mx-2 mt-3 rounded-2xl p-4 text-black">
          <h2 className="font-black text-center mb-3">MES FICHES</h2>
          <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} className="w-full h-12 border-2 border-black rounded-xl px-3 mb-3"/>
          <input placeholder="Recherche fiches" className="w-full h-12 border-2 border-black rounded-xl text-center mb-3" onChange={e=>setSearchId(e.target.value)}/>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {fiches.filter((f:any)=>!dateF || f.date.includes(dateF)).filter((f:any)=>!searchId || f.id.includes(searchId)).map((f:any)=><div key={f.id} className="border border-black rounded-xl p-2 text-sm"><div className="font-bold">{f.id} - {f.total}G - {new Date(f.date).toLocaleString()}</div><div>{f.tirages.map((id:string)=>TIRAGES.find(t=>t.id===id)?.nom).join(", ")}</div></div>)}
          </div>
        </div>
      )}

      {tab==="rapport" && (
        <div className="bg-white mx-2 mt-3 rounded-2xl p-4 text-black">
          <h2 className="font-black text-center mb-3">RAPPORT</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input type="date" value={du} onChange={e=>setDu(e.target.value)} className="h-12 border-2 border-black rounded-xl px-2"/>
            <input type="date" value={au} onChange={e=>setAu(e.target.value)} className="h-12 border-2 border-black rounded-xl px-2"/>
          </div>
          <select value={rapTiraj} onChange={e=>setRapTiraj(e.target.value)} className="w-full h-12 border-2 border-black rounded-xl px-3 mb-3">
            <option value="tous">Tous tiraj</option>{TIRAGES.map(t=><option key={t.id} value={t.id}>{t.nom}</option>)}
          </select>
          {(()=>{
            let flt=fiches; if(rapTiraj!=="tous") flt=flt.filter((f:any)=> f.tirages.includes(rapTiraj));
            const vente=flt.reduce((s:any,f:any)=> s+f.total,0); const comm=Math.round(vente*0.1); const gain=0; const bal=vente-comm-gain;
            return <div className="space-y-2">
              <div className="flex justify-between border-b py-1"><span>Vente</span><span className="font-bold">{vente}G</span></div>
              <div className="flex justify-between border-b py-1"><span>Commission</span><span className="font-bold">{comm}G</span></div>
              <div className="flex justify-between border-b py-1"><span>Gain (kliyan)</span><span className="font-bold">{gain}G</span></div>
              <div className="flex justify-between py-1 font-black"><span>Balance net</span><span>{bal}G</span></div>
              <button onClick={()=>window.print()} className="w-full bg-black text-white font-black py-3 rounded-xl mt-3">IMPRIMER RAPPORT</button>
            </div>
          })()}
        </div>
      )}

      {tab==="paramet" && (
        <div className="bg-white mx-2 mt-3 rounded-2xl p-4 text-black">
          <h2 className="font-black text-center mb-3">PARAMÈTRES</h2>
          <button onClick={()=>setPrinters(["V2 Pro - "+Date.now(),"Bluetooth","USB"])} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mb-3">Ajouter une imprimante - Rechèch tout</button>
          <div className="text-sm mb-3">{printers.map(p=><div key={p} className="border rounded px-2 py-1 mb-1">{p}</div>)}</div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold">Utilisation imprimante par defaut</span>
            <button onClick={()=>setImpDef(true)} className={`${impDef?'bg-green-600 text-white':'bg-zinc-200'} px-4 py-1 rounded-full font-bold`}>Oui</button>
            <button onClick={()=>setImpDef(false)} className={`${!impDef?'bg-red-600 text-white':'bg-zinc-200'} px-4 py-1 rounded-full font-bold`}>Non</button>
          </div>
          <input value={entete} onChange={e=>{setEntete(e.target.value); localStorage.setItem("cd_entete",e.target.value)}} className="w-full h-12 border-2 border-black rounded-xl px-3 mb-3 text-center font-bold"/>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(prix).map(k=><div key={k}><label className="text-xs font-bold">{k.toUpperCase()}</label><input type="number" value={(prix as any)[k]} onChange={e=>{ const np={...prix,[k]:parseInt(e.target.value)}; setPrix(np); localStorage.setItem("cd_prix",JSON.stringify(np)); }} className="w-full h-10 border border-black rounded-xl text-center"/></div>)}
          </div>
          <div className="mt-3"><label className="text-xs font-bold">LIMITE GLOBAL</label><input type="number" value={limiteG} onChange={e=>{setLimiteG(parseInt(e.target.value)); localStorage.setItem("cd_limite_global",e.target.value)}} className="w-full h-12 border-2 border-black rounded-xl text-center font-bold"/></div>
        </div>
      )}
    </div>
  );
}
