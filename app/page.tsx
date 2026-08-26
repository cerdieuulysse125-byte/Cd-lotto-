"use client";
import Link from "next/link";
export default function Home(){
 return(
  <div style={{background:"#000",color:"#fff",minHeight:"100vh",padding:20,textAlign:"center",maxWidth:400,margin:"0 auto"}}>
   <h1 style={{color:"#FFD700",fontSize:32}}>CD-LOTTO</h1>
   <p style={{opacity:0.7}}>Bolet • Loto3 • Loto4 • Mariage</p>
   
   <Link href="/vendeur" style={{display:"block",background:"#FFD700",color:"#000",padding:16,borderRadius:12,marginTop:20,fontWeight:"bold",textDecoration:"none"}}>🎰 ANTRE VANDEUR</Link>
   <Link href="/proprio" style={{display:"block",background:"#222",color:"#fff",padding:16,borderRadius:12,marginTop:12,textDecoration:"none",border:"1px solid #333"}}>🔵 PROPRIO</Link>
   <Link href="/super-admin" style={{display:"block",background:"#D50000",color:"#fff",padding:16,borderRadius:12,marginTop:12,textDecoration:"none",fontWeight:"bold"}}>👑 SUPER ADMIN</Link>
   
   <p style={{marginTop:40,fontSize:11,opacity:0.4}}>cd-lotto.vercel.app - v1.0</p>
  </div>
 )
}