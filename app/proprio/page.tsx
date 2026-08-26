'use client'
import { useState } from 'react'

export default function Proprio(){
  const [tab,setTab]=useState('vendeurs')
  const [vendeurs,setVendeurs]=useState([
    {id:1,nom:'Jean PV',pass:'1234',pct:15,ouvert:true},
    {id:2,nom:'Marie Delmas',pass:'5678',pct:12,ouvert:true},
  ])
  const [newV,setNewV]=useState({nom:'',pass:'',pct:10})
  const [limites,setLimites]=useState({borlette:15000,mariage:100,loto3:100,loto4:20,loto5:5})
  const [heures,setHeures]=useState([
    {nom:'GA midi',h:'12h15'},{nom:'FL midi',h:'13h15'},{nom:'NY midi',h:'14h15'},
    {nom:'GA soir',h:'18h15'},{nom:'FL soir',h:'21h15'},{nom:'NY soir',h:'22h15'},
    {nom:'Real',h:'12h45'},{nom:'Primera dia',h:'11h50'},{nom:'Suerte dia',h:'12h20'},
    {nom:'Lote Dom',h:'1h45'},{nom:'Ganamas',h:'14h15'},{nom:'Suerte noche',h:'17h50'},
    {nom:'Primera noche',h:'19h50'},{nom:'Loteka',h:'19h45'},{nom:'Nacional noche',h:'20h50 / Dim 17h50'},
    {nom:'Leidsa',h:'20h45 / Dim 15h45'},{nom:'Anguila 10h',h:'09h55'},{nom:'Anguilla 18h',h:'17h55'},
  ])
  const [prix,setPrix]=useState({lot1:50,lot2:20,lot3:10,m1:1000,m2:1000,m3:1000,l3:500,l4:5000,l5:25000})
  const [resultats,setResultats]=useState<any[]>([])
  const [form,setForm]=useState({tiraj:'',p1:'',p2:'',p3:'',m1:'',m2:'',m3:'',l3:'',l4:'',l5:''})
  const [entete,setEntete]=useState({nom:'C&D VERITE LOTTO',adr:'Petion-Ville #25',tel:'+509 1234 5678',resp:'Proprio'})
  const [passProprio,setPassProprio]=useState('proprio123')
  const [boulBloke,setBoulBloke]=useState('')
  const [horaires,setHoraires]=useState([
    {j:'Lundi',de:'06:00',a:'22:00'},{j:'Mardi',de:'06:00',a:'22:00'},{j:'Mercredi',de:'06:00',a:'22:00'},
    {j:'Jeudi',de:'06:00',a:'22:00'},{j:'Vendredi',de:'06:00',a:'22:00'},{j:'Samedi',de:'06:00',a:'22:00'},{j:'Dimanche',de:'08:00',a:'18:00'},
  ])

  const addVendeur=()=>{
    if(!newV.nom) return alert('Mete non!')
    setVendeurs([...vendeurs,{id:Date.now(),nom:newV.nom,pass:newV.pass||'1234',pct:newV.pct,ouvert:true}])
    setNewV({nom:'',pass:'',pct:10})
  }
  const saveResult=()=>{
    if(!form.tiraj||!form.p1) return alert('Mete Tiraj ak 1er!')
    setResultats([...resultats,{...form,date:new Date().toLocaleDateString()}])
    setForm({tiraj:'',p1:'',p2:'',p3:'',m1:'',m2:'',m3:'',l3:'',l4:'',l5:''})
  }

  return(
    <div style={{background:'#000',minHeight:'100vh',color:'white',padding:10}}>
      <h1 style={{color:'#007BFF',textAlign:'center',fontWeight:900}}>🔵 PROPRIO - C&D</h1>
      <div style={{display:'flex',gap:5,overflowX:'auto',marginTop:10,paddingBottom:10}}>
        {[
          {id:'vendeurs',l:'Vendeur'},{id:'limites',l:'Limit'},{id:'heures',l:'Lè'},
          {id:'prix',l:'Pri'},{id:'rapport',l:'Rapò'},{id:'resultats',l:'Rezilta'},{id:'param',l:'Paramèt'},
        ].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?'#007BFF':'#222',color:'white',padding:'8px 12px',borderRadius:20,border:'none',whiteSpace:'nowrap',fontWeight:'bold',fontSize:12}}>{t.l}</button>)}
      </div>

      {tab==='vendeurs' && (
        <div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>Ajoute Nouvo Vendeur</h3>
            <input value={newV.nom} onChange={e=>setNewV({...newV,nom:e.target.value})} placeholder="Non vendeur" style={{width:'100%',padding:10,background:'#333',color:'white',borderRadius:6,marginTop:6}}/>
            <div style={{display:'flex',gap:6,marginTop:6}}><input value={newV.pass} onChange={e=>setNewV({...newV,pass:e.target.value})} placeholder="Modpas" style={{flex:1,padding:10,background:'#333',color:'white',borderRadius:6}}/><input type="number" value={newV.pct} onChange={e=>setNewV({...newV,pct:parseInt(e.target.value)||0})} placeholder="%" style={{width:70,padding:10,background:'#333',color:'white',borderRadius:6}}/></div>
            <button onClick={addVendeur} style={{background:'#007BFF',width:'100%',padding:10,borderRadius:8,marginTop:8,fontWeight:'bold',border:'none',color:'white'}}>+ AJOUTE VANDEUR</button>
          </div>
          <div style={{marginTop:10}}>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 0.7fr 1fr 0.5fr',gap:5,fontSize:11,color:'#888',padding:'5px 10px'}}><span>Non</span><span>Modpas</span><span>%</span><span>Ouvè/Fèmen</span><span>X</span></div>
            {vendeurs.map(v=>(
              <div key={v.id} style={{display:'grid',gridTemplateColumns:'2fr 1fr 0.7fr 1fr 0.5fr',gap:5,background:'#111',padding:10,borderRadius:8,marginTop:5,alignItems:'center'}}>
                <span style={{fontWeight:'bold'}}>{v.nom}</span><span>{v.pass}</span><span>{v.pct}%</span>
                <button onClick={()=>setVendeurs(vendeurs.map(x=>x.id===v.id?{...x,ouvert:!x.ouvert}:x))} style={{background:v.ouvert?'green':'red',color:'white',border:'none',padding:5,borderRadius:5,fontSize:11}}>{v.ouvert?'OUVÈ':'FÈMEN'}</button>
                <button onClick={()=>setVendeurs(vendeurs.filter(x=>x.id!==v.id))} style={{background:'#333',color:'red',border:'none',padding:5,borderRadius:5}}>X</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='limites' && (
        <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Limit Mize (Modifiable) - Vendeur: Tous</h3>
          {Object.entries(limites).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',background:'#333',padding:10,borderRadius:8,marginTop:6}}><span style={{textTransform:'uppercase'}}>{k}</span><input type="number" value={v} onChange={e=>setLimites({...limites,[k]:parseInt(e.target.value)||0})} style={{width:100,background:'black',color:'#0f0',textAlign:'center',borderRadius:5}}/></div>)}
          <button onClick={()=>alert('Limit sove!')} style={{background:'#0f0',color:'black',width:'100%',padding:10,borderRadius:8,marginTop:10,fontWeight:'bold',border:'none'}}>SOVE</button>
        </div>
      )}

      {tab==='heures' && (
        <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Lè Fèmen Modifiable</h3>
          {heures.map((h,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',background:'#333',padding:8,borderRadius:8,marginTop:5}}><span style={{fontSize:12}}>{h.nom}</span><input value={h.h} onChange={e=>{const n=[...heures]; n[i].h=e.target.value; setHeures(n)}} style={{width:130,background:'black',color:'white',textAlign:'center',borderRadius:5,fontSize:12}}/></div>)}
          <button onClick={()=>alert('Lè sove!')} style={{background:'#FFD700',color:'black',width:'100%',padding:10,borderRadius:8,marginTop:10,fontWeight:'bold',border:'none'}}>SOVE</button>
        </div>
      )}

      {tab==='prix' && (
        <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Pri Pèman (Modifiable) - Vendeurs Tous</h3>
          {[
            {k:'lot1',l:'1er lot 50'},{k:'lot2',l:'2e lot 20'},{k:'lot3',l:'3e lot 10'},
            {k:'m1',l:'Mariage1 1000'},{k:'m2',l:'Mariage2 1000'},{k:'m3',l:'Mariage3 1000'},
            {k:'l3',l:'Loto3 500'},{k:'l4',l:'Loto4 5000'},{k:'l5',l:'Loto5 25000'},
          ].map(it=><div key={it.k} style={{display:'flex',justifyContent:'space-between',background:'#333',padding:10,borderRadius:8,marginTop:6}}><span style={{fontSize:12}}>{it.l}</span><input type="number" value={(prix as any)[it.k]} onChange={e=>setPrix({...prix,[it.k]:parseInt(e.target.value)||0})} style={{width:80,background:'black',color:'#0f0',textAlign:'center',borderRadius:5}}/></div>)}
          <button onClick={()=>alert('Pri sove!')} style={{background:'#0f0',color:'black',width:'100%',padding:10,borderRadius:8,marginTop:10,fontWeight:'bold',border:'none'}}>SOVE</button>
        </div>
      )}

      {tab==='rapport' && (
        <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
          <h3 style={{color:'#FFD700'}}>Rapò</h3>
          <div style={{display:'flex',gap:6,marginTop:8}}><input type="date" style={{flex:1,padding:8,background:'#333',color:'white',borderRadius:5}}/><input type="date" style={{flex:1,padding:8,background:'#333',color:'white',borderRadius:5}}/></div>
          <div style={{display:'flex',gap:6,marginTop:6}}><select style={{flex:1,padding:8,background:'#333',color:'white',borderRadius:5}}><option>Vendeurs (Tous)</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select><select style={{flex:1,padding:8,background:'#333',color:'white',borderRadius:5}}><option>Tirages (Tous)</option><option>NY midi</option><option>FL soir</option></select></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>
            <div style={{background:'#000',padding:10,borderRadius:8,textAlign:'center'}}><small>Vente</small><br/><b style={{color:'#0f0'}}>12,500G</b></div>
            <div style={{background:'#000',padding:10,borderRadius:8,textAlign:'center'}}><small>Commission</small><br/><b>1,500G</b></div>
            <div style={{background:'#000',padding:10,borderRadius:8,textAlign:'center'}}><small>Gain (kliyan)</small><br/><b style={{color:'red'}}>3,000G</b></div>
            <div style={{background:'#000',padding:10,borderRadius:8,textAlign:'center'}}><small>Balance net</small><br/><b style={{color:'#FFD700'}}>8,000G</b></div>
          </div>
          <button onClick={()=>window.print()} style={{background:'white',color:'black',width:'100%',padding:10,borderRadius:8,marginTop:10,fontWeight:'bold',border:'none'}}>🖨️ IMPRIMER</button>
          <p style={{fontSize:11,color:'#888',marginTop:8}}>Si gen plizyè tiraj nan fich, rapò chak tiraj kalkile separeman selon rezilta. Maryaj bon nan lòd ou dezòd: 12x34=34x12 pri 1000</p>
        </div>
      )}

      {tab==='resultats' && (
        <div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <input value={form.tiraj} onChange={e=>setForm({...form,tiraj:e.target.value})} placeholder="TIRAJ (....)" style={{width:'100%',padding:10,background:'black',color:'#FFD700',border:'2px solid #FFD700',borderRadius:8,fontWeight:'bold'}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6,marginTop:8}}>
              {[
                {k:'p1',l:'1er 🈁'},{k:'p2',l:'2e 🈁'},{k:'p3',l:'3e 🈁'},{k:'m1',l:'M1 🈁'},
                {k:'m2',l:'M2 🈁'},{k:'m3',l:'M3 🈁'},{k:'l3',l:'L3 🈁'},{k:'l4',l:'L4 🈁'},{k:'l5',l:'L5 🈁'},
              ].map(f=><div key={f.k}><label style={{fontSize:10,color:'#aaa'}}>{f.l}</label><input value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5,textAlign:'center',fontWeight:'bold'}}/></div>)}
            </div>
            <button onClick={saveResult} style={{background:'#0f0',color:'black',width:'100%',padding:10,borderRadius:8,marginTop:10,fontWeight:'900',border:'none'}}>ANREJISTRE</button>
          </div>
          <div style={{background:'#111',padding:10,borderRadius:10,marginTop:10,overflowX:'auto'}}>
            <table style={{width:'100%',fontSize:11,borderCollapse:'collapse'}}><thead><tr style={{background:'#333'}}><th>Tir</th><th>1e</th><th>2e</th><th>3e</th><th>M1</th><th>M2</th><th>M3</th><th>L3</th><th>L4</th><th>L5</th></tr></thead><tbody>{resultats.map((r,i)=><tr key={i} style={{borderBottom:'1px solid #222',textAlign:'center'}}><td style={{color:'#FFD700'}}>{r.tiraj}</td><td>{r.p1}</td><td>{r.p2}</td><td>{r.p3}</td><td>{r.m1}</td><td>{r.m2}</td><td>{r.m3}</td><td>{r.l3}</td><td>{r.l4}</td><td>{r.l5}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}

      {tab==='param' && (
        <div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>Entête (Tèt fich)</h3>
            <input value={entete.nom} onChange={e=>setEntete({...entete,nom:e.target.value})} placeholder="C&D VERITE LOTTO" style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5,marginTop:5}}/>
            <input value={entete.adr} onChange={e=>setEntete({...entete,adr:e.target.value})} placeholder="Adresse..." style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5,marginTop:5}}/>
            <input value={entete.tel} onChange={e=>setEntete({...entete,tel:e.target.value})} placeholder="Telephone..." style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5,marginTop:5}}/>
            <input value={entete.resp} onChange={e=>setEntete({...entete,resp:e.target.value})} placeholder="Responsable..." style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5,marginTop:5}}/>
          </div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>Modpas Proprio (Modifiable)</h3>
            <input value={passProprio} onChange={e=>setPassProprio(e.target.value)} type="password" style={{width:'100%',padding:10,background:'#000',color:'#0f0',borderRadius:5,marginTop:5,border:'1px solid #0f0'}}/>
            <button onClick={()=>alert('Modpas chanje!')} style={{background:'#0f0',color:'black',width:'100%',padding:8,borderRadius:5,marginTop:5,fontWeight:'bold',border:'none'}}>CHANJE MODPAS</button>
          </div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>1- Orè Tirages chak jou</h3>
            {horaires.map((h,i)=><div key={i} style={{display:'flex',gap:5,alignItems:'center',background:'#333',padding:6,borderRadius:5,marginTop:4}}><span style={{width:80,fontSize:12}}>{h.j}</span><span style={{fontSize:11}}>de</span><input value={h.de} onChange={e=>{const n=[...horaires]; n[i].de=e.target.value; setHoraires(n)}} style={{width:60,background:'black',color:'white',borderRadius:4,textAlign:'center'}}/><span style={{fontSize:11}}>a</span><input value={h.a} onChange={e=>{const n=[...horaires]; n[i].a=e.target.value; setHoraires(n)}} style={{width:60,background:'black',color:'white',borderRadius:4,textAlign:'center'}}/></div>)}
          </div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>2- Bloke Boul: 00-99</h3>
            <input value={boulBloke} onChange={e=>setBoulBloke(e.target.value)} placeholder="Ex: 00, 13, 45, 78" style={{width:'100%',padding:10,background:'#333',color:'red',borderRadius:5,marginTop:5}}/>
            <button style={{background:'red',color:'white',width:'100%',padding:8,borderRadius:5,marginTop:5,border:'none',fontWeight:'bold'}}>BLOKE BOUL SA YO</button>
          </div>
          <div style={{background:'#222',padding:12,borderRadius:10,marginTop:10}}>
            <h3 style={{color:'#FFD700'}}>3- Bloke Vandè / 4- Ajoute Vandè</h3>
            <select style={{width:'100%',padding:8,background:'#333',color:'white',borderRadius:5}}><option>Chwazi vandè pou bloke...</option>{vendeurs.map(v=><option key={v.id}>{v.nom}</option>)}</select>
            <button style={{background:'red',color:'white',width:'100%',padding:8,borderRadius:5,marginTop:5,border:'none'}}>BLOKE VANDEUR</button>
          </div>
        </div>
      )}

      <a href="/" style={{display:'block',textAlign:'center',marginTop:20,color:'#888'}}>← Akèy</a>
    </div>
  )
}