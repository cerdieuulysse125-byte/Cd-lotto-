package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.Color; import android.util.Log;
import java.util.*; import java.text.SimpleDateFormat;
import java.lang.reflect.Method;

public class MainActivity extends Activity {
    String CUR_SERIAL="2222"; String CUR_NOM="Vendeur"; String CUR_KEY="15";
    List<String> selT=new ArrayList<>(); String LAST_TXT="";
    Object sunmiService=null; boolean sunmiReady=false;
    Map<String,String> heuresMap=new HashMap<>();
    String[] TIRAJ_DEFAULT={"Borlette Matin|10:00","La Suerte 12:30|12:30","Haiti 14h|14:00","Borlette Soir 18h|18:00","Real|12:30","Primera dia|11:30","Suerte dia|12:00","Lote Dom 13:30|13:30","Ganamas|14:15","Suerte noche|17:50","Primera noche|19:50","Loteka|19:45","Nacional noche|20:50","Leidsa|20:45","GA midi|12:00","FL midi|13:00","NY midi|14:00","GA soir|18:00","FL soir|21:00","NY soir|22:00","Chicago Midday|13:00","Chicago Evening|21:30","Chile 11h|11:00","Chile 20h|20:00","Brazil 14h|14:00","Brazil 19h|19:00"};
    LinearLayout betsLayout; List<BetRow> betRows=new ArrayList<>(); List<CheckBox> tirajChecks=new ArrayList<>();
    TextView totalText, statusText, heureText, priceInfo;
    LinearLayout tabV, tabC, tabF, tabR, tabP;
    EditText inputCopyId;
    class BetRow{ Spinner jeu; EditText boul, mise; LinearLayout row; }

