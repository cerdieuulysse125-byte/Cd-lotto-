"use client";
export const DB_KEY = "cd_global_db";
export type GlobalDB = {
  proprios: {id:number, nom:string, modpas:string, tel:string, vendeur:number, statut:"Aktif"|"Bloke"}[],
  vendeurs: {id:number, proprioId:number, nom:string, modpas:string, pou:string, statut:"Aktif"|"Bloke"}[],
  resultats: {[k:string]: string},
  limits: { global:number, proprio:{[k:string]:number}, vendeur:{[k:string]:number} },
  prix: { global:{bolet:number,maryaj:number,loto3:number,loto4:number,loto5:number}, proprio:{[k:string]:any}, vendeur:{[k:string]:any} },
  fermetures: {[k:string]:string},
  boulBloke: string[],
  tickets: any[],
  antet: {nom:string, tel:string, vendeur:string, showDat:boolean, showTiraj:boolean, showVande:boolean, showId:boolean, showTel:boolean}
};
export const defaultDB: GlobalDB = {
  proprios: [{id:1,nom:"Proprio Petion-Ville",modpas:"1234",tel:"+509 1234",vendeur:12,statut:"Aktif"},{id:2,nom:"Proprio Delmas 33",modpas:"5678",tel:"+509 5678",vendeur:8,statut:"Aktif"}],
  vendeurs: [{id:1,proprioId:1,nom:"Toto",modpas:"1234",pou:"20",statut:"Aktif"},{id:2,proprioId:1,nom:"Marcel",modpas:"1234",pou:"20",statut:"Aktif"}],
  resultats: {}, limits: { global:5000, proprio:{}, vendeur:{} },
  prix: { global:{bolet:20,maryaj:1000,loto3:500,loto4:1000,loto5:1000}, proprio:{}, vendeur:{} },
  fermetures: {}, boulBloke: [], tickets: [],
  antet: {nom:"C&D VÉRITÉ LOTTO", tel:"+509 0000", vendeur:"Toto", showDat:true, showTiraj:true, showVande:true, showId:true, showTel:true}
};
export function loadDB(): GlobalDB {
  if(typeof window==="undefined") return defaultDB;
  const s = localStorage.getItem(DB_KEY);
  if(!s){ localStorage.setItem(DB_KEY, JSON.stringify(defaultDB)); return defaultDB; }
  try{ return {...defaultDB,...JSON.parse(s)}; }catch{ return defaultDB; }
}
export function saveDB(db:GlobalDB){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }
