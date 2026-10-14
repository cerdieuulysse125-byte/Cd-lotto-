package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.Color; import android.util.Log;
import java.util.*; import java.text.SimpleDateFormat;

public class MainActivity extends Activity {
    String CUR_SERIAL="2222"; String CUR_NOM="Vendeur"; String CUR_KEY="15";
    List<String> selT=new ArrayList<>(); String LAST_TXT="";
    Object sunmiService=null; boolean sunmiReady=false;
    // TIRAJ JAN OU MANDE YO - YON SÈL KAZ
    String[] TIRAJ_LIST={"GA midi 12:00","FL midi 13:00","NY midi 14:00","Real 12:30","GA soir 18:00","FL soir 21:00","NY soir 22:00","Real 12h45","Primera dia 11h50","Suerte dia 12h20","Lote Dom 1h45","Ganamas 14h15","Suerte noche 17h50","Primera noche 19h50","Loteka 19h45","Nacional noche 20h50","Leidsa 20h45","Anguila 10h 9h55","Anguila 18h 17h55","Tout tiraj"};
    LinearLayout betsLayout; List<BetRow> betRows=new ArrayList<>();
    TextView totalText, statusText, txtTirajKaz;
    LinearLayout tabV, tabC, tabF, tabR, tabP;
    EditText inputCopyId, inputDateF, inputDu, inputAu; Spinner spinnerRapportTiraj;
    // LIMIT GLOBAL V25.6
    int LIMIT_BOUL=1500; int LIMIT_MAR=100; int LIMIT_L3=100; int LIMIT_L4=20; int LIMIT_L5=5;
    class BetRow{ Spinner jeu; EditText boul, mise; LinearLayout row; }

    @Override protected void onCreate(Bundle b){ super.onCreate(b); showMainFull(); initSunmi(); }

