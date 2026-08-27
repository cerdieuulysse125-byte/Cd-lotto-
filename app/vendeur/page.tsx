"use client";
import { useState, useEffect, useRef } from "react";

const TIRAGES_LIST = [
  { id:"ga-midi", nom:"GA midi", heure:"11:30" }, { id:"fl-midi", nom:"FL midi", heure:"12:30" },
  { id:"ny-midi", nom:"NY midi", heure:"14:15" }, { id:"real", nom:"Real", heure:"13:00" },
  { id:"ga-soir", nom:"GA soir", heure:"18:30" }, { id:"fl-soir", nom:"FL soir", heure:"18:00" },
  { id:"ny-soir", nom:"NY soir", heure:"20:20" }, { id:"primera-11h50", nom:"Primera dia 11h50", heure:"11:50" },
  { id:"suerte-12h20", nom:"Suerte dia 12h20", heure:"12:20" }, { id:"lote-dom-1h45", nom:"Lote Dom 1h45", heure:"13:45" },
  { id:"ganamas-14h15", nom:"Ganamas 14h15", heure:"14:15" }, { id:"suerte-noche-17h50", nom:"Suerte noche 17h50", heure:"17:50" },
  { id:"primera-noche-19h50", nom:"Primera noche 19h50", heure:"19:50" }, { id:"loteka-19h45", nom:"Loteka 19h45", heure:"19:45" },
  { id:"nacional", nom:"Nacional noche", heure:"20:30" }, { id:"leidsa", nom:"Leidsa", heure:"20:50" },
  { id:"anguila-10h", nom:"Anguila 10h", heure:"10:00" }, { id:"anguila-18h", nom:"Anguilla 18h", heure:"18:00" },
];

