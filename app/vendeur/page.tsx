const printTicket = () => {
  const cfg = JSON.parse(localStorage.getItem('cfg_antet') || '{"nom":"C&D VÉRITÉ LOTTO","vendeur":"Toto","showDate":true,"showTirage":true,"showVendeur":true,"showId":true}');
  const idTicket = 'CD' + Date.now().toString().slice(-6);
  const dateNow = new Date().toLocaleDateString('fr-HT')+' '+new Date().toLocaleTimeString();
  const tirageStr = selected.join(', ');
  const total = fiches.reduce((s,f)=>s+f.miz,0)*(selected.length||1);

  // Miz yo sou menm kolòn dwat - pa kole
  const lignes = fiches.map(f=>{
    return `<div style="display:flex; justify-content:space-between; width:100%; max-width:68mm; margin:0 auto; font-size:22px; line-height:26px;">
              <span>${f.jeu} ${f.boul}</span>
              <span style="min-width:38px; text-align:right;">${f.miz}</span>
            </div>`;
  }).join('');

  const w = window.open('','','width=400,height=800');
  w!.document.write(`
  <html><head>
  <style>
    @page { size: 58mm auto; margin: 0; }
    * { -webkit-print-color-adjust: exact; }
    html, body { 
      width: 58mm; 
      margin: 0 auto; 
      padding: 0; 
      display: flex; 
      justify-content: center; 
      align-items: flex-start;
      background: #fff;
    }
    .ticket {
      width: 72mm;
      margin: 0 auto;
      text-align: center;
      font-family: 'Courier New', monospace;
      font-weight: 900;
      color: #000;
      padding: 8mm 4mm;
    }
    .title { font-size: 24px; line-height: 26px; letter-spacing: 0.5px; }
    .info { font-size: 16px; line-height: 19px; margin: 2px 0; }
    hr { border: none; border-top: 2.5px dashed #000; margin: 10px auto; width: 68mm; }
    .total { font-size: 26px; line-height: 28px; }
  </style>
  </head><body>
    <div class="ticket">
      <div class="title">${cfg.nom}</div>
      ${cfg.showDate?`<div class="info">Dat: ${dateNow}</div>`:''}
      ${cfg.showTirage?`<div class="info">Tiraj: ${tirageStr}</div>`:''}
      ${cfg.showVendeur?`<div class="info">Vandè: ${cfg.vendeur}</div>`:''}
      ${cfg.showId?`<div class="info">Id ticket: ${idTicket}</div>`:''}
      <hr/>
      <div style="margin: 8px 0;">${lignes}</div>
      <hr/>
      <div class="total">TOTAL: ${total} HTG</div>
      <hr/>
      <div class="info" style="font-size:12px;">Imprimante: ${localStorage.getItem('printer_default')||'System'}</div>
      <div style="font-size:20px; margin-top:8px;">BON CHANS!</div>
    </div>
    <script>
      window.onload = function(){ 
        setTimeout(()=>{ window.print(); window.close(); }, 300);
      }
    <\/script>
  </body></html>`);
};