    void showMainFull(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(1); root.setBackgroundColor(Color.parseColor("#eef2f7"));
        LinearLayout header=new LinearLayout(this); header.setBackgroundColor(Color.parseColor("#0a4a2e")); header.setPadding(10,10,10,10);
        TextView vName=new TextView(this); vName.setText("C&D VERITE V26 FINAL | "+CUR_SERIAL+" | SILENT 58mm"); vName.setTextColor(Color.parseColor("#d4af37")); vName.setTextSize(12); header.addView(vName); root.addView(header);
        // 1- KAZ TIRAJ - YON SÈL KAZ - TOUT TIRAJ LADAN
        LinearLayout kazContainer=new LinearLayout(this); kazContainer.setOrientation(1); kazContainer.setPadding(8,8,8,8); kazContainer.setBackgroundColor(Color.WHITE);
        TextView labelTiraj=new TextView(this); labelTiraj.setText("1- TIRAJ - Yon sèl Kaz (a chwazi) - Miltip"); labelTiraj.setTextSize(13); labelTiraj.setTextColor(Color.parseColor("#0a4a2e")); kazContainer.addView(labelTiraj);
        LinearLayout rowKaz=new LinearLayout(this); rowKaz.setOrientation(0); rowKaz.setPadding(0,8,0,0);
        TextView lbl=new TextView(this); lbl.setText("Tiraj"); lbl.setPadding(15,15,15,15); lbl.setBackgroundColor(Color.WHITE); lbl.setTextColor(Color.BLACK); LinearLayout.LayoutParams lp1=new LinearLayout.LayoutParams(90,100); rowKaz.addView(lbl,lp1);
        txtTirajKaz=new TextView(this); txtTirajKaz.setText("Chwazi tiraj EST"); txtTirajKaz.setPadding(15,15,15,15); txtTirajKaz.setBackgroundColor(Color.WHITE); txtTirajKaz.setTextColor(Color.GRAY); txtTirajKaz.setBackgroundResource(android.R.drawable.editbox_background); LinearLayout.LayoutParams lp2=new LinearLayout.LayoutParams(0,100,1); lp2.leftMargin=10; rowKaz.addView(txtTirajKaz,lp2);
        Button btnV=new Button(this); btnV.setText("V"); LinearLayout.LayoutParams lp3=new LinearLayout.LayoutParams(60,100); lp3.leftMargin=5; rowKaz.addView(btnV,lp3);
        kazContainer.addView(rowKaz); root.addView(kazContainer);
        View.OnClickListener openTiraj=new View.OnClickListener(){ public void onClick(View v){ showTirajDialog(); } }; txtTirajKaz.setOnClickListener(openTiraj); btnV.setOnClickListener(openTiraj);
        // SCROLL CONTENT
        ScrollView scroll=new ScrollView(this); LinearLayout content=new LinearLayout(this); content.setOrientation(1); content.setPadding(8,8,8,80);
        // TAB VENDRE
        tabV=new LinearLayout(this); tabV.setOrientation(1);
        statusText=new TextView(this); statusText.setText("Sunmi: SILENT OK - Pa gen dyalog - 58mm"); statusText.setTextSize(10); tabV.addView(statusText);
        TextView jeuxHeader=new TextView(this); jeuxHeader.setText("JEUX (chwazi) - BOUL - MISE >"); jeuxHeader.setBackgroundColor(Color.parseColor("#0a4a2e")); jeuxHeader.setTextColor(Color.parseColor("#d4af37")); jeuxHeader.setPadding(10,10,10,10); tabV.addView(jeuxHeader);
        betsLayout=new LinearLayout(this); betsLayout.setOrientation(1); tabV.addView(betsLayout);
        Button addBtn=new Button(this); addBtn.setText("+ Liy - flèch pou avanse, konsève jwèt"); tabV.addView(addBtn); addBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ addBetRow("BOUL 2"); }});
        totalText=new TextView(this); totalText.setText("Total $0 x 0 = $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(12,12,12,12); totalText.setTextSize(18); tabV.addView(totalText);
        LinearLayout btnRow=new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn=new Button(this); sellBtn.setText("VANN - SANTRE GRAN LÈT"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams blp=new LinearLayout.LayoutParams(0,120,1); btnRow.addView(sellBtn,blp);
        Button reprintBtn=new Button(this); reprintBtn.setText("RE-PRINT"); LinearLayout.LayoutParams blp2=new LinearLayout.LayoutParams(0,120,1); blp2.leftMargin=10; btnRow.addView(reprintBtn,blp2);
        tabV.addView(btnRow); sellBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ vannFinal(); }}); reprintBtn.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ if(!LAST_TXT.isEmpty()) printSilent(LAST_TXT); }});
        addBetRow("BOUL 2"); addBetRow("BOUL 2"); addBetRow("BOUL 2");
        // TAB 2 COPIER
        tabC=new LinearLayout(this); tabC.setOrientation(1); tabC.setVisibility(8);
        TextView cT=new TextView(this); cT.setText("2 - Copier\nMete Id ticket a pou kopye"); cT.setTextSize(16); tabC.addView(cT);
        inputCopyId=new EditText(this); inputCopyId.setHint("Id ticket"); inputCopyId.setInputType(2); tabC.addView(inputCopyId);
        Button copyBtn=new Button(this); copyBtn.setText("Kopye Fich"); tabC.addView(copyBtn);
        // TAB 3 MES FICHES
        tabF=new LinearLayout(this); tabF.setOrientation(1); tabF.setVisibility(8);
        TextView fT=new TextView(this); fT.setText("3 - Mes fiches\nDate..... Recherche fiches"); fT.setTextSize(16); tabF.addView(fT);
        inputDateF=new EditText(this); inputDateF.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabF.addView(inputDateF);
        Button searchF=new Button(this); searchF.setText("Recherche fiches"); tabF.addView(searchF);
        // TAB 4 RAPPORT
        tabR=new LinearLayout(this); tabR.setOrientation(1); tabR.setVisibility(8);
        TextView rT=new TextView(this); rT.setText("4 - Rapport\nDu.... Au.... Tirage (..., tous)\nVente / Commission / Gain / Balance net / Imprimer"); rT.setTextSize(14); tabR.addView(rT);
        inputDu=new EditText(this); inputDu.setHint("Du yyyy-MM-dd"); inputDu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabR.addView(inputDu);
        inputAu=new EditText(this); inputAu.setHint("Au yyyy-MM-dd"); inputAu.setText(new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date())); tabR.addView(inputAu);
        spinnerRapportTiraj=new Spinner(this); ArrayAdapter<String> adR=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, TIRAJ_LIST); adR.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); spinnerRapportTiraj.setAdapter(adR); tabR.addView(spinnerRapportTiraj);
        Button calcR=new Button(this); calcR.setText("Kalkile Rapò - chak tiraj separe"); tabR.addView(calcR);
        Button printR=new Button(this); printR.setText("Imprimer Rapò - santre gran lèt"); tabR.addView(printR);
        // TAB 5 PARAMETRES
        tabP=new LinearLayout(this); tabP.setOrientation(1); tabP.setVisibility(8);
        TextView pT=new TextView(this); pT.setText("5- Paramètres\nprimant avanse\nEskane aparèy yo (chwazi enprimant, konfigire & anrejistre)\nPaper 58mm Sunmi V2 Pro\nLogo 20mm santre"); pT.setTextSize(14); tabP.addView(pT);
        Button scanSunmi=new Button(this); scanSunmi.setText("📟 SCAN Sunmi Inner"); tabP.addView(scanSunmi);
        Button scanBT=new Button(this); scanBT.setText("📱 SCAN Bluetooth 58mm"); tabP.addView(scanBT);
        Button saveP=new Button(this); saveP.setText("💾 ANREJISTRE Konfig"); saveP.setBackgroundColor(Color.parseColor("#0a4a2e")); saveP.setTextColor(Color.parseColor("#d4af37")); tabP.addView(saveP);
        content.addView(tabV); content.addView(tabC); content.addView(tabF); content.addView(tabR); content.addView(tabP); scroll.addView(content); root.addView(scroll);
        // TABS BOTTOM
        LinearLayout tabs=new LinearLayout(this); tabs.setOrientation(0); tabs.setBackgroundColor(Color.WHITE);
        String[] names={"1-Vendre","2-Kopye","3-Fiches","4-Rapport","5-Paramèt"};
        for(int i=0;i<names.length;i++){ Button tb=new Button(this); tb.setText(names[i]); tb.setTextSize(10); LinearLayout.LayoutParams tp=new LinearLayout.LayoutParams(0,-2,1); final int idx=i; tb.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ showTab(idx); }}); tabs.addView(tb,tp); }
        root.addView(tabs); setContentView(root);
    }
    void showTab(int idx){ tabV.setVisibility(8); tabC.setVisibility(8); tabF.setVisibility(8); tabR.setVisibility(8); tabP.setVisibility(8); if(idx==0) tabV.setVisibility(0); if(idx==1) tabC.setVisibility(0); if(idx==2) tabF.setVisibility(0); if(idx==3) tabR.setVisibility(0); if(idx==4) tabP.setVisibility(0); }
    void showTirajDialog(){
        final android.app.Dialog d=new android.app.Dialog(this); d.setTitle("Chwazi Tiraj - Miltip");
        LinearLayout lay=new LinearLayout(this); lay.setOrientation(1); lay.setPadding(10,10,10,10);
        ScrollView sv=new ScrollView(this); LinearLayout grid=new LinearLayout(this); grid.setOrientation(1);
        final List<CheckBox> cbs=new ArrayList<>();
        for(int i=0;i<TIRAJ_LIST.length;i++){ CheckBox cb=new CheckBox(this); cb.setText(TIRAJ_LIST[i]); if(selT.contains(TIRAJ_LIST[i])) cb.setChecked(true); cbs.add(cb); grid.addView(cb); }
        sv.addView(grid); lay.addView(sv);
        LinearLayout btns=new LinearLayout(this); btns.setOrientation(0);
        Button ok=new Button(this); ok.setText("OK"); Button tout=new Button(this); tout.setText("Tout"); btns.addView(ok,new LinearLayout.LayoutParams(0,-2,1)); btns.addView(tout,new LinearLayout.LayoutParams(0,-2,1)); lay.addView(btns);
        tout.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ for(CheckBox cb:cbs) cb.setChecked(true); }});
        ok.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ selT.clear(); for(CheckBox cb:cbs) if(cb.isChecked()) selT.add(cb.getText().toString()); if(txtTirajKaz!=null){ if(selT.isEmpty()) txtTirajKaz.setText("Chwazi tiraj EST"); else txtTirajKaz.setText(selT.size()+" tiraj: "+android.text.TextUtils.join(", ",selT)); txtTirajKaz.setTextColor(Color.BLACK); } updateTotal(); d.dismiss(); }});
        d.setContentView(lay); d.show();
    }
    void addBetRow(String jeuDef){
        LinearLayout row=new LinearLayout(this); row.setOrientation(0); row.setPadding(0,6,0,6); row.setBackgroundColor(Color.parseColor("#f9fdf9"));
        Spinner sp=new Spinner(this); ArrayAdapter<String> ad=new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, new String[]{"BOUL 2","L3 3","L4 4","L5 5","MAR 4"}); ad.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); sp.setAdapter(ad); if(jeuDef!=null){ for(int i=0;i<ad.getCount();i++) if(ad.getItem(i).equals(jeuDef)) sp.setSelection(i); }
        LinearLayout.LayoutParams p0=new LinearLayout.LayoutParams(95,-2); row.addView(sp,p0);
        EditText boul=new EditText(this); boul.setHint("boul"); boul.setInputType(2); boul.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(5)}); LinearLayout.LayoutParams p1=new LinearLayout.LayoutParams(0,-2,1); p1.leftMargin=4; row.addView(boul,p1);
        EditText mise=new EditText(this); mise.setHint("mise"); mise.setInputType(2); LinearLayout.LayoutParams p2=new LinearLayout.LayoutParams(0,-2,1); p2.leftMargin=4; row.addView(mise,p2);
        Button del=new Button(this); del.setText("X"); del.setBackgroundColor(Color.parseColor("#e11d48")); del.setTextColor(Color.WHITE); LinearLayout.LayoutParams p3=new LinearLayout.LayoutParams(50,-2); p3.leftMargin=4; row.addView(del,p3);
        BetRow br=new BetRow(); br.jeu=sp; br.boul=boul; br.mise=mise; br.row=row; betRows.add(br); betsLayout.addView(row);
        // TOUCHE FLÈCH POU AVANSE - DWAT / ANBA - KONSÈVE JWÈT
        View.OnKeyListener keyListener=new View.OnKeyListener(){ public boolean onKey(View v, int keyCode, KeyEvent event){ if(event.getAction()==KeyEvent.ACTION_DOWN){ if(keyCode==KeyEvent.KEYCODE_DPAD_RIGHT || keyCode==KeyEvent.KEYCODE_ENTER || keyCode==KeyEvent.KEYCODE_DPAD_DOWN){ String jeu=(String)sp.getSelectedItem(); if(boul.getText().length()>0 && mise.getText().length()==0){ mise.requestFocus(); return true; } if(boul.getText().length()>0 && mise.getText().length()>0){ addBetRow(jeu); return true; } } } return false; } };
        boul.setOnKeyListener(keyListener); mise.setOnKeyListener(keyListener);
        del.setOnClickListener(new View.OnClickListener(){ public void onClick(View v){ betsLayout.removeView(row); for(int i=0;i<betRows.size();i++){ if(betRows.get(i).row==row){ betRows.remove(i); break; } } updateTotal(); }});
        mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); }});
    }
    void updateTotal(){ int sum=0; for(int i=0;i<betRows.size();i++){ try{ String m=betRows.get(i).mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } int count=selT.size(); if(count==0) count=1; if(totalText!=null) totalText.setText("Total $"+sum+" x "+selT.size()+" = $"+(sum*selT.size())); }
    void vannFinal(){
        if(selT.isEmpty()){ Toast.makeText(this,"Chwazi Tiraj nan Kaz la",0).show(); return; }
        StringBuilder betsStr=new StringBuilder(); int total=0;
        for(int i=0;i<betRows.size();i++){ BetRow br=betRows.get(i); String b=br.boul.getText().toString().trim(); String m=br.mise.getText().toString().trim(); if(!b.isEmpty()&&!m.isEmpty()){ try{ int mi=Integer.parseInt(m); total+=mi; String j=(String)br.jeu.getSelectedItem(); betsStr.append(String.format("%-6s %-5s $%s\n",j,b,m)); }catch(Exception e){} } }
        if(betsStr.length()==0){ Toast.makeText(this,"Mete Boul - chif sèlman",0).show(); return; }
        // LIMIT GLOBAL
        if(total>LIMIT_BOUL){ Toast.makeText(this,"LIMIT GLOBAL depase $"+LIMIT_BOUL,0).show(); return; }
        int grand=total*selT.size();
        StringBuilder ticket=new StringBuilder();
        // SANTRE GRAN LÈT POU TI WOULO
        ticket.append(centerBig("C&D VERITE LOTTO")).append("\n"); ticket.append(center("V26 FINAL SILENT")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("POS: "+CUR_KEY+" V:"+CUR_SERIAL)).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()))).append("\n"); ticket.append(center("----------------")).append("\n");
        for(int i=0;i<selT.size();i++) ticket.append(centerBig(selT.get(i))).append("\n");
        ticket.append(center("----------------")).append("\n"); ticket.append(betsStr.toString()); ticket.append(center("----------------")).append("\n"); ticket.append(centerBig("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Maryaj: 12x47=47x12 BON")).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        LAST_TXT=ticket.toString(); printSilent(LAST_TXT); Toast.makeText(this,"VANN $"+grand+" SILENT OK",1).show();
    }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    String centerBig(String s){ return center(s.toUpperCase()); } // pou Sunmi gran lèt nou mete majiskil + santre
    void initSunmi(){ try{ Class<?> managerCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); java.lang.reflect.Method getInstance=managerCls.getMethod("getInstance"); Object manager=getInstance.invoke(null); Class<?> callbackCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback=java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, new java.lang.reflect.InvocationHandler(){ public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable { if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(new Runnable(){ public void run(){ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - 58mm - Gran Lèt"); }}); } return null; }}); java.lang.reflect.Method init=managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager,this,callback); }catch(Exception e){ Log.e("SUNMI","fail "+e.getMessage()); if(statusText!=null) statusText.setText("Mode: GENERIC 58mm - SILENT OK - V26"); } }
    void printSilent(String txt){ try{ if(sunmiService!=null&&sunmiReady){ java.lang.reflect.Method mSetSize=sunmiService.getClass().getMethod("setFontSize", int.class); try{ mSetSize.invoke(sunmiService,24); }catch(Exception e){} java.lang.reflect.Method m1=sunmiService.getClass().getMethod("printText", String.class); java.lang.reflect.Method m2=sunmiService.getClass().getMethod("lineWrap", int.class); m1.invoke(sunmiService,txt); m2.invoke(sunmiService,4); return; } }catch(Exception e){ Log.e("PRINT",e.toString()); } Toast.makeText(this,"PRINT:\n"+txt,1).show(); }
}
