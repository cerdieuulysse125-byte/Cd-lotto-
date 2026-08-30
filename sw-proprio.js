const CACHE = "proprio-v2216";
const FILES = ["proprio.html","manifest-proprio.json","icon-192.png","icon-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>x!==CACHE&&caches.delete(x)))));
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      return caches.open(CACHE).then(c=>{c.put(e.request,res.clone());return res;});
    }).catch(()=>caches.match("proprio.html")))
  );
});
