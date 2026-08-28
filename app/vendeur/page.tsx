"use client"; import{useState,useEffect,useRef}from"react";
const TIRAGES=[
 {n:"GA midi",h:"11:00"}, {n:"FL midi",h:"12:30"}, {n:"NY midi",h:"13:25"}, {n:"Real",h:"12:45"},
 {n:"GA soir",h:"18:30"}, {n:"FL soir",h:"19:30"}, {n:"NY soir",h:"22:30"}, {n:"Real 12h45",h:"12:45"},
 {n:"Primera día",h:"11:50"}, {n:"Suerte día",h:"12:20"}, {n:"Lote Dom",h:"13:45"}, {n:"Ganamas",h:"14:15"},
 {n:"Suerte noche",h:"17:50"}, {n:"Primera noche",h:"19:50"}, {n:"Loteka",h:"19:45"},
 {n:"Nacional noche",h:"20:50 Lun-Sam, Dim 17:50"}, {n:"Leidsa",h:"20:45 Lun-Sam, Dim 15:45"},
 {n:"Anguila 10h",h:"10:00"}, {n:"Anguilla 9h55",h:"09:55"}, {n:"Anguila 18h",h:"18:00"}, {n:"Anguilla 17h55",h:"17:55"},
];
const JEUX=["Bolet","Maryaj Lòd","Maryaj Dezòd","Loto 3","Loto 4","Loto 5"];
const LIMIT_GLOBAL=5000;

