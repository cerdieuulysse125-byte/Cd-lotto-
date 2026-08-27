"use client";
import { useState, useEffect, useRef } from "react";

const TIRAGES = [
  { id: "ga-midi", nom: "GA midi", heure: "11:30" },
  { id: "fl-midi", nom: "FL midi", heure: "12:30" },
  { id: "ny-midi", nom: "NY midi", heure: "13:20" },
  { id: "real", nom: "Real", heure: "13:00" },
  { id: "ga-soir", nom: "GA soir", heure: "18:30" },
  { id: "fl-soir", nom: "FL soir", heure: "18:00" },
  { id: "ny-soir", nom: "NY soir", heure: "20:20" },
  { id: "primera-11h50", nom: "Primera dia 11h50", heure: "11:50" },
  { id: "suerte-12h20", nom: "Suerte dia 12h20", heure: "12:20" },
  { id: "lote-dom-1h45", nom: "Lote Dom 1h45", heure: "13:45" },
  { id: "ganamas-14h15", nom: "Ganamas 14h15", heure: "14:15" },
  { id: "suerte-noche-17h50", nom: "Suerte noche 17h50", heure: "17:50" },
  { id: "primera-noche-19h50", nom: "Primera noche 19h50", heure: "19:50" },
  { id: "loteka-19h45", nom: "Loteka 19h45", heure: "19:45" },
  { id: "nacional", nom: "Nacional noche", heure: "20:30" },
  { id: "leidsa", nom: "Leidsa", heure: "20:50" },
  { id: "anguila-10h", nom: "Anguila 10h", heure: "10:00" },
  { id: "anguila-18h", nom: "Anguilla 18h", heure: "18:00" },
];

