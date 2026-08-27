<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SUPER ADMIN</title></head><body style="background:white;font-family:sans-serif;padding:10px">
<h1 style="text-align:center;font-weight:900">SUPER <span style="color:red">ADMIN</span></h1>
<div id="login"><input id="p" type="password" placeholder="Modpas" style="width:100%;height:50px;border:2px solid black;border-radius:10px;text-align:center"><button onclick="if(document.getElementById('p').value==='admin2024'){localStorage.setItem('cd_super_auth','ok');location.reload()}else alert('Pa bon')" style="width:100%;background:black;color:white;padding:15px;border-radius:10px;margin-top:10px;font-weight:900">ANTRE</button></div>
<div id="app" style="display:none">
<select id="selP" style="width:100%;height:40px;border:1px solid black;border-radius:8px;margin-top:10px"></select>
<input id="nP" placeholder="Non Proprio" style="width:100%;height:40px;border:1px solid black;border-radius:8px;margin-top:6px;padding:8px">
<input id="passP" placeholder="Modpas Proprio" style="width:100%;height:40px;border:1px solid black;border-radius:8px;margin-top:6px;padding:8px">
<button onclick="addP()" style="width:100%;background:#dc2626;color:white;padding:10px;border-radius:8px;margin-top:8px;font-weight:900">AJOUTE PROPRIO</button>
<hr style="margin:15px 0">
<input id="nV" placeholder="Non Vandè" style="width:100%;height:40px;border:1px solid black;border-radius:8px;padding:8px">
<input id="passV" placeholder="Modpas Vandè" style="width:100%;height:40px;border:1px solid black;border-radius:8px;margin-top:6px;padding:8px">
<button onclick="addV()" style="width:100%;background:#facc15;color:black;padding:10px;border-radius:8px;margin-top:8px;font-weight:900">AJOUTE VANDEUR NAN PROPRIO CHWAZI A</button>
<div id="list" style="margin-top:15px"></div>
</div>
<script>
let proprios=JSON.parse(localStorage.getItem("cd_proprios")||"[]");let vendeurs=JSON.parse(localStorage.getItem("cd_vendeurs")||"[]");
if(localStorage.getItem("cd_super_auth")){document.getElementById("login").style.display="none";document.getElementById("app").style.display="block";render()}
function addP(){let n=document.getElementById("nP").value;let ps=document.getElementById("passP").value;if(!n||!ps)return;proprios.push({id:"P"+Date.now(),nom:n,password:ps});localStorage.setItem("cd_proprios",JSON.stringify(proprios));render()}
function addV(){let sel=document.getElementById("selP").value;let n=document.getElementById("nV").value;let ps=document.getElementById("passV").value;if(!n||!ps||!sel)return alert("Chwazi proprio!");vendeurs.push({id:"V"+Date.now(),nom:n,password:ps,proprioId:sel});localStorage.setItem("cd_vendeurs",JSON.stringify(vendeurs));render()}
function render(){let s=document.getElementById("selP");s.innerHTML='<option value="">Chwazi Proprio</option>'+proprios.map(p=>`<option value="${p.id}">${p.nom}</option>`).join("");document.getElementById("list").innerHTML=proprios.map(p=>`<div style="border:2px solid black;border-radius:8px;padding:8px;margin-top:6px;background:#fef2f2"><b style="color:red">${p.nom}</b> - ${p.password}<br>${vendeurs.filter(v=>v.proprioId===p.id).map(v=>`→ ${v.nom} (${v.password})`).join("<br>")}</div>`).join("")}
</script></body></html>
