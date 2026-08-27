"use client";
export const DB_KEY="cd_global_db_v3";
export const TIRAGES=["GA midi","FL midi","NY midi","Real","GA soir","FL soir","NY soir","Real 12h45","Primera dia","Suerte dia","Lote Dom","Ganamas","Suerte noche","Primera noche","Loteka","Nacional noche","Leidsa","Anguila 10h","Anguila 18h"];
export type GlobalDB={
 proprios:{id:number,nom:string,modpas:string,tel:string,adr:string,resp:string,logo:string,statut:"Aktif"|"Bloke",msg:string}[],
 vendeurs:{id:number,proprioId:number,nom:string,modpas:string,serie:string,pou:string,statut:"Aktif"|"Bloke"}[],
 resultats:{[t:string]:{p1:string,p2:string,p3:string,m1:string,m2:string,m3:string,l3:string,l4:string,l5:string}},
 limits:{global:{bolet:number,maryaj:number,loto3:number,loto4:number,loto5:number},parProprio:{[k:string]:any},parVendeur:{[k:string]:any}},
 prix:{global:{lot1:number,lot2:number,lot3:number,m1:number,m2:number,m3:number,l3:number,l4:number,l5:number},parProprio:{[k:string]:any},parVendeur:{[k:string]:any}},
 fermetures:{[t:string]:string}, tickets:any[], antet:{nom:string,adr:string,tel:string,vendeur:string,logo:string,showDat:boolean,showTiraj:boolean,showVande:boolean,showId:boolean,pied:string}, supModpas:string, boulBloke:string[]
};
export const defaultDB:GlobalDB={
 proprios:[{id:1,nom:"Proprio Petion-Ville",modpas:"1234",tel:"+509 1234",adr:"Petion-Ville",resp:"Boss",logo:"",statut:"Aktif",msg:""}],
 vendeurs:[{id:1,proprioId:1,nom:"Toto",modpas:"1234",serie:"SERIE-001",pou:"20",statut:"Aktif"}],
 resultats:{}, limits:{global:{bolet:1500,maryaj:100,loto3:100,loto4:20,loto5:5},parProprio:{},parVendeur:{}},
 prix:{global:{lot1:50,lot2:20,lot3:10,m1:1000,m2:1000,m3:1000,l3:500,l4:5000,l5:25000},parProprio:{},parVendeur:{}},
 fermetures:{"GA midi":"12:15","FL midi":"13:15","NY midi":"14:15","GA soir":"18:15","FL soir":"21:15","NY soir":"22:15","Real 12h45":"12:45","Primera dia":"11:50","Suerte dia":"12:20","Lote Dom":"01:45","Ganamas":"14:15","Suerte noche":"17:50","Primera noche":"19:50","Loteka":"19:45","Nacional noche":"20:50","Leidsa":"20:45","Anguila 10h":"09:55","Anguila 18h":"17:55"},
 tickets:[], antet:{nom:"C&D VÉRITÉ LOTTO",adr:"Adresse...",tel:"+509 0000",vendeur:"Toto",logo:"",showDat:true,showTiraj:true,showVande:true,showId:true,pied:"BON CHANS!"}, supModpas:"super123", boulBloke:[]
};
export function loadDB():GlobalDB{
 if(typeof window==="undefined") return defaultDB;
 const s=localStorage.getItem(DB_KEY); if(!s){localStorage.setItem(DB_KEY,JSON.stringify(defaultDB)); return defaultDB;}
 try{return {...defaultDB,...JSON.parse(s)};}catch{return defaultDB;}
}
export function saveDB(db:GlobalDB){localStorage.setItem(DB_KEY,JSON.stringify(db));}