export default function VendeurPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [vendeurNom, setVendeurNom] = useState("");
  const [error, setError] = useState("");
  const [tiragesChwazi, setTiragesChwazi] = useState<string[]>([]);
  const [jeux, setJeux] = useState("BO");
  const [boul, setBoul] = useState("");
  const [mise, setMise] = useState("");

  const boulRef = useRef<HTMLInputElement>(null);
  const miseRef = useRef<HTMLInputElement>(null);

  // VERIFIKASYON MODPAS VANDE - LI RESPEKTE MODPAS PROPRIO METE A
  const handleLogin = () => {
    const vendeurs = JSON.parse(localStorage.getItem("cd_vendeurs") || "[]");
    // Chèche vandè ak modpas la
    const found = vendeurs.find((v:any) => v.password === passwordInput || v.code === passwordInput);

    // Si pa gen lis vandè ankò, kreye yon default pou test
    if(vendeurs.length === 0 && passwordInput.length >= 3){
      // Premye fwa - aksepte nenpot modpas epi anrejistre l
      localStorage.setItem("cd_current_vendeur", JSON.stringify({nom: "Vendeur1", password: passwordInput}));
      setIsAuth(true);
      setVendeurNom("Vendeur1");
      return;
    }

    if(found){
      localStorage.setItem("cd_current_vendeur", JSON.stringify(found));
      setIsAuth(true);
      setVendeurNom(found.nom || found.code);
      setError("");
    } else {
      setError("❌ Modpas la pa bon! Mande Proprio a nouvo modpas la.");
    }
  };

  useEffect(() => {
    const current = localStorage.getItem("cd_current_vendeur");
    if(current){
      // Verifye si modpas la toujou bon (si proprio te chanje l)
      const vendeurs = JSON.parse(localStorage.getItem("cd_vendeurs") || "[]");
      const parsed = JSON.parse(current);
      const toujouValab = vendeurs.find((v:any) => v.password === parsed.password);
      if(vendeurs.length === 0 || toujouValab || vendeurs.length===0){
        setIsAuth(true);
        setVendeurNom(parsed.nom);
      } else {
        // Modpas chanje pa Proprio -> deconnecte vandè a
        localStorage.removeItem("cd_current_vendeur");
        setIsAuth(false);
        setError("🔒 Proprio a chanje modpas ou! Antre nouvo modpas la.");
      }
    }
  }, []);

  const isFerme = (heureFermeture: string) => {
    const now = new Date();
    const [h, m] = heureFermeture.split(":").map(Number);
    const fermeture = new Date();
    fermeture.setHours(h, m, 0);
    return now > fermeture;
  };

  const handleKeyDown = (e: React.KeyboardEvent, next: string) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (next === "mise") miseRef.current?.focus();
      if (next === "new" && boul && mise) {
        setBoul(""); setMise(""); boulRef.current?.focus();
      }
    }
  };

  // SI PA AUTH - MONTRE LOGIN AK MODPAS
  if(!isAuth){
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-sm border border-zinc-800">
          <h1 className="text-yellow-400 text-2xl font-black text-center mb-2">🔒 VANDEUR - C&D</h1>
          <p className="text-zinc-400 text-center text-sm mb-6">Antre modpas ou - Modpas dwe respekte</p>

          <input
            type="password"
            value={passwordInput}
            onChange={e=>setPasswordInput(e.target.value)}
            onKeyDown={e=> e.key === 'Enter' && handleLogin()}
            placeholder="Modpas Vandeur"
            className="w-full h-14 bg-black border-2 border-yellow-400 rounded-xl text-white text-center text-xl tracking-widest outline-none mb-3"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

          <button onClick={handleLogin} className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl text-lg">
            ANTRE
          </button>
          <p className="text-zinc-600 text-xs text-center mt-4">Si modpas pa mache, kontakte Proprio ou</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-yellow-400 text-2xl font-black">🟡 VENDEUR - {vendeurNom}</h1>
        <button onClick={()=>{localStorage.removeItem("cd_current_vendeur"); setIsAuth(false);}} className="text-xs bg-zinc-800 px-3 py-1 rounded-full">Dekonekte</button>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
        <h2 className="text-yellow-300 font-bold mb-3">Tout Tiraj yo - Yon sèl Kaz (Chwazi miltip)</h2>
        <div className="flex flex-wrap gap-2">
          {TIRAGES.map(t => {
            const ferme = isFerme(t.heure);
            const selected = tiragesChwazi.includes(t.id);
            return (
              <button key={t.id} disabled={ferme} onClick={()=>!ferme && setTiragesChwazi(p=> p.includes(t.id)? p.filter(x=>x!==t.id): [...p,t.id])}
                className={`px-3 py-2 rounded-full text-sm font-bold ${ferme? 'bg-zinc-800 text-zinc-500 line-through': selected? 'bg-yellow-400 text-black': 'bg-zinc-800 text-white'}`}>
                {t.nom} {ferme && "🔒"}
              </button>
            );
          })}
        </div>
        <p className="text-green-400 mt-3 text-sm">{tiragesChwazi.length} tiraj chwazi:</p>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-zinc-500 text-xs">Jeux</label>
            <select value={jeux} onChange={e=>setJeux(e.target.value)} className="w-full h-14 bg-black border-2 border-yellow-400 rounded-xl text-yellow-400 font-black text-center text-lg">
              <option>BO</option><option>MA</option><option>L3</option><option>L4</option><option>L5</option>
            </select>
          </div>
          <div>
            <label className="text-zinc-500 text-xs">Boul</label>
            <input ref={boulRef} value={boul} onChange={e=>setBoul(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKeyDown(e,"mise")} className="w-full h-14 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-bold text-center text-xl focus:border-yellow-400 outline-none"/>
          </div>
          <div>
            <label className="text-zinc-500 text-xs">Mise</label>
            <input ref={miseRef} value={mise} onChange={e=>setMise(e.target.value.replace(/\D/g,''))} onKeyDown={e=>handleKeyDown(e,"new")} className="w-full h-14 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-bold text-center text-xl focus:border-yellow-400 outline-none"/>
          </div>
        </div>
      </div>

      <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl text-xl">🖨️ IMPRIMER - Ticket Santre</button>

      <div className="bg-white text-black w-full max-w-[320px] mx-auto mt-4 p-4 rounded text-center font-mono text-sm">
        <div className="font-black text-center">CD-LOTTO</div>
        <div className="text-center">Vandè: {vendeurNom}</div>
        <div className="text-center">{new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}
