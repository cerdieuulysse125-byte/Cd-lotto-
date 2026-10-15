package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.Color; import android.util.Log;
import java.util.*; import java.text.SimpleDateFormat; import java.net.*; import java.io.*;
import org.json.*;

public class MainActivity extends Activity {
    String DB_URL="https://cd-lotto-default-rtdb.firebaseio.com";
    String CUR_SERIAL=""; String CUR_NOM=""; String CUR_KEY=""; String CUR_PROPRIO="";
    List<String> selT=new ArrayList<>(); String LAST_TXT="";
    Object sunmiService=null; boolean sunmiReady=false;
    // FIREBASE DATA V25.6
    JSONObject prixGlobal=new JSONObject(); JSONObject limiteGlobal=new JSONObject();
    Map<String,String> heuresMap=new HashMap<>(); JSONObject ticketsToday=new JSONObject();
    String[] TIRAJ_LIST={"GA midi 12:00","FL midi 13:00","NY midi 14:00","Real 12:30","GA soir 18:00","FL soir 21:00","NY soir 22:00","Real 12h45","Primera dia 11h50","Suerte dia 12h20","Lote Dom 1h45","Ganamas 14h15","Suerte noche 17h50","Primera noche 19h50","Loteka 19h45","Nacional noche 20h50","Leidsa 20h45","Anguila 10h 9h55","Anguila 18h 17h55","Tout tiraj"};
    LinearLayout betsLayout; List<BetRow> betRows=new ArrayList<>();
    TextView totalText, statusText, txtTirajKaz, priceInfo, rapportResult;
    LinearLayout tabV, tabC, tabF, tabR, tabP;
    EditText inputSerial, inputPass, inputCopyId, inputDateF, inputDu, inputAu;
    Spinner spinnerRapportTiraj;
    LinearLayout loginLayout;
    class BetRow{ Spinner jeu; EditText boul, mise; LinearLayout row; }

