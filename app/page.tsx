"use client";
export default function Home(){
 return(
  <div style={{padding:20,maxWidth:400,margin:"50px auto",textAlign:"center"}}>
   <h1>C&D VERITE LOTTO</h1>
   <div style={{marginTop:30,display:"flex",flexDirection:"column",gap:15}}>
    <a href="/vendeur" style={{padding:20,background:"#000",color:"#fff",borderRadius:12,textDecoration:"none",fontWeight:900}}>VENDEUR</a>
    <a href="/proprio" style={{padding:20,background:"#006600",color:"#fff",borderRadius:12,textDecoration:"none",fontWeight:900}}>PROPRIO</a>
    <a href="/super-admin" style={{padding:20,background:"#aa0000",color:"#fff",borderRadius:12,textDecoration:"none",fontWeight:900}}>SUPER ADMIN</a>
   </div>
  </div>
 )
}
