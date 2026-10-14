package com.cdlotto.app;
import android.app.Activity; import android.os.Bundle; import android.widget.*;
import android.view.*; import android.graphics.Color; import android.util.Log;
import java.util.*; import java.lang.reflect.Method;
import java.text.SimpleDateFormat; import java.util.Date;

public class MainActivity extends Activity {
    String currentSerial="2222"; String lastTicket=""; List<String> allTickets = new ArrayList<>();
    Object sunmiService=null; boolean sunmiReady=false;
    // UI VANN
    List<CheckBox> tirajChecks=new ArrayList<>(); List<BetRow> betRows=new ArrayList<>();
    TextView totalText, statusText; LinearLayout betsLayout;
    LinearLayout tabVann, tabList, tabRapport, tabReprint;
    String[] TIRAJ={"Borlette Matin","La Suerte 12:30","Haiti 14h","Borlette Soir 18h","FL midi","FL soir","NY soir","GA soir"};
    class BetRow{ EditText boul,mise; }
    @Override protected void onCreate(Bundle b){
        super.onCreate(b);
        try{ showMainFull(); initSunmi(); }catch(Exception e){ Log.e("CD","crash "+e); }
    }
    void showMainFull(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(1);
        // HEADER
        TextView header=new TextView(this); header.setText("CD VERITE V32 FULL | "+currentSerial+" | SILENT"); header.setBackgroundColor(Color.parseColor("#0a4a2e")); header.setTextColor(Color.parseColor("#d4af37")); header.setPadding(15,15,15,15); header.setTextSize(14); root.addView(header);
        // TAB BUTTONS
        LinearLayout tabs=new LinearLayout(this); tabs.setOrientation(0); tabs.setBackgroundColor(Color.parseColor("#123d2a"));
        String[] names={"VANN","LIS","RAPÒ","REPRINT"}; for(int i=0;i<names.length;i++){ Button tb=new Button(this); tb.setText(names[i]); tb.setTextSize(12); tb.setTextColor(Color.WHITE); tb.setBackgroundColor(Color.parseColor("#0a4a2e")); LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(0,-2,1); p.setMargins(2,2,2,2); int idx=i; tb.setOnClickListener(v->showTab(idx)); tabs.addView(tb,p); } root.addView(tabs);
        // CONTAINER
        ScrollView scroll=new ScrollView(this); LinearLayout container=new LinearLayout(this); container.setOrientation(1); container.setPadding(10,10,10,100);
        // --- TAB VANN ---
        tabVann=new LinearLayout(this); tabVann.setOrientation(1);
        TextView t1=new TextView(this); t1.setText("1- TIRAJ (Chwazi)"); t1.setTextSize(16); t1.setPadding(0,10,0,5); tabVann.addView(t1);
        for(String t:TIRAJ){ CheckBox cb=new CheckBox(this); cb.setText(t); cb.setOnCheckedChangeListener((buttonView,isChecked)->updateTotal()); tirajChecks.add(cb); tabVann.addView(cb); }
        TextView t2=new TextView(this); t2.setText("2- BOUL / MIZ"); t2.setTextSize(16); t2.setPadding(0,20,0,10); tabVann.addView(t2);
        betsLayout=new LinearLayout(this); betsLayout.setOrientation(1); tabVann.addView(betsLayout);
        Button addBtn=new Button(this); addBtn.setText("+ Liy Boul"); tabVann.addView(addBtn); addBtn.setOnClickListener(v->addBetRow());
        totalText=new TextView(this); totalText.setText("Total $0 x 0 = $0"); totalText.setBackgroundColor(Color.parseColor("#0a4a2e")); totalText.setTextColor(Color.parseColor("#d4af37")); totalText.setPadding(15,15,15,15); totalText.setTextSize(18); LinearLayout.LayoutParams tlp=new LinearLayout.LayoutParams(-1,-2); tlp.topMargin=15; tabVann.addView(totalText,tlp);
        LinearLayout btnRow=new LinearLayout(this); btnRow.setOrientation(0);
        Button sellBtn=new Button(this); sellBtn.setText("VANN SILENT"); sellBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); sellBtn.setTextColor(Color.parseColor("#d4af37")); LinearLayout.LayoutParams blp=new LinearLayout.LayoutParams(0,-2,1); btnRow.addView(sellBtn,blp);
        Button clearBtn=new Button(this); clearBtn.setText("EFAS"); LinearLayout.LayoutParams blp2=new LinearLayout.LayoutParams(0,-2,1); blp2.leftMargin=10; btnRow.addView(clearBtn,blp2);
        tabVann.addView(btnRow);
        sellBtn.setOnClickListener(v->sellTicket()); clearBtn.setOnClickListener(v->clearAll());
        statusText=new TextView(this); statusText.setText("Sunmi: init..."); statusText.setGravity(17); tabVann.addView(statusText);
        addBetRow(); addBetRow(); addBetRow();
        // --- TAB LIST ---
        tabList=new LinearLayout(this); tabList.setOrientation(1); tabList.setVisibility(8);
        TextView listTitle=new TextView(this); listTitle.setText("LIS TIKÈ VANN JODIA"); listTitle.setTextSize(18); tabList.addView(listTitle);
        // --- TAB RAPPORT ---
        tabRapport=new LinearLayout(this); tabRapport.setOrientation(1); tabRapport.setVisibility(8);
        TextView rapTitle=new TextView(this); rapTitle.setText("RAPÒ JODIA"); rapTitle.setTextSize(18); tabRapport.addView(rapTitle);
        // --- TAB REPRINT ---
        tabReprint=new LinearLayout(this); tabReprint.setOrientation(1); tabReprint.setVisibility(8);
        TextView reTitle=new TextView(this); reTitle.setText("RE-PRINT DÈNYE TIKÈ"); reTitle.setTextSize(18); tabReprint.addView(reTitle);
        Button reprintBtn=new Button(this); reprintBtn.setText("RE-PRINT DÈNYE TIKÈ"); reprintBtn.setBackgroundColor(Color.parseColor("#0a4a2e")); reprintBtn.setTextColor(Color.parseColor("#d4af37")); tabReprint.addView(reprintBtn); reprintBtn.setOnClickListener(v->{ if(!lastTicket.isEmpty()) printSilent(lastTicket); else Toast.makeText(this,"Pa gen tikè",0).show(); });
        container.addView(tabVann); container.addView(tabList); container.addView(tabRapport); container.addView(tabReprint);
        scroll.addView(container); root.addView(scroll); setContentView(root);
    }
    void showTab(int idx){
        tabVann.setVisibility(8); tabList.setVisibility(8); tabRapport.setVisibility(8); tabReprint.setVisibility(8);
        if(idx==0) tabVann.setVisibility(0);
        if(idx==1){ tabList.setVisibility(0); refreshListTab(); }
        if(idx==2){ tabRapport.setVisibility(0); refreshRapportTab(); }
        if(idx==3) tabReprint.setVisibility(0);
    }
    void refreshListTab(){
        tabList.removeAllViews(); TextView t=new TextView(this); t.setText("LIS TIKÈ ("+allTickets.size()+")"); t.setTextSize(18); tabList.addView(t);
        for(int i=allTickets.size()-1;i>=0;i--){ TextView tv=new TextView(this); tv.setText("--- Tikè "+(i+1)+" ---\n"+allTickets.get(i)); tv.setBackgroundColor(Color.WHITE); tv.setPadding(10,10,10,10); tv.setTextSize(12); LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2); p.topMargin=10; tabList.addView(tv,p); }
    }
    void refreshRapportTab(){
        tabRapport.removeAllViews(); TextView t=new TextView(this); t.setText("RAPÒ JODIA - Total Tikè: "+allTickets.size()); t.setTextSize(18); tabRapport.addView(t);
        int grand=0; for(String tk: allTickets){ try{ String[] lines=tk.split("\n"); for(String l: lines) if(l.contains("Total =>")){ String num=l.replaceAll("[^0-9]",""); if(!num.isEmpty()) grand+=Integer.parseInt(num); } }catch(Exception e){} }
        TextView g=new TextView(this); g.setText("TOTAL JODIA: $"+grand+" HTG"); g.setTextSize(22); g.setTextColor(Color.parseColor("#0a4a2e")); g.setPadding(0,20,0,0); tabRapport.addView(g);
    }
    void addBetRow(){
        LinearLayout row=new LinearLayout(this); row.setOrientation(0); row.setPadding(0,5,0,5);
        EditText boul=new EditText(this); boul.setHint("Boul (ex: 22)"); boul.setInputType(2); LinearLayout.LayoutParams p1=new LinearLayout.LayoutParams(0,-2,1); row.addView(boul,p1);
        EditText mise=new EditText(this); mise.setHint("$"); mise.setInputType(2); LinearLayout.LayoutParams p2=new LinearLayout.LayoutParams(0,-2,1); p2.leftMargin=10; row.addView(mise,p2);
        mise.addTextChangedListener(new android.text.TextWatcher(){ public void beforeTextChanged(CharSequence s,int a,int b,int c){} public void onTextChanged(CharSequence s,int a,int b,int c){ updateTotal(); } public void afterTextChanged(android.text.Editable s){ updateTotal(); } });
        BetRow br=new BetRow(); br.boul=boul; br.mise=mise; betRows.add(br); betsLayout.addView(row);
    }
    void updateTotal(){ int sum=0; for(BetRow br: betRows){ try{ String m=br.mise.getText().toString(); if(!m.isEmpty()) sum+=Integer.parseInt(m); }catch(Exception e){} } int count=0; for(CheckBox cb: tirajChecks) if(cb.isChecked()) count++; if(totalText!=null) totalText.setText("Total $"+sum+" x "+count+" = $"+(sum*count)); }
    void clearAll(){ for(BetRow br: betRows){ br.boul.setText(""); br.mise.setText(""); } for(CheckBox cb: tirajChecks) cb.setChecked(false); updateTotal(); }
    void sellTicket(){
        List<String> sel=new ArrayList<>(); for(CheckBox cb: tirajChecks) if(cb.isChecked()) sel.add(cb.getText().toString());
        if(sel.isEmpty()){ Toast.makeText(this,"Chwazi TIRAJ",0).show(); return; }
        StringBuilder betsStr=new StringBuilder(); int total=0;
        for(BetRow br: betRows){ String b=br.boul.getText().toString().trim(); String m=br.mise.getText().toString().trim(); if(!b.isEmpty()&&!m.isEmpty()){ try{ int mi=Integer.parseInt(m); total+=mi; betsStr.append(b).append(" - $").append(m).append("\n"); }catch(Exception e){} } }
        if(betsStr.length()==0){ Toast.makeText(this,"Mete Boul",0).show(); return; }
        int grand=total*sel.size();
        StringBuilder ticket=new StringBuilder();
        ticket.append(center("CD VERITE LOTTO")).append("\n"); ticket.append(center("V32 FULL SILENT")).append("\n"); ticket.append(center("----------------")).append("\n"); ticket.append(center("Vendeur: "+currentSerial)).append("\n"); ticket.append(center("Date: "+new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()))).append("\n"); ticket.append(center("----------------")).append("\n");
        for(String t: sel) ticket.append(center(t)).append("\n"); ticket.append(betsStr.toString()); ticket.append(center("----------------")).append("\n"); ticket.append(center("Total => "+grand+" HTG")).append("\n"); ticket.append(center("Mesi!")).append("\n\n\n\n");
        lastTicket=ticket.toString(); allTickets.add(lastTicket); printSilent(lastTicket); Toast.makeText(this,"VANN $"+grand+" OK",1).show(); clearAll();
    }
    String center(String s){ int W=32; if(s.length()>=W) return s.substring(0,W); int left=(W-s.length())/2; StringBuilder sb=new StringBuilder(); for(int i=0;i<left;i++) sb.append(" "); sb.append(s); return sb.toString(); }
    void initSunmi(){ try{ Class<?> managerCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterManager"); java.lang.reflect.Method getInstance=managerCls.getMethod("getInstance"); Object manager=getInstance.invoke(null); Class<?> callbackCls=Class.forName("com.sunmi.peripheral.printer.InnerPrinterCallback"); Object callback=java.lang.reflect.Proxy.newProxyInstance(callbackCls.getClassLoader(), new Class[]{callbackCls}, (proxy,method,args)->{ if(method.getName().equals("onConnected")){ sunmiService=args[0]; sunmiReady=true; runOnUiThread(()->{ if(statusText!=null) statusText.setText("Sunmi: SILENT OK - Pa gen dyalog"); }); } return null; }); java.lang.reflect.Method init=managerCls.getMethod("init", android.content.Context.class, callbackCls); init.invoke(manager,this,callback); }catch(Exception e){ if(statusText!=null) runOnUiThread(()->statusText.setText("Mode: GENERIC 58mm - SILENT OK")); } }
    void printSilent(String txt){ try{ if(sunmiService!=null&&sunmiReady){ Method m1=sunmiService.getClass().getMethod("printText", String.class); Method m2=sunmiService.getClass().getMethod("lineWrap", int.class); m1.invoke(sunmiService,txt); m2.invoke(sunmiService,4); return; } }catch(Exception e){} Toast.makeText(this,"PRINT:\n"+txt,1).show(); }
}