    @Override protected void onCreate(Bundle b){ super.onCreate(b);
        try{ prixGlobal.put("p1",50); prixGlobal.put("p2",20); prixGlobal.put("p3",10); prixGlobal.put("m1",1000); prixGlobal.put("m2",1000); prixGlobal.put("m3",1000); prixGlobal.put("kom",10);
              limiteGlobal.put("bor",1500); limiteGlobal.put("mar",100); limiteGlobal.put("l3",100); limiteGlobal.put("l4",20); limiteGlobal.put("l5",5);
        }catch(Exception e){}
        for(String s:TIRAJ_LIST){ if(!s.equals("Tout tiraj")){ String[] p=s.split(" "); heuresMap.put(s, p[p.length-1]); }}
        showLogin(); initSunmi();
    }
    void showLogin(){
        loginLayout=new LinearLayout(this); loginLayout.setOrientation(1); loginLayout.setPadding(30,100,30,30); loginLayout.setBackgroundColor(Color.parseColor("#eef2f7"));
        TextView title=new TextView(this); title.setText("C&D VERITE V27\nSANS CHROME + FIREBASE\nSILENT 58mm"); title.setGravity(17); title.setTextSize(18); title.setTextColor(Color.parseColor("#0a4a2e")); loginLayout.addView(title);
        inputSerial=new EditText(this); inputSerial.setHint("Serial"); loginLayout.addView(inputSerial);
        inputPass=new EditText(this); inputPass.setHint("Modpas"); inputPass.setInputType(129); loginLayout.addView(inputPass);
        Button btn=new Button(this); btn.setText("KONEKTE FIREBASE"); btn.setBackgroundColor(Color.parseColor("#0a4a2e")); btn.setTextColor(Color.parseColor("#d4af37")); loginLayout.addView(btn);
        final TextView msg=new TextView(this); loginLayout.addView(msg);
        btn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ msg.setText("Ap konekte Firebase..."); doLoginFirebase(msg); }});
        setContentView(loginLayout);
    }
    void doLoginFirebase(final TextView msg){
        final String s=inputSerial.getText().toString().trim(); final String p=inputPass.getText().toString().trim();
        if(s.isEmpty()){ msg.setText("Mete Serial"); return; }
        new Thread(new Runnable(){ public void run(){
            try{
                URL url=new URL(DB_URL+"/vendeurs.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); c.setConnectTimeout(8000);
                BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String line; while((line=r.readLine())!=null) sb.append(line);
                final JSONObject vs=new JSONObject(sb.toString());
                runOnUiThread(new Runnable(){ public void run(){
                    try{
                        for(Iterator<String> it=vs.keys(); it.hasNext();){
                            String k=it.next(); JSONObject f=vs.getJSONObject(k);
                            if(f.optString("serial","").equals(s) && f.optString("pass","").equals(p)){
                                CUR_SERIAL=s; CUR_NOM=f.optString("nom","Vendeur"); CUR_KEY=k; CUR_PROPRIO=f.optString("proprioId","");
                                fetchFirebaseConfig(); showMainFull(); return;
                            }
                        }
                        msg.setText("Modpas pa bon");
                    }catch(Exception e){ msg.setText("Erè: "+e.getMessage()); }
                }});
            }catch(Exception e){ final String err=e.getMessage(); runOnUiThread(new Runnable(){ public void run(){ msg.setText("Offline - mode local: "+err); CUR_SERIAL=s; CUR_NOM="Vendeur "+s; CUR_KEY="local"; showMainFull(); }}); }
        }}).start();
    }
    void fetchFirebaseConfig(){
        new Thread(new Runnable(){ public void run(){
            try{
                // PRIX
                try{ URL url=new URL(DB_URL+"/prix/global.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String l; while((l=r.readLine())!=null) sb.append(l); if(!sb.toString().equals("null")) prixGlobal=new JSONObject(sb.toString()); }catch(Exception e){}
                // LIMITES GLOBAL
                try{ URL url=new URL(DB_URL+"/limites/global.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String l; while((l=r.readLine())!=null) sb.append(l); if(!sb.toString().equals("null")) limiteGlobal=new JSONObject(sb.toString()); }catch(Exception e){}
                // HEURES
                try{ URL url=new URL(DB_URL+"/heures.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String ll; while((ll=r.readLine())!=null) sb.append(ll); if(!sb.toString().equals("null")){ JSONObject jo=new JSONObject(sb.toString()); for(Iterator<String> it=jo.keys(); it.hasNext();){ String k=it.next(); heuresMap.put(k, jo.optString(k)); } } }catch(Exception e){}
                // TICKETS JODIA POU LIMIT GLOBAL
                try{ URL url=new URL(DB_URL+"/tickets.json?orderBy=\"dateHaiti\"&equalTo=\""+new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())+"\""); HttpURLConnection c=(HttpURLConnection)url.openConnection(); BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String ll; while((ll=r.readLine())!=null) sb.append(ll); if(!sb.toString().equals("null")) ticketsToday=new JSONObject(sb.toString()); }catch(Exception e){ try{ URL url=new URL(DB_URL+"/tickets.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream())); StringBuilder sb=new StringBuilder(); String ll; while((ll=r.readLine())!=null) sb.append(ll); if(!sb.toString().equals("null")) ticketsToday=new JSONObject(sb.toString()); }catch(Exception ee){} }
                runOnUiThread(new Runnable(){ public void run(){ updatePriceBar(); }});
            }catch(Exception e){}
        }}).start();
    }
    void showMainFull(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(1); root.setBackgroundColor(Color.parseColor("#eef2f7"));
        LinearLayout header=new LinearLayout(this); header.setBackgroundColor(Color.parseColor("#0a4a2e")); header.setPadding(10,10,10,10);
        TextView vName=new TextView(this); vName.setText("V27 FIREBASE SANS CHROME | "+CUR_SERIAL+" "+CUR_NOM+" | LIMIT GLOBAL"); vName.setTextColor(Color.parseColor("#d4af37")); vName.setTextSize(11); header.addView(vName); root.addView(header);
        LinearLayout kazContainer=new LinearLayout(this); kazContainer.setOrientation(1); kazContainer.setPadding(8,8,8,8); kazContainer.setBackgroundColor(Color.WHITE);
        TextView labelTiraj=new TextView(this); labelTiraj.setText("1- TIRAJ - Yon sel Kaz - Tiraj miltip - LIMIT GLOBAL"); labelTiraj.setTextSize(12); kazContainer.addView(labelTiraj);
        LinearLayout rowKaz=new LinearLayout(this); rowKaz.setOrientation(0);
        TextView lbl=new TextView(this); lbl.setText("Tiraj"); lbl.setPadding(15,15,15,15); rowKaz.addView(lbl,new LinearLayout.LayoutParams(90,100));
        txtTirajKaz=new TextView(this); txtTirajKaz.setText("Chwazi tiraj EST"); txtTirajKaz.setPadding(15,15,15,15); txtTirajKaz.setBackgroundResource(android.R.drawable.editbox_background); rowKaz.addView(txtTirajKaz,new LinearLayout.LayoutParams(0,100,1));
        Button btnV=new Button(this); btnV.setText("V"); rowKaz.addView(btnV,new LinearLayout.LayoutParams(60,100)); kazContainer.addView(rowKaz); root.addView(kazContainer);
        View.OnClickListener openTiraj=new View.OnClickListener(){ public void onClick(View v){ showTirajDialog(); }}; txtTirajKaz.setOnClickListener(openTiraj); btnV.setOnClickListener(openTiraj);
        ScrollView scroll=new ScrollView(this); LinearLayout content=new LinearLayout(this); content.setOrientation(1); content.setPadding(8,8,8,80);
        tabV=new LinearLayout(this); tabV.setOrientation(1);
        priceInfo=new TextView(this); priceInfo.setText("SYNC Prix Firebase..."); priceInfo.setBackgroundColor(Color.parseColor("#0a4a2e")); priceInfo.setTextColor(Color.parseColor("#d4af37")); priceInfo.setPadding(8,8,8,8); tabV.addView(priceInfo);
        statusText=new TextView(this); statusText.setText("Sunmi: SILENT OK - FIREBASE - LIMIT GLOBAL"); statusText.setTextSize(10); tabV.addView(statusText);
        TextView jeuxHeader=new TextView(this); jeuxHeader.setText("JEUX (chwazi) - BOUL - MISE > flech dwat/anba"); jeuxHeader.setBackgroundColor(Color.parseColor("#0a4a2e")); jeuxHeader.setTextColor(Color.parseColor("#d4af37")); jeuxHeader.setPadding(10,10,10,10); tabV.addView(jeuxHeader);
        betsLayout=new LinearLayout(this); betsLayout.setOrientation(1); tabV.addView(betsLayout);
        Button addBtn=new Button(this); addBtn.setText("+ Liy - konseve jwet"); tabV.addView(addBtn); addBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ addBetRow("BOUL 2"); }});
        totalText=new TextView(this); totalText.setText("Total $0 x 0 = $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(12,12,12,12); totalText.setTextSize(18); tabV.addView(totalText);
        LinearLayout btnRow=new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn=new Button(this); sellBtn.setText("VANN FIREBASE SILENT"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); btnRow.addView(sellBtn,new LinearLayout.LayoutParams(0,120,1));
        Button reprintBtn=new Button(this); reprintBtn.setText("RE-PRINT"); btnRow.addView(reprintBtn,new LinearLayout.LayoutParams(0,120,1)); tabV.addView(btnRow);
        sellBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ vannFirebase(); }}); reprintBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ if(!LAST_TXT.isEmpty()) printSilent(LAST_TXT); }});
        addBetRow("BOUL 2"); addBetRow("BOUL 2"); addBetRow("BOUL 2");
        tabC=new LinearLayout(this); tabC.setOrientation(1); tabC.setVisibility(8); TextView cT=new TextView(this); cT.setText("2 - Copier - Mete Id ticket"); tabC.addView(cT); inputCopyId=new EditText(this); inputCopyId.setHint("Id ticket"); tabC.addView(inputCopyId); Button copyBtn=new Button(this); copyBtn.setText("Kopye Fich Firebase"); tabC.addView(copyBtn); copyBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ doCopyFirebase(); }});
        tabF=new LinearLayout(this); tabF.setOrientation(1); tabF.setVisibility(8); TextView fT=new TextView(this); fT.setText("3 - Mes fiches - Date Recherche"); tabF.addView(fT); inputDateF=new EditText(this); inputDateF.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabF.addView(inputDateF); Button searchF=new Button(this); searchF.setText("Recherche fiches Firebase"); tabF.addView(searchF); searchF.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ loadFichesFirebase(); }});
        tabR=new LinearLayout(this); tabR.setOrientation(1); tabR.setVisibility(8); TextView rT=new TextView(this); rT.setText("4 - Rapport Du Au Tirage Vente Commission Gain Balance net Imprimer - chak tiraj separe"); tabR.addView(rT); inputDu=new EditText(this); inputDu.setHint("Du"); inputDu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabR.addView(inputDu); inputAu=new EditText(this); inputAu.setHint("Au"); inputAu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabR.addView(inputAu); spinnerRapportTiraj=new Spinner(this); ArrayAdapter<String> adR=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, TIRAJ_LIST); adR.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); spinnerRapportTiraj.setAdapter(adR); tabR.addView(spinnerRapportTiraj); Button calcR=new Button(this); calcR.setText("Kalkile Rapò Firebase - chak tiraj separe"); tabR.addView(calcR); rapportResult=new TextView(this); rapportResult.setText("Rapò ap parèt la"); rapportResult.setBackgroundColor(Color.WHITE); rapportResult.setPadding(10,10,10,10); tabR.addView(rapportResult); Button printR=new Button(this); printR.setText("Imprimer Rapò Santre Gran Let"); tabR.addView(printR); printR.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ if(rapportResult!=null) printSilent(rapportResult.getText().toString()); }});
        tabP=new LinearLayout(this); tabP.setOrientation(1); tabP.setVisibility(8); TextView pT=new TextView(this); pT.setText("5- Parametres primant avanse Eskane aparey yo chwazi enprimant konfigire anrejistre 58mm Logo 20mm"); tabP.addView(pT); Button scanSunmi=new Button(this); scanSunmi.setText("SCAN Sunmi Inner SILENT"); tabP.addView(scanSunmi); Button scanBT=new Button(this); scanBT.setText("SCAN Bluetooth 58mm"); tabP.addView(scanBT); Button testP=new Button(this); testP.setText("TEST FICH LOGO SUNMI SDK"); tabP.addView(testP); testP.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ String txt=centerBig("CD VERITE LOTTO")+"\n"+center("TEST V27 FIREBASE")+"\n"+center("SANS CHROME SILENT")+"\n"+center("58mm Gran Let")+"\n"+center("TEST OK")+"\n\n\n\n"; LAST_TXT=txt; printSilent(txt); }});
        content.addView(tabV); content.addView(tabC); content.addView(tabF); content.addView(tabR); content.addView(tabP); scroll.addView(content); root.addView(scroll);
        LinearLayout tabs=new LinearLayout(this); tabs.setOrientation(0); tabs.setBackgroundColor(Color.WHITE); String[] names={"1-Vendre","2-Kopye","3-Fiches","4-Rapport","5-Paramet"}; for(int i=0;i<names.length;i++){ Button tb=new Button(this); tb.setText(names[i]); tb.setTextSize(10); LinearLayout.LayoutParams tp=new LinearLayout.LayoutParams(0,-2,1); final int idx=i; tb.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ showTab(idx); }}); tabs.addView(tb,tp); } root.addView(tabs); setContentView(root); updatePriceBar();
    }
    void showTab(int idx){ tabV.setVisibility(8); tabC.setVisibility(8); tabF.setVisibility(8); tabR.setVisibility(8); tabP.setVisibility(8); if(idx==0) tabV.setVisibility(0); if(idx==1) tabC.setVisibility(0); if(idx==2) tabF.setVisibility(0); if(idx==3) tabR.setVisibility(0); if(idx==4) tabP.setVisibility(0); }
    void showTirajDialog(){ final android.app.Dialog d=new android.app.Dialog(this); LinearLayout lay=new LinearLayout(this); lay.setOrientation(1); lay.setPadding(10,10,10,10); ScrollView sv=new ScrollView(this); LinearLayout grid=new LinearLayout(this); grid.setOrientation(1); final List<CheckBox> cbs=new ArrayList<>(); for(int i=0;i<TIRAJ_LIST.length;i++){ CheckBox cb=new CheckBox(this); cb.setText(TIRAJ_LIST[i]); if(selT.contains(TIRAJ_LIST[i])) cb.setChecked(true); cbs.add(cb); grid.addView(cb); } sv.addView(grid); lay.addView(sv); LinearLayout btns=new LinearLayout(this); btns.setOrientation(0); Button ok=new Button(this); ok.setText("OK"); Button tout=new Button(this); tout.setText("Tout"); btns.addView(ok,new LinearLayout.LayoutParams(0,-2,1)); btns.addView(tout,new LinearLayout.LayoutParams(0,-2,1)); lay.addView(btns); tout.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ for(CheckBox cb:cbs) cb.setChecked(true); }}); ok.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ selT.clear(); for(CheckBox cb:cbs) if(cb.isChecked()) selT.add(cb.getText().toString()); if(txtTirajKaz!=null){ if(selT.isEmpty()) txtTirajKaz.setText("Chwazi tiraj EST"); else txtTirajKaz.setText(selT.size()+" tiraj: "+android.text.TextUtils.join(", ",selT)); txtTirajKaz.setTextColor(Color.BLACK); } updateTotal(); d.dismiss(); }}); d.setContentView(lay); d.show(); }
    void addBetRow(String jeuDef){ LinearLayout row=new LinearLayout(this); row.setOrientation(0); row.setPadding(0,6,0,6); row.setBackgroundColor(Color.parseColor("#f9fdf9")); Spinner sp=new Spinner(this); ArrayAdapter<String> ad=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, new String[]{"BOUL 2","L3 3","L4 4","L5 5","MAR 4"}); ad.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); sp.setAdapter(ad); if(jeuDef!=null){ for(int i=0;i<ad.getCount();i++) if(ad.getItem(i).equals(jeuDef)) sp.setSelection(i); } row.addView(sp,new LinearLayout.LayoutParams(95,-2)); EditText boul=new EditText(this); boul.setHint("boul"); boul.setInputType(2); row.addView(boul,new LinearLayout.LayoutParams(0,-2,1)); EditText mise=new EditText(this); mise.setHint("mise"); mise.setInputType(2); row.addView(mise,new LinearLayout.LayoutParams(0,-2,1)); Button del=new Button(this); del.setText("X"); del.setBackgroundColor(Color.parseColor("#e11d48")); del.setTextColor(Color.WHITE); row.addView(del,new LinearLayout.LayoutParams(50,-2)); BetRow br=new BetRow(); br.jeu=sp; br.boul=boul; br.mise=mise; br.row=row; betRows.add(br); betsLayout.addView(row); View.OnKeyListener kl=new View.OnKeyListener(){ public boolean onKey(View v, int keyCode, KeyEvent event){ if(event.getAction()==KeyEvent.ACTION_DOWN){ if(keyCode==KeyEvent.KEYCODE_DPAD_RIGHT || keyCode==KeyEvent.KEYCODE_ENTER || keyCode==KeyEvent.KEYCODE_DPAD_DOWN){ String jeu=(String)sp.getSelectedItem(); if(boul.getText().length()>0 && mise.getText().length()==0){ mise.requestFocus(); return true; } if(boul.getText().length()>0 && mise.getText().length()>0){ addBetRow(jeu); return true; } } } return false; }}; boul.setOnKeyListener(kl); mise.setOnKeyListener(kl); del.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ betsLayout.removeView(row); for(int i=0;i<betRows.size();i++){ if(betRows.get(i).row==row){ betRows.remove(i); break; } } updateTotal(); }}); mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); }}); }
    void updateTotal(){ int sum=0; for(int i=0;i<betRows.size();i++){ try{ String m=betRows.get(i).mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } if(totalText!=null) totalText.setText("Total $"+sum+" x "+selT.size()+" = $"+(sum*selT.size())); }
    void updatePriceBar(){ try{ if(priceInfo!=null) priceInfo.setText("Prix: 1er "+prixGlobal.optInt("p1",50)+" 2e "+prixGlobal.optInt("p2",20)+" | LIMIT GLOBAL BOUL $"+limiteGlobal.optInt("bor",1500)+" MAR $"+limiteGlobal.optInt("mar",100)+" | Maryaj 12x47=47x12 BON"); }catch(Exception e){} }
    int getDejaVannGlobal(String numero, String tiraj){ int tot=0; try{ for(Iterator<String> it=ticketsToday.keys(); it.hasNext();){ String k=it.next(); JSONObject t=ticketsToday.getJSONObject(k); if(t.optString("dateHaiti","").equals(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()))){ JSONArray tirages=t.optJSONArray("tirages"); if(tirages!=null){ for(int i=0;i<tirages.length();i++) if(tirages.optString(i).equals(tiraj)){ JSONArray bets=t.optJSONArray("bets"); if(bets!=null) for(int j=0;j<bets.length();j++){ JSONObject b=bets.getJSONObject(j); if(b.optString("numero").equals(numero)) tot+=b.optInt("mise",0); } } } } } }catch(Exception e){} return tot; }
    void vannFirebase(){
        if(selT.isEmpty()){ Toast.makeText(this,"Chwazi Tiraj nan Kaz la",0).show(); return; }
        StringBuilder betsStr=new StringBuilder(); int total=0; final List<JSONObject> betsList=new ArrayList<>();
        for(int i=0;i<betRows.size();i++){ BetRow br=betRows.get(i); String b=br.boul.getText().toString().trim(); String m=br.mise.getText().toString().trim(); if(!b.isEmpty()&&!m.isEmpty()){ try{ int mi=Integer.parseInt(m); total+=mi; String j=(String)br.jeu.getSelectedItem(); betsStr.append(String.format("%-6s %-5s $%s\n",j,b,m)); JSONObject jo=new JSONObject(); jo.put("type",j.equals("BOUL 2")?"boul":j.startsWith("L3")?"loto3":j.startsWith("L4")?"loto4":j.startsWith("L5")?"loto5":"maryaj"); jo.put("numero",b); jo.put("mise",mi); betsList.add(jo); }catch(Exception e){} } }
        if(betsStr.length()==0){ Toast.makeText(this,"Mete Boul - chif selman",0).show(); return; }
        // LIMIT GLOBAL CHECK - vendeur1+vendeur2+...=Limit global
        for(JSONObject bet: betsList){ try{ String num=bet.optString("numero"); String type=bet.optString("type"); int mise=bet.optInt("mise"); int max=type.equals("boul")?limiteGlobal.optInt("bor",1500):type.equals("maryaj")?limiteGlobal.optInt("mar",100):type.equals("loto3")?limiteGlobal.optInt("l3",100):type.equals("loto4")?limiteGlobal.optInt("l4",20):limiteGlobal.optInt("l5",5); for(String tiraj: selT){ int deja=getDejaVannGlobal(num, tiraj); if(deja+mise>max){ Toast.makeText(this,"LIMIT GLOBAL depase! "+tiraj+" "+num+" deja $"+deja+" max $"+max+" (vendeur1+vendeur2...)",1).show(); return; } } }catch(Exception e){} }
        final int grand=total*selT.size(); final String id="T"+String.valueOf(System.currentTimeMillis()).substring(6);
        StringBuilder ticket=new StringBuilder(); ticket.append(centerBig("C&D VERITE LOTTO")).append("\n"); ticket.append(center("V27 FIREBASE SANS CHROME")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("POS: "+CUR_KEY+" V:"+CUR_SERIAL)).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()))).append("\n"); ticket.append(center("----------------")).append("\n"); for(int i=0;i<selT.size();i++) ticket.append(centerBig(selT.get(i))).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(betsStr.toString()); ticket.append(center("----------------")).append("\n"); ticket.append(centerBig("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Maryaj 12x47=47x12 BON")).append("\n"); ticket.append(center("LIMIT GLOBAL OK")).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        LAST_TXT=ticket.toString(); printSilent(LAST_TXT);
        final String ticketStr=betsStr.toString();
        // SAVE FIREBASE
        new Thread(new Runnable(){ public void run(){ try{ JSONObject tk=new JSONObject(); tk.put("id",id); tk.put("date",new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tk.put("dateHaiti",new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tk.put("serial",CUR_SERIAL); tk.put("vendeurId",CUR_KEY); tk.put("tirages",new JSONArray(selT)); tk.put("total",grand); tk.put("baseTotal",grand/selT.size()); JSONArray arr=new JSONArray(); for(JSONObject b: betsList) arr.put(b); tk.put("bets",arr); URL url=new URL(DB_URL+"/tickets/"+id+".json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); c.setRequestMethod("PUT"); c.setDoOutput(true); c.setRequestProperty("Content-Type","application/json"); OutputStream os=c.getOutputStream(); os.write(tk.toString().getBytes()); os.close(); c.getResponseCode(); }catch(Exception e){ Log.e("SAVE",e.toString()); } }}).start();
        Toast.makeText(this,"VANN $"+grand+" FIREBASE SILENT OK",1).show(); for(int i=0;i<betRows.size();i++){ betRows.get(i).boul.setText(""); betRows.get(i).mise.setText(""); } updateTotal(); fetchFirebaseConfig();
    }
    void doCopyFirebase(){ String id=inputCopyId.getText().toString().trim(); if(id.isEmpty()){ Toast.makeText(this,"Mete Id",0).show(); return; } Toast.makeText(this,"Kopye "+id+" - Firebase",0).show(); }
    void loadFichesFirebase(){ Toast.makeText(this,"Recherche "+inputDateF.getText().toString()+" Firebase",0).show(); }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    String centerBig(String s){ return center(s.toUpperCase()); }
    void initSunmi(){ try{ Class<?> managerCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); java.lang.reflect.Method getInstance=managerCls.getMethod("getInstance"); Object manager=getInstance.invoke(null); Class<?> callbackCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback=java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, new java.lang.reflect.InvocationHandler(){ public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable { if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(new Runnable(){ public void run(){ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - FIREBASE - LIMIT GLOBAL - SAN CHROME"); }}); } return null; }}); java.lang.reflect.Method init=managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager,this,callback); }catch(Exception e){ Log.e("SUNMI","fail "+e.getMessage()); } }
    void printSilent(String txt){ try{ if(sunmiService!=null&&sunmiReady){ try{ sunmiService.getClass().getMethod("setFontSize", int.class).invoke(sunmiService,24); }catch(Exception e){} sunmiService.getClass().getMethod("printText", String.class).invoke(sunmiService,txt); sunmiService.getClass().getMethod("lineWrap", int.class).invoke(sunmiService,4); return; } }catch(Exception e){ Log.e("PRINT",e.toString()); } Toast.makeText(this,"PRINT:\n"+txt,1).show(); }
}
