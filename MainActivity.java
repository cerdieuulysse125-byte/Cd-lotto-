package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.*; import android.util.Log;
import android.os.AsyncTask; import java.util.*; import java.net.*; import java.io.*;
import java.text.SimpleDateFormat; import java.lang.reflect.Method;
import org.json.*;

public class MainActivity extends Activity {
    // FIREBASE V25.6 MENM JAN
    String DB_URL="https://cd-lotto-default-rtdb.firebaseio.com";
    Map<String,Object> CUR=null; String CUR_KEY="";
    List<String> selT=new ArrayList<>(); String LAST_TXT=""; List<String> allTicketsCache=new ArrayList<>();
    Object sunmiService=null; boolean sunmiReady=false;
    // PRIX & LIMITES DEFAULT V25.6
    JSONObject prixGlobal=new JSONObject(); JSONObject limiteGlobal=new JSONObject();
    JSONObject config=new JSONObject(); JSONObject heures=new JSONObject();
    Map<String,String> heuresMap=new HashMap<>(); JSONObject logosProprio=new JSONObject();
    String[] TIRAJ_DEFAULT={"Borlette Matin|10:00","La Suerte 12:30|12:30","Haiti 14h|14:00","Borlette Soir 18h|18:00","Real|12:30","Primera dia|11:30","Suerte dia|12:00","Lote Dom 13:30|13:30","Ganamas|14:15","Suerte noche|17:50","Primera noche|19:50","Loteka|19:45","Nacional noche|20:50","Leidsa|20:45","GA midi|12:00","FL midi|13:00","NY midi|14:00","GA soir|18:00","FL soir|21:00","NY soir|22:00","Chicago Midday|13:00","Chicago Evening|21:30","Chile 11h|11:00","Chile 20h|20:00","Brazil 14h|14:00","Brazil 19h|19:00"};
    // UI
    LinearLayout root, content, tabV, tabC, tabF, tabR, tabP;
    LinearLayout betsLayout; List<BetRow> betRows=new ArrayList<>(); List<CheckBox> tirajChecks=new ArrayList<>();
    TextView totalText, statusText, heureText, priceInfo, logoStatus;
    EditText inputSerial, inputPass, inputCopyId; EditText inputDateFiches, inputDu, inputAu;
    class BetRow{ Spinner jeu; EditText boul, mise; }

