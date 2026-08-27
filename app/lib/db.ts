"use client";
export const DB_KEY="CD_FINAL_V4";
export const TIRAGES=["GA midi","FL midi","NY midi","GA soir","FL soir","NY soir","Real","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];
export type GlobalDB={ proprios:any[], vendeurs:any[], resultats:any, limits:any, prix:any, fermetures:any, tickets:any[], antet:any, supModpas:string, boulBloke:string[] };
export const defaultDB:GlobalDB={
 proprios:[{id:1,nom:"Proprio",modpas:"1234",tel:"",adr:"",resp:"",logo:"",statut:"Aktif",msg:""}],
 vendeurs:[{id:1,proprioId:1,nom:"Toto",modpas:"1234",serie:"SERIE-001",pou:"20",statut:"Aktif"}],
 resultats:{}, limits:{global:{bolet:1500,maryaj:100,loto3:100,loto4:20,loto5:5},parProprio:{},parVendeur:{}},
 prix:{global:{lot1:50,lot2:20,lot3:10,m1:1000,m2:1000,m3:1000,l3:500,l4:5000,l5:25000},parProprio:{},parVendeur:{}},
 fermetures:{}, tickets:[], antet:{nom:"C&D VERITE LOTTO",adr:"",tel:"",vendeur:"Toto",logo:"",showDat:true,showTiraj:true,showVande:true,showId:true,pied:"BON CHANS!"}, supModpas:"super123", boulBloke:[]
};
export function loadDB():GlobalDB{
 if(typeof window==="undefined") return defaultDB;
 try{ const s=localStorage.getItem(DB_KEY); if(!s) return defaultDB; const p=JSON.parse(s); return {...defaultDB,...p}; }catch{ localStorage.removeItem(DB_KEY); return defaultDB; }
}
export function saveDB(db:GlobalDB){ localStorage.setItem(DB_KEY,JSON.stringify(db)); }