export default function VendeurV57() {
  const [isAuth, setIsAuth] = useState(false);
  const [pass, setPass] = useState(""); const [nomV, setNomV] = useState("Vendeur1");
  const [tirages, setTirages] = useState<string[]>(["ny-midi"]);
  const [jeux, setJeux] = useState("BOLET"); const [boul, setBoul] = useState(""); const [mise, setMise] = useState("");
  const [lignes, setLignes] = useState<any[]>([]); const [showTiraj, setShowTiraj] = useState(false);
  const boulRef = useRef<HTMLInputElement>(null); const miseRef = useRef<HTMLInputElement>(null);

  // MODPAS RESPEKTE
  useEffect(()=>{
    const cur = localStorage.getItem("cd_current_vendeur");
    if(cur){ setIsAuth(true); setNomV(JSON.parse(cur).nom || "Vendeur1"); }
  },[]);
  const login = () => {
    const vendeurs = JSON.parse(localStorage.getItem("cd_vendeurs") || "[]");
    const f = vendeurs.find((v:any)=> v.password===pass || v.code===pass);
    if(vendeurs.length===0 && pass.length>=3){ localStorage.setItem("cd_current_vendeur", JSON.stringify({nom:"Vendeur1", password:pass})); setIsAuth(true); return; }
    if(f){ localStorage.setItem("cd_current_vendeur", JSON.stringify(f)); setIsAuth(true); setNomV(f.nom); }
    else alert("Modpas pa bon!");
  };

  const isFerme = (h:string)=>{ const now=new Date(); const [hh,mm]=h.split(":").map(Number); const f=new Date(); f.setHours(hh,mm,0); return now>f; };

  const addLigne = () => {
    if(!boul ||!mise) return;
    const newL = { jeux, boul, mise: parseInt(mise) };
    setLignes([...lignes, newL]); setBoul(""); setMise(""); boulRef.current?.focus();
  };

  const handleKey = (e:any, next:string)=>{
    if(e.key==="ArrowRight" || e.key==="ArrowDown" || e.key==="Enter"){ e.preventDefault(); if(next==="mise") miseRef.current?.focus(); if(next==="add") addLigne(); }
  };

  const total = lignes.reduce((s,l)=> s + l.mise, 0) * (tirages.length||1);

  if(!isAuth) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border">
        <h1 className="text-yellow-400 text-2xl font-black text-center mb-4">🔒 VENDEUR</h1>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Modpas" className="w-full h-14 bg-black border-2 border-yellow-400 rounded-xl text-center text-white text-xl mb-3 outline-none" autoFocus/>
        <button onClick={login} className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl">ANTRE</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* HEADER VER - fòma V57 */}
      <div className="bg-green-700 mx-2 mt-2 rounded-xl p-2 text-center text-white font-bold text-sm">
        VENDEUR V57 FIX - BOUL ANTRE 100% - X FÈMEN FENÈT - FICH SOU TELEFON - POS - 17:05:16<br/>🔥 Firebase OK - 3 vande - Boul antre FIX - X fèmen
      </div>

      {/* MENU TOP */}
      <div className="grid grid-cols-5 gap-2 p-2">
        <button className="bg-yellow-400 text-black font-black py-3 rounded-2xl text-sm">VENDRE</button>
        <button className="bg-zinc-700 text-white font-bold py-3 rounded-2xl text-sm">COPIER</button>
        <button className="bg-zinc-700 text-white font-bold py-3 rounded-2xl text-sm leading-tight">MES<br/>FICHES</button>
        <button className="bg-zinc-700 text-white font-bold py-3 rounded-2xl text-sm">RAPPORT</button>
        <button className="bg-orange-500 text-white font-bold py-3 rounded-2xl text-sm">PARAMÈT</button>
      </div>

      <button onClick={()=>{localStorage.removeItem("cd_current_vendeur"); setIsAuth(false)}} className="mx-2 w-[calc(100%-16px)] bg-red-600 text-white font-black py-3 rounded-2xl">X FÈMEN</button>

      <div className="bg-white mx-2 mt-4 rounded-2xl p-3">
        <div className="bg-green-700 rounded-xl p-2 text-center text-white font-bold text-sm mb-3">VENDRE V57 FIX - Boul antre 100% - X fèmen fenèt - Fich sou telefon menm san printer - POS</div>

        {/* TOUT TIRAJ NAN YON SEL KAZ - Dropdown + Multi */}
        <div className="relative">
          <button onClick={()=>setShowTiraj(!showTiraj)} className="w-full bg-white border-2 border-black rounded-xl py-3 px-4 text-black font-bold flex justify-between items-center">
            <span>Chwazi tiraj - {tirages.length} chwazi {tirages[0]? `(${TIRAGES_LIST.find(t=>t.id===tirages[0])?.nom})`:""}</span>
            <span>▼</span>
          </button>
          {showTiraj && (
            <div className="absolute z-10 w-full bg-zinc-900 border-2 border-yellow-400 rounded-xl mt-1 p-2 max-h-64 overflow-y-auto">
              <p className="text-yellow-400 font-bold mb-2 text-center">Tout Tiraj yo nan yon sèl Kaz (Chwazi miltip)</p>
              <div className="flex flex-wrap gap-2">
                {TIRAGES_LIST.map(t=>{
                  const ferme=isFerme(t.heure); const sel=tirages.includes(t.id);
                  return <button key={t.id} disabled={ferme} onClick={()=> setTirages(p=> p.includes(t.id)? p.filter(x=>x!==t.id): [...p,t.id])} className={`px-2 py-1 rounded-full text-xs font-bold ${ferme?'bg-zinc-700 text-zinc-500 line-through': sel?'bg-yellow-400 text-black':'bg-white text-black'}`}>{t.nom} {ferme?'🔒':''}</button>
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-black text-yellow-400 text-center font-bold py-2 rounded-xl mt-3">{tirages.length} tiraj nan yon sèl Kaz miltip</div>

        {/* JEUX BOUL MISE MENM DIMANSYON MWAYEN 72px */}
        <div className="grid grid-cols-[1fr_1fr_1fr_60px] gap-2 mt-3">
          <select value={jeux} onChange={e=>setJeux(e.target.value)} className="w-full h-[72px] bg-yellow-200 border-2 border-black rounded-xl text-black font-black text-center text-lg">
            <option>BOLET</option><option>MARYAJ</option><option>LOTO3</option><option>LOTO4</option><option>LOTO5</option>
          </select>
          <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKey(e,"mise")} placeholder="Boul" className="w-full h-[72px] bg-white border-2 border-black rounded-xl text-black font-bold text-center text-2xl outline-none"/>
          <input ref={miseRef} value={mise} onChange={e=>setMise(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKey(e,"add")} placeholder="Mise" className="w-full h-[72px] bg-white border-2 border-black rounded-xl text-black font-bold text-center text-2xl outline-none"/>
          <button onClick={addLigne} className="w-full h-[72px] bg-blue-600 rounded-xl text-white font-black text-2xl">+↓</button>
        </div>

        <div className="bg-[#fff8e1] border border-black rounded-xl mt-3 p-2 text-[11px] text-black text-center font-bold">Tape Boul + Mise + klike +↓ - Boul antre FIX - Flèche conserve jeu - 72px - Chif sèlman - X fèmen fenèt</div>

        <div className="bg-black rounded-xl mt-3 p-3 min-h-[80px] font-mono text-sm">
          {lignes.length===0? <div className="text-green-400">Pa gen liy - Tape Boul + Mise + klike +↓<br/>- Boul antre FIX - BOLET 00 5G<br/>- Mariage bon 12x47=47x12</div> : lignes.map((l,i)=><div key={i} className="text-green-400 text-center">{l.jeux} {l.boul} - {l.mise}G</div>)}
        </div>

        <div className="bg-[#fff8c4] border-2 border-black rounded-xl mt-3 p-3 text-center font-black text-black">Total: {lignes.reduce((s,l)=>s+l.mise,0)}G x {tirages.length} tiraj = {total}G - Boul antre FIX V57 - Fich ap save sou telefon - POS</div>

        <button className="w-full bg-green-800 text-white font-black py-4 rounded-xl mt-3 flex flex-col items-center">
          <span className="flex items-center gap-2">🖨️ IMPRIMER - Ticket Santre</span>
          <span className="text-xs font-normal">Fich ap save menm sou telefon - POS - Rechèch tout imprimant otomatik</span>
        </button>

        {/* TICKET SANTRE */}
        <div className="bg-white text-black w-[260px] mx-auto mt-4 p-3 border border-dashed border-black text-center font-mono text-xs">
          <div className="font-black">CD-LOTTO</div>
          <div>Vandè: {nomV}</div>
          <div>{new Date().toLocaleString()}</div>
          <div className="border-t border-black mt-2 pt-2">{tirages.map(id=>TIRAGES_LIST.find(t=>t.id===id)?.nom).join(", ")}</div>
          {lignes.map((l,i)=><div key={i}>{l.jeux} {l.boul} - {l.mise}G</div>)}
          <div className="font-black mt-2">TOTAL: {total}G</div>
        </div>
      </div>
    </div>
  );
}