    @Override protected void onCreate(Bundle b){ super.onCreate(b);
        try{ prixGlobal.put("p1",50); prixGlobal.put("p2",20); prixGlobal.put("p3",10); prixGlobal.put("m1",1000); prixGlobal.put("m2",1000); prixGlobal.put("m3",1000); prixGlobal.put("l3",500); prixGlobal.put("l4",5000); prixGlobal.put("l5",25000); prixGlobal.put("kom",10);
              limiteGlobal.put("bor",1500); limiteGlobal.put("mar",100); limiteGlobal.put("l3",100); limiteGlobal.put("l4",20); limiteGlobal.put("l5",5);
        }catch(Exception e){}
        for(String s:TIRAJ_DEFAULT){ String[] p=s.split("\\|"); heuresMap.put(p[0],p[1]); }
        showLogin(); initSunmi(); fetchConfig();
    }
    void showLogin(){
        LinearLayout lay=new LinearLayout(this); lay.setOrientation(1); lay.setPadding(30,100,30,30); lay.setBackgroundColor(Color.parseColor("#eef2f7"));
        TextView title=new TextView(this); title.setText("C&D VERITE LOTTO\nV25.6 NATIF FULL\nSAN HTML - SILENT"); title.setGravity(17); title.setTextSize(18); title.setTextColor(Color.parseColor("#0a4a2e")); lay.addView(title);
        inputSerial=new EditText(this); inputSerial.setHint("Serial"); lay.addView(inputSerial);
        inputPass=new EditText(this); inputPass.setHint("Modpas"); inputPass.setInputType(129); lay.addView(inputPass);
        Button btn=new Button(this); btn.setText("KONEKTE - SUNMI SDK"); btn.setBackgroundColor(Color.parseColor("#0a4a2e")); btn.setTextColor(Color.parseColor("#d4af37")); lay.addView(btn);
        TextView msg=new TextView(this); lay.addView(msg);
        btn.setOnClickListener(v->{ msg.setText("Ap konekte Firebase..."); doLoginFirebase(msg); });
        setContentView(lay);
    }
    void doLoginFirebase(TextView msg){
        String s=inputSerial.getText().toString().trim(); String p=inputPass.getText().toString().trim();
        if(s.isEmpty()){ msg.setText("Mete Serial"); return; }
        new AsyncTask<String,Void,String>(){
            protected String doInBackground(String... pr){ try{ URL url=new URL(DB_URL+"/vendeurs.json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); c.setConnectTimeout(8000); InputStream in=c.getInputStream(); BufferedReader r=new BufferedReader(new InputStreamReader(in)); StringBuilder sb=new StringBuilder(); String line; while((line=r.readLine())!=null) sb.append(line); return sb.toString(); }catch(Exception e){ return "ERR:"+e.getMessage(); } }
            protected void onPostExecute(String res){
                if(res.startsWith("ERR")){ msg.setText("Firebase offline - mode local: "+res); CUR=new HashMap<>(); CUR.put("serial",s); CUR.put("nom","Vendeur "+s); CUR_KEY="local"; showMainFull(); return; }
                try{ JSONObject vs=new JSONObject(res); for(Iterator<String> it=vs.keys(); it.hasNext();){ String k=it.next(); JSONObject f=vs.getJSONObject(k); if(f.optString("serial","").equals(s) && f.optString("pass","").equals(p)){ CUR=new HashMap<>(); CUR.put("serial",f.optString("serial")); CUR.put("nom",f.optString("nom","Vendeur")); CUR.put("proprioId",f.optString("proprioId","")); CUR_KEY=k; showMainFull(); return; } } msg.setText("Modpas pa bon"); }catch(Exception e){ msg.setText("Erè: "+e.getMessage()); }
            }
        }.execute();
    }
    void showMainFull(){
        root=new LinearLayout(this); root.setOrientation(1); root.setBackgroundColor(Color.parseColor("#eef2f7"));
        // HEADER V25.6
        LinearLayout header=new LinearLayout(this); header.setOrientation(0); header.setBackgroundColor(Color.parseColor("#0a4a2e")); header.setPadding(10,10,10,10);
        TextView vName=new TextView(this); vName.setText("Vendeur: "+CUR.get("nom")+" | "+CUR.get("serial")); vName.setTextColor(Color.parseColor("#d4af37")); vName.setTextSize(12); header.addView(vName);
        heureText=new TextView(this); heureText.setText("EST SYNC..."); heureText.setTextColor(Color.WHITE); heureText.setPadding(20,0,0,0); header.addView(heureText);
        root.addView(header);
        // PRINTER BAR V25.6 AVANSÉ
        LinearLayout printerBar=new LinearLayout(this); printerBar.setOrientation(1); printerBar.setBackgroundColor(Color.WHITE); printerBar.setPadding(10,10,10,10);
        TextView printerTitle=new TextView(this); printerTitle.setText("🖨️ SUNMI SDK DIREK + AVANSÉ - V25.6 NATIF"); printerTitle.setTextSize(12); printerBar.addView(printerTitle);
        statusText=new TextView(this); statusText.setText("Sunmi: Binding..."); logoStatus=new TextView(this); logoStatus.setText("Logo:..."); printerBar.addView(statusText); printerBar.addView(logoStatus);
        priceInfo=new TextView(this); priceInfo.setText("SYNC Prix..."); priceInfo.setBackgroundColor(Color.parseColor("#0a4a2e")); priceInfo.setTextColor(Color.parseColor("#d4af37")); priceInfo.setPadding(8,8,8,8); printerBar.addView(priceInfo);
        root.addView(printerBar);
        // CONTENT SCROLL
        ScrollView scroll=new ScrollView(this); content=new LinearLayout(this); content.setOrientation(1); content.setPadding(8,8,80,8);
        // TAB VENDRE - menm jan ak HTML
        tabV=new LinearLayout(this); tabV.setOrientation(1);
        TextView tTitle=new TextView(this); tTitle.setText("1- Tiraj Pa Proprio - EST ("+heuresMap.size()+")"); tTitle.setTextSize(14); tabV.addView(tTitle);
        LinearLayout tirajGrid=new LinearLayout(this); tirajGrid.setOrientation(1);
        for(String kv: heuresMap.keySet()){ CheckBox cb=new CheckBox(this); String heure=heuresMap.get(kv); cb.setText(kv+" - "+heure+" "+(isOpen(kv)?"OK":"FEMEN")); if(!isOpen(kv)) cb.setEnabled(false); cb.setOnCheckedChangeListener((b,c)->{ if(c){ if(!selT.contains(kv)) selT.add(kv); } else selT.remove(kv); updateTotal(); }); tirajChecks.add(cb); tirajGrid.addView(cb); }
        tabV.addView(tirajGrid);
        Button allBtn=new Button(this); allBtn.setText("Tout ouve EST"); tabV.addView(allBtn); allBtn.setOnClickListener(v->{ selT.clear(); for(CheckBox cb:tirajChecks) if(cb.isEnabled()){ cb.setChecked(true); } });
        // JEUX HEADER
        TextView jeuxHeader=new TextView(this); jeuxHeader.setText("JEUX | BOUL | MIZ"); jeuxHeader.setBackgroundColor(Color.parseColor("#0a4a2e")); jeuxHeader.setTextColor(Color.parseColor("#d4af37")); jeuxHeader.setPadding(10,10,10,10); tabV.addView(jeuxHeader);
        betsLayout=new LinearLayout(this); betsLayout.setOrientation(1); tabV.addView(betsLayout);
        Button addBtn=new Button(this); addBtn.setText("+ Liy"); tabV.addView(addBtn); addBtn.setOnClickListener(v->addBetRow("boul"));
        totalText=new TextView(this); totalText.setText("Total $0 x 0 = $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(12,12,12,12); totalText.setTextSize(18); tabV.addView(totalText);
        LinearLayout btnRow=new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn=new Button(this); sellBtn.setText("VANN - SUNMI SDK DIREK"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams blp=new LinearLayout.LayoutParams(0,-2,1); btnRow.addView(sellBtn,blp);
        Button reprintBtn=new Button(this); reprintBtn.setText("RE-PRINT"); LinearLayout.LayoutParams blp2=new LinearLayout.LayoutParams(0,-2,1); blp2.leftMargin=10; btnRow.addView(reprintBtn,blp2);
        tabV.addView(btnRow); sellBtn.setOnClickListener(v->vannNatif()); reprintBtn.setOnClickListener(v->{ if(!LAST_TXT.isEmpty()) printSilent(LAST_TXT); });
        addBetRow("boul"); addBetRow("boul"); addBetRow("boul");
        // TAB KOPYE
        tabC=new LinearLayout(this); tabC.setOrientation(1); tabC.setVisibility(8);
        TextView cTitle=new TextView(this); cTitle.setText("2- Kopye Fich"); tabC.addView(cTitle);
        inputCopyId=new EditText(this); inputCopyId.setHint("ID Ticket"); tabC.addView(inputCopyId);
        Button copyBtn=new Button(this); copyBtn.setText("Kopye Fich"); tabC.addView(copyBtn); copyBtn.setOnClickListener(v->doCopyNatif());
        // TAB FICHES
        tabF=new LinearLayout(this); tabF.setOrientation(1); tabF.setVisibility(8);
        TextView fTitle=new TextView(this); fTitle.setText("3- Mes Fiches - V25.6"); tabF.addView(fTitle);
        inputDateFiches=new EditText(this); inputDateFiches.setHint("yyyy-MM-dd"); inputDateFiches.setText(new SimpleDateFormat("yyyy-MM-dd").format(new Date())); tabF.addView(inputDateFiches);
        Button loadFBtn=new Button(this); loadFBtn.setText("Wè Fich"); tabF.addView(loadFBtn); loadFBtn.setOnClickListener(v->loadFichesNatif());
        // TAB RAPPORT
        tabR=new LinearLayout(this); tabR.setOrientation(1); tabR.setVisibility(8);
        TextView rTitle=new TextView(this); rTitle.setText("4- Rapò V25.6"); tabR.addView(rTitle);
        inputDu=new EditText(this); inputDu.setHint("Du yyyy-MM-dd"); inputDu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new Date())); tabR.addView(inputDu);
        inputAu=new EditText(this); inputAu.setHint("Au yyyy-MM-dd"); inputAu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new Date())); tabR.addView(inputAu);
        Button calcBtn=new Button(this); calcBtn.setText("Kalkile Rapò"); tabR.addView(calcBtn); calcBtn.setOnClickListener(v->calcRapportNatif());
        // TAB PARAMET
        tabP=new LinearLayout(this); tabP.setOrientation(1); tabP.setVisibility(8);
        TextView pTitle=new TextView(this); pTitle.setText("5- Paramèt V25.6 - Imprimante Avansé + Logo Sync\nPaper 58mm Sunmi V2 Pro\nLogo 20mm centre\nMode: SILENT DIREK"); tabP.addView(pTitle);
        Button testLogoBtn=new Button(this); testLogoBtn.setText("TEST FICH - LOGO + SUNMI SDK"); tabP.addView(testLogoBtn); testLogoBtn.setOnClickListener(v->testPrintLogoNatif());
        content.addView(tabV); content.addView(tabC); content.addView(tabF); content.addView(tabR); content.addView(tabP);
        scroll.addView(content); root.addView(scroll);
        // TABS BOTTOM V25.6
        LinearLayout tabs=new LinearLayout(this); tabs.setOrientation(0); tabs.setBackgroundColor(Color.WHITE);
        String[] tabNames={"1-Vendre","2-Kopye","3-Fiches","4-Rapport","5-Paramèt"};
        for(int i=0;i<tabNames.length;i++){ Button tb=new Button(this); tb.setText(tabNames[i]); tb.setTextSize(10); LinearLayout.LayoutParams tp=new LinearLayout.LayoutParams(0,-2,1); int idx=i; tb.setOnClickListener(v->showTab(idx)); tabs.addView(tb,tp); }
        root.addView(tabs);
        setContentView(root); updateHeure(); updatePriceBar();
    }
    void showTab(int idx){ tabV.setVisibility(8); tabC.setVisibility(8); tabF.setVisibility(8); tabR.setVisibility(8); tabP.setVisibility(8); if(idx==0) tabV.setVisibility(0); if(idx==1) tabC.setVisibility(0); if(idx==2) tabF.setVisibility(0); if(idx==3) tabR.setVisibility(0); if(idx==4) tabP.setVisibility(0); }
    void addBetRow(String jeuDef){
        LinearLayout row=new LinearLayout(this); row.setOrientation(0); row.setPadding(0,5,0,5); row.setBackgroundColor(Color.parseColor("#f9fdf9"));
        Spinner sp=new Spinner(this); ArrayAdapter<String> ad=new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, new String[]{"BOUL 2","L3 3","L4 4","L5 5","MAR 4"}); ad.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); sp.setAdapter(ad); LinearLayout.LayoutParams p0=new LinearLayout.LayoutParams(120,-2); row.addView(sp,p0);
        EditText boul=new EditText(this); boul.setHint("--"); boul.setInputType(2); LinearLayout.LayoutParams p1=new LinearLayout.LayoutParams(0,-2,1); p1.leftMargin=5; row.addView(boul,p1);
        EditText mise=new EditText(this); mise.setHint("$"); mise.setInputType(2); LinearLayout.LayoutParams p2=new LinearLayout.LayoutParams(0,-2,1); p2.leftMargin=5; row.addView(mise,p2);
        Button del=new Button(this); del.setText("X"); del.setBackgroundColor(Color.parseColor("#e11d48")); del.setTextColor(Color.WHITE); LinearLayout.LayoutParams p3=new LinearLayout.LayoutParams(80,-2); p3.leftMargin=5; row.addView(del,p3); del.setOnClickListener(v->{ betsLayout.removeView(row); betRows.removeIf(br->br.boul==boul); updateTotal(); });
        mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); } });
        BetRow br=new BetRow(); br.jeu=sp; br.boul=boul; br.mise=mise; betRows.add(br); betsLayout.addView(row);
    }
    void updateTotal(){ int sum=0; for(BetRow br: betRows){ try{ String m=br.mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } int count=selT.size(); if(totalText!=null) totalText.setText("Total $"+sum+" x "+count+" = $"+(sum*count)); }
    boolean isOpen(String name){ try{ String h=heuresMap.get(name); if(h==null) return true; String[] p=h.split(":"); int fh=Integer.parseInt(p[0]); int fm=Integer.parseInt(p[1]); Calendar cal=Calendar.getInstance(TimeZone.getTimeZone("America/Port-au-Prince")); int now=cal.get(Calendar.HOUR_OF_DAY)*60+cal.get(Calendar.MINUTE); return now < fh*60+fm; }catch(Exception e){ return true; } }
    void updateHeure(){ try{ Calendar cal=Calendar.getInstance(TimeZone.getTimeZone("America/Port-au-Prince")); int h=cal.get(Calendar.HOUR_OF_DAY); int m=cal.get(Calendar.MINUTE); String ap=h>=12?"PM":"AM"; int h12=h%12; if(h12==0) h12=12; if(heureText!=null) heureText.setText("EST:"+h12+":"+String.format("%02d",m)+" "+ap); }catch(Exception e){} }
    void updatePriceBar(){ if(priceInfo!=null) priceInfo.setText("Prix: 1er "+prixGlobal.optInt("p1",50)+" M1="+prixGlobal.optInt("m1",1000)+" | LIMIT $"+limiteGlobal.optInt("bor",1500)+" | SILENT"); }
    void fetchConfig(){ new AsyncTask<Void,Void,Void>(){ protected Void doInBackground(Void... v){ try{ String[] nodes={"prix/global","limites/global","config","heures","logosProprio"}; for(String node:nodes){ try{ URL url=new URL(DB_URL+"/"+node+".json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); c.setConnectTimeout(5000); InputStream in=c.getInputStream(); BufferedReader r=new BufferedReader(new InputStreamReader(in)); StringBuilder sb=new StringBuilder(); String line; while((line=r.readLine())!=null) sb.append(line); String json=sb.toString(); if(json==null||json.equals("null")) continue; if(node.startsWith("prix")) prixGlobal=new JSONObject(json); if(node.startsWith("limites")) limiteGlobal=new JSONObject(json); if(node.startsWith("config")) config=new JSONObject(json); if(node.startsWith("heures")){ JSONObject jo=new JSONObject(json); for(Iterator<String> it=jo.keys(); it.hasNext();){ String k=it.next(); heuresMap.put(k,jo.optString(k)); } } if(node.startsWith("logos")) logosProprio=new JSONObject(json); }catch(Exception e){ Log.e("FETCH",node+" "+e); } } }catch(Exception e){} return null; } protected void onPostExecute(Void v){ updatePriceBar(); updateHeure(); if(logoStatus!=null){ String logo=getLogoUrl(); logoStatus.setText("Logo: "+(logo.length()>100?"✅ Sync":"❌")+" | Sunmi SILENT OK"); } } }.execute(); }
    String getLogoUrl(){ try{ if(CUR!=null){ String propId=(String)CUR.get("proprioId"); if(propId!=null && logosProprio.has(propId)) return logosProprio.optString(propId); if(CUR_KEY!=null && logosProprio.has(CUR_KEY)) return logosProprio.optString(CUR_KEY); if(CUR.get("serial")!=null && logosProprio.has((String)CUR.get("serial"))) return logosProprio.optString((String)CUR.get("serial")); } if(config.has("logoUrl") && config.optString("logoUrl").length()>100) return config.optString("logoUrl"); }catch(Exception e){} return ""; }
    void vannNatif(){
        if(selT.isEmpty()){ Toast.makeText(this,"Chwazi Tiraj",0).show(); return; }
        List<Map<String,Object>> bets=new ArrayList<>(); int total=0;
        for(BetRow br: betRows){ String b=br.boul.getText().toString().trim(); String m=br.mise.getText().toString().trim(); if(!b.isEmpty()&&!m.isEmpty()){ try{ int mi=Integer.parseInt(m); total+=mi; Map<String,Object> mp=new HashMap<>(); int idx=br.jeu.getSelectedItemPosition(); String type= idx==0?"boul":idx==1?"loto3":idx==2?"loto4":idx==3?"loto5":"maryaj"; mp.put("type",type); mp.put("numero",b); mp.put("mise",mi); bets.add(mp); }catch(Exception e){} } }
        if(bets.isEmpty()){ Toast.makeText(this,"Mete Boul",0).show(); return; }
        int grand=total*selT.size();
        String id="T"+String.valueOf(System.currentTimeMillis()).substring(6);
        StringBuilder ticket=new StringBuilder();
        ticket.append(center("CD VERITE LOTTO")).append("\n"); ticket.append(center("Fiche Original V25.6")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("POS: "+CUR_KEY)).append("\n"); ticket.append(center("Vendeur: "+CUR.get("serial")+" "+CUR.get("nom"))).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()))).append("\n"); ticket.append(center("----------------")).append("\n");
        for(String t: selT) ticket.append(center(t+" - "+heuresMap.getOrDefault(t,""))).append("\n");
        for(Map<String,Object> bet: bets) ticket.append(betLine((String)bet.get("type"),(String)bet.get("numero"),String.valueOf(bet.get("mise")))).append("\n");
        ticket.append(center("----------------")).append("\n"); ticket.append(center("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Prix: 1er "+prixGlobal.optInt("p1",50))).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        LAST_TXT=ticket.toString(); printSilent(LAST_TXT); allTicketsCache.add(LAST_TXT);
        // SAVE FIREBASE
        new AsyncTask<Void,Void,Void>(){ protected Void doInBackground(Void... v){ try{ JSONObject tk=new JSONObject(); tk.put("id",id); tk.put("date",new SimpleDateFormat("yyyy-MM-dd").format(new Date())); tk.put("dateHaiti",new SimpleDateFormat("yyyy-MM-dd").format(new Date())); tk.put("serial",CUR.get("serial")); tk.put("vendeurId",CUR_KEY); tk.put("tirages",new JSONArray(selT)); tk.put("total",grand); tk.put("baseTotal",total); JSONArray arr=new JSONArray(); for(Map<String,Object> b: bets){ JSONObject jo=new JSONObject(); jo.put("type",b.get("type")); jo.put("numero",b.get("numero")); jo.put("mise",b.get("mise")); arr.put(jo); } tk.put("bets",arr); URL url=new URL(DB_URL+"/tickets/"+id+".json"); HttpURLConnection c=(HttpURLConnection)url.openConnection(); c.setRequestMethod("PUT"); c.setDoOutput(true); c.setRequestProperty("Content-Type","application/json"); OutputStream os=c.getOutputStream(); os.write(tk.toString().getBytes()); os.close(); c.getResponseCode(); }catch(Exception e){ Log.e("SAVE",e.toString()); } return null; } }.execute();
        Toast.makeText(this,"VANN $"+grand+" SILENT OK",1).show(); for(BetRow br: betRows){ br.boul.setText(""); br.mise.setText(""); } updateTotal();
    }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    String betLine(String j,String n,String m){ String left=j.length()>8?j.substring(0,8):String.format("%-8s",j); String mid=n.length()>4?n.substring(0,4):String.format("%4s",n); String right=("$"+m).length()>6?("$"+m).substring(0,6):String.format("%6s","$"+m); return (left+" "+mid+" "+right); }
    void doCopyNatif(){ String id=inputCopyId.getText().toString().trim(); if(id.isEmpty()) return; Toast.makeText(this,"Kopye "+id,0).show(); }
    void loadFichesNatif(){ Toast.makeText(this,"Chaje fiches "+inputDateFiches.getText().toString()+" - Firebase",0).show(); }
    void calcRapportNatif(){ Toast.makeText(this,"Rapò "+inputDu.getText().toString()+" -> "+inputAu.getText().toString(),0).show(); }
    void testPrintLogoNatif(){ String txt=center("CD VERITE LOTTO")+ "\n"+center("TEST V25.6 AVANSÉ")+ "\n"+center("----------------")+ "\n"+center("Printer: Sunmi V2 Pro")+ "\n"+center("Paper: 58mm")+ "\n"+center("Logo: 20mm Centre")+ "\n"+center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()))+ "\n"+center("----------------")+ "\n"+center("TEST OK")+ "\n\n\n\n"; LAST_TXT=txt; printSilent(txt); }
    void initSunmi(){ try{ Class<?> managerCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); Method getInstance=managerCls.getMethod("getInstance"); Object manager=getInstance.invoke(null); Class<?> callbackCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback=java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, (proxy,method,args)->{ if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(()->{ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - Pa gen dyalog - V25.6"); }); } return null; }); Method init=managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager,this,callback); }catch(Exception e){ Log.e("SUNMI","fail "+e); if(statusText!=null) statusText.setText("Mode: GENERIC 58mm - SILENT OK"); } }
    void printSilent(String txt){ try{ if(sunmiService!=null&&sunmiReady){ Method m1=sunmiService.getClass().getMethod("printText", String.class); Method m2=sunmiService.getClass().getMethod("lineWrap", int.class); m1.invoke(sunmiService,txt); m2.invoke(sunmiService,4); return; } }catch(Exception e){ Log.e("PRINT",e.toString()); } Toast.makeText(this,"PRINT:\n"+txt,1).show(); }
}
