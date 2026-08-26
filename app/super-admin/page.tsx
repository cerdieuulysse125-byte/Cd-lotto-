'use client'
import { useState } from 'react'

export default function SuperAdmin() {
  const [tab, setTab] = useState('comptes')
  const [proprios, setProprios] = useState([
    {id:1, nom:'Proprio Petion-Ville', tel:'+509 1234', statut:'Aktif', vendeur:12},
    {id:2, nom:'Proprio Delmas 33', tel:'+509 5678', statut:'Aktif', vendeur:8},
    {id:3, nom:'Proprio Mirebalais', tel:'+509 9012', statut:'Bloke', vendeur:5},
  ])
  const [msg, setMsg] = useState('')
  const [resultats, setResultats] = useState<any[]>([])
  const [form, setForm] = useState({tiraj:'', p1:'', p2:'', p3:'', m1:'', m2:'', m3:'', l3:'', l4:'', l5:''})

  const [limites, setLimites] = useState({borlette:15000, mariage:100, loto3:100, loto4:20, loto5:5})
  const [heures, setHeures] = useState([
    {nom:'GA midi', h:'12h15'}, {nom:'FL midi', h:'13h15'}, {nom:'NY midi', h:'14h15'},
    {nom:'GA soir', h:'18h15'}, {nom:'FL soir', h:'21h15'}, {nom:'NY soir', h:'22h15'},
    {nom:'Real', h:'12h45'}, {nom:'Primera dia', h:'11h50'}, {nom:'Suerte dia', h:'12h20'},
    {nom:'Lote Dom', h:'1h45'}, {nom:'Ganamas', h:'14h15'}, {nom:'Suerte noche', h:'17h50'},
    {nom:'Primera noche', h:'19h50'}, {nom:'Loteka', h:'19h45'}, {nom:'Nacional noche', h:'20h50 (Lun-Sam) / 17h50 Dim'},
    {nom:'Leidsa', h:'20h45 (Lun-Sam) / 15h45 Dim'}, {nom:'Anguila 10h', h:'09h55'}, {nom:'Anguilla 18h', h:'17h55'},
  ])
  const [prix, setPrix] = useState({lot1:50, lot2:20, lot3:10, m1:1000, m2:1000, m3:1000, l3:500, l4:5000, l5:25000})

  const toggleBloke = (id:number) => {
    setProprios(proprios.map(p=> p.id===id? {...p, statut: p.statut==='Aktif'?'Bloke':'Aktif'} : p))
  }

  const saveResult = () => {
    if(!form.tiraj ||!form.p1) return alert('Mete Tiraj ak 1er lot!')
    setResultats([...resultats, {...form, date:new Date().toLocaleDateString()}])
    setForm({tiraj:'', p1:'', p2:'', p3:'', m1:'', m2:'', m3:'', l3:'', l4:'', l5:''})
  }

  return (
    <div style={{background:'#000', minHeight:'100vh', color:'white', padding:10, fontFamily:'sans-serif'}}>
      <h1 style={{color:'red', textAlign:'center', fontSize:24, fontWeight:'900'}}>🔴 SUPER-ADMIN - C&D</h1>

      <div style={{display:'flex', gap:5, overflowX:'auto', marginTop:15, paddingBottom:10}}>
        {[
          {id:'comptes', label:'Kont'},
          {id:'resultats', label:'Rezilta'},
          {id:'limites', label:'Limit'},
          {id:'heures', label:'Lè Fèmen'},
          {id:'prix', label:'Pri Peye'},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background: tab===t.id? 'red':'#222', color:'white', padding:'10px 15px', borderRadius:20, border:'none', whiteSpace:'nowrap', fontWeight:'bold'}}>{t.label}</button>
        ))}
      </div>

      {/* COMPTES */}
      {tab==='comptes' && (
        <div>
          <div style={{background:'#222', padding:12, borderRadius:10, marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>📩 Voye Mesaj Avètisman</h3>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Ekri mesaj pou avèti proprio yo avan ou bloke kont yo..." style={{width:'100%', height:70, background:'#333', color:'white', borderRadius:8, padding:8, marginTop:8}}/>
            <button onClick={()=>{alert('Mesaj voye bay tout proprio: '+msg); setMsg('')}} style={{background:'#FFD700', color:'black', width:'100%', padding:10, borderRadius:8, marginTop:8, fontWeight:'bold'}}>VOYE MESAJ</button>
          </div>
          {proprios.map(p=>(
            <div key={p.id} style={{background:'#111', border:'1px solid #333', padding:12, borderRadius:10, marginTop:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><b>{p.nom}</b><br/><small>{p.tel} | {p.vendeur} vendeur | <span style={{color: p.statut==='Aktif'?'#0f0':'red'}}>{p.statut}</span></small></div>
              <button onClick={()=>toggleBloke(p.id)} style={{background: p.statut==='Aktif'?'red':'green', color:'white', padding:'8px 12px', borderRadius:8, border:'none', fontWeight:'bold'}}>{p.statut==='Aktif'?'BLOKE':'DEBLOKE'}</button>
            </div>
          ))}
        </div>
      )}

      {/* RESULTATS */}
      {tab==='resultats' && (
        <div>
          <div style={{background:'#222', padding:12, borderRadius:10, marginTop:10}}>
            <input value={form.tiraj} onChange={e=>setForm({...form, tiraj:e.target.value})} placeholder="TIRAJ (ex: NY midi)" style={{width:'100%', padding:12, background:'#000', color:'#FFD700', border:'2px solid #FFD700', borderRadius:8, fontWeight:'bold', marginBottom:10}}/>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8}}>
              {[
                {k:'p1', l:'1er 🈁'}, {k:'p2', l:'2e 🈁'}, {k:'p3', l:'3e 🈁'}, {k:'m1', l:'M1 🈁'},
                {k:'m2', l:'M2 🈁'}, {k:'m3', l:'M3 🈁'}, {k:'l3', l:'L3 🈁'}, {k:'l4', l:'L4 🈁'}, {k:'l5', l:'L5 🈁'},
              ].map(f=>(
                <div key={f.k}><label style={{fontSize:11, color:'#aaa'}}>{f.l}</label><input value={(form as any)[f.k]} onChange={e=>setForm({...form, [f.k]:e.target.value})} placeholder="00" style={{width:'100%', padding:10, background:'#333', color:'white', borderRadius:6, textAlign:'center', fontWeight:'bold', fontSize:18}}/></div>
              ))}
            </div>
            <button onClick={saveResult} style={{background:'#0f0', color:'black', width:'100%', padding:12, borderRadius:8, marginTop:12, fontWeight:'900'}}>ANREJISTRE REZILTA</button>
          </div>

          <div style={{background:'#111', padding:10, borderRadius:10, marginTop:15, overflowX:'auto'}}>
            <h3 style={{color:'#FFD700'}}>Tablo Rezilta yo</h3>
            <table style={{width:'100%', fontSize:11, borderCollapse:'collapse', marginTop:8}}>
              <thead><tr style={{background:'#333'}}><th>Tir</th><th>1e</th><th>2e</th><th>3e</th><th>M1</th><th>M2</th><th>M3</th><th>L3</th><th>L4</th><th>L5</th></tr></thead>
              <tbody>{resultats.map((r,i)=><tr key={i} style={{borderBottom:'1px solid #222', textAlign:'center'}}><td style={{color:'#FFD700', fontWeight:'bold'}}>{r.tiraj}</td><td>{r.p1}</td><td>{r.p2}</td><td>{r.p3}</td><td>{r.m1}</td><td>{r.m2}</td><td>{r.m3}</td><td>{r.l3}</td><td>{r.l4}</td><td>{r.l5}</td></tr>)}</tbody>
            </table>
            {resultats.length===0 && <p style={{textAlign:'center', color:'#666', marginTop:10}}>Poko gen rezilta</p>}
          </div>
        </div>
      )}

      {/* LIMITES */}
      {tab==='limites' && (
        <div style={{background:'#222', padding:12, borderRadius:10, marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Limit Mize Par Proprio/Vendeur (Modifiable)</h3>
          {Object.entries(limites).map(([k,v])=>(
            <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#333', padding:10, borderRadius:8, marginTop:8}}>
              <span style={{textTransform:'uppercase'}}>{k}</span><input type="number" value={v as any} onChange={e=>setLimites({...limites, [k]:parseInt(e.target.value)||0})} style={{width:100, padding:6, background:'black', color:'#0f0', textAlign:'center', borderRadius:5}}/>
            </div>
          ))}
          <button onClick={()=>alert('Limit yo sove!')} style={{background:'#007BFF', width:'100%', padding:10, borderRadius:8, marginTop:10, fontWeight:'bold', border:'none', color:'white'}}>SOVE LIMIT YO</button>
        </div>
      )}

      {/* HEURES */}
      {tab==='heures' && (
        <div style={{background:'#222', padding:12, borderRadius:10, marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Lè Fèmti Modifiable</h3>
          {heures.map((h,i)=>(
            <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#333', padding:8, borderRadius:8, marginTop:6}}>
              <span style={{fontSize:13}}>{h.nom}</span><input value={h.h} onChange={e=>{const n=[...heures]; n[i].h=e.target.value; setHeures(n)}} style={{width:140, padding:5, background:'black', color:'white', textAlign:'center', borderRadius:5, fontSize:12}}/>
            </div>
          ))}
          <button onClick={()=>alert('Lè yo sove!')} style={{background:'#FFD700', color:'black', width:'100%', padding:10, borderRadius:8, marginTop:10, fontWeight:'bold', border:'none'}}>SOVE LÈ YO</button>
        </div>
      )}

      {/* PRIX */}
      {tab==='prix' && (
        <div style={{background:'#222', padding:12, borderRadius:10, marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Pri Pèman Par Proprio/Vendeur (Modifiable) - Vendeurs: Tous</h3>
          {Object.entries(prix).map(([k,v])=>(
            <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#333', padding:10, borderRadius:8, marginTop:8}}>
              <span style={{textTransform:'uppercase', fontSize:13}}>{k==='lot1'?'1er Lot 50': k==='lot2'?'2e Lot 20': k==='lot3'?'3e Lot 10': k==='m1'?'Maryaj1 1000': k==='m2'?'Maryaj2 1000': k==='m3'?'Maryaj3 1000': k==='l3'?'Loto3 500': k==='l4'?'Loto4 5000':'Loto5 25000'}</span>
              <div style={{display:'flex', gap:5}}><input type="number" value={v as any} onChange={e=>setPrix({...prix, [k]:parseInt(e.target.value)||0})} style={{width:80, padding:6, background:'black', color:'#0f0', textAlign:'center', borderRadius:5}}/></div>
            </div>
          ))}
          <button onClick={()=>alert('Pri yo sove!')} style={{background:'#0f0', color:'black', width:'100%', padding:10, borderRadius:8, marginTop:10, fontWeight:'bold', border:'none'}}>SOVE PRI YO</button>
        </div>
      )}
      <a href="/" style={{display:'block', textAlign:'center', marginTop:20, color:'#888'}}>← Akèy</a>
    </div>
  )
}