export default function Vendeur(){
 const[tab,setTab]=useState("VENDRE");const[sel,setSel]=useState<string[]>([]);const[jeu,setJeu]=useState("Bolet");
 const[boul,setBoul]=useState("");const[miz,setMiz]=useState("");const[lignes,setLignes]=useState<any[]>([]);
 const[fiches,setFiches]=useState<any[]>([]);const[searchId,setSearchId]=useState("");const[dateF,setDateF]=useState("");
 const[du,setDu]=useState(new Date().toISOString().slice(0,10));const[au,setAu]=useState(new Date().toISOString().slice(0,10));
 const[filtreTiraj,setFiltreTiraj]=useState("Tous");const[printer,setPrinter]=useState("Defaut");
 const boulRef=useRef<HTMLInputElement>(null);const mizRef=useRef<HTMLInputElement>(null);

 useEffect(()=>{const s=localStorage.getItem("FICHES_V");if(s)setFiches(JSON.parse(s))},[]);
 useEffect(()=>{localStorage.setItem("FICHES_V",JSON.stringify(fiches))},[fiches]);

 const totalGlobal=fiches.reduce((a,c)=>a+c.miz*c.tirages.length,0)+lignes.reduce((a,c)=>a+c.miz,0)*sel.length;

 const addLigne=()=>{
  if(!boul||!miz||!sel.length)return alert("Chwazi tiraj + boul + miz");
  if(!/^\d+$/.test(boul)||!/^\d+$/.test(miz))return alert("Chif sèlman!");
  if(totalGlobal> LIMIT_GLOBAL)return alert("LIMIT GLOBAL DEPASE! Limit: "+LIMIT_GLOBAL+" HTG - Total: "+totalGlobal);
  let b=boul;
  if(jeu.includes("Maryaj")){if(b.includes("x")){let p=b.split("x");if(p.length===2){let a=p[0].trim(),cc=p[1].trim();if(jeu==="Maryaj Dezòd"&&a>cc)b=cc+"x"+a;}}else if(b.length===4){b=b.slice(0,2)+"x"+b.slice(2)}}
  const l={jeu,boul:b,miz:parseInt(miz)};
  setLignes([...lignes,l]);setBoul("");setMiz("");setTimeout(()=>boulRef.current?.focus(),100);
 };

 const validerFiche=()=>{
  if(!lignes.length)return alert("Ajoute liy");const fiche={id:"CD"+Date.now().toString().slice(-7),date:new Date().toLocaleDateString(),heure:new Date().toLocaleTimeString(),tirages:sel,lignes,total:lignes.reduce((a,c)=>a+c.miz,0)*sel.length,tirageCount:sel.length};
  setFiches([fiche,...fiches]);setLignes([]);setSel([]);alert("Fich "+fiche.id+" valide! Total "+fiche.total+" HTG");
 };

 const handleKey=(e:any,nextRef:any)=>{if(e.key==="ArrowRight"||e.key==="ArrowDown"||e.key==="Enter"){e.preventDefault();if(nextRef?.current)nextRef.current.focus();else addLigne()}};

 const fichesFiltre=dateF?fiches.filter(f=>f.date.includes(dateF)||f.id.includes(dateF)):fiches;
 const rapportFiltre=fiches.filter(f=>{const dOk=true;const tOk=filtreTiraj==="Tous"||f.tirages.includes(filtreTiraj);return tOk});
 const vente=rapportFiltre.reduce((a,c)=>a+c.total,0);const comm=vente*0.2;const gain=0;const balance=vente-comm-gain;

 const printFiche=(f:any)=>{
  const html=`<div style="width:58mm;font-family:monospace;text-align:center;font-size:16px;font-weight:900"><b style="font-size:18px">C&D VERITE LOTTO</b><br/>${f.date} ${f.heure}<br/>Ticket: ${f.id}<br/>${f.tirages.join(",")}<hr/>${f.lignes.map((l:any)=>`<div>${l.jeu} ${l.boul} - ${l.miz}HTG</div>`).join("")}<hr/><b style="font-size:20px">TOTAL ${f.total} HTG x ${f.tirageCount}</b><br/><br/>BON CHANS!<br/>---</div>`;
  const w=window.open("","","width=300");w?.document.write(html);w?.document.close();w?.print();
 };

 return(<div style={{maxWidth:480,margin:"0 auto",padding:8,fontWeight:900}}>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>{["VENDRE","COPIER","FICHES","RAPPORT"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:10,border:"2px solid #000",borderRadius:10,background:tab===t?"#4fb3ff":"#eee",fontSize:11}}>{t}</button>)}</div>
  <button onClick={()=>setTab("PARAM")} style={{width:"100%",marginTop:5,padding:8,border:"2px solid #000",borderRadius:10,background:tab==="PARAM"?"#4fb3ff":"#eee",fontSize:11}}>PARAMÈTRES</button>

  {tab==="VENDRE"&&<div style={{marginTop:10}}>
   <div style={{border:"2px solid #000",padding:6,borderRadius:8}}><b style={{fontSize:11}}>CHWAZI TIRAJ - Yon sèl Kaz - Miltip</b><div style={{display:"flex",flexWrap:"wrap",marginTop:4}}>{TIRAGES.map(t=><label key={t.n} style={{border:sel.includes(t.n)?"2px solid #0044ff":"1px solid #000",margin:2,padding:"4px 5px",borderRadius:6,fontSize:10,background:sel.includes(t.n)?"#d0eaff":"#fff"}}><input type="checkbox" checked={sel.includes(t.n)} onChange={()=>setSel(sel.includes(t.n)?sel.filter(x=>x!==t.n):[...sel,t.n])} style={{marginRight:3}}/>{t.n} <span style={{fontSize:8,color:"#555"}}>{t.h}</span></label>)}</div></div>
   <div style={{display:"flex",gap:4,marginTop:8,alignItems:"center"}}><select value={jeu} onChange={e=>setJeu(e.target.value)} style={{padding:10,border:"2px solid #000",borderRadius:8,fontSize:12,width:110}}>{JEUX.map(j=><option key={j}>{j}</option>)}</select><input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value.replace(/\D/g,""))} onKeyDown={e=>handleKey(e,mizRef)} placeholder="Boul" inputMode="numeric" style={{flex:1,padding:10,border:"2px solid #000",borderRadius:8,fontSize:14}}/><input ref={mizRef} value={miz} onChange={e=>setMiz(e.target.value.replace(/\D/g,""))} onKeyDown={e=>handleKey(e,null)} placeholder="Miz" inputMode="numeric" style={{width:70,padding:10,border:"2px solid #000",borderRadius:8}}/><button onClick={addLigne} style={{padding:10,background:"#0a0",color:"#fff",borderRadius:8}}>OK</button></div>
   <div style={{fontSize:10,marginTop:4}}>Flèch ➡️⬇️ pou avanse - konsève jwèt la - Chif sèlman</div>
   <div style={{border:"2px solid #000",minHeight:90,marginTop:6,padding:5,borderRadius:8}}>{lignes.map((l,i)=><div key={i} style={{fontSize:12,display:"flex",justifyContent:"space-between",borderBottom:"1px solid #ccc"}}><span>{l.jeu} {l.boul}</span><span>{l.miz}HTG</span><button onClick={()=>setLignes(lignes.filter((_,ix)=>ix!==i))} style={{color:"red"}}>X</button></div>)}{lignes.length===0&&<div style={{fontSize:11,color:"#777"}}>Pa gen liy - ajoute liy anwo</div>}</div>
   <div style={{background:"#000",color:"#fff",padding:10,marginTop:6,textAlign:"center",borderRadius:8}}>TOTAL {lignes.reduce((a,c)=>a+c.miz,0)} x {sel.length||1} = {lignes.reduce((a,c)=>a+c.miz,0)* (sel.length||1)} HTG | GLOBAL {totalGlobal}/{LIMIT_GLOBAL}</div>
   <button onClick={validerFiche} disabled={!lignes.length} style={{width:"100%",padding:14,background:lignes.length?"#000":"#999",color:"#fff",borderRadius:10,marginTop:6,fontSize:16}}>VALIDER & IMPRIMER (Santre Gwo Lèt)</button>
   <div style={{marginTop:8}}>{fiches.slice(0,1).map(f=><button key={f.id} onClick={()=>printFiche(f)} style={{width:"100%",padding:10,border:"2px solid #000"}}>Re-Imprimer dènye fich {f.id} - {f.total}HTG</button>)}</div>
  </div>}

  {tab==="COPIER"&&<div style={{marginTop:15,border:"2px solid #000",padding:12,borderRadius:8}}><b>COPIER FICH</b><p style={{fontSize:11}}>Mete ID ticket pou kopye</p><input value={searchId} onChange={e=>setSearchId(e.target.value)} placeholder="CD1234567" style={{width:"100%",padding:12,border:"2px solid #000",marginTop:8}}/><button onClick={()=>{const f=fiches.find(x=>x.id===searchId);if(!f)return alert("Pa jwenn");setLignes(f.lignes);setSel(f.tirages);setTab("VENDRE")}} style={{width:"100%",padding:12,background:"#000",color:"#fff",marginTop:8}}>KOPIYE FICH SA</button>{fiches.filter(f=>f.id.includes(searchId)).slice(0,5).map(f=><div key={f.id} style={{border:"1px solid #000",padding:5,marginTop:5,fontSize:11}}>{f.id} - {f.total}HTG - {f.tirages.join(",")} <button onClick={()=>{setLignes(f.lignes);setSel(f.tirages);setTab("VENDRE")}}>Kopye</button></div>)}</div>}

  {tab==="FICHES"&&<div style={{marginTop:12}}><div style={{display:"flex",gap:5}}><input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} style={{flex:1,padding:10,border:"2px solid #000"}}/><input value={dateF} onChange={e=>setDateF(e.target.value)} placeholder="Recherche ID" style={{flex:1,padding:10,border:"2px solid #000"}}/></div><div style={{border:"2px solid #000",marginTop:8,padding:6,maxHeight:400,overflow:"auto"}}>{fichesFiltre.map(f=><div key={f.id} style={{borderBottom:"1px solid #000",padding:6,fontSize:11}}><b>{f.id}</b> {f.date} {f.heure}<br/>{f.tirages.join(",")} - {f.total}HTG<br/>{f.lignes.map((l:any,i:number)=><span key={i}>{l.boul}({l.miz}) </span>)}<br/><button onClick={()=>printFiche(f)} style={{padding:3,background:"#000",color:"#fff",marginTop:3}}>Imprimer</button></div>)}</div></div>}

  {tab==="RAPPORT"&&<div style={{marginTop:12,border:"2px solid #000",padding:10,borderRadius:8}}><div style={{display:"flex",gap:5}}><div><span style={{fontSize:10}}>Du</span><input type="date" value={du} onChange={e=>setDu(e.target.value)} style={{width:"100%",padding:8,border:"2px solid #000"}}/></div><div><span style={{fontSize:10}}>Au</span><input type="date" value={au} onChange={e=>setAu(e.target.value)} style={{width:"100%",padding:8,border:"2px solid #000"}}/></div></div><select value={filtreTiraj} onChange={e=>setFiltreTiraj(e.target.value)} style={{width:"100%",padding:8,border:"2px solid #000",marginTop:6}}><option>Tous</option>{TIRAGES.map(t=><option key={t.n}>{t.n}</option>)}</select><div style={{marginTop:10,lineHeight:1.8,fontSize:14}}><div>Vente: <b>{vente} HTG</b></div><div>Commission 20%: <b>{comm} HTG</b></div><div>Gain Kliyan: <b>{gain} HTG</b></div><div style={{background:"#000",color:"#fff",padding:8}}>Balance Net: <b>{balance} HTG</b></div><div style={{fontSize:10,marginTop:5}}>Si fich gen plizyè tiraj, chak tiraj kalkile separeman selon rezilta</div></div><button onClick={()=>window.print()} style={{width:"100%",padding:12,background:"#000",color:"#fff",marginTop:8}}>IMPRIMER RAPPORT - Gwo Lèt Santre</button></div>}

  {tab==="PARAM"&&<div style={{marginTop:12,border:"2px solid #000",padding:10,borderRadius:8}}><b>PARAMÈTRES</b><div style={{marginTop:10}}><button onClick={()=>alert("Recherche imprimantes... "+(navigator as any).printing?" OK":" Non disponible - itilize RawBT")} style={{width:"100%",padding:10,border:"2px solid #000"}}>Ajouter une imprimante (Recherche)</button><div style={{marginTop:10}}><div>Utilisation imprimante par défaut</div><div style={{display:"flex",gap:10,marginTop:5}}><label><input type="radio" checked={printer==="Defaut"} onChange={()=>setPrinter("Defaut")}/> Oui</label><label><input type="radio" checked={printer!=="Defaut"} onChange={()=>setPrinter("Autre")}/> Non (Chwazi)</label></div><select style={{width:"100%",padding:8,border:"1px solid #000",marginTop:5}}><option>RawBT 58mm - Défaut</option><option>Bluetooth Printer</option><option>USB Printer</option></select></div><div style={{marginTop:10,padding:8,background:"#eee",fontSize:11}}>Limit Global: {LIMIT_GLOBAL} HTG = vendeur1+vendeur2+...<br/>Maryaj Dezòd: 12x47=47x12 OK<br/>Impression: Santre Gwo Lèt 58mm</div></div></div>}
 </div>)
}