    @Override protected void onCreate(Bundle b){ super.onCreate(b);
        for(String s:TIRAJ_DEFAULT){ String[] p=s.split("\\|"); heuresMap.put(p[0],p[1]); }
        showMainFull(); initSunmi();
    }
    void showMainFull(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(1); root.setBackgroundColor(Color.parseColor("#eef2f7"));
        LinearLayout header=new LinearLayout(this); header.setOrientation(0); header.setBackgroundColor(Color.parseColor("#0a4a2e")); header.setPadding(10,10,10,10);
        TextView vName=new TextView(this); vName.setText("V25.6 NATIF FULL | "+CUR_SERIAL+" | "+CUR_NOM); vName.setTextColor(Color.parseColor("#d4af37")); vName.setTextSize(12); header.addView(vName);
        heureText=new TextView(this); heureText.setText("EST SYNC"); heureText.setTextColor(Color.WHITE); heureText.setPadding(20,0,0,0); header.addView(heureText); root.addView(header);
        LinearLayout printerBar=new LinearLayout(this); printerBar.setOrientation(1); printerBar.setBackgroundColor(Color.WHITE); printerBar.setPadding(10,10,10,10);
        statusText=new TextView(this); statusText.setText("Sunmi: Binding... SILENT"); printerBar.addView(statusText);
        priceInfo=new TextView(this); priceInfo.setText("Prix: 1er 50 M1=1000 | LIMIT $1500 | Mode: SUNMI SDK DIREK SILENT"); priceInfo.setBackgroundColor(Color.parseColor("#0a4a2e")); priceInfo.setTextColor(Color.parseColor("#d4af37")); priceInfo.setPadding(8,8,8,8); printerBar.addView(priceInfo); root.addView(printerBar);
        ScrollView scroll=new ScrollView(this); LinearLayout content=new LinearLayout(this); content.setOrientation(1); content.setPadding(8,8,8,80);
        tabV=new LinearLayout(this); tabV.setOrientation(1);
        TextView tTitle=new TextView(this); tTitle.setText("1- Tiraj Pa Proprio - EST ("+heuresMap.size()+")"); tabV.addView(tTitle);
        for(String kv: heuresMap.keySet()){ CheckBox cb=new CheckBox(this); cb.setText(kv+" - "+heuresMap.get(kv)); cb.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener(){ public void onCheckedChanged(CompoundButton b, boolean c){ if(c){ if(!selT.contains(kv)) selT.add(kv); } else selT.remove(kv); updateTotal(); }}); tirajChecks.add(cb); tabV.addView(cb); }
        Button allBtn=new Button(this); allBtn.setText("Tout ouve EST"); tabV.addView(allBtn); allBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ selT.clear(); for(CheckBox cb:tirajChecks){ cb.setChecked(true); } }});
        TextView jeuxHeader=new TextView(this); jeuxHeader.setText("JEUX | BOUL | MIZ"); jeuxHeader.setBackgroundColor(Color.parseColor("#0a4a2e")); jeuxHeader.setTextColor(Color.parseColor("#d4af37")); jeuxHeader.setPadding(10,10,10,10); tabV.addView(jeuxHeader);
        betsLayout=new LinearLayout(this); betsLayout.setOrientation(1); tabV.addView(betsLayout);
        Button addBtn=new Button(this); addBtn.setText("+ Liy - menm jan ak HTML"); tabV.addView(addBtn); addBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ addBetRow(); }});
        totalText=new TextView(this); totalText.setText("Total $0 x 0 = $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(12,12,12,12); totalText.setTextSize(18); tabV.addView(totalText);
        LinearLayout btnRow=new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn=new Button(this); sellBtn.setText("VANN - SUNMI SDK DIREK"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams blp=new LinearLayout.LayoutParams(0,-2,1); btnRow.addView(sellBtn,blp);
        Button reprintBtn=new Button(this); reprintBtn.setText("RE-PRINT"); LinearLayout.LayoutParams blp2=new LinearLayout.LayoutParams(0,-2,1); blp2.leftMargin=10; btnRow.addView(reprintBtn,blp2);
        tabV.addView(btnRow); sellBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ vannNatif(); }}); reprintBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ if(!LAST_TXT.isEmpty()) printSilent(LAST_TXT); }});
        addBetRow(); addBetRow(); addBetRow();
        tabC=new LinearLayout(this); tabC.setOrientation(1); tabC.setVisibility(8); TextView cTitle=new TextView(this); cTitle.setText("2- Kopye Fich - menm jan ak HTML"); tabC.addView(cTitle); inputCopyId=new EditText(this); inputCopyId.setHint("ID Ticket"); tabC.addView(inputCopyId); Button copyBtn=new Button(this); copyBtn.setText("Kopye Fich"); tabC.addView(copyBtn);
        tabF=new LinearLayout(this); tabF.setOrientation(1); tabF.setVisibility(8); TextView fTitle=new TextView(this); fTitle.setText("3- Mes Fiches V25.6"); tabF.addView(fTitle); TextView fList=new TextView(this); fList.setText("LIS ap parèt la - Firebase offline pou kounya, build la dwe vèt avan"); tabF.addView(fList);
        tabR=new LinearLayout(this); tabR.setOrientation(1); tabR.setVisibility(8); TextView rTitle=new TextView(this); rTitle.setText("4- Rapò V25.6 - menm kalkil ak HTML"); tabR.addView(rTitle);
        tabP=new LinearLayout(this); tabP.setOrientation(1); tabP.setVisibility(8); TextView pTitle=new TextView(this); pTitle.setText("5- Paramèt V25.6 - Imprimante Avansé\nPaper 58mm Sunmi V2 Pro\nLogo 20mm centre\nMode SILENT DIREK\nMòd: SUNMI SDK + BT 58mm + CHROME"); tabP.addView(pTitle); Button testBtn=new Button(this); testBtn.setText("TEST FICH - LOGO + SUNMI SDK"); tabP.addView(testBtn); testBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ String txt=center("CD VERITE LOTTO")+"\n"+center("TEST V25.6 AVANSÉ")+"\n"+center("----------------")+"\n"+center("Printer: Sunmi V2 Pro")+"\n"+center("58mm SILENT")+"\n"+center("----------------")+"\n"+center("TEST OK")+"\n\n\n\n"; LAST_TXT=txt; printSilent(txt); }});
        content.addView(tabV); content.addView(tabC); content.addView(tabF); content.addView(tabR); content.addView(tabP); scroll.addView(content); root.addView(scroll);
        LinearLayout tabs=new LinearLayout(this); tabs.setOrientation(0); tabs.setBackgroundColor(Color.WHITE);
        String[] tabNames={"1-Vendre","2-Kopye","3-Fiches","4-Rapport","5-Paramèt"};
        for(int i=0;i<tabNames.length;i++){ Button tb=new Button(this); tb.setText(tabNames[i]); tb.setTextSize(10); LinearLayout.LayoutParams tp=new LinearLayout.LayoutParams(0,-2,1); final int idx=i; tb.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ showTab(idx); }}); tabs.addView(tb,tp); }
        root.addView(tabs); setContentView(root);
    }
    void showTab(int idx){ tabV.setVisibility(8); tabC.setVisibility(8); tabF.setVisibility(8); tabR.setVisibility(8); tabP.setVisibility(8); if(idx==0) tabV.setVisibility(0); if(idx==1) tabC.setVisibility(0); if(idx==2) tabF.setVisibility(0); if(idx==3) tabR.setVisibility(0); if(idx==4) tabP.setVisibility(0); }
    void addBetRow(){
        LinearLayout row=new LinearLayout(this); row.setOrientation(0); row.setPadding(0,5,0,5); row.setBackgroundColor(Color.parseColor("#f9fdf9"));
        Spinner sp=new Spinner(this); ArrayAdapter<String> ad=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, new String[]{"BOUL 2","L3 3","L4 4","L5 5","MAR 4"}); ad.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); sp.setAdapter(ad); LinearLayout.LayoutParams p0=new LinearLayout.LayoutParams(110,-2); row.addView(sp,p0);
        EditText boul=new EditText(this); boul.setHint("--"); boul.setInputType(2); LinearLayout.LayoutParams p1=new LinearLayout.LayoutParams(0,-2,1); p1.leftMargin=5; row.addView(boul,p1);
        EditText mise=new EditText(this); mise.setHint("$"); mise.setInputType(2); LinearLayout.LayoutParams p2=new LinearLayout.LayoutParams(0,-2,1); p2.leftMargin=5; row.addView(mise,p2);
        Button del=new Button(this); del.setText("X"); del.setBackgroundColor(Color.parseColor("#e11d48")); del.setTextColor(Color.WHITE); LinearLayout.LayoutParams p3=new LinearLayout.LayoutParams(70,-2); p3.leftMargin=5; row.addView(del,p3);
        BetRow br=new BetRow(); br.jeu=sp; br.boul=boul; br.mise=mise; br.row=row; betRows.add(br); betsLayout.addView(row);
        del.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ betsLayout.removeView(row); for(int i=0;i<betRows.size();i++){ if(betRows.get(i).row==row){ betRows.remove(i); break; } } updateTotal(); }});
        mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); }});
    }
    void updateTotal(){ int sum=0; for(int i=0;i<betRows.size();i++){ try{ String m=betRows.get(i).mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } int count=selT.size(); if(totalText!=null) totalText.setText("Total $"+sum+" x "+count+" = $"+(sum*count)); }
    void vannNatif(){
        if(selT.isEmpty()){ Toast.makeText(this,"Chwazi Tiraj",0).show(); return; }
        StringBuilder betsStr=new StringBuilder(); int total=0;
        for(int i=0;i<betRows.size();i++){ BetRow br=betRows.get(i); String b=br.boul.getText().toString().trim(); String m=br.mise.getText().toString().trim(); if(!b.isEmpty()&&!m.isEmpty()){ try{ int mi=Integer.parseInt(m); total+=mi; String j=(String)br.jeu.getSelectedItem(); betsStr.append(j).append(" ").append(b).append(" - $").append(m).append("\n"); }catch(Exception e){} } }
        if(betsStr.length()==0){ Toast.makeText(this,"Mete Boul",0).show(); return; }
        int grand=total*selT.size();
        StringBuilder ticket=new StringBuilder();
        ticket.append(center("CD VERITE LOTTO")).append("\n"); ticket.append(center("Fiche Original V25.6")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("POS: "+CUR_KEY)).append("\n"); ticket.append(center("Vendeur: "+CUR_SERIAL+" "+CUR_NOM)).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()))).append("\n"); ticket.append(center("----------------")).append("\n");
        for(int i=0;i<selT.size();i++) ticket.append(center(selT.get(i)+" - "+heuresMap.get(selT.get(i)))).append("\n");
        ticket.append(betsStr.toString()); ticket.append(center("----------------")).append("\n"); ticket.append(center("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Prix: 1er 50 2e 20 3e 10")).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        LAST_TXT=ticket.toString(); printSilent(LAST_TXT); Toast.makeText(this,"VANN $"+grand+" SILENT OK",1).show();
    }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    void initSunmi(){ try{ Class<?> managerCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); java.lang.reflect.Method getInstance=managerCls.getMethod("getInstance"); Object manager=getInstance.invoke(null); Class<?> callbackCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback=java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, new java.lang.reflect.InvocationHandler(){ public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable { if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(new Runnable(){ public void run(){ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - Pa gen dyalog - V25.6"); }}); } return null; }}); java.lang.reflect.Method init=managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager,this,callback); }catch(Exception e){ Log.e("SUNMI","fail "+e.getMessage()); } }
    void printSilent(String txt){ try{ if(sunmiService!=null&&sunmiReady){ java.lang.reflect.Method m1=sunmiService.getClass().getMethod("printText", String.class); java.lang.reflect.Method m2=sunmiService.getClass().getMethod("lineWrap", int.class); m1.invoke(sunmiService,txt); m2.invoke(sunmiService,4); return; } }catch(Exception e){ Log.e("PRINT",e.toString()); } Toast.makeText(this,"PRINT:\n"+txt,1).show(); }
}